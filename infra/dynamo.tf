resource "aws_dynamodb_table" "access_tokens" {
  name         = "shopify-access-tokens"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "store"

  attribute {
    name = "store"
    type = "S"
  }

  tags = {
    Name = "shopify-access-tokens"
  }
}
