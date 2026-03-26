const { ConditionalCheckFailedException } = require("@aws-sdk/client-dynamodb");
const { getUserContext } = require("../../shared/src/auth");
const { isHttpError } = require("../../shared/src/errors");
const { claimShirt, getShirtByActivationCode } = require("../../shared/src/repository");
const { json } = require("../../shared/src/response");
const { normalizeActivationCode } = require("../../shared/src/validation");

exports.handler = async (event) => {
  try {
    const user = getUserContext(event);
    const body = JSON.parse(event.body ?? "{}");
    const activationCode = normalizeActivationCode(body.activationCode);
    const shirt = await getShirtByActivationCode(activationCode);

    if (!shirt) {
      return json(404, { message: "Activation code non valido." });
    }

    const item = await claimShirt({
      shirtId: shirt.shirtId,
      ownerUserId: user.userId
    });

    return json(200, { item });
  } catch (error) {
    if (isHttpError(error)) {
      return json(error.statusCode, { message: error.message });
    }

    if (error instanceof ConditionalCheckFailedException) {
      return json(409, { message: "Questa maglietta e' gia stata reclamata." });
    }

    return json(500, {
      message: error instanceof Error ? error.message : "Errore interno."
    });
  }
};
