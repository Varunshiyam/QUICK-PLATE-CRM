# Contributing to QuickPlate CRM

Thank you for your interest in contributing to QuickPlate! 🎉
This guide will help you get started quickly, especially during **GSSoC'26**.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Branch Naming Guidelines](#branch-naming-guidelines)
- [Commit Message Standards](#commit-message-standards)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Code Style Standards](#code-style-standards)
- [Reporting Bugs](#reporting-bugs)
- [GSSoC'26 Contributors](#gssoc26-contributors)

---

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md). Please read it before contributing.

---

## How to Contribute

### Step 1 — Fork the repository

Click the **Fork** button on the top right of the [repo page](https://github.com/Varunshiyam/QUICK-PLATE-CRM).

### Step 2 — Clone your fork

```bash
git clone https://github.com/YOUR_USERNAME/QUICK-PLATE-CRM.git
cd QUICK-PLATE-CRM
```

### Step 3 — Add upstream remote

```bash
git remote add upstream https://github.com/Varunshiyam/QUICK-PLATE-CRM.git
```

### Step 4 — Keep your fork up to date

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

### Step 5 — Create a new branch

```bash
git checkout -b feat/your-feature-name
```

### Step 6 — Make your changes

Make your changes, following the [Code Style Standards](#code-style-standards) below.

### Step 7 — Commit your changes

```bash
git add .
git commit -m "feat: add your feature description"
```

### Step 8 — Push and open a PR

```bash
git push origin feat/your-feature-name
```

Then go to GitHub and click **"Compare & pull request"**.

---

## Branch Naming Guidelines

Use the following prefixes for your branch names:

| Prefix | Use For | Example |
|--------|---------|---------|
| `feat/` | New features | `feat/add-dark-mode` |
| `fix/` | Bug fixes | `fix/cart-total-bug` |
| `docs/` | Documentation | `docs/update-readme` |
| `refactor/` | Code refactoring | `refactor/order-service` |
| `style/` | UI/CSS changes only | `style/navbar-mobile` |
| `chore/` | Build/config tasks | `chore/update-deps` |
| `test/` | Adding/fixing tests | `test/order-api` |

---

## Commit Message Standards

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
type(scope): short description

Examples:
feat(cart): add quantity selector to cart items
fix(auth): resolve Google OAuth redirect loop
docs(readme): update local setup instructions
style(navbar): improve mobile responsiveness
refactor(orders): extract order status helper
```

### Rules
- Use **present tense** ("add feature" not "added feature")
- Keep the first line under **72 characters**
- Reference issues using `Closes #issue_number` in the PR description

---

## Pull Request Guidelines

Before submitting a PR:

- ✅ Your branch is up to date with `main`
- ✅ Code follows the style standards below
- ✅ No console.log statements left in code
- ✅ PR title follows the commit message format
- ✅ PR description mentions `Closes #issue_number`
- ✅ Only files related to the issue are changed

### PR Description Template

```
## What does this PR do?
Brief description of the changes.

## Changes Made
- Added X
- Fixed Y
- Updated Z

## Related Issue
Closes #ISSUE_NUMBER

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Refactor
- [ ] Style/UI improvement
```

---

## Code Style Standards

### JavaScript / React

- Use **functional components** with hooks (no class components)
- Use **ES6+** syntax (arrow functions, destructuring, template literals)
- Keep components **small and focused** — one responsibility per component
- Place reusable components in `src/components/`
- Place page-level components in `src/pages/`
- Use **camelCase** for variables and functions
- Use **PascalCase** for component names and files

```jsx
// ✅ Good
const OrderCard = ({ order, onCancel }) => {
  return (
    <div className="order-card">
      <p>{order.status}</p>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default OrderCard;

// ❌ Avoid
class OrderCard extends React.Component { ... }
```

### CSS / Styling

- Use **TailwindCSS** utility classes where possible
- For custom CSS, use **kebab-case** class names
- Keep styles co-located with their components

### Imports

- Group imports: React → third-party → local
- Use relative paths for local imports

```jsx
// ✅ Correct import order
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderCard from '../components/OrderCard';
import { formatCurrency } from '../utils/helpers';
```

---

## Reporting Bugs

Found a bug? Please open an issue with:

1. **Title**: Clear, descriptive title starting with `[Bug]`
2. **Description**: What happened vs. what you expected
3. **Steps to reproduce**: Numbered list of steps
4. **Screenshots**: If applicable
5. **Environment**: Browser, OS, Node version

---

## GSSoC'26 Contributors

Welcome, GSSoC'26 participants! 🧡

Before picking up an issue:

1. Read the [GSSoC Contribution Guide](./gssoc26/Readme.md)
2. Comment on the issue asking to be assigned — **don't submit PRs for unassigned issues**
3. One issue per contributor at a time
4. Issues labeled `level:beginner` are great starting points

### Point System

| Label | Points |
|-------|--------|
| `level:beginner` | 10 pts |
| `level:intermediate` | 25 pts |
| `level:advanced` | 45 pts |

---

Thank you for contributing to QuickPlate! 🚀
Every contribution, big or small, makes a difference.
