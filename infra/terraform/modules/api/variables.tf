variable "project_name" {
  type = string
}

variable "environment" {
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

variable "user_pool_id" {
  type = string
}

variable "user_pool_client_id" {
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
