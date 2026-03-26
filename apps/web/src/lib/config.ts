export const config = {
  apiBaseUrl: import.meta.env.VITE_SCANME_API_BASE_URL ?? "",
  useMockAuth: import.meta.env.VITE_SCANME_USE_MOCK_AUTH !== "false",
  cognitoRegion: import.meta.env.VITE_SCANME_COGNITO_REGION ?? "",
  cognitoUserPoolId: import.meta.env.VITE_SCANME_COGNITO_USER_POOL_ID ?? "",
  cognitoClientId: import.meta.env.VITE_SCANME_COGNITO_USER_POOL_CLIENT_ID ?? ""
};
