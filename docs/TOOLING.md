# Tooling & Developer Guide

This file describes the developer tooling configured for AuraPredict AI.

## What is Configured
- **ESLint** (`.eslintrc.cjs`): Configured for TypeScript + React (`@typescript-eslint/parser`, `plugin:@typescript-eslint/recommended`, `plugin:react/recommended`, `plugin:react-hooks/recommended`, `prettier`).
- **Prettier** (`.prettierrc` + `.prettierignore`): Consistent code formatting standards.
- **Husky** (`.husky/pre-commit`): Pre-commit hook to execute `lint-staged`.
- **lint-staged** (configured in `package.json`): Runs formatting and lint fixes on staged files before commit.
- **GitHub Actions CI** (`.github/workflows/ci.yml`): Continuous Integration pipeline with automated linting, testing, and production builds on Node 20.
- **OpenAPI Specification** (`openapi/openapi.yaml`): Standard API contracts for authentication, spatio-temporal forecasting, and conversational chat endpoints.

---

## How to Enable Husky Locally
```bash
npm install
npm run prepare
```

---

## Common Development Commands

```bash
# Run ESLint validation
npm run lint

# Automatically fix ESLint formatting/rule issues
npm run lint:fix

# Format entire codebase with Prettier
npm run format

# Run full Vitest test suite
npm run test

# Compile production build
npm run build

# Run end-to-end checks (lint + test + build)
npm run check
```

---

## Generate TypeScript Client from OpenAPI (Example)

To generate strongly typed TypeScript clients from the OpenAPI specification:
```bash
npx openapi-typescript openapi/openapi.yaml --output src/generated/openapi.ts
```
