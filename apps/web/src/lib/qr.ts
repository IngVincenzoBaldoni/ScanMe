import QRCode from "qrcode";

export const buildRedirectUrl = (baseUrl: string, shirtId: string) => {
  return `${baseUrl.replace(/\/$/, "")}/r/${shirtId}`;
};

export const buildQrPreviewUrl = (qrPreviewBaseUrl: string, redirectUrl: string) => {
  const params = new URLSearchParams({
    size: "320x320",
    data: redirectUrl
  });

  return `${qrPreviewBaseUrl}?${params.toString()}`;
};

export const downloadQrSvg = async (redirectUrl: string, fileName: string) => {
  const svg = await QRCode.toString(redirectUrl, {
    errorCorrectionLevel: "M",
    margin: 2,
    type: "svg",
    width: 1200
  });

  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(objectUrl);
};
