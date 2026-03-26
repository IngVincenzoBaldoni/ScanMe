# ScanMe

Piattaforma per gestire magliette con QR code dinamico: ogni QR rimanda a un link pubblico aggiornabile dal proprietario della maglietta.

## Obiettivo

Il valore di business del progetto e' la possibilita' per l'utente di cambiare in autonomia la destinazione del proprio QR code nel tempo, senza ristampare la maglietta.

## Architettura proposta

- Frontend: SPA statica ospitata su Amazon S3 e distribuita via CloudFront.
- Backend: Amazon API Gateway + AWS Lambda per API pubbliche e private.
- Auth MVP: login admin semplificato gestito dal backend.
- Data: Amazon DynamoDB per mapping QR -> link target.
- IaC: Terraform modulare con environment separati.

## Servizi AWS del primo deploy `dev`

- `Amazon S3`: bucket privato per i file statici del frontend.
- `Amazon CloudFront`: distribuzione pubblica HTTPS del frontend.
- `Amazon DynamoDB`: database del MVP per capi, link target e analytics scansioni.
- `AWS Lambda`: logica backend per redirect, login admin, creazione capo e update link.
- `Amazon API Gateway HTTP API`: esposizione degli endpoint backend.
- `AWS IAM`: role e policy minime per le Lambda.
- `Amazon CloudWatch Logs`: log runtime generati automaticamente dalle Lambda.

## Struttura repository

- `docs/functional`: documentazione di prodotto e flussi utente.
- `docs/technical`: architettura, decisioni tecniche e guida API.
- `infra/terraform`: infrastruttura AWS in Terraform.
- `apps/web`: frontend React + TypeScript + Vite.
- `services/lambdas`: Lambda Node.js per redirect e gestione magliette.

## Documentazione principale

- [Overview funzionale](/Users/vincemartibalducci/Desktop/Projects/ScanMe/codebase/docs/functional/product-overview.md)
- [User journeys](/Users/vincemartibalducci/Desktop/Projects/ScanMe/codebase/docs/functional/user-journeys.md)
- [Architettura tecnica](/Users/vincemartibalducci/Desktop/Projects/ScanMe/codebase/docs/technical/architecture-overview.md)
- [Fondazioni AWS](/Users/vincemartibalducci/Desktop/Projects/ScanMe/codebase/docs/technical/aws-foundations.md)
- [Struttura Terraform](/Users/vincemartibalducci/Desktop/Projects/ScanMe/codebase/docs/technical/terraform-structure.md)

## Stato attuale

Questa repository contiene:

- architettura iniziale consigliata;
- Terraform pronto al naming `it-dev-scanme-*` per l'account `scanme_official`;
- codice MVP frontend con dashboard QR, login admin e preview del QR code;
- codice MVP Lambda per redirect, login admin, creazione e update maglietta;
- linee guida per implementare FE e BE in modo coerente.

Non contiene ancora:

- pipeline CI/CD;
- risorse AWS gia' deployate.

## Avvio consigliato

1. Creare un account AWS dedicato al progetto.
2. Configurare backend remoto Terraform e credenziali AWS.
3. Installare Node.js e dipendenze locali con `npm install`.
4. Generare gli artifact con `npm run lambdas:package` e `npm run web:build`.
5. Eseguire il primo deploy infrastrutturale in `infra/terraform/environments/dev`.
6. Caricare il frontend buildato nel bucket S3 e invalidare CloudFront.
