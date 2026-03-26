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

module.exports = {
  json,
  redirect
};
