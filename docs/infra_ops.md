# Infrastructure, CI/CD, & Observability - beingsde

This document describes the Docker configuration, CI/CD workflows, OpenTelemetry settings, AWS VPC deployment topology, and MVP budget estimates.

---

## 1. Multi-Stage Dockerfiles

### Core (Java 21 / Spring Boot 3.x) - `beingsde-core/Dockerfile`
Uses a multi-stage process to build with Maven and package with an optimized, secure Eclipse Temurin runtime.

```dockerfile
# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
COPY --from=builder /app/target/beingsde-core-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### UI (Next.js Node 20) - `beingsde-ui/Dockerfile`
Implements multi-stage build optimization to strip development dependencies and build a lightweight standalone build.

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV PORT 3000
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Copy standalone build outputs for Next.js output: standalone
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 2. CI/CD GitHub Actions Pipeline

We configure a GitHub Actions workflow to build, lint, scan, push to Amazon Elastic Container Registry (ECR), and update ECS Fargate services.

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]

env:
  AWS_REGION: us-east-1
  ECR_REPOSITORY_CORE: beingsde-core
  ECR_REPOSITORY_UI: beingsde-ui
  ECS_CLUSTER: beingsde-cluster
  ECS_SERVICE_CORE: beingsde-core-service
  ECS_SERVICE_UI: beingsde-ui-service

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
          cache: 'maven'

      - name: Build Core & Run Tests
        run: |
          cd beingsde-core
          mvn clean test

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: beingsde-ui/package-lock.json

      - name: Lint and Build UI
        run: |
          cd beingsde-ui
          npm ci
          npm run lint

  deploy-to-aws:
    needs: build-and-test
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Log in to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      # 1. Build and push Core Container
      - name: Build and Push Core Image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY_CORE:$IMAGE_TAG ./beingsde-core
          docker push $ECR_REGISTRY/$ECR_REPOSITORY_CORE:$IMAGE_TAG
          echo "IMAGE=$ECR_REGISTRY/$ECR_REPOSITORY_CORE:$IMAGE_TAG" >> $GITHUB_ENV

      # 2. Deploy to ECS Fargate
      - name: Deploy Amazon ECS Core Task
        uses: aws-actions/amazon-ecs-deploy-task-definition@v2
        with:
          task-definition: task-def-core.json
          service: ${{ env.ECS_SERVICE_CORE }}
          cluster: ${{ env.ECS_CLUSTER }}
          image: ${{ env.IMAGE }}
```

---

## 3. Observability Architecture (OpenTelemetry, Prometheus, Grafana)

The Spring Boot backend uses the **OpenTelemetry Java Agent** (agent jar mounted into the container) or micrometer-registry-otlp exporter to send metrics and traces.

### OpenTelemetry Collector Config (`otel-collector-config.yaml`)

The collector aggregates data inside the VPC and pushes traces to Jaeger/AWS X-Ray and metrics to Prometheus.

```yaml
receivers:
  otlp:
    protocols:
      grpc:
      http:

processors:
  batch:

exporters:
  prometheus:
    endpoint: "0.0.0.0:8889"
    namespace: "beingsde"
  otlp/jaeger:
    endpoint: "jaeger:4317"
    tls:
      insecure: true

service:
  pipelines:
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [prometheus]
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp/jaeger]
```

### Critical SLIs/SLOs to Alert on:
* **Availability SLO**: `99.9%` of requests should return status `< 500`.
  * *Alert Condition*: `(sum(rate(http_server_requests_seconds_count{status=~"5.."}[5m])) / sum(rate(http_server_requests_seconds_count[5m]))) * 100 > 0.1` (Trigger: PagerDuty if active for 2 minutes).
* **Latency SLO**: `95%` of topic retrieval API responses under `150ms`.
  * *Alert Condition*: `histogram_quantile(0.95, sum(rate(http_server_requests_seconds_bucket{uri="/api/v1/topics/*"}[5m])) by (le)) > 0.15`

---

## 4. MVP AWS Cost Projections (Standard Scaling Tier)

Calculated based on standard AWS pricing inside the US-East-1 region for an MVP serving up to ~10,000 active students.

| AWS Resource | Details | Hourly Cost | Monthly Cost (Est.) |
| :--- | :--- | :--- | :--- |
| **ECS Fargate (Core)** | 2 Tasks × (0.5 vCPU + 1 GB RAM) | $0.0226 / hr | $32.50 |
| **ECS Fargate (UI)** | 2 Tasks × (0.25 vCPU + 0.5 GB RAM) | $0.0113 / hr | $16.25 |
| **MongoDB Atlas** | M10 Cluster (Dedicated, Backup enabled) | $0.08 / hr | $58.00 |
| **ElastiCache Redis** | `cache.t4g.medium` (Single Node Cache) | $0.04 / hr | $29.00 |
| **CloudFront CDN** | Egress traffic cost (~200 GB data transfer) | - | $16.00 |
| **Application Load Balancer** | 1 ALB (running globally) | $0.0225 / hr | $16.20 + LCU charges (~$22.00) |
| **S3 Storage + KMS** | ~100 GB PDFs and Video Storage | - | $3.50 |
| **Observability (Grafana Cloud)** | Free Tier (up to 3 users, metrics + logs limits) | - | $0.00 |
| **Razorpay gateway** | 2% per successful transaction | - | Pay-as-you-go |
| **Total Estimated Cost** | **Estimated Base Cost for Running MVP** | | **~$197.25 / month** |
