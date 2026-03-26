export type Shirt = {
  shirtId: string;
  label: string;
  targetUrl?: string;
  updatedAt?: string;
  createdAt?: string;
};

export type AuthSession = {
  accessToken: string;
  userId: string;
  email: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type CreateShirtPayload = {
  label: string;
  targetUrl: string;
};

export type UpdateTargetPayload = {
  targetUrl: string;
};
