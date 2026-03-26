export type Shirt = {
  shirtId: string;
  label: string;
  activationCode?: string;
  ownerUserId?: string;
  targetUrl?: string;
  updatedAt?: string;
  claimedAt?: string;
  status: "unclaimed" | "claimed";
};

export type AuthSession = {
  accessToken: string;
  userId: string;
  email: string;
};

export type ClaimPayload = {
  activationCode: string;
};

export type UpdateTargetPayload = {
  targetUrl: string;
};
