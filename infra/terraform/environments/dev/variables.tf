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
  description = "Percorso locale del package zip della Lambda claim."
  type        = string
  default     = "PLACEHOLDER/claim.zip"
}
