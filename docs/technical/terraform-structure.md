# Terraform Structure

## Obiettivo

Separare la definizione infrastrutturale per responsabilita', mantenendo un layer `environment` che orchestra i moduli.

## Struttura

- `infra/terraform/environments/dev`: entrypoint dell'environment.
- `infra/terraform/modules/auth`: Cognito.
- `infra/terraform/modules/data`: DynamoDB.
- `infra/terraform/modules/api`: API Gateway, Lambda, IAM.
- `infra/terraform/modules/frontend`: S3 + CloudFront.

## Filosofia

- I moduli non devono conoscere dettagli specifici dell'account.
- I valori variabili arrivano dall'environment.
- Le dipendenze tra moduli avvengono tramite output espliciti.

## Processo futuro

1. Copiare `terraform.tfvars.example` in un file locale.
2. Inserire placeholder reali.
3. Configurare backend remoto.
4. Eseguire `terraform init`.
5. Eseguire `terraform plan`.
6. Eseguire `terraform apply`.
