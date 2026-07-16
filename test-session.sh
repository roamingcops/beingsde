#!/bin/bash
RES1=$(curl -s -X POST http://localhost:8081/api/v1/auth/login -H "Content-Type: application/json" -d '{"email":"bob@beingsde.com", "password":"password123"}')
TOKEN1=$(echo $RES1 | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

RES2=$(curl -s -X POST http://localhost:8081/api/v1/auth/login -H "Content-Type: application/json" -d '{"email":"bob@beingsde.com", "password":"password123"}')
TOKEN2=$(echo $RES2 | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

echo "T1: $TOKEN1"
echo "T2: $TOKEN2"

TEST1=$(curl -s -o /dev/null -w "%{http_code}" -X GET http://localhost:8081/api/v1/interviews -H "Authorization: Bearer $TOKEN1")
TEST2=$(curl -s -o /dev/null -w "%{http_code}" -X GET http://localhost:8081/api/v1/interviews -H "Authorization: Bearer $TOKEN2")

echo "T1 HTTP: $TEST1"
echo "T2 HTTP: $TEST2"
