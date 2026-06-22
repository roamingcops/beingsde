#!/bin/bash

# Configuration
API_URL="http://localhost:8081/api/v1"
EMAIL="testuser@beingsde.com"
PASSWORD="testuser123"

echo "========================================="
echo "Logging in as: $EMAIL"
echo "========================================="

# Perform Login API call
RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\", \"password\":\"$PASSWORD\"}")

# Parse Access Token (requires grep / sed if jq is not installed)
ACCESS_TOKEN=$(echo "$RESPONSE" | grep -o '"accessToken":"[^"]*' | grep -o '[^"]*$')

if [ -z "$ACCESS_TOKEN" ]; then
  echo "Error logging in. Response details:"
  echo "$RESPONSE"
  exit 1
fi

echo "Success! Access Token generated:"
echo "$ACCESS_TOKEN"
echo ""
echo "========================================="
echo "Try fetching gated topics with this token:"
echo "========================================="
echo "curl -X GET \"$API_URL/topics/design-distributed-caching-redis\" \\"
echo "  -H \"Authorization: Bearer $ACCESS_TOKEN\""
echo "========================================="
