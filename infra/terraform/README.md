# Terraform

Questa cartella contiene lo scheletro IaC del progetto ScanMe.

## Moduli inclusi

- `data`: Amazon DynamoDB
- `api`: API Gateway + Lambda + IAM
- `frontend`: S3 + CloudFront

## Nota

I file sono pronti per essere completati con valori reali ma non possono essere applicati finche' non vengono definiti:

- credenziali AWS;
- backend remoto Terraform;
- package delle Lambda;
- eventuale dominio custom.
