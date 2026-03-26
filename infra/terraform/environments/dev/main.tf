module "data" {
  source = "../../modules/data"

  name_prefix = var.name_prefix
}

module "api" {
  source = "../../modules/api"

  name_prefix                     = var.name_prefix
  allowed_cors_origins            = var.allowed_cors_origins
  links_table_name                = module.data.links_table_name
  links_table_arn                 = module.data.links_table_arn
  admin_email                     = var.admin_email
  admin_password                  = var.admin_password
  admin_session_token             = var.admin_session_token
  fallback_url                    = var.fallback_url
  redirect_lambda_package_path    = var.redirect_lambda_package_path
  management_lambda_package_path  = var.management_lambda_package_path
  claim_lambda_package_path       = var.claim_lambda_package_path
}

module "frontend" {
  source = "../../modules/frontend"

  name_prefix          = var.name_prefix
  frontend_bucket_name = var.frontend_bucket_name
}
