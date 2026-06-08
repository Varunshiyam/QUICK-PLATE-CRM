# Contributing to QuickPlate

We're thrilled that you want to contribute to QuickPlate! This project is part of **GirlScript Summer of Code 2026 (GSSoC'26)** and we welcome contributions from everyone, whether you're a first-time open-source contributor or an experienced developer.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Branching Strategy](#branching-strategy)
- [Commit Message Convention](#commit-message-convention)
- [Code Standards](#code-standards)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Community](#community)

## Code of Conduct
By participating in this project, you agree to maintain a respectful and inclusive environment for everyone. Harassment, discrimination, or any form of disrespectful behavior will not be tolerated.

## Getting Started

1. **Star** the repository
2. **Fork** the repository to your GitHub account
3. **Clone** your fork:
   ```bash
   git clone https://github.com/<your-username>/QUICK-PLATE-CRM.git
   cd QUICK-PLATE-CRM
   ```
4. **Add the upstream** remote:
   ```bash
   git remote add upstream https://github.com/Varunshiyam/QUICK-PLATE-CRM.git
   ```

## How to Contribute

### For GSSoC'26 Participants
1. Browse open issues with the `gssoc26` label
2. Comment on the issue: "I'd like to work on this"
3. Wait for assignment from a maintainer
4. Follow the branching strategy below
5. Make your changes following the code standards
6. Submit a Pull Request

### For External Contributors
1. Check open issues or create a new one
2. Discuss your approach with maintainers
3. Fork and work on your changes
4. Submit a Pull Request with a clear description

## Development Setup

### Prerequisites
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### Install Dependencies
```bash
npm install
```

### Configure Environment
```bash
cp .env.example .env
```

Fill in your values in `.env`:
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_API_BASE_URL=your_salesforce_apex_api_base_url
VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
```

### Run Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

### Build for Production
```bash
npm run build
```

## Branching Strategy

Always branch from `main`:

```bash
git checkout main
git pull upstream main

# Feature branch
git checkout -b feature/your-feature-name

# Bug fix branch
git checkout -b fix/issue-description

# Documentation branch
git checkout -b docs/what-you-updated
```

## Commit Message Convention

| Prefix     | Use For                   |
|------------|---------------------------|
| `feat:`    | New feature addition      |
| `fix:`     | Bug fix                   |
| `style:`   | CSS / UI-only changes     |
| `refactor:`| Code restructure          |
| `docs:`    | Documentation updates     |
| `chore:`   | Build or config changes   |
| `test:`    | Adding or updating tests  |

Example:
```
feat: add restaurant search filter UI
fix: resolve price range filter not applying
```

## Code Standards

### General
- Use descriptive variable names
- Extract reusable logic into custom hooks (`src/hooks/`)
- Keep components focused ΓÇö one responsibility per file
- Handle all three async states: loading, error, success

### API Calls
- Always use the service layer ΓÇö never call `fetch()` directly in a component
- Service files are located in `src/services/`
- Every API call must include the Firebase `idToken`

### File Structure
- Screens go in `src/pages/<PageName>/`
- Reusable UI components go in `src/components/ui/`
- Custom hooks go in `src/hooks/`
- Store/slices go in `src/store/`

### Styling
- Use CSS files co-located with components (e.g., `Home.jsx` ΓåÆ `Home.css`)
- Follow existing design tokens and color variables
- Ensure all UI changes are mobile-responsive

## Pull Request Process

1. **Test your changes** locally with `npm run dev`
2. **Update relevant documentation** if needed
3. **Ensure your code follows** the project structure and coding standards
4. **Fill out the PR template** completely
5. **Link the issue** in your PR description using `Closes #<issue_number>`
6. **Request a review** from a maintainer
7. **Address review feedback** promptly

### PR Checklist
- [ ] Tested changes locally with `npm run dev`
- [ ] Code follows the project folder structure
- [ ] All API calls go through the service layer
- [ ] `.env` file and API keys are NOT committed
- [ ] Commit messages follow the convention
- [ ] Issue number is linked in PR description
- [ ] No new console errors or warnings introduced
- [ ] UI changes are mobile-responsive

## Issue Reporting

### Reporting Bugs
Before reporting a bug, please check if it has already been reported. Use the **Bug Report** template when creating a new issue. Include:
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (device, OS, browser, version)

### Feature Requests
Use the **Feature Request** template. Include:
- The problem you're trying to solve
- Your proposed solution
- Any alternative solutions you've considered

## Community

- **Project Maintainer**: [Varunshiyam](https://github.com/Varunshiyam)
- **Report a Bug**: [Open an Issue](https://github.com/Varunshiyam/QUICK-PLATE-CRM/issues/new)
- **Request a Feature**: [Start a Discussion](https://github.com/Varunshiyam/QUICK-PLATE-CRM/discussions)
- **GSSoC'26 Official**: [gssoc.girlscript.tech](https://gssoc.girlscript.tech)

---

Thank you for contributing to QuickPlate! Your efforts help make this project better for everyone.
