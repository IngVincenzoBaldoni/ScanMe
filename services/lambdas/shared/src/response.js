const json = (statusCode, body) => ({
  statusCode,
  headers: {
    "content-type": "application/json"
  },
  body: JSON.stringify(body)
});

const redirect = (location) => ({
  statusCode: 302,
  headers: {
    Location: location,
    "cache-control": "no-store"
  }
});

const html = (statusCode, body) => ({
  statusCode,
  headers: {
    "content-type": "text/html; charset=utf-8",
    "cache-control": "no-store"
  },
  body
});

module.exports = {
  json,
  redirect,
  html
};
