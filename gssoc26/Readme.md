<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:FF6B00,50:FF8C00,100:FFB347&height=200&section=header&text=QuickPlate&fontSize=70&fontColor=ffffff&fontAlignY=38&desc=Quick%20Commerce%20Food%20Delivery%20Platform&descAlignY=58&descSize=20&animation=fadeIn" width="100%" />

<p>
  <img src="https://img.shields.io/badge/GSSoC%2726-Open%20Source-FF6600?style=for-the-badge&logo=github&logoColor=white" alt="GSSoC 2026"/>
  <img src="https://img.shields.io/badge/React-18%2B-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase"/>
  <img src="https://img.shields.io/badge/Salesforce-CRM-00A1E0?style=for-the-badge&logo=salesforce&logoColor=white" alt="Salesforce"/>
  <img src="https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe"/>
</p>

<p>
  <img src="https://img.shields.io/badge/License-MIT-22c55e?style=flat-square" alt="License"/>
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square&logo=github" alt="PRs Welcome"/>
  <img src="https://img.shields.io/badge/Contributions-Open-FF6600?style=flat-square" alt="Contributions"/>
  <img src="https://img.shields.io/badge/Status-Active-success?style=flat-square" alt="Status"/>
  <img src="https://img.shields.io/github/stars/Varunshiyam/QUICK-PLATE-CRM?style=flat-square&color=FF6600" alt="Stars"/>
  <img src="https://img.shields.io/github/forks/Varunshiyam/QUICK-PLATE-CRM?style=flat-square&color=FF8C00" alt="Forks"/>
</p>

---

### 🌟 *Built for Speed. Designed for Developers. Powered by Community.*

<br/>

> ## 🔥 This project is participating in GirlScript Summer of Code 2026 — GSSoC'26!
>
> **Welcome, open-source contributors!** QuickPlate is a production-grade **React + Salesforce CRM** food delivery platform open for contributions. Whether you are fixing bugs, building features, or improving UX — **there is a place for you here.**

</div>

---

## 📋 Table of Contents

<details>
<summary>🗂️ Click to expand</summary>

- [What is QuickPlate?](#-what-is-quickplate)
- [System Architecture](#-system-architecture)
- [Frontend Engineering Deep Dive](#-frontend-engineering-deep-dive)
  - [Folder Structure](#-folder-structure)
  - [All UI Screens](#-all-ui-screens)
  - [State Management](#-state-management)
  - [API Integration Layer](#-api-integration-layer)
- [Authentication Flow](#-authentication-flow)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [GSSoC'26 Contribution Guide](#-gssoc26-contribution-guide)
  - [Issue Labels](#-issue-labels)
  - [How to Contribute](#-how-to-contribute)
  - [Branching Strategy](#-branching-strategy)
  - [PR Checklist](#-pr-checklist)
  - [Code Standards](#-code-standards-for-contributors)
- [Roadmap](#-roadmap)
- [Contributors](#-contributors)
- [License](#-license)

</details>

---

## 🚀 What is QuickPlate?

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│    QuickPlate = Speed + Quality + Developer Love         │
│                                                          │
│   React owns the ENTIRE user experience                  │
│   Salesforce CRM handles ALL business logic              │
│   REST APIs connect everything seamlessly                │
│   Firebase secures every single request                  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**QuickPlate** is a modern **Quick Commerce food delivery platform** that brings restaurant-quality experiences to users in minutes. The architecture follows a strict **separation of concerns**:

| Layer | Responsibility | Technology |
|-------|---------------|------------|
| 🎨 **Presentation** | Full UI/UX experience, all screen flows | React 18+ |
| 🔐 **Identity** | Auth, token management, session | Firebase |
| 🔗 **Integration** | Secure API contracts | Apex REST APIs |
| 🧠 **Business Logic** | Orders, payments, delivery, CRM | Salesforce |
| 💳 **Payments** | Secure checkout, refunds | Stripe |

> **QuickPlate is intentionally React-heavy.** The backend is a headless system — React drives every pixel of the user experience.

---

## 🏗️ System Architecture

```
╔══════════════════════════════════════════════════════════════╗
║                    QuickPlate Architecture                   ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   User                                                       ║
║     │                                                        ║
║     ▼                                                        ║
║  ┌──────────────────────────────────────┐                    ║
║  │       React Frontend (UI Layer)      │  <- You build here ║
║  │  Pages | Components | Hooks | Store  │                    ║
║  └──────────────┬───────────────────────┘                    ║
║                 │                                            ║
║                 ▼                                            ║
║  ┌──────────────────────────────────────┐                    ║
║  │   Firebase Authentication Layer      │                    ║
║  │     Google Sign-In -> idToken        │                    ║
║  └──────────────┬───────────────────────┘                    ║
║                 │                                            ║
║                 ▼                                            ║
║  ┌──────────────────────────────────────┐                    ║
║  │     Apex REST API (Integration)      │                    ║
║  │  /restaurant | /order | /wallet...   │                    ║
║  └──────────────┬───────────────────────┘                    ║
║                 │                                            ║
║                 ▼                                            ║
║  ┌──────────────────────────────────────┐                    ║
║  │    Salesforce CRM (Business Brain)   │                    ║
║  │ Orders | Delivery | Refunds | CRM    │                    ║
║  └──────────────────────────────────────┘                    ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

### Data Flow Pattern

```
User Interaction (React UI)
        │
        ▼
  Service Layer (.js)      ← Abstract all API logic here
        │
        ▼
  Firebase Token Check     ← Attach idToken to every request
        │
        ▼
  Apex REST Endpoint       ← Backend receives + validates
        │
        ▼
  Salesforce Processing    ← Business logic executes
        │
        ▼
  JSON Response            ← Clean, minimal payload
        │
        ▼
  React State Update       ← UI re-renders instantly
```

---

## 🎨 Frontend Engineering Deep Dive

> **This is where you, as a GSSoC contributor, will spend most of your time.**

### 📁 Folder Structure

```
QUICK-PLATE-CRM/
│
├── public/                    # Static assets
├── src/                       # All React source code lives here
│   │
│   ├── assets/                # Images, icons, fonts
│   │
│   ├── components/ui/         # Reusable, atomic UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Skeleton.jsx
│   │   └── ...
│   │
│   ├── pages/                 # Screen-level views (route components)
│   │   ├── Cart/              # Shopping cart management
│   │   ├── Checkout/          # Order checkout flow
│   │   ├── CustomerWallet/    # Wallet balance & top-up
│   │   ├── Discover/          # Restaurant discovery
│   │   ├── Features/          # Platform feature highlights
│   │   ├── Home/              # Main dashboard
│   │   ├── Landing/           # Public landing page
│   │   ├── Onboarding/        # New user onboarding
│   │   ├── OnboardingDetails/ # Profile completion
│   │   ├── OrderIssue/        # Order problem reporting
│   │   ├── Orders/            # Order history & management
│   │   ├── PaymentIssue/      # Payment problem reporting
│   │   ├── PaymentSuccess/    # Post-payment confirmation
│   │   ├── Profile/           # User profile management
│   │   ├── RaiseRefund/       # Refund request flow
│   │   ├── Restaurant/        # Restaurant listing & detail
│   │   ├── Support/           # Customer support tickets
│   │   ├── Tracking/          # Real-time order tracking
│   │   └── WalletPayment/     # Wallet-based checkout
│   │
│   ├── services/              # API abstraction layer
│   │   ├── authService.js
│   │   ├── orderService.js
│   │   ├── restaurantService.js
│   │   └── walletService.js
│   │
│   ├── store/                 # Global state management
│   ├── hooks/                 # Custom React hooks
│   ├── data/                  # Static/mock data files
│   ├── styles/                # Global styles & themes
│   ├── utils/                 # Helper functions & constants
│   │
│   ├── App.jsx                # Root component + routing
│   └── main.jsx               # React DOM entry point
│
├── .env.example               # Environment variable template
├── .firebaserc                # Firebase project config
├── firebase.json              # Firebase hosting config
├── vite.config.js             # Vite build configuration
├── eslint.config.js           # Linting rules
└── package.json               # Dependencies & scripts
```

---

### 📱 All UI Screens

<details>
<summary>🔐 Authentication Screen</summary>

**Path:** `src/pages/Landing/`

- Google Sign-In via Firebase
- Retrieves `idToken` for all subsequent API calls
- Stores session in global state

</details>

<details>
<summary>🧑‍💼 Onboarding Flow</summary>

**Path:** `src/pages/Onboarding/` and `src/pages/OnboardingDetails/`

- Triggered when user profile is incomplete
- Collects: Full Name, Phone Number, Delivery Address
- Progressive input validation, mobile-first layout

</details>

<details>
<summary>🍽️ Restaurant Discovery</summary>

**Path:** `src/pages/Discover/` and `src/pages/Restaurant/`

- Fetches real restaurant data via `restaurantService.js`
- Displays: Name, City, Average Prep Time
- Card-based responsive grid with loading skeletons

</details>

<details>
<summary>🛒 Cart and Checkout</summary>

**Path:** `src/pages/Cart/` and `src/pages/Checkout/`

- Dynamic cart management with real-time price updates
- Wallet credits application at checkout
- Dual payment: Stripe or Wallet balance

</details>

<details>
<summary>💳 Payment Flow</summary>

**Path:** `src/pages/PaymentSuccess/`, `src/pages/PaymentIssue/`, `src/pages/WalletPayment/`

- Stripe Checkout redirect for card payments
- Wallet deduction with Source of Truth from Salesforce backend
- Clear success/failure state rendering

</details>

<details>
<summary>📦 Order Tracking</summary>

**Path:** `src/pages/Tracking/` and `src/pages/Orders/`

- Real-time polling for order status updates
- Displays: Order Status, Payment Status, Assigned Delivery Agent
- Status-driven UI with visual progress indicators

</details>

<details>
<summary>💼 Customer Wallet</summary>

**Path:** `src/pages/CustomerWallet/`

- Wallet balance fetched directly from Salesforce (Source of Truth)
- Add funds via `WalletPayment` page
- Applied at checkout for order discounts

</details>

<details>
<summary>🎫 Support and Refunds</summary>

**Path:** `src/pages/Support/`, `src/pages/OrderIssue/`, `src/pages/RaiseRefund/`

- Raise support tickets with issue categorisation
- Salesforce status labels displayed in UI
- Track ticket resolution in real time

</details>

<details>
<summary>👤 Profile Management</summary>

**Path:** `src/pages/Profile/`

- View and edit user information
- Wallet balance widget integration
- Synced with Salesforce CRM backend

</details>

---

### 🔄 State Management

```
Global State (store/)
    ├── authSlice       —  User session, Firebase idToken
    ├── orderSlice      —  Current order, order history
    ├── restaurantSlice —  Restaurant list, selected restaurant
    └── walletSlice     —  Wallet balance, transaction history

Local State (React Hooks)
    ├── Form inputs and validation
    ├── Loading / error / success states
    └── UI toggle states (modals, dropdowns)
```

---

### 🔗 API Integration Layer

All backend communication is **strictly abstracted** through service modules. **Never call APIs directly from components.**

```javascript
// ✅ CORRECT — Use the service layer
import { fetchRestaurants } from '../services/restaurantService';

const restaurants = await fetchRestaurants(idToken);

// ❌ WRONG — Never call fetch directly in a component
const res = await fetch('/restaurant/list?idToken=...');
```

Every API call **must** include the Firebase `idToken`:

```javascript
// services/restaurantService.js
export const fetchRestaurants = async (idToken) => {
  const response = await fetch(`/api/restaurant/list?idToken=${idToken}`);
  if (!response.ok) throw new Error('Failed to fetch restaurants');
  return response.json();
};
```

| Service File | Endpoints Managed |
|---|---|
| `authService.js` | Login, logout, token refresh |
| `restaurantService.js` | List restaurants, get details |
| `orderService.js` | Create order, fetch status, history |
| `walletService.js` | Get balance, add funds, deduct |

---

## 🔐 Authentication Flow

```
1. User clicks "Sign in with Google"
          │
          ▼
2. Firebase Google OAuth → returns idToken
          │
          ▼
3. React stores idToken in global state (store/)
          │
          ▼
4. Every API request attaches idToken to headers/params
          │
          ▼
5. Salesforce backend validates token via Firebase Admin SDK
          │
          ▼
6. User-specific data returned → UI renders
```

> 🔒 **Security Note:** No sensitive data is ever stored client-side. All authorization decisions happen on the Salesforce backend.

---

## ⚙️ Tech Stack

<div align="center">

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend Framework** | React 18+ | UI rendering, component architecture |
| **Build Tool** | Vite | Fast dev server, optimised builds |
| **Authentication** | Firebase | Google OAuth, token management |
| **Backend / CRM** | Salesforce | Business logic, data storage |
| **Payments** | Stripe | Secure card payments |
| **Deployment** | Firebase Hosting | Frontend hosting & CDN |
| **State** | React Store + Hooks | Global + local state |
| **Linting** | ESLint | Code quality enforcement |

</div>

---

## 🚦 Getting Started

### Prerequisites

```bash
node >= 18.0.0
npm  >= 9.0.0
```

### 1. Fork and Clone

```bash
# Fork the repo on GitHub first, then:
git clone https://github.com/<your-username>/QUICK-PLATE-CRM.git
cd QUICK-PLATE-CRM
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_API_BASE_URL=your_salesforce_apex_api_base_url
VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
```

### 4. Run the Dev Server

```bash
npm run dev
```

> App will be running at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

---

## 🧩 GSSoC'26 Contribution Guide

<div align="center">

**Welcome to QuickPlate's GSSoC'26 program!** 🧡

QuickPlate is built with contributors in mind — clean architecture, well-defined screens, and modular code make it easy to jump in and make a real impact.

</div>

---

### 🏷️ Issue Labels

| Label | Points | Description |
|-------|--------|-------------|
| `gssoc26` | — | All GSSoC'26 eligible issues |
| `level1` | ⭐ 10 pts | Documentation, typo fixes, styling tweaks |
| `level2` | ⭐⭐ 25 pts | Bug fixes, UI improvements, small features |
| `level3` | ⭐⭐⭐ 45 pts | New features, major refactors, API integrations |
| `good first issue` | 🟢 | Perfect for first-time contributors |
| `help wanted` | 🟡 | Community help needed |
| `bug` | 🔴 | Something is broken |
| `enhancement` | 🔵 | Feature improvement |
| `frontend` | 🎨 | React UI work |
| `documentation` | 📚 | Docs updates |

---

### 📋 How to Contribute

```
Step  1:  Star this repository
Step  2:  Fork the repository
Step  3:  Browse open issues with the 'gssoc26' label
Step  4:  Comment on an issue: "I'd like to work on this"
Step  5:  Wait for assignment from a maintainer
Step  6:  Create your branch (see branching strategy below)
Step  7:  Make your changes following the code standards
Step  8:  Test thoroughly before submitting
Step  9:  Submit a Pull Request with a clear description
Step 10:  Get reviewed, merged, and earn your points!
```

---

### 🌿 Branching Strategy

```bash
# Always branch from 'main'
git checkout main
git pull origin main

# Feature branch
git checkout -b feature/your-feature-name

# Bug fix branch
git checkout -b fix/issue-description

# Docs branch
git checkout -b docs/what-you-updated

# After making changes:
git add .
git commit -m "feat: add restaurant search filter UI"
git push origin feature/your-feature-name

# Then open a Pull Request on GitHub targeting base: main
```

#### Commit Message Convention

| Prefix | Use For |
|--------|---------|
| `feat:` | New feature addition |
| `fix:` | Bug fix |
| `style:` | CSS / UI-only changes (no logic change) |
| `refactor:` | Code restructure (no feature or fix change) |
| `docs:` | Documentation updates |
| `chore:` | Build or config changes |
| `test:` | Adding or updating tests |

---

### ✅ PR Checklist

Before submitting your Pull Request, confirm every item below:

- [ ] Tested changes locally with `npm run dev`
- [ ] Code follows the project folder structure
- [ ] All API calls go through the service layer — not directly in components
- [ ] `.env` file and API keys are NOT committed
- [ ] Commit messages follow the convention above
- [ ] Issue number is linked in the PR description (`Closes #<issue_number>`)
- [ ] No new console errors or warnings introduced
- [ ] UI changes are mobile-responsive

---

### 🧑‍💻 Code Standards for Contributors

```javascript
// 1. Always use the service layer for API calls — never fetch() directly in a component
import { createOrder } from '../services/orderService';

// 2. Handle all three async states in every component
const [loading, setLoading] = useState(false);
const [error,   setError]   = useState(null);
const [data,    setData]    = useState(null);

// 3. Use descriptive variable names
const restaurantList = [];  // ✅ correct
const data = [];            // ❌ avoid — too generic

// 4. Extract reusable logic into custom hooks
// src/hooks/useRestaurants.js
export const useRestaurants = (idToken) => { /* ... */ };

// 5. Keep components focused — one responsibility per file.
// If a component exceeds ~200 lines, consider splitting it.
```

---

## 📈 Roadmap

| Status | Feature | Priority |
|--------|---------|----------|
| ✅ Done | Firebase Authentication | Core |
| ✅ Done | Restaurant Listing | Core |
| ✅ Done | Order Creation & Checkout | Core |
| ✅ Done | Stripe Payment Integration | Core |
| ✅ Done | Order Tracking | Core |
| ✅ Done | Wallet System | Core |
| ✅ Done | Support & Refund Flow | Core |
| 🔄 In Progress | Dynamic Tracking Page | Enhancement |
| 🟡 Planned | Real-time WebSocket Tracking | Enhancement |
| 🟡 Planned | Push Notification System | Enhancement |
| 🟡 Planned | AI-based Delivery ETA | Advanced |
| 🟡 Planned | Advanced Analytics Dashboard | Advanced |
| 🟡 Planned | Dark Mode UI | UI/UX |
| 🟡 Planned | Accessibility (a11y) Audit | Quality |
| 🟡 Planned | Unit Test Coverage | Quality |
| 💡 Open for GSSoC | Enhanced Restaurant Search & Filter | Level 2 |
| 💡 Open for GSSoC | UI Skeleton Loading States | Level 2 |
| 💡 Open for GSSoC | Improved Error Boundaries | Level 2 |
| 💡 Open for GSSoC | Component Storybook | Level 3 |

---

## 🤝 Contributors

<div align="center">

Thanks to all the amazing people who have contributed to QuickPlate! 🧡

[![Contributors](https://contrib.rocks/image?repo=Varunshiyam/QUICK-PLATE-CRM)](https://github.com/Varunshiyam/QUICK-PLATE-CRM/graphs/contributors)

### Maintainer

| | |
|:---:|:---:|
| <a href="https://github.com/Varunshiyam"><img src="https://github.com/Varunshiyam.png" width="80px" alt="Varunshiyam"/><br/><b>Varunshiyam</b><br/><sub>Project Maintainer</sub></a> | |

</div>

---

## 💬 Community and Support

<div align="center">

| Resource | Link |
|----------|------|
| 🐛 Report a Bug | [Open an Issue](https://github.com/Varunshiyam/QUICK-PLATE-CRM/issues/new) |
| 💡 Request a Feature | [Start a Discussion](https://github.com/Varunshiyam/QUICK-PLATE-CRM/discussions) |
| 📖 GSSoC'26 Official | [gssoc.girlscript.tech](https://gssoc.girlscript.tech) |

</div>

---

## 📜 License

```
MIT License — Copyright (c) 2025 Varunshiyam
```

See [LICENSE](./LICENSE) for full details.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:FF6B00,50:FF8C00,100:FFB347&height=120&section=footer&animation=fadeIn" width="100%" />

**Made with 🧡 for the GSSoC'26 Open Source Community**

*If this project helped you, please give it a star!*

[![Star](https://img.shields.io/github/stars/Varunshiyam/QUICK-PLATE-CRM?style=social)](https://github.com/Varunshiyam/QUICK-PLATE-CRM)

</div>
