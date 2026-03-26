const { getShirtById } = require("../../shared/src/repository");
const { isHttpError } = require("../../shared/src/errors");
const { redirect, html, json } = require("../../shared/src/response");
const { normalizeShirtId } = require("../../shared/src/validation");

const fallbackUrl = process.env.FALLBACK_URL ?? "";

const renderFallbackPage = (shirtId) => `<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>ScanMe - QR non configurato</title>
    <style>
      body { font-family: Arial, sans-serif; background: #f8fafc; color: #0f172a; margin: 0; }
      main { max-width: 640px; margin: 0 auto; min-height: 100vh; display: grid; place-content: center; padding: 24px; }
      section { background: white; border-radius: 20px; padding: 32px; box-shadow: 0 20px 60px rgba(15, 23, 42, 0.1); }
      h1 { margin-top: 0; }
      p { color: #475569; line-height: 1.6; }
      code { background: #e2e8f0; padding: 2px 6px; border-radius: 6px; }
      a { color: #0f766e; }
    </style>
  </head>
  <body>
    <main>
      <section>
        <h1>QR non ancora configurato</h1>
        <p>La maglietta <code>${shirtId}</code> non ha ancora un link attivo.</p>
        <p>Sei il proprietario? Accedi alla dashboard ScanMe e imposta il link che vuoi aprire quando qualcuno scansiona questo QR.</p>
        ${fallbackUrl ? `<p><a href="${fallbackUrl}">Apri la dashboard</a></p>` : ""}
      </section>
    </main>
  </body>
</html>`;

exports.handler = async (event) => {
  try {
    const shirtId = normalizeShirtId(event.pathParameters?.shirt_id);
    const shirt = await getShirtById(shirtId);

    if (!shirt) {
      return html(404, renderFallbackPage(shirtId));
    }

    if (!shirt.targetUrl) {
      return html(200, renderFallbackPage(shirtId));
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
