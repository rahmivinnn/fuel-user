#!/bin/bash

# Build Docker image
echo "Building Docker image..."
docker build -t wasilahhadi/fuel-user-backend:latest .

# Push to Docker Hub
echo "Pushing to Docker Hub..."
docker push wasilahhadi/fuel-user-backend:latest

# Create secrets
echo "Creating Kubernetes secrets..."
./create-secret.sh

# Apply Kubernetes configuration
echo "Deploying to Kubernetes..."
kubectl apply -f k8s-deploy.yaml

# Wait for deployment
echo "Waiting for deployment to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/fuel-user -n fuel-friendly

# Show status
echo "Deployment status:"
kubectl get pods -n fuel-friendly
kubectl get services -n fuel-friendly
kubectl get ingress -n fuel-friendly

echo "Backend deployed successfully!"
echo "API will be available at: https://apidecor.kelolahrd.life"