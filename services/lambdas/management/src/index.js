const { ConditionalCheckFailedException } = require("@aws-sdk/client-dynamodb");
const { getUserContext } = require("../../shared/src/auth");
const { isHttpError } = require("../../shared/src/errors");
const { listShirtsByOwner, updateTargetUrl } = require("../../shared/src/repository");
const { json } = require("../../shared/src/response");
const { normalizeShirtId, normalizeTargetUrl } = require("../../shared/src/validation");

exports.handler = async (event) => {
  try {
    const user = getUserContext(event);

    if (event.requestContext?.http?.method === "GET") {
      const items = await listShirtsByOwner(user.userId);
      return json(200, { items });
    }

    if (event.requestContext?.http?.method === "PUT") {
      const shirtId = normalizeShirtId(event.pathParameters?.shirt_id);
      const body = JSON.parse(event.body ?? "{}");
      const item = await updateTargetUrl({
        shirtId,
        ownerUserId: user.userId,
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
      return json(403, { message: "Non puoi modificare questa maglietta." });
    }

    return json(500, {
      message: error instanceof Error ? error.message : "Errore interno."
    });
  }
};
