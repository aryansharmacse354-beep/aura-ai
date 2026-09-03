# Tooling, AI Engineering & UI Generation Architecture

This document establishes the UI generation standards, design-to-code toolchains, and developer workflow integrations for **AuraPredict AI**.

---

## 🎨 UI Generation & Design-to-Code Toolchain Integrations

| Tool | Core Role in AuraPredict AI | Workflow & Conversion Strategy |
| :--- | :--- | :--- |
| **1. Google Stitch** | **Cross-Platform Component Synthesis** | Translates Material You / Stitch design tokens into Tailwind CSS v4 variables with high UI generation accuracy. |
| **2. GitHub Copilot** | **Pair Programming & Autonomous Refactoring** | Autocompletes PINN/GNN atmospheric math, validates strict TypeScript types, and guarantees clean, readable, self-documenting code. |
| **3. V0 by Vercel** | **Generative Component Prototyping** | Rapid design-to-code transformation of dashboard wireframes into production React 19 + Lucide React + Tailwind components. |
| **4. Webcrumbs** | **Multi-Framework Snippet Extraction** | Provides modular, framework-agnostic HTML/CSS/React/Vue export bridges with zero style pollution. |
| **5. UX Pilot** | **Figma/Sketch UX Audit & Accessibility** | Evaluates WCAG 2.1 AA contrast compliance across AQI severity badges and ensures ergonomic mobile-first navigation. |

---

## 📐 Five Core UI Engineering Principles

1. **UI Generation Accuracy**:
   - High-fidelity layout mirroring adhering strictly to atmospheric information hierarchy (Real-time AQI hero badge $\rightarrow$ 72h Multi-Horizon Forecast $\rightarrow$ Spatial Plume Contour $\rightarrow$ Actionable Health Advisory).
2. **Code Quality and Readability**:
   - Strict TypeScript (`strict: true`), zero untyped `any`, clean modular components under `src/components/`, and atomic state custom hooks under `src/hooks/`.
3. **Design-to-Code Conversion**:
   - Instant zero-friction transformation from Figma/Sketch frames into reusable React 19 functional components utilizing Tailwind utility classes.
4. **Multi-Framework Support & Portability**:
   - Headless state contracts and standard REST/JSON endpoints (`/api/datasets/*`, `/api/predict/*`) allowing seamless integration with Next.js, Remix, React Native, or Vue frontends.
5. **Integration with Design Systems**:
   - Centralized theme tokens (`ThemeMode`: `dark`, `light`, `system`), CSS variable palettes, and responsive breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`).

---

## 🛠️ Local Developer & Quality Gate Commands

```bash
# 1. Run ESLint validation across all TypeScript & TSX modules
npm run lint

# 2. Automatically fix formatting and ESLint rule infractions
npm run lint:fix

# 3. Format entire repository with Prettier
npm run format

# 4. Execute automated unit & integration test suite (Vitest)
npm run test

# 5. Compile production frontend bundle (Vite) & backend bundle (esbuild)
npm run build

# 6. Execute full CI/CD quality gate
npm run check
```
