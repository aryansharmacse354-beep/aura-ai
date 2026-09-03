# Changelog

All notable changes to the AuraPredict AI project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-08-16
### Added
- **OpenAPI 3.0.3 Specification**: Full API contract exposed at `/api/openapi.json` with interactive Swagger UI rendered at `/api/docs`.
- **Developer DX & Workspace Configuration**: Configured TypeScript path aliases (`@/*`, `@src/*`, `@server/*`, `@components/*`, `@services/*`, `@hooks/*`, `@contexts/*`, `@data/*`) in `tsconfig.json` and `vite.config.ts`.
- **VSCode Workspace Defaults**: Added `.vscode/settings.json`, `.vscode/extensions.json`, and `.prettierrc`.
- **Reusable React Custom Hooks**: Created `useAQI`, `useAuth`, `useGPS`, `useTheme`, and `useOfflineSync` in `src/hooks/`.
- **Global React Contexts**: Added `AQIContext` and `AuthContext` in `src/contexts/`.
- **Backend Logging & Observability**: Integrated structured JSON logging (`loggerService`) and HTTP `requestLogger` middleware with request IDs and duration metrics.
- **Kubernetes Production Manifests**: Added `k8s/deployment.yaml` and `k8s/service.yaml` with readiness/liveness health probes.
- **Architecture & API Documentation**: Authored `ARCHITECTURE.md`, `API.md`, and `ROADMAP.md`.

## [1.0.0] - 2026-08-14
### Added
- Initial enterprise release of AuraPredict AI with 14 atmospheric intelligence and forecasting modules.
- PINN physics loss simulation, GNN dispersion models, and 10,000 node multi-agent consensus swarm.
- Gemini 3.7 Pro chatbot with audio speech synthesis and clean-air exposure routing.
