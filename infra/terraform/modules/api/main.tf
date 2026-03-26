resource "aws_iam_role" "lambda_exec" {
  name = "${var.name_prefix}-iam-lambda-exec"

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
  name = "${var.name_prefix}-iam-ddb-policy"
  role = aws_iam_role.lambda_exec.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:Scan",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem"
        ]
        Resource = [
          var.links_table_arn
        ]
      }
    ]
  })
}

resource "aws_lambda_function" "redirect" {
  function_name = "${var.name_prefix}-lambda-redirect"
  role          = aws_iam_role.lambda_exec.arn
  runtime       = "nodejs20.x"
  handler       = "redirect/index.handler"
  filename      = var.redirect_lambda_package_path
  source_code_hash = filebase64sha256(var.redirect_lambda_package_path)
  timeout       = 5

  environment {
    variables = {
      LINKS_TABLE_NAME = var.links_table_name
      FALLBACK_URL     = var.fallback_url
    }
  }
}

resource "aws_lambda_function" "management" {
  function_name = "${var.name_prefix}-lambda-management"
  role          = aws_iam_role.lambda_exec.arn
  runtime       = "nodejs20.x"
  handler       = "management/index.handler"
  filename      = var.management_lambda_package_path
  source_code_hash = filebase64sha256(var.management_lambda_package_path)
  timeout       = 10

  environment {
    variables = {
      LINKS_TABLE_NAME    = var.links_table_name
      ADMIN_EMAIL         = var.admin_email
      ADMIN_PASSWORD      = var.admin_password
      ADMIN_SESSION_TOKEN = var.admin_session_token
    }
  }
}

resource "aws_lambda_function" "claim" {
  function_name = "${var.name_prefix}-lambda-claim"
  role          = aws_iam_role.lambda_exec.arn
  runtime       = "nodejs20.x"
  handler       = "claim/index.handler"
  filename      = var.claim_lambda_package_path
  source_code_hash = filebase64sha256(var.claim_lambda_package_path)
  timeout       = 10

  environment {
    variables = {
      LINKS_TABLE_NAME    = var.links_table_name
      ADMIN_EMAIL         = var.admin_email
      ADMIN_PASSWORD      = var.admin_password
      ADMIN_SESSION_TOKEN = var.admin_session_token
    }
  }
}

resource "aws_apigatewayv2_api" "this" {
  name          = "${var.name_prefix}-apigateway-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_headers = ["authorization", "content-type"]
    allow_methods = ["GET", "OPTIONS", "POST", "PUT"]
    allow_origins = var.allowed_cors_origins
    expose_headers = ["location"]
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
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "GET /v1/shirts"
  target    = "integrations/${aws_apigatewayv2_integration.management.id}"
}

resource "aws_apigatewayv2_route" "login_admin" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "POST /v1/admin/login"
  target    = "integrations/${aws_apigatewayv2_integration.management.id}"
}

resource "aws_apigatewayv2_route" "create_shirt" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "POST /v1/shirts"
  target    = "integrations/${aws_apigatewayv2_integration.claim.id}"
}

resource "aws_apigatewayv2_route" "update_target" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "PUT /v1/shirts/{shirt_id}/target"
  target    = "integrations/${aws_apigatewayv2_integration.management.id}"
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
