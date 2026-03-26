# Lambdas

Codice iniziale delle funzioni AWS Lambda del progetto.

## Handler inclusi

- `redirect`: resolve del target URL pubblico e redirect `302`
- `claim`: claim della maglietta tramite activation code
- `management`: lista magliette dell'owner e update del target URL

## Assunzioni dati

Le Lambda leggono e scrivono una singola tabella DynamoDB con item `PROFILE` della maglietta.

Attributi principali:

- `pk = SHIRT#{shirtId}`
- `sk = PROFILE`
- `gsi1pk = ACTIVATION#{activationCode}` finche' la maglietta non e' reclamata
- `gsi1pk = OWNER#{ownerUserId}` dopo il claim

## Packaging

Lo script `npm run package --workspace @scanme/lambdas` genera zip iniziali in `artifacts/`.

Nota importante:

- prima del deploy reale va completata l'inclusione delle dipendenze `node_modules` o introdotto un bundler come `esbuild`;
- per produzione conviene sostituire questo script con un packaging deterministico e una pipeline CI/CD.
