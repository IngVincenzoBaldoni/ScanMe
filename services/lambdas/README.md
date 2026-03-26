# Lambdas

Codice iniziale delle funzioni AWS Lambda del progetto.

## Handler inclusi

- `redirect`: resolve del target URL pubblico e redirect `302`
- `claim`: creazione di una nuova maglietta dinamica nel MVP
- `management`: login admin, lista magliette e update del target URL

## Assunzioni dati

Le Lambda leggono e scrivono una singola tabella DynamoDB con item `PROFILE` della maglietta.

Attributi principali:

- `pk = SHIRT#{shirtId}`
- `sk = PROFILE`
- `label = nome visualizzato in dashboard`
- `targetUrl = link finale che si apre dopo il redirect`
- `createdAt` e `updatedAt = metadati operativi`

## Packaging

Lo script `npm run package --workspace @scanme/lambdas` genera zip iniziali in `artifacts/`.

Nota importante:

- lo script attuale include anche `node_modules`, quindi richiede `npm install` eseguito prima del packaging;
- per produzione conviene sostituire questo script con un packaging deterministico e una pipeline CI/CD.
