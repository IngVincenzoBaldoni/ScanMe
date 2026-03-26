variable "project_name" {
  description = "Nome logico del progetto."
  type        = string
  default     = "scanme"
}

variable "environment" {
  description = "Nome environment."
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "Regione AWS di deploy."
  type        = string
  default     = "eu-west-1"
}

variable "aws_account_id" {
  description = "AWS account ID di destinazione."
  type        = string
  default     = "265020547280"
}

variable "aws_account_name" {
  description = "Nome logico dell'account AWS."
  type        = string
  default     = "scanme_official"
}

variable "name_prefix" {
  description = "Prefisso naming condiviso da tutte le risorse del deploy dev."
  type        = string
  default     = "it-dev-scanme"
}

variable "frontend_bucket_name" {
  description = "Nome bucket S3 frontend."
  type        = string
  default     = "it-dev-scanme-s3-frontend-265020547280"
}

variable "allowed_cors_origins" {
  description = "Origin abilitate per la SPA."
  type        = list(string)
  default     = ["http://localhost:5173"]
}

variable "admin_email" {
  description = "Email usata per il login admin MVP."
  type        = string
  default     = "founder@example.com"
}

variable "admin_password" {
  description = "Password admin MVP. Sostituire con un valore reale e robusto."
  type        = string
  sensitive   = true
}

variable "admin_session_token" {
  description = "Token restituito dal login admin e validato dal backend."
  type        = string
  sensitive   = true
}

variable "fallback_url" {
  description = "URL dashboard o pagina fallback da mostrare quando il QR non e' configurato."
  type        = string
  default     = ""
}

variable "redirect_lambda_package_path" {
  description = "Percorso locale del package zip della Lambda redirect."
  type        = string
  default     = "../../../../artifacts/redirect.zip"
}

variable "management_lambda_package_path" {
  description = "Percorso locale del package zip della Lambda gestione."
  type        = string
  default     = "../../../../artifacts/management.zip"
}

variable "claim_lambda_package_path" {
  description = "Percorso locale del package zip della Lambda creazione maglietta MVP."
  type        = string
  default     = "../../../../artifacts/claim.zip"
}
