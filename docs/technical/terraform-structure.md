# Terraform Structure

## Obiettivo

Separare la definizione infrastrutturale per responsabilita', mantenendo un layer `environment` che orchestra i moduli.

## Struttura

- `infra/terraform/environments/dev`: entrypoint dell'environment.
- `infra/terraform/modules/data`: DynamoDB.
- `infra/terraform/modules/api`: API Gateway, Lambda, IAM.
- `infra/terraform/modules/frontend`: S3 + CloudFront.
- `infra/terraform/modules/auth`: modulo storico non usato nel deploy MVP attuale.

Nota: nel modulo API il package chiamato `claim` e' stato riutilizzato nel MVP come Lambda di creazione maglietta, per ridurre refactor infrastrutturale iniziale.

## Filosofia

- I moduli non devono conoscere dettagli specifici dell'account.
- I valori variabili arrivano dall'environment.
- Le dipendenze tra moduli avvengono tramite output espliciti.
- Il naming viene centralizzato nell'environment tramite `name_prefix`.

## Processo futuro

1. Copiare `terraform.tfvars.example` in un file locale.
2. Verificare `terraform.tfvars` locale e sostituire i segreti admin.
3. Generare i package Lambda e la build frontend.
4. Eseguire `terraform init`.
5. Eseguire `terraform plan -var-file=terraform.tfvars`.
6. Eseguire `terraform apply -var-file=terraform.tfvars`.
