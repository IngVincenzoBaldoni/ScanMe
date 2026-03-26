# Architettura Tecnica

## Scelta architetturale

Per l'MVP la soluzione migliore e' un'architettura serverless su AWS:

- minimizza costi fissi;
- riduce il carico operativo;
- scala bene su picchi di scansioni;
- separa chiaramente traffico pubblico di redirect e traffico autenticato di gestione.

## Componenti

- Frontend SPA `React + TypeScript + Vite` su `S3 + CloudFront`
- Autenticazione su `Amazon Cognito`
- API su `Amazon API Gateway HTTP API`
- Business logic su `AWS Lambda`
- Persistenza su `Amazon DynamoDB`

## Flussi principali

### Redirect pubblico

```mermaid
flowchart LR
  U[Utente che scansiona] --> QR[QR Code sulla maglietta]
  QR --> API[API Gateway /r/{shirtId}]
  API --> L1[Lambda Redirect]
  L1 --> DDB[DynamoDB]
  L1 --> DEST[URL finale]
```

### Gestione privata

```mermaid
flowchart LR
  O[Owner autenticato] --> FE[Frontend Dashboard]
  FE --> COG[Cognito]
  FE --> API[API Gateway]
  API --> L2[Lambda Manage Link]
  L2 --> DDB[DynamoDB]
```

## Motivazioni FE

- `React + TypeScript` e' una scelta solida per una dashboard utente con form, stato autenticazione e validazioni.
- `Vite` accelera lo sviluppo locale e produce un output statico semplice da distribuire.
- Una SPA e' sufficiente per dashboard, onboarding e gestione link.
- Hosting statico su S3/CloudFront e' economico e semplice da distribuire.
- Il frontend dialoga con Cognito e API Gateway tramite HTTPS.

## Motivazioni BE

- Lambda isola bene i casi d'uso: redirect, claim, update link.
- API Gateway gestisce routing, CORS e integrazione con authorizer Cognito.
- DynamoDB offre letture rapide e latenza bassa, adatta al redirect.

## Dominio dati minimo

- `shirts`: anagrafica maglietta e owner attuale.
- `redirects`: link attivo e metadati di aggiornamento.

Per l'MVP questi due concetti possono convivere anche in una singola tabella DynamoDB ben progettata.

## Nota implementativa FE

Il frontend dovra' esporre almeno queste schermate:

- landing di onboarding;
- login e registrazione;
- pagina claim maglietta;
- dashboard con lista magliette;
- form di aggiornamento URL;
- fallback page per QR non ancora attivati.
