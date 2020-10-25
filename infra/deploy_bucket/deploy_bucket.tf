terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

variable "aws_region" {}

provider "aws" {
  region = var.aws_region
}

resource "aws_s3_bucket" "deploy_bucket" {
  bucket = "shopify-app-deploy-bucket"
  acl    = "private"
}
