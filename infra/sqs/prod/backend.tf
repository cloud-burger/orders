provider "aws" {
  region = "us-east-1"
}

terraform {
  backend "s3" {
    bucket = "cloud-burger-states"
    key    = "prod/orders/infra/sqs/terraform.tfstate"
    region = "us-east-1"
  }
}
