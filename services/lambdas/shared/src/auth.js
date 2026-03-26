const { HttpError } = require("./errors");

const getUserContext = (event) => {
  const claims = event.requestContext?.authorizer?.jwt?.claims;

  if (!claims) {
    throw new HttpError(401, "Utente non autenticato.");
  }

  return {
    userId: claims.sub ?? claims.username ?? claims.email,
    email: claims.email ?? ""
  };
};

module.exports = {
  getUserContext
};
