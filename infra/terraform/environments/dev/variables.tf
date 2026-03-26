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

variable "frontend_bucket_name" {
  description = "Nome bucket S3 frontend. Lasciare placeholder finche' non si definisce l'account."
  type        = string
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
  default     = "PLACEHOLDER/redirect.zip"
}

variable "management_lambda_package_path" {
  description = "Percorso locale del package zip della Lambda gestione."
  type        = string
  default     = "PLACEHOLDER/management.zip"
}

variable "claim_lambda_package_path" {
  description = "Percorso locale del package zip della Lambda creazione maglietta MVP."
  type        = string
  default     = "PLACEHOLDER/claim.zip"
}
