const { ConditionalCheckFailedException } = require("@aws-sdk/client-dynamodb");
const { parseBody, requireAdmin } = require("../../shared/src/auth");
const { isHttpError, HttpError } = require("../../shared/src/errors");
const { createShirt } = require("../../shared/src/repository");
const { json } = require("../../shared/src/response");
const { normalizeTargetUrl } = require("../../shared/src/validation");

const normalizeLabel = (value) => {
  if (typeof value !== "string" || value.trim().length < 3) {
    throw new HttpError(400, "Il nome della maglietta deve avere almeno 3 caratteri.");
  }

  return value.trim();
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
      targetUrl: normalizeTargetUrl(body.targetUrl)
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
