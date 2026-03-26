import { config } from "./config";
import type { CreateShirtPayload, Shirt, UpdateTargetPayload } from "./types";

const MOCK_DB_KEY = "scanme-mock-shirts";

const buildHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`
});

const request = async <T>(path: string, init: RequestInit): Promise<T> => {
  if (!config.apiBaseUrl) {
    throw new Error("Configura VITE_SCANME_API_BASE_URL prima di usare il frontend reale.");
  }

  const response = await fetch(`${config.apiBaseUrl}${path}`, init);
  const body = (await response.json()) as { message?: string };

  if (!response.ok) {
    throw new Error(body.message ?? "Richiesta fallita.");
  }

  return body as T;
};

const readMockDb = (): Shirt[] => {
  const raw = window.localStorage.getItem(MOCK_DB_KEY);

  if (!raw) {
    const seedItems: Shirt[] = [
      {
        shirtId: "shirt-demo-001",
        label: "ScanMe Founder Tee",
        targetUrl: "https://instagram.com/ingvincenzobaldoni",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
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

const listMockShirts = () => {
  return { items: readMockDb() };
};

const createMockShirt = (payload: CreateShirtPayload) => {
  const items = readMockDb();
  const now = new Date().toISOString();
  const item: Shirt = {
    shirtId: `shirt-${Date.now().toString(36)}`,
    label: payload.label.trim(),
    targetUrl: payload.targetUrl.trim(),
    createdAt: now,
    updatedAt: now
  };

  writeMockDb([item, ...items]);
  return { item };
};

const updateMockTarget = (shirtId: string, payload: UpdateTargetPayload) => {
  const items = readMockDb();
  const match = items.find((item) => item.shirtId === shirtId);

  if (!match) {
    throw new Error("Maglietta non trovata.");
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
    if (!config.apiBaseUrl || config.useMockAuth) {
      return Promise.resolve(listMockShirts());
    }

    return request<{ items: Shirt[] }>("/v1/shirts", {
      method: "GET",
      headers: buildHeaders(token)
    });
  },

  createShirt(token: string, payload: CreateShirtPayload) {
    if (!config.apiBaseUrl || config.useMockAuth) {
      return Promise.resolve(createMockShirt(payload));
    }

    return request<{ item: Shirt }>("/v1/shirts", {
      method: "POST",
      headers: buildHeaders(token),
      body: JSON.stringify(payload)
    });
  },

  updateTarget(token: string, shirtId: string, payload: UpdateTargetPayload) {
    if (!config.apiBaseUrl || config.useMockAuth) {
      return Promise.resolve(updateMockTarget(shirtId, payload));
    }

    return request<{ item: Shirt }>(`/v1/shirts/${shirtId}/target`, {
      method: "PUT",
      headers: buildHeaders(token),
      body: JSON.stringify(payload)
    });
  }
};
