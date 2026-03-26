# Local Development

## Frontend

Prerequisiti:

- Node.js 20+
- npm 10+

Passi:

1. Copiare [apps/web/.env.example](/Users/vincemartibalducci/Desktop/Projects/ScanMe/codebase/apps/web/.env.example) in `apps/web/.env`.
2. Se non hai ancora API reali, puoi lasciare vuoto `VITE_SCANME_API_BASE_URL`: il frontend usera' un backend mock nel browser.
3. Lasciare `VITE_SCANME_USE_MOCK_AUTH=true` finche' non colleghi il backend AWS.
4. Eseguire `npm install`.
5. Eseguire `npm run web:dev`.

Demo MVP disponibili in mock mode:

- login: qualsiasi email
- password: qualsiasi password
- una maglietta demo viene caricata automaticamente alla prima apertura

## Backend Lambda

Prerequisiti:

- account AWS non ancora necessario per scrivere il codice;
- necessario invece per test end-to-end e deploy.

Passi successivi consigliati:

1. Generare package Lambda realmente deployabili.
2. Configurare `admin_email`, `admin_password`, `admin_session_token` e `fallback_url` in Terraform.
3. Effettuare deploy in `dev`.
4. Creare la prima maglietta dalla dashboard.
