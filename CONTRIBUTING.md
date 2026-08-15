# Contributing to AuraPredict AI

Thank you for your interest in contributing to **AuraPredict AI**! We welcome pull requests, bug reports, feature suggestions, and documentation improvements.

---

## 👥 Maintainers & Contact Information

- **Lead Maintainer:** Aryan Sharma
- **Email Contact:** `aryansharmacse354@gmail.com`
- **Repository:** `aurapredict-ai`
- **Issue Tracker:** GitHub Issues

---

## 🛠️ Development Setup

### 1. Prerequisites
- **Node.js**: v20.x or v22.x LTS
- **npm**: v10.x or higher
- **Gemini API Key** (optional for local fallback mode, required for live LLM inferences)

### 2. Local Installation
```bash
# Clone the repository
git clone https://github.com/aryansharma/aurapredict-ai.git
cd aurapredict-ai

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start dev server
npm run dev
```

The application will be accessible at `http://localhost:3000`.

---

## 🧪 Testing & Quality Gates

Before submitting any Pull Request, ensure that all automated quality checks pass:

```bash
# 1. Type check & static analysis
npm run lint

# 2. Execute automated unit & integration tests
npm run test

# 3. Verify production compilation & bundle packaging
npm run build
```

---

## 🌿 Branching & Pull Request Workflow

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```
2. Commit your changes using semantic commit messages:
   - `feat:` for new capabilities or UI tabs
   - `fix:` for bug fixes
   - `test:` for test additions or fixtures
   - `docs:` for documentation updates
   - `refactor:` for code cleanups without functional change
3. Push to your fork and open a Pull Request against `main`.
4. Ensure the GitHub Actions CI pipeline runs and passes all checks.

---

## 📜 Code of Conduct

We are committed to providing a friendly, safe, and welcoming environment for all contributors, regardless of experience level, gender, identity, or background. Please treat fellow contributors with respect and constructive feedback.
