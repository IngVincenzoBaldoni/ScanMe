data "aws_region" "current" {}

resource "aws_iam_role" "lambda_exec" {
  name = "${var.project_name}-${var.environment}-lambda-exec"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "ddb_access" {
  name = "${var.project_name}-${var.environment}-ddb-policy"
  role = aws_iam_role.lambda_exec.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:Query",
          "dynamodb:UpdateItem"
        ]
        Resource = [
          var.links_table_arn,
          "${var.links_table_arn}/index/*"
        ]
      }
    ]
  })
}

resource "aws_lambda_function" "redirect" {
  function_name = "${var.project_name}-${var.environment}-redirect"
  role          = aws_iam_role.lambda_exec.arn
  runtime       = "nodejs20.x"
  handler       = "index.handler"
  filename      = var.redirect_lambda_package_path
  timeout       = 5

  environment {
    variables = {
      LINKS_TABLE_NAME = var.links_table_name
    }
  }
}

resource "aws_lambda_function" "management" {
  function_name = "${var.project_name}-${var.environment}-management"
  role          = aws_iam_role.lambda_exec.arn
  runtime       = "nodejs20.x"
  handler       = "index.handler"
  filename      = var.management_lambda_package_path
  timeout       = 10

  environment {
    variables = {
      LINKS_TABLE_NAME = var.links_table_name
      USER_POOL_ID     = var.user_pool_id
    }
  }
}

resource "aws_lambda_function" "claim" {
  function_name = "${var.project_name}-${var.environment}-claim"
  role          = aws_iam_role.lambda_exec.arn
  runtime       = "nodejs20.x"
  handler       = "index.handler"
  filename      = var.claim_lambda_package_path
  timeout       = 10

  environment {
    variables = {
      LINKS_TABLE_NAME = var.links_table_name
      USER_POOL_ID     = var.user_pool_id
    }
  }
}

resource "aws_apigatewayv2_api" "this" {
  name          = "${var.project_name}-${var.environment}-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_headers = ["authorization", "content-type"]
    allow_methods = ["GET", "OPTIONS", "POST", "PUT"]
    allow_origins = var.allowed_cors_origins
    expose_headers = ["location"]
  }
}

resource "aws_apigatewayv2_authorizer" "cognito" {
  api_id           = aws_apigatewayv2_api.this.id
  authorizer_type  = "JWT"
  name             = "${var.project_name}-${var.environment}-jwt-authorizer"
  identity_sources = ["$request.header.Authorization"]

  jwt_configuration {
    audience = [var.user_pool_client_id]
    issuer   = "https://cognito-idp.${data.aws_region.current.name}.amazonaws.com/${var.user_pool_id}"
  }
}

resource "aws_apigatewayv2_integration" "redirect" {
  api_id                 = aws_apigatewayv2_api.this.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.redirect.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "management" {
  api_id                 = aws_apigatewayv2_api.this.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.management.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "claim" {
  api_id                 = aws_apigatewayv2_api.this.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.claim.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "redirect" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "GET /r/{shirt_id}"
  target    = "integrations/${aws_apigatewayv2_integration.redirect.id}"
}

resource "aws_apigatewayv2_route" "list_shirts" {
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "GET /v1/shirts"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
  target             = "integrations/${aws_apigatewayv2_integration.management.id}"
}

resource "aws_apigatewayv2_route" "update_target" {
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "PUT /v1/shirts/{shirt_id}/target"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
  target             = "integrations/${aws_apigatewayv2_integration.management.id}"
}

resource "aws_apigatewayv2_route" "claim_shirt" {
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "POST /v1/shirts/claim"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
  target             = "integrations/${aws_apigatewayv2_integration.claim.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.this.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_lambda_permission" "allow_api_redirect" {
  statement_id  = "AllowExecutionFromApiGatewayRedirect"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.redirect.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.this.execution_arn}/*/*"
}

resource "aws_lambda_permission" "allow_api_management" {
  statement_id  = "AllowExecutionFromApiGatewayManagement"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.management.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.this.execution_arn}/*/*"
}

resource "aws_lambda_permission" "allow_api_claim" {
  statement_id  = "AllowExecutionFromApiGatewayClaim"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.claim.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.this.execution_arn}/*/*"
}
