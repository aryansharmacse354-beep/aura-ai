# AuraPredict AI — Enterprise System Architecture

```
                               ┌─────────────────────────────────────────────────────────┐
                               │             AuraPredict Web Client / PWA                │
                               │  (React 19 + Tailwind CSS + Lucide + D3 + Recharts)     │
                               └────────────────────────────┬────────────────────────────┘
                                                            │ HTTP / JSON / Bearer JWT
                                                            ▼
                               ┌─────────────────────────────────────────────────────────┐
                               │           Express API Gateway (Port 3000)               │
                               │  - Request Logger Middleware (Structured JSON)          │
                               │  - Rate Limiter Safeguards (Auth / AI / General)        │
                               │  - PBKDF2 Auth & Session Verification                   │
                               │  - OpenAPI 3.0 Documentation (/api/docs)                │
                               └─────────────┬───────────────────────────┬───────────────┘
                                             │                           │
                   ┌─────────────────────────┴─────────────┐             │
                   │                                       │             │
                   ▼                                       ▼             ▼
┌──────────────────────────────────────┐  ┌───────────────────────┐  ┌───────────────────────┐
│       Atmospheric ML Core            │  │  Gemini 3.7 Pro AI    │  │ Persistent DB Layer   │
│ - PINN Navier-Stokes Loss Engine     │  │  Reasoning Engine     │  │ - PBKDF2 Users Vault  │
│ - GNN Spatial Advection Interpolator │  │ - Multi-turn Dialogue │  │ - Session Tokens      │
│ - 72h Probabilistic Confidence Bands │  │ - Policy Synthesizer  │  │ - Stored Route Plans  │
│ - Gaussian Plume Dispersion Model    │  │ - High Thinking Tiers │  │ - Security Audit Logs │
└──────────────────────────────────────┘  └───────────────────────┘  └───────────────────────┘
```

---

## 1. Architectural Principles

1. **Deterministic Physics + Generative AI Hybrid**:
   - Physics-Informed Neural Network (PINN) formulations enforce fundamental conservation of mass and momentum (Navier-Stokes equation).
   - Gemini 3.7 Pro reasoning models provide multi-turn synthesis, causal policy simulation explanations, and rapid clinical health triage.

2. **Edge-First Offline Resiliency**:
   - Client-side IndexedDB caching ensures full GIS map rendering, route calculation, and health advisory access during network disruptions.
   - Offline tile packages persist down to zoom level 16 for metropolitan districts.

3. **Cryptographic Security & RBAC**:
   - PBKDF2 password hashing (10,000 iterations, 64-byte SHA-512 key derivation with unique cryptographic salts).
   - Role-Based Access Control (`citizen`, `researcher`, `policymaker`, `health_official`, `industrial_operator`).
   - Immutable security audit logging with IP tracking, location detection, and device metadata.

---

## 2. Directory Structure

```
├── .github/                # CI/CD Workflows (CI, CodeQL, Release)
├── .vscode/                # VS Code Workspace Settings & Extensions
├── data/                   # Persistent Database File & Automated Backups
├── k8s/                    # Production Kubernetes Deployment & Service Manifests
├── server/                 # Modular Backend Services & Controllers
│   ├── db.ts               # Persistent Encrypted Storage Engine
│   ├── openapi.ts          # OpenAPI 3.0.3 Specification Contract
│   ├── middlewares/        # Auth, Rate Limiter, Logger, Error Handler
│   ├── routes/             # Modular API Subrouters (Docs, Auth, Predict, Routes)
│   └── services/           # Gemini Cascade, Physics PINN, Logging Services
├── src/                    # React 19 Frontend Application
│   ├── components/         # Domain-organized UI Components
│   ├── contexts/           # React Contexts (AQIContext, AuthContext)
│   ├── data/               # High-precision Global Station Datasets
│   ├── hooks/              # Reusable Custom Hooks (useAQI, useAuth, useGPS, etc.)
│   ├── services/           # Browser GIS, Speech Synthesis, PDF Export
│   ├── types.ts            # Global Unified TypeScript Interfaces
│   └── App.tsx             # Root Application Orchestrator
└── tests/                  # Vitest Test Suites (API Integration, Engine, Auth)
```

---

## 3. Atmospheric ML Pipeline

```
[ Sensor Telemetry (EPA / CPCB / Satellite) ]
                   │
                   ▼
       [ GNN Spatial Graph Layer ] ───────► [ Advection-Diffusion Tensor Grid ]
                   │                                         │
                   ▼                                         ▼
   [ Temporal Transformer (TCN) ]            [ Physics-Informed Loss (PINN) ]
                   │                                         │
                   └──────────────────┬──────────────────────┘
                                      │
                                      ▼
             [ Probabilistic 72-Hour Air Quality Matrix with Confidence Intervals ]
```
