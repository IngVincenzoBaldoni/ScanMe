const { ConditionalCheckFailedException } = require("@aws-sdk/client-dynamodb");
const { parseBody, requireAdmin } = require("../../shared/src/auth");
const { isHttpError, HttpError } = require("../../shared/src/errors");
const { createShirt } = require("../../shared/src/repository");
const { json } = require("../../shared/src/response");
const {
  normalizeEmail,
  normalizeOptionalText,
  normalizeRequiredText,
  normalizeTargetUrl
} = require("../../shared/src/validation");

const normalizeLabel = (value) => {
  if (typeof value !== "string" || value.trim().length < 3) {
    throw new HttpError(400, "Il nome della maglietta deve avere almeno 3 caratteri.");
  }

  return value.trim();
};

const normalizeSalesChannel = (value) => {
  const normalized = normalizeRequiredText(value, "Canale vendita");
  const allowedValues = ["shopify", "printify_sample", "manual"];

  if (!allowedValues.includes(normalized)) {
    throw new HttpError(400, "Canale vendita non valido.");
  }

  return normalized;
};

const normalizeProductionStatus = (value) => {
  const normalized = normalizeRequiredText(value, "Stato produzione");
  const allowedValues = [
    "draft",
    "qr_ready",
    "sent_to_printify",
    "in_production",
    "shipped",
    "active"
  ];

  if (!allowedValues.includes(normalized)) {
    throw new HttpError(400, "Stato produzione non valido.");
  }

  return normalized;
};

const generateShirtId = () => {
  return `shirt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
};

exports.handler = async (event) => {
  try {
    requireAdmin(event);
    const body = parseBody(event);

    const item = await createShirt({
      shirtId: generateShirtId(),
      label: normalizeLabel(body.label),
      targetUrl: normalizeTargetUrl(body.targetUrl),
      commerce: {
        salesChannel: normalizeSalesChannel(body.commerce?.salesChannel),
        orderReference: normalizeRequiredText(body.commerce?.orderReference, "Order reference"),
        customerName: normalizeRequiredText(body.commerce?.customerName, "Nome cliente"),
        customerEmail: normalizeEmail(body.commerce?.customerEmail, "Email cliente"),
        requestedUrl: normalizeTargetUrl(body.commerce?.requestedUrl)
      },
      product: {
        model: normalizeRequiredText(body.product?.model, "Modello prodotto"),
        size: normalizeRequiredText(body.product?.size, "Taglia"),
        color: normalizeRequiredText(body.product?.color, "Colore"),
        placement: normalizeRequiredText(body.product?.placement, "Posizionamento stampa"),
        printProvider: normalizeRequiredText(body.product?.printProvider, "Print provider")
      },
      operations: {
        productionStatus: normalizeProductionStatus(body.operations?.productionStatus),
        notes: normalizeOptionalText(body.operations?.notes)
      }
    });

    return json(201, { item });
  } catch (error) {
    if (isHttpError(error)) {
      return json(error.statusCode, { message: error.message });
    }

    if (error instanceof ConditionalCheckFailedException) {
      return json(409, { message: "Esiste gia' una maglietta con questo identificativo." });
    }

    return json(500, {
      message: error instanceof Error ? error.message : "Errore interno."
    });
  }
};
