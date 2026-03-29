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

const buildMockAnalytics = (seed: number) => {
  const today = new Date();
  const dailyScans = Array.from({ length: 7 }).map((_, index) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (6 - index));
    return {
      date: day.toISOString().slice(0, 10),
      count: [1, 3, 2, 5, 4, 7, 6][(index + seed) % 7]
    };
  });

  return {
    totalScans: dailyScans.reduce((sum, item) => sum + item.count, 0),
    lastScannedAt: new Date().toISOString(),
    dailyScans
  };
};

const readMockDb = (): Shirt[] => {
  const raw = window.localStorage.getItem(MOCK_DB_KEY);

  if (!raw) {
    const now = new Date().toISOString();
    const seedItems: Shirt[] = [
      {
        shirtId: "shirt-demo-001",
        label: "ScanMe Founder Tee",
        targetUrl: "https://instagram.com/ingvincenzobaldoni",
        createdAt: now,
        updatedAt: now,
        commerce: {
          salesChannel: "shopify",
          orderReference: "SHOPIFY-1001",
          customerName: "Vincenzo Baldoni",
          customerEmail: "official.scanme.app@gmail.com",
          requestedUrl: "https://instagram.com/ingvincenzobaldoni"
        },
        product: {
          model: "Unisex Heavy Cotton Tee",
          size: "L",
          color: "Black",
          placement: "Back upper center",
          printProvider: "Printify"
        },
        operations: {
          productionStatus: "active",
          notes: "Capo demo usato per testare scansioni e redirect."
        },
        analytics: buildMockAnalytics(0)
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
    updatedAt: now,
    commerce: payload.commerce,
    product: payload.product,
    operations: payload.operations,
    analytics: buildMockAnalytics(items.length)
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
