provider "aws" {
  alias  = "cert_region"
  region = "us-east-1"
}

resource "aws_acm_certificate" "cert" {
  provider          = aws.cert_region
  domain_name       = "*.${var.hosted_zone_domain}"
  validation_method = "DNS"
}

resource "aws_route53_record" "cert_record" {
  provider = aws.cert_region
  for_each = {
    for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.primary.zone_id
}

resource "aws_acm_certificate_validation" "cert_validation" {
  provider        = aws.cert_region
  certificate_arn = aws_acm_certificate.cert.arn
  validation_record_fqdns = [
    for record in aws_route53_record.cert_record : record.fqdn
  ]
}
