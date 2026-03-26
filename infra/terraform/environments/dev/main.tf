module "data" {
  source = "../../modules/data"

  project_name = var.project_name
  environment  = var.environment
}

module "api" {
  source = "../../modules/api"

  project_name                    = var.project_name
  environment                     = var.environment
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

  project_name         = var.project_name
  environment          = var.environment
  frontend_bucket_name = var.frontend_bucket_name
}
