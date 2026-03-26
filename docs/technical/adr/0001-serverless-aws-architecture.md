# ADR 0001 - Serverless AWS Architecture

## Stato

Accepted

## Contesto

Il prodotto richiede:

- redirect pubblici veloci;
- dashboard privata semplice;
- costi iniziali contenuti;
- deployment rapido.

## Decisione

Adottare un'architettura serverless AWS composta da S3, CloudFront, API Gateway, Lambda e DynamoDB. Per il day-1 dell'MVP l'autenticazione e' semplificata con login admin lato backend; Cognito resta un'evoluzione successiva.

## Conseguenze positive

- basso costo di ingresso;
- scalabilita' automatica;
- minore gestione infrastrutturale;
- velocita' di prototipazione.

## Trade-off

- maggiore attenzione a cold start e osservabilita';
- gestione piu' articolata dei package Lambda;
- eventuale complessita' futura su custom domain e multi-environment.
