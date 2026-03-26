# AWS Foundations

## Account e ambienti

Consiglio operativo:

- 1 account AWS dedicato a ScanMe.
- Environment iniziale: `dev`.
- Environment futuri: `staging`, `prod`.

## Naming convention

Pattern suggerito:

- `${project_name}-${environment}-${resource}`

Esempio:

- `scanme-dev-api`
- `scanme-dev-frontend`
- `scanme-dev-links`

## Placeholder da sostituire

Prima del deploy reale dovranno essere valorizzati:

- AWS account ID
- regione AWS definitiva
- eventuale dominio custom
- certificate ACM
- package delle Lambda
- backend remoto Terraform

## Sicurezza minima

- Accesso API private protetto con Cognito JWT authorizer.
- Bucket frontend non pubblico, accessibile solo da CloudFront.
- Policy IAM minime per le Lambda.
- Validazione rigorosa degli URL per evitare redirect malevoli.

## Roadmap tecnica consigliata

1. Fondazioni AWS e Terraform backend remoto.
2. Setup Cognito e tabelle DynamoDB.
3. Endpoint redirect pubblico.
4. Endpoint claim e update link.
5. Frontend dashboard.
6. Osservabilita', audit e analytics.
