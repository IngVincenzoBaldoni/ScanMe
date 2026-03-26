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

Adottare un'architettura serverless AWS composta da S3, CloudFront, Cognito, API Gateway, Lambda e DynamoDB.

## Conseguenze positive

- basso costo di ingresso;
- scalabilita' automatica;
- minore gestione infrastrutturale;
- velocita' di prototipazione.

## Trade-off

- maggiore attenzione a cold start e osservabilita';
- gestione piu' articolata dei package Lambda;
- eventuale complessita' futura su custom domain e multi-environment.
