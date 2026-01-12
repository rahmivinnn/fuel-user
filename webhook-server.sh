#!/bin/bash

# Webhook server untuk auto deploy
# Jalankan di VPS: ./webhook-server.sh

PORT=9000
DOCKER_USERNAME="your-dockerhub-username"

echo "🎣 Starting webhook server on port $PORT..."

while true; do
  echo "Waiting for webhook..."
  
  # Simple HTTP server yang listen webhook
  echo -e "HTTP/1.1 200 OK\n\n" | nc -l -p $PORT -q 1
  
  echo "📦 Webhook received! Deploying..."
  
  # Pull latest image dan update deployment
  kubectl set image deployment/fuel-user fuel-user=$DOCKER_USERNAME/fuel-user-backend:latest -n fuel-friend
  kubectl rollout status deployment/fuel-user -n fuel-friend
  
  echo "✅ Deployment complete!"
  sleep 5
done