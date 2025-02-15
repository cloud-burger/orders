output "sqs_arn" {
  value = aws_sqs_queue.terraform_queue.arn
}

output "sqs_deadletter_arn" {
  value = aws_sqs_queue.terraform_queue_deadletter.arn
}
