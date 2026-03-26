import { config } from "./config";
import type { ClaimPayload, Shirt, UpdateTargetPayload } from "./types";

const MOCK_DB_KEY = "scanme-mock-shirts";

const buildHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`
});

const request = async <T>(path: string, init: RequestInit): Promise<T> => {
  if (!config.apiBaseUrl) {
    throw new Error("Configura VITE_SCANME_API_BASE_URL prima di usare il frontend.");
  }

  const response = await fetch(`${config.apiBaseUrl}${path}`, init);
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error((body as { message?: string } | null)?.message ?? "Richiesta fallita.");
  }

  return body as T;
};

const readMockDb = (): Shirt[] => {
  const raw = window.localStorage.getItem(MOCK_DB_KEY);

  if (!raw) {
    const seedItems: Shirt[] = [
      {
        shirtId: "shirt-demo-001",
        label: "Creator Tee 001",
        activationCode: "ABC123-PLACEHOLDER",
        status: "unclaimed"
      },
      {
        shirtId: "shirt-demo-002",
        label: "Creator Tee 002",
        activationCode: "XYZ789-PLACEHOLDER",
        status: "unclaimed"
      }
    ];
    window.localStorage.setItem(MOCK_DB_KEY, JSON.stringify(seedItems));
    return seedItems;
  }

  return JSON.parse(raw) as Shirt[];
};

const writeMockDb = (items: Shirt[]) => {
  window.localStorage.setItem(MOCK_DB_KEY, JSON.stringify(items));
};

const parseUserIdFromToken = (token: string) => {
  if (token === "mock-access-token") {
    const sessionRaw = window.localStorage.getItem("scanme-auth-session");

    if (sessionRaw) {
      const session = JSON.parse(sessionRaw) as { userId: string };
      return session.userId;
    }
  }

  return token;
};

const listMockShirts = (token: string) => {
  const userId = parseUserIdFromToken(token);
  return { items: readMockDb().filter((item) => item.ownerUserId === userId) };
};

const claimMockShirt = (token: string, payload: ClaimPayload) => {
  const userId = parseUserIdFromToken(token);
  const items = readMockDb();
  const activationCode = payload.activationCode.trim().toUpperCase();
  const match = items.find((item) => item.activationCode === activationCode);

  if (!match) {
    throw new Error("Activation code non valido.");
  }

  if (match.ownerUserId) {
    throw new Error("Questa maglietta e' gia stata reclamata.");
  }

  const now = new Date().toISOString();
  const updatedItem: Shirt = {
    ...match,
    ownerUserId: userId,
    status: "claimed",
    claimedAt: now,
    updatedAt: now
  };

  writeMockDb(items.map((item) => (item.shirtId === match.shirtId ? updatedItem : item)));
  return { item: updatedItem };
};

const updateMockTarget = (token: string, shirtId: string, payload: UpdateTargetPayload) => {
  const userId = parseUserIdFromToken(token);
  const items = readMockDb();
  const match = items.find((item) => item.shirtId === shirtId);

  if (!match) {
    throw new Error("Maglietta non trovata.");
  }

  if (match.ownerUserId !== userId) {
    throw new Error("Non puoi modificare questa maglietta.");
  }

  const updatedItem: Shirt = {
    ...match,
    targetUrl: payload.targetUrl,
    updatedAt: new Date().toISOString()
  };

  writeMockDb(items.map((item) => (item.shirtId === shirtId ? updatedItem : item)));
  return { item: updatedItem };
};

export const apiClient = {
  listShirts(token: string) {
    if (!config.apiBaseUrl) {
      return Promise.resolve(listMockShirts(token));
    }

    return request<{ items: Shirt[] }>("/v1/shirts", {
      method: "GET",
      headers: buildHeaders(token)
    });
  },

  claimShirt(token: string, payload: ClaimPayload) {
    if (!config.apiBaseUrl) {
      return Promise.resolve(claimMockShirt(token, payload));
    }

    return request<{ item: Shirt }>("/v1/shirts/claim", {
      method: "POST",
      headers: buildHeaders(token),
      body: JSON.stringify(payload)
    });
  },

  updateTarget(token: string, shirtId: string, payload: UpdateTargetPayload) {
    if (!config.apiBaseUrl) {
      return Promise.resolve(updateMockTarget(token, shirtId, payload));
    }

    return request<{ item: Shirt }>(`/v1/shirts/${shirtId}/target`, {
      method: "PUT",
      headers: buildHeaders(token),
      body: JSON.stringify(payload)
    });
  }
};
