export const config = {
  apiBaseUrl: import.meta.env.VITE_SCANME_API_BASE_URL ?? "",
  useMockAuth: import.meta.env.VITE_SCANME_USE_MOCK_AUTH !== "false",
  redirectBaseUrl:
    import.meta.env.VITE_SCANME_REDIRECT_BASE_URL ??
    import.meta.env.VITE_SCANME_API_BASE_URL ??
    "",
  qrPreviewBaseUrl:
    import.meta.env.VITE_SCANME_QR_PREVIEW_BASE_URL ??
    "https://api.qrserver.com/v1/create-qr-code/"
};
