export type DailyScanPoint = {
  date: string;
  count: number;
};

export type ShirtAnalytics = {
  totalScans: number;
  lastScannedAt?: string;
  dailyScans: DailyScanPoint[];
};

export type Shirt = {
  shirtId: string;
  label: string;
  targetUrl?: string;
  updatedAt?: string;
  createdAt?: string;
  analytics: ShirtAnalytics;
};

export type AuthSession = {
  accessToken: string;
  userId: string;
  email: string;
};

export type CreateShirtPayload = {
  label: string;
  targetUrl: string;
};

export type UpdateTargetPayload = {
  targetUrl: string;
};
