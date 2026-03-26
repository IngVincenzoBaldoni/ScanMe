const { ConditionalCheckFailedException } = require("@aws-sdk/client-dynamodb");
const { loginAdmin, parseBody, requireAdmin } = require("../../shared/src/auth");
const { isHttpError } = require("../../shared/src/errors");
const { listShirts, updateTargetUrl } = require("../../shared/src/repository");
const { json } = require("../../shared/src/response");
const { normalizeShirtId, normalizeTargetUrl } = require("../../shared/src/validation");

exports.handler = async (event) => {
  try {
    const method = event.requestContext?.http?.method;
    const path = event.requestContext?.http?.path ?? "";

    if (method === "POST" && path === "/v1/admin/login") {
      const session = loginAdmin(event);
      return json(200, { session });
    }

    requireAdmin(event);

    if (method === "GET" && path === "/v1/shirts") {
      const items = await listShirts();
      return json(200, { items });
    }

    if (method === "PUT") {
      const shirtId = normalizeShirtId(event.pathParameters?.shirt_id);
      const body = parseBody(event);
      const item = await updateTargetUrl({
        shirtId,
        targetUrl: normalizeTargetUrl(body.targetUrl)
      });

      return json(200, { item });
    }

    return json(405, { message: "Metodo non supportato." });
  } catch (error) {
    if (isHttpError(error)) {
      return json(error.statusCode, { message: error.message });
    }

    if (error instanceof ConditionalCheckFailedException) {
      return json(404, { message: "Maglietta non trovata." });
    }

    return json(500, {
      message: error instanceof Error ? error.message : "Errore interno."
    });
  }
};
