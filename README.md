# ScanMe

Piattaforma per gestire magliette con QR code dinamico: ogni QR rimanda a un link pubblico aggiornabile dal proprietario della maglietta.

## Obiettivo

Il valore di business del progetto e' la possibilita' per l'utente di cambiare in autonomia la destinazione del proprio QR code nel tempo, senza ristampare la maglietta.

## Architettura proposta

- Frontend: SPA statica ospitata su Amazon S3 e distribuita via CloudFront.
- Backend: Amazon API Gateway + AWS Lambda per API pubbliche e private.
- Auth: Amazon Cognito per registrazione, login e recupero password.
- Data: Amazon DynamoDB per mapping QR -> link target e stato di ownership.
- IaC: Terraform modulare con environment separati.

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
- scheletro Terraform con placeholder per account AWS, dominio e package Lambda;
- codice iniziale frontend con mock auth e mock backend browser mode;
- codice iniziale Lambda per redirect, claim e update link;
- linee guida per implementare FE e BE in modo coerente.

Non contiene ancora:

- pipeline CI/CD;
- risorse AWS gia' deployate.

## Avvio consigliato

1. Creare un account AWS dedicato al progetto.
2. Configurare backend remoto Terraform e credenziali AWS.
3. Installare Node.js e dipendenze locali con `npm install`.
4. Provare il frontend con `npm run web:dev`.
5. Eseguire il primo deploy nell'environment `dev`.
