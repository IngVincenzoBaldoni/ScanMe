# Terraform

Questa cartella contiene lo scheletro IaC del progetto ScanMe.

## Moduli inclusi

- `data`: Amazon DynamoDB
- `api`: API Gateway + Lambda + IAM
- `frontend`: S3 + CloudFront
- `auth`: modulo legacy non usato dal deploy MVP attuale

## Nota

I file sono pronti per essere completati con valori reali ma non possono essere applicati finche' non vengono definiti:

- credenziali AWS;
- `admin_password`;
- `admin_session_token`;
- package delle Lambda;
- upload del frontend buildato su S3.
