data "aws_route53_zone" "primary" {
  name         = var.hosted_zone_domain
  private_zone = false
}

resource "aws_route53_record" "api_record" {
  name    = aws_api_gateway_domain_name.url.domain_name
  type    = "A"
  zone_id = data.aws_route53_zone.primary.zone_id

  alias {
    name                   = aws_api_gateway_domain_name.url.cloudfront_domain_name
    zone_id                = aws_api_gateway_domain_name.url.cloudfront_zone_id
    evaluate_target_health = true
  }
}
