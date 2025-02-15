terraform {
  backend "s3" {
    bucket = "cloud-burger-states"
    key    = "orders/infra/sqs/prod/terraform.tfstate"
    region = "us-east-1"
  }
}
