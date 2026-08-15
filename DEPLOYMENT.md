# AuraPredict AI - Production Deployment & Operations Guide

This guide details how to deploy, configure, and maintain **AuraPredict AI** across cloud container platforms (Google Cloud Run, AWS ECS, Kubernetes, Docker Swarm).

---

## 🔑 Environment Variables Specification

Define these environment variables in your deployment secret manager or container orchestration configuration:

| Variable | Required | Default | Description |
|---|---|---|---|
| `GEMINI_API_KEY` | **Recommended** | `""` (Fallback active) | Google Gemini API Key used for spatial reports, neural chat, and policy simulations. |
| `NODE_ENV` | Yes | `production` | Node runtime environment mode (`production` or `development`). |
| `PORT` | Optional | `3000` | Ingress port for HTTP traffic (defaults to `3000`). |
| `DATA_DIR` | Optional | `./data` | File-system path for persistent transactional JSON stores and audit trails. |
| `SESSION_SECRET` | Optional | Auto-generated | Secret token seed for cryptographically signed user sessions. |

---

## 🐳 Docker Deployment

### 1. Build Container Image
```bash
docker build -t aurapredict-ai:latest .
```

### 2. Run Container with Persistent Volume & API Key
```bash
docker run -d \
  --name aurapredict-app \
  -p 3000:3000 \
  -e GEMINI_API_KEY="your_actual_gemini_key" \
  -e NODE_ENV="production" \
  -v $(pwd)/data:/app/data \
  --restart unless-stopped \
  aurapredict-ai:latest
```

---

## ☁️ Google Cloud Run Deployment

Deploy directly using Google Cloud SDK:

```bash
# Set Project
gcloud config set project your-gcp-project-id

# Build & Deploy to Cloud Run
gcloud run deploy aurapredict-ai \
  --source . \
  --platform managed \
  --region asia-east1 \
  --allow-unauthenticated \
  --port 3000 \
  --set-env-vars="NODE_ENV=production" \
  --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest"
```

---

## 🔍 Health Checks & Metrics

- **Liveness & Readiness Probe:** `GET /api/health`
  ```json
  {
    "status": "healthy",
    "uptimeSeconds": 1420,
    "version": "1.0.0",
    "geminiConfigured": true,
    "storageStatus": "connected"
  }
  ```
- **System Telemetry Probe:** `GET /api/metrics`
  ```json
  {
    "activeUsersCount": 3,
    "auditLogsCount": 24,
    "savedSimulationsCount": 5,
    "memoryUsageMB": 68
  }
  ```

---

## 🛡️ Secrets Management & Security Safeguards

1. **GCP Secret Manager / AWS Secrets Manager**: Store `GEMINI_API_KEY` in your cloud secret manager and mount it as a runtime secret rather than hardcoded environment variables.
2. **Quota & Rate Safeguards**: The Express server incorporates built-in IP-based rate limiting on all `/api/` and `/api/gemini/` endpoints.
3. **Deterministic Fallbacks**: If upstream LLM quotas are exhausted or offline, the platform automatically serves physics-informed deterministic telemetry without application downtime.
