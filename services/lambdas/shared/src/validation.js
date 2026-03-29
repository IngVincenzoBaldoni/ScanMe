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

const normalizeRequiredText = (value, fieldName, minLength = 1) => {
  if (!isNonEmptyString(value) || value.trim().length < minLength) {
    throw new HttpError(400, `${fieldName} obbligatorio.`);
  }

  return value.trim();
};

const normalizeOptionalText = (value) => {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  if (typeof value !== "string") {
    throw new HttpError(400, "Il valore testuale non e' valido.");
  }

  return value.trim();
};

const normalizeEmail = (value, fieldName = "Email") => {
  const normalized = normalizeRequiredText(value, fieldName);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    throw new HttpError(400, `${fieldName} non valida.`);
  }

  return normalized.toLowerCase();
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
  normalizeEmail,
  normalizeOptionalText,
  normalizeRequiredText,
  normalizeShirtId,
  normalizeTargetUrl
};
