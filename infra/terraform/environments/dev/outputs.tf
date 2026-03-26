output "frontend_bucket_name" {
  description = "Bucket frontend."
  value       = module.frontend.frontend_bucket_name
}

output "frontend_distribution_domain_name" {
  description = "Domain name CloudFront."
  value       = module.frontend.cloudfront_domain_name
}

output "api_base_url" {
  description = "Invoke URL dell'API."
  value       = module.api.api_base_url
}

output "cognito_user_pool_id" {
  description = "Cognito user pool ID."
  value       = module.auth.user_pool_id
}

output "cognito_user_pool_client_id" {
  description = "Cognito app client ID."
  value       = module.auth.user_pool_client_id
}
