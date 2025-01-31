variable "environment" {
  default = "prod"
}

variable "project" {
  default = "self-service-orders"
}

variable "database_password" {
  default = "orders"
}

variable "database_instance_class" {
  default = "db.t3.micro"
}

variable "database_name" {
  default = "orders"
}

variable "database_username" {
  default = "orders"
}
