class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
  }
}

const isHttpError = (error) => error instanceof HttpError;

module.exports = {
  HttpError,
  isHttpError
};
