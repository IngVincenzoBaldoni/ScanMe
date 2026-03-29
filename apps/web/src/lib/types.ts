export type DailyScanPoint = {
  date: string;
  count: number;
};

export type ShirtAnalytics = {
  totalScans: number;
  lastScannedAt?: string;
  dailyScans: DailyScanPoint[];
};

export type SalesChannel = "shopify" | "printify_sample" | "manual";

export type ProductionStatus =
  | "draft"
  | "qr_ready"
  | "sent_to_printify"
  | "in_production"
  | "shipped"
  | "active";

export type DigitalTwinCommerce = {
  salesChannel: SalesChannel;
  orderReference: string;
  customerName: string;
  customerEmail: string;
  requestedUrl: string;
};

export type DigitalTwinProduct = {
  model: string;
  size: string;
  color: string;
  placement: string;
  printProvider: string;
};

export type DigitalTwinOperations = {
  productionStatus: ProductionStatus;
  notes?: string;
};

export type Shirt = {
  shirtId: string;
  label: string;
  targetUrl?: string;
  updatedAt?: string;
  createdAt?: string;
  commerce: DigitalTwinCommerce;
  product: DigitalTwinProduct;
  operations: DigitalTwinOperations;
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
  commerce: DigitalTwinCommerce;
  product: DigitalTwinProduct;
  operations: DigitalTwinOperations;
};

export type UpdateTargetPayload = {
  targetUrl: string;
};
