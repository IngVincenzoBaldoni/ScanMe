const { HttpError } = require("./errors");

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const adminSessionToken = process.env.ADMIN_SESSION_TOKEN || adminPassword;

const ensureConfig = () => {
  if (!adminEmail || !adminPassword || !adminSessionToken) {
    throw new Error("Configurazione admin incompleta.");
  }
};

const parseBody = (event) => {
  try {
    return JSON.parse(event.body ?? "{}");
  } catch {
    throw new HttpError(400, "Body JSON non valido.");
  }
};

const loginAdmin = (event) => {
  ensureConfig();
  const body = parseBody(event);

  if (body.email !== adminEmail || body.password !== adminPassword) {
    throw new HttpError(401, "Credenziali non valide.");
  }

  return {
    accessToken: adminSessionToken,
    email: adminEmail
  };
};

const requireAdmin = (event) => {
  ensureConfig();

  const authorizationHeader =
    event.headers?.authorization ?? event.headers?.Authorization ?? "";

  if (!authorizationHeader.startsWith("Bearer ")) {
    throw new HttpError(401, "Token mancante.");
  }

  const token = authorizationHeader.replace("Bearer ", "").trim();

  if (token !== adminSessionToken) {
    throw new HttpError(401, "Token non valido.");
  }

  return {
    userId: "admin",
    email: adminEmail
  };
};

module.exports = {
  loginAdmin,
  parseBody,
  requireAdmin
};
