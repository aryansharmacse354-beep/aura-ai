# Security Policy & Safeguards

## 🛡️ Supported Versions

| Version | Supported          | Security Maintenance |
| ------- | ------------------ | -------------------- |
| 1.0.x   | :white_check_mark: | Active               |

---

## 🔒 Security Architecture & Secret Management

### 1. Zero Client-Side Exposure for Secrets
- **`GEMINI_API_KEY`** and all sensitive tokens are **strictly confined to the Node.js backend server (`server.ts`)**.
- No API keys are prefixed with `VITE_` or sent over client network bundles.
- All GenAI requests are proxied and validated through authenticated server endpoints (`/api/*`).

### 2. Multi-Tier Rate Limiting & Quota Safeguards
- **General API Limiter**: Enforces a max of 180 requests per minute per IP.
- **AI Synthesis Limiter**: Enforces a max of 50 requests per minute per IP on `/api/gemini/*` and `/api/predict/*` routes to prevent API quota starvation and Denial-of-Service attacks.
- **Auth Endpoint Brute-Force Limiter**: Enforces a max of 30 attempts per 15 minutes on login/register endpoints.

### 3. Password Hashing & Salt Standards
- User passwords are encrypted with **PBKDF2 (SHA-512)** using 10,000 iterations and cryptographically unique 16-byte random salts.
- Password comparison uses `crypto.timingSafeEqual` to eliminate timing side-channel attacks.

### 4. HTTP Security Headers
The server automatically injects:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

---

## 🚨 Reporting a Vulnerability

If you discover a potential security vulnerability in **AuraPredict AI**, please do **not** open a public issue.

Instead, please send an encrypted or direct email to:
- **Security Contact:** `aryansharmacse354@gmail.com`
- **Response SLA:** Within 24-48 hours with initial triage and fix timeline.
