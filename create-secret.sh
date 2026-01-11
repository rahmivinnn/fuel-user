#!/bin/bash

# Load .env file
source backend/.env.local

# Delete existing secret if exists
kubectl delete secret fuel-user-secrets -n fuel-friendly --ignore-not-found=true

# Create secret from environment variables
kubectl create secret generic fuel-user-secrets -n fuel-friendly \
  --from-literal=database_url="$DATABASE_URL" \
  --from-literal=jwt_secret="$JWT_SECRET" \
  --from-literal=emailjs_public_key="$EMAILJS_PUBLIC_KEY" \
  --from-literal=emailjs_service_id="$EMAILJS_SERVICE_ID" \
  --from-literal=emailjs_template_id="$EMAILJS_TEMPLATE_ID" \
  --from-literal=stripe_secret_key="$STRIPE_SECRET_KEY"

echo "✅ Secret created for fuel-user"