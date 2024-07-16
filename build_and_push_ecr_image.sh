set -e

aws ecr get-login-password --region us-east-1 --profile default | docker login --username AWS --password-stdin 339713089106.dkr.ecr.us-east-1.amazonaws.com/aliqamarlabs/dw-interview:latest
docker build -f ./Dockerfile -t aliqamarlabs/dw-interview:latest .
docker tag aliqamarlabs/dw-interview:latest 339713089106.dkr.ecr.us-east-1.amazonaws.com/aliqamarlabs/dw-interview:latest
docker push 339713089106.dkr.ecr.us-east-1.amazonaws.com/aliqamarlabs/dw-interview:latest

Write-Host "AWS Ecr repo updated"