# Being SDE Deployment Guide

This document outlines the standard deployment procedures for the Being SDE platform, covering both the Next.js frontend (hosted on Vercel) and the Spring Boot backend (hosted on Render).

Both services are configured for **Continuous Deployment (CD)** via GitHub. Pushing code to the `main` branch will automatically trigger new builds and deployments for both the frontend and the backend.

---

## 1. Automated Deployments (Standard Method)

The standard and most reliable way to deploy changes is via Git:

1. Stage your changes:
   ```bash
   git add .
   ```
2. Commit your changes:
   ```bash
   git commit -m "feat: your descriptive commit message"
   ```
3. Push to the `main` branch:
   ```bash
   git push origin main
   ```

**What happens next?**
- **Vercel** listens to the webhook, detects changes in the repository (specifically the `beingsde-ui` directory), and starts a frontend production build.
- **Render** listens to the webhook, detects changes (specifically in the `beingsde-core` directory), runs `mvn clean install`, and starts the Java backend.

---

## 2. Frontend Deployment (Vercel)

The frontend is a Next.js 14 app located in the `beingsde-ui` folder.

### Forcing a Manual CLI Deployment
If the GitHub webhook fails, or if you need to push a hotfix directly from your local machine without waiting for GitHub:

1. Navigate to the frontend directory:
   ```bash
   cd beingsde-ui
   ```
2. Run the Vercel CLI to deploy to production:
   ```bash
   npx vercel --prod --yes
   ```
   *(The `--yes` flag automatically confirms the project settings so the deployment runs non-interactively).*

### Vercel Dashboard & Configuration
- **Dashboard Url:** Log into [Vercel](https://vercel.com/) and open the `beingsde` project.
- **Environment Variables:** If you add new environment variables to your local `.env` file, **you must add them to Vercel** (Settings -> Environment Variables) before the next deployment.
- **Rollbacks:** If a deployment breaks production, go to the Deployments tab in Vercel, click the three dots next to a previous successful deployment, and select **Assign Custom Domains** (or simply click **Promote to Production**) to instantly roll back.

---

## 3. Backend Deployment (Render)

The backend is a Spring Boot Java application located in the `beingsde-core` folder.

### Forcing a Manual Deployment via Dashboard
Render does not use a local CLI tool for code uploads. If you need to manually trigger a deployment (for instance, if the webhook failed or you want to clear the build cache):

1. Log into your [Render Dashboard](https://dashboard.render.com).
2. Select your Spring Boot Web Service.
3. Click the **Manual Deploy** button in the top right.
   - Select **Deploy latest commit** to simply restart the build process.
   - Select **Clear build cache & deploy** if you recently changed Maven dependencies (`pom.xml`) and the build is failing due to cached artifacts.

### Render Dashboard & Configuration
- **Logs:** Render provides a unified Logs tab. If the backend returns `502 Bad Gateway`, check these logs to see if the Spring application failed to start or crashed.
- **Environment Variables:** Any properties mapped in `application-production.properties` must have their values supplied in Render (Settings -> Environment). 
- **Health Checks:** Render relies on a health check endpoint (typically `/actuator/health` or a custom endpoint) to determine if the deployment was successful before routing live traffic to the new instance.
