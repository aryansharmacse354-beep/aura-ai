# AuraPredict AI — REST API Documentation

The AuraPredict platform exposes a standard REST API documented under the OpenAPI 3.0.3 specification.

- **Interactive Swagger UI**: [`/api/docs`](/api/docs)
- **Raw OpenAPI JSON Spec**: [`/api/openapi.json`](/api/openapi.json)

---

## Base URL
```
http://localhost:3000/api
```

---

## Authentication Endpoints

### 1. Register User
`POST /api/auth/register`

**Request Body:**
```json
{
  "name": "Dr. Sarah Lin",
  "email": "sarah.lin@aurapredict.org",
  "password": "AuraPredict2026!",
  "role": "researcher",
  "healthConditions": ["asthma"],
  "alertThresholdAQI": 150
}
```

**Response (200 OK):**
```json
{
  "token": "d78fa89b21...",
  "user": {
    "id": "usr_17000000",
    "name": "Dr. Sarah Lin",
    "email": "sarah.lin@aurapredict.org",
    "role": "researcher",
    "mfaEnabled": true
  }
}
```

---

### 2. User Login
`POST /api/auth/login`

**Request Body:**
```json
{
  "email": "sarah.lin@aurapredict.org",
  "password": "AuraPredict2026!"
}
```

**Response (200 OK):**
```json
{
  "token": "49bf32890a...",
  "user": { "id": "usr_001", "name": "Dr. Sarah Lin", "role": "researcher" },
  "auditLogs": [...]
}
```

---

## Health & Monitoring Endpoints

### 1. Health Probe
`GET /api/health`

**Response (200 OK):**
```json
{
  "status": "healthy",
  "uptimeSeconds": 1845,
  "timestamp": "2026-08-16T08:15:00.000Z",
  "version": "1.0.0",
  "geminiConfigured": true,
  "storageStatus": "connected"
}
```

### 2. Cluster Metrics
`GET /api/metrics`

**Response (200 OK):**
```json
{
  "activeUsersCount": 6,
  "auditLogsCount": 52,
  "savedSimulationsCount": 14,
  "savedRoutesCount": 6,
  "memoryUsageMB": 138,
  "timestamp": "2026-08-16T08:15:00.000Z"
}
```

---

## Atmospheric Forecasting & AI Endpoints

### 1. 72-Hour Forecast Synthesis
`POST /api/predict/forecast`

**Request Body:**
```json
{
  "cityName": "Delhi NCR",
  "currentAQI": 285,
  "windSpeed": "12 km/h",
  "dominantPollutant": "PM2.5",
  "scenario": "stubble_burning_surge"
}
```

---

### 2. Policy & Intervention Simulator
`POST /api/policy/simulate`

**Request Body:**
```json
{
  "scenarioTitle": "Targeted EV & Industrial Scrubbing",
  "interventions": [
    { "id": "transport_ev", "name": "EV Transition", "intensity": 70 },
    { "id": "industrial_scrubbers", "name": "Heavy Scrubbers", "intensity": 80 }
  ]
}
```

---

### 3. Clean-Air Transit Route Persistence
- `POST /api/routes/save` (Headers: `Authorization: Bearer <token>`)
- `GET /api/routes` (Headers: `Authorization: Bearer <token>`)
