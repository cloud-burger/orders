resource "aws_sqs_queue" "terraform_queue" {
  name = "${var.name}-${var.environment}"

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.terraform_queue_deadletter.arn
    maxReceiveCount     = 4
  })
  tags = {
    Environment = var.environment
  }
}

resource "aws_sqs_queue" "terraform_queue_deadletter" {
  name = "${var.name}-deadletter-queue-${var.environment}"
  tags = {
    Environment = var.environment
  }
}

resource "aws_sqs_queue_redrive_allow_policy" "terraform_queue_redrive_allow_policy" {
  queue_url = aws_sqs_queue.terraform_queue_deadletter.id

  redrive_allow_policy = jsonencode({
    redrivePermission = "byQueue",
    sourceQueueArns   = [aws_sqs_queue.terraform_queue.arn]
  })
}