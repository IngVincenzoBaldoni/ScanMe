const { HttpError } = require("./errors");

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

const normalizeActivationCode = (value) => {
  if (!isNonEmptyString(value)) {
    throw new HttpError(400, "Activation code obbligatorio.");
  }

  return value.trim().toUpperCase();
};

const normalizeShirtId = (value) => {
  if (!isNonEmptyString(value)) {
    throw new HttpError(400, "shirtId obbligatorio.");
  }

  return value.trim();
};

const normalizeTargetUrl = (value) => {
  if (!isNonEmptyString(value)) {
    throw new HttpError(400, "Target URL obbligatorio.");
  }

  let parsed;

  try {
    parsed = new URL(value.trim());
  } catch {
    throw new HttpError(400, "Target URL non valido.");
  }

  if (!["https:", "http:"].includes(parsed.protocol)) {
    throw new HttpError(400, "Sono consentiti solo URL http o https.");
  }

  return parsed.toString();
};

module.exports = {
  normalizeActivationCode,
  normalizeShirtId,
  normalizeTargetUrl
};
