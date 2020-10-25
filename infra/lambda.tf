resource "aws_iam_role" "iam_for_lambda" {
  name = "iam_for_lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_policy" "lambda_logging" {
  name        = "lambda_logging"
  path        = "/"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:CreateLogGroup"
      ],
      "Resource": "arn:aws:logs:*:*:*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.lambda_logging.arn
}

resource "aws_lambda_function" "server" {
  # aws lambda invoke --region=us-west-2 --function-name=lambda_function_name output.txt
  filename      = "output.zip"
  function_name = "shopify-app" # TODO rename when you make this a module
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "testy.test"

  source_code_hash = filebase64sha256("output.zip")

  runtime = "nodejs12.x"

  environment {
    variables = {
      STAGE                  = var.stage,
      SHOPIFY_API_SECRET_KEY = var.shopify_api_secret_key,
      SHOPIFY_API_KEY        = var.shopify_api_key,
      SECRET_KEY             = var.secret_key,
      HOST                   = aws_api_gateway_domain_name.url.domain_name
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_logs,
  ]
}

resource "aws_lambda_permission" "allow_api_to_server" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.server.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_api_gateway_rest_api.api.execution_arn}/*/*"
}
