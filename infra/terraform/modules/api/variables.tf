variable "name_prefix" {
  type = string
}

variable "allowed_cors_origins" {
  type = list(string)
}

variable "links_table_name" {
  type = string
}

variable "links_table_arn" {
  type = string
}

variable "admin_email" {
  type = string
}

variable "admin_password" {
  type      = string
  sensitive = true
}

variable "admin_session_token" {
  type      = string
  sensitive = true
}

variable "fallback_url" {
  type = string
}

variable "redirect_lambda_package_path" {
  type = string
}

variable "management_lambda_package_path" {
  type = string
}

variable "claim_lambda_package_path" {
  type = string
}
