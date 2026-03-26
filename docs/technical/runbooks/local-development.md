# Local Development

## Frontend

Prerequisiti:

- Node.js 20+
- npm 10+

Passi:

1. Copiare [apps/web/.env.example](/Users/vincemartibalducci/Desktop/Projects/ScanMe/codebase/apps/web/.env.example) in `apps/web/.env`.
2. Se non hai ancora API reali, puoi lasciare vuoto `VITE_SCANME_API_BASE_URL`: il frontend usera' un backend mock nel browser.
3. Lasciare `VITE_SCANME_USE_MOCK_AUTH=true` finche' Cognito non viene integrato nel frontend.
4. Eseguire `npm install`.
5. Eseguire `npm run web:dev`.

Demo activation code disponibili in mock mode:

- `ABC123-PLACEHOLDER`
- `XYZ789-PLACEHOLDER`

## Backend Lambda

Prerequisiti:

- account AWS non ancora necessario per scrivere il codice;
- necessario invece per test end-to-end e deploy.

Passi successivi consigliati:

1. Seed iniziale di magliette in DynamoDB con activation code.
2. Packaging reale delle Lambda.
3. Configurazione di test integration contro environment `dev`.
