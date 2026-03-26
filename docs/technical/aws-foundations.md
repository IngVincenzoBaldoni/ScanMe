# AWS Foundations

## Account e ambienti

Consiglio operativo:

- 1 account AWS dedicato a ScanMe.
- Environment iniziale: `dev`.
- Environment futuri: `staging`, `prod`.

## Naming convention

Pattern suggerito:

- `it-dev-scanme-(servizio-aws)-...`

Esempio:

- `it-dev-scanme-apigateway-api`
- `it-dev-scanme-s3-frontend-265020547280`
- `it-dev-scanme-dynamodb-links`

## Placeholder da sostituire

Prima del deploy reale dovranno essere valorizzati:

- `admin_email`
- `admin_password`
- `admin_session_token`
- `fallback_url` dopo il primo deploy frontend
- backend remoto Terraform se vuoi stato remoto condiviso

## Servizi AWS del primo deploy

- `S3`
- `CloudFront`
- `DynamoDB`
- `Lambda`
- `API Gateway HTTP API`
- `IAM`
- `CloudWatch Logs`

## Fuori scope del primo deploy

- `Cognito`
- `Route53`
- `ACM`
- `WAF`

## Sicurezza minima

- Accesso API private protetto da login admin e token bearer server-side.
- Bucket frontend non pubblico, accessibile solo da CloudFront.
- Policy IAM minime per le Lambda.
- Validazione rigorosa degli URL per evitare redirect malevoli.

## Roadmap tecnica consigliata

1. Fondazioni AWS e Terraform backend remoto.
2. Setup tabella DynamoDB, variabili admin e package Lambda.
3. Endpoint redirect pubblico.
4. Endpoint login admin, create shirt e update link.
5. Frontend dashboard.
6. Osservabilita', audit e analytics.
