# Deploy Dev

## Obiettivo

Eseguire il primo deploy `dev` dell'MVP ScanMe nell'account AWS `scanme_official` (`265020547280`) in regione `eu-west-1`, senza custom domain.

## Servizi deployati

- `S3`
- `CloudFront`
- `DynamoDB`
- `Lambda`
- `API Gateway HTTP API`
- `IAM`
- `CloudWatch Logs`

## Prerequisiti locali

- `aws` CLI configurata con utente IAM admin
- `terraform`
- `node`
- `npm install` eseguito in repository root

## Sequenza

1. Generare i package Lambda:

```bash
cd /Users/vincemartibalducci/Desktop/Projects/ScanMe/codebase
export PATH="$HOME/.local/bin:$PATH"
npm run lambdas:package
```

2. Generare la build frontend:

```bash
export PATH="$HOME/.local/bin:$PATH"
npm run web:build
```

3. Verificare il file locale [terraform.tfvars](/Users/vincemartibalducci/Desktop/Projects/ScanMe/codebase/infra/terraform/environments/dev/terraform.tfvars):

- sostituire `admin_email`
- sostituire `admin_password`
- sostituire `admin_session_token`

4. Deploy infrastrutturale:

```bash
cd /Users/vincemartibalducci/Desktop/Projects/ScanMe/codebase/infra/terraform/environments/dev
terraform init
terraform plan -var-file=terraform.tfvars
terraform apply -var-file=terraform.tfvars
```

5. Recuperare gli output:

- `frontend_bucket_name`
- `frontend_distribution_id`
- `frontend_distribution_domain_name`
- `api_base_url`

6. Caricare il frontend buildato:

```bash
cd /Users/vincemartibalducci/Desktop/Projects/ScanMe/codebase
aws s3 sync apps/web/dist s3://it-dev-scanme-s3-frontend-265020547280 --delete
```

7. Invalidare CloudFront:

```bash
aws cloudfront create-invalidation --distribution-id <DISTRIBUTION_ID> --paths "/*"
```

8. Aggiornare il frontend per il deploy successivo:

- `VITE_SCANME_API_BASE_URL = api_base_url`
- `VITE_SCANME_REDIRECT_BASE_URL = api_base_url`
- aggiungere il dominio CloudFront agli `allowed_cors_origins`
- opzionalmente valorizzare `fallback_url` con il dominio CloudFront e rieseguire `terraform apply`

## Verifiche funzionali

- login admin dal frontend
- creazione di un capo
- visualizzazione di `I TUOI CAPI`
- apertura del redirect pubblico `/r/{shirt_id}`
- aggiornamento target URL
- crescita dei contatori analytics dopo scansioni ripetute
