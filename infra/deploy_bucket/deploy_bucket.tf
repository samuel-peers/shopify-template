terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

variable "aws_region" {}

variable "deploy_bucket_name" {}

provider "aws" {
  region = var.aws_region
}

resource "aws_s3_bucket" "deploy_bucket" {
  bucket = var.deploy_bucket_name
  acl    = "private"
}
