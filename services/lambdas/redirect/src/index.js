const { getShirtById } = require("../../shared/src/repository");
const { isHttpError } = require("../../shared/src/errors");
const { redirect, json } = require("../../shared/src/response");
const { normalizeShirtId } = require("../../shared/src/validation");

exports.handler = async (event) => {
  try {
    const shirtId = normalizeShirtId(event.pathParameters?.shirt_id);
    const shirt = await getShirtById(shirtId);

    if (!shirt) {
      return json(404, { message: "Maglietta non trovata." });
    }

    if (!shirt.targetUrl) {
      return json(409, { message: "Maglietta senza link attivo." });
    }

    return redirect(shirt.targetUrl);
  } catch (error) {
    if (isHttpError(error)) {
      return json(error.statusCode, { message: error.message });
    }

    return json(500, {
      message: error instanceof Error ? error.message : "Errore interno."
    });
  }
};
