<div align="center">

# 🍽️ Quick Plate Platform

**A Unified Food Delivery Ecosystem — From Order to Doorstep**

[![Salesforce](https://img.shields.io/badge/Backend-Salesforce%20Apex-00A1E0?style=for-the-badge&logo=salesforce&logoColor=white)](https://www.salesforce.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Auth-Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Stripe](https://img.shields.io/badge/Payments-Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![License](https://img.shields.io/badge/License-Private-red?style=for-the-badge)](#)

<br/>

> _Quick Plate bridges a premium React customer experience with Salesforce's enterprise backend — delivering real-time order management, automated logistics, and financial oversight through a single unified codebase._

<br/>

[🚀 Getting Started](#-getting-started) · [📐 Architecture](#-architecture) · [🗄️ Data Model](#%EF%B8%8F-data-model) · [🔌 API Reference](#-api-reference) · [⚙️ Automation](#%EF%B8%8F-automation-engines) · [🖥️ Admin Dashboards](#%EF%B8%8F-admin-dashboards-salesforce-lwc) · [🛡️ Security](#%EF%B8%8F-security)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Authentication Flow](#-authentication-flow)
- [Data Model](#%EF%B8%8F-data-model)
- [API Reference](#-api-reference)
- [Automation Engines](#%EF%B8%8F-automation-engines)
- [Payment Flow (Stripe)](#-payment-flow-stripe)
- [Frontend Pages](#-frontend-pages)
- [Admin Dashboards (Salesforce LWC)](#%EF%B8%8F-admin-dashboards-salesforce-lwc)
- [Security](#%EF%B8%8F-security)
- [Environment Setup](#-environment-setup)
- [Roadmap](#-roadmap)

---

## 🔭 Overview

Quick Plate is a **dual-interface** food delivery management platform:

| Interface | Users | Tech | Purpose |
|:---------:|:-----:|:----:|:-------:|
| 🛒 **Customer App** | End Users | React + Vite | Browse → Order → Pay → Track |
| 🏢 **Admin Console** | Ops / Finance / Restaurant Teams | Salesforce LWC | Manage → Monitor → Approve → Analyze |

Both share the **same Salesforce data layer**, connected through authenticated REST APIs and Firebase token verification.

### ✨ Key Capabilities

```
📱 Restaurant Discovery & Ordering     💳 Stripe Checkout Integration
🔐 Firebase ↔ Salesforce Auth Bridge   🚚 Automated Delivery Assignment
💰 Wallet & Credits System             📊 Finance & Operations Dashboards
🎫 Support Ticket & Refund Workflows   ✅ Restaurant Approval Pipelines
```

---

## 📐 Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                        CUSTOMER LAYER                         │
│          React 18 · Vite · Zustand · Framer Motion            │
│   Landing → Home → Restaurant → Cart → Checkout → Tracking    │
└──────────────────────────┬────────────────────────────────────┘
                           │ Firebase idToken
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                    AUTH BRIDGE                               │
│     Firebase Auth  ──→  Google Identity API  ──→  Apex       │
│     (idToken)           (verify)               (Customer__c) │
└──────────────────────────┬───────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  REST APIs   │  │  Automation  │  │  LWC Admin   │
│  (14 endpts) │  │  Engines (3) │  │  Panels (11) │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └─────────────────┼─────────────────┘
                         ▼
          ┌──────────────────────────┐
          │    SALESFORCE DATA       │
          │    8 Custom Objects      │
          │    100+ Custom Fields    │
          └──────────────────────────┘
```

---

## 🛠 Tech Stack

<table>
<tr>
<td width="50%">

### Frontend
| | Technology |
|:--|:--|
| ⚛️ | React 18 |
| ⚡ | Vite (Build) |
| 🐻 | Zustand (State) |
| 🎞️ | Framer Motion (Animations) |
| 🔗 | Axios (HTTP) |
| 🎨 | Vanilla CSS + CSS Variables |
| 📦 | Google Material Symbols |

</td>
<td width="50%">

### Backend
| | Technology |
|:--|:--|
| ☁️ | Salesforce Platform |
| 🔧 | Apex (REST Resources) |
| ⚡ | Lightning Web Components |
| 🔐 | Firebase Authentication |
| 💳 | Stripe API |
| 🗃️ | Custom Objects & Fields |
| 🔄 | Approval Processes |

</td>
</tr>
</table>

---

## 🚀 Getting Started

### Prerequisites

- Node.js `18+` & npm
- Salesforce CLI (`sf` / `sfdx`)
- Firebase project configured
- Stripe account (test keys)

### 1️⃣ Clone & Install

```bash
git clone https://github.com/Varunshiyam/QUICK-PLATE-CRM.git
cd QUICK-PLATE-CRM
git checkout beta/unified-platform
```

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env   # Configure your keys
npm run dev             # → http://localhost:5173
```

### 3️⃣ Salesforce Deployment

```bash
# Authenticate to your org
sf org login web --set-default

# Deploy metadata
sf project deploy start --source-dir force-app
```

---

## 📁 Project Structure

```
CONSOLE_LWC/
│
├── frontend/                          # React Customer App
│   └── src/
│       ├── pages/                     # 18 page components
│       │   ├── Home/                  # Restaurant discovery
│       │   ├── Restaurant/            # Menu & item selection
│       │   ├── Cart/                  # Cart + wallet + billing
│       │   ├── Checkout/              # Stripe payment flow
│       │   ├── Tracking/              # Live order tracking
│       │   ├── Orders/                # Order history
│       │   ├── Profile/               # User profile
│       │   ├── CustomerWallet/        # Wallet management
│       │   ├── Support/               # Ticket listing
│       │   ├── RaiseRefund/           # Refund requests
│       │   └── ...                    # Landing, Onboarding, etc.
│       ├── services/
│       │   ├── firebase.js            # Auth SDK + token exchange
│       │   ├── api.js                 # Axios client + interceptors
│       │   └── restaurantService.js   # Restaurant API calls
│       ├── store/
│       │   └── useAppStore.js         # Zustand (auth + cart)
│       └── hooks/
│           └── useHaptic.js           # Mobile haptic feedback
│
├── force-app/main/default/
│   ├── classes/                       # 50 Apex classes
│   │   ├── FirebaseAuthController     # 🔐 Auth bridge
│   │   ├── OrderController            # 📦 Order creation
│   │   ├── StripeCheckoutController   # 💳 Payment sessions
│   │   ├── StripeWebhookController    # 🔔 Webhook handler
│   │   ├── CustomerWalletController   # 💰 Balance queries
│   │   ├── DeliveryAssignmentEngine   # 🚚 Auto-assign agents
│   │   ├── DeliveryCompletionEngine   # ✅ Post-delivery cleanup
│   │   ├── RefundRequestEngine        # 🔄 Refund automation
│   │   ├── FinanceDashboardController # 📊 Revenue analytics
│   │   ├── RestaurantManagerController# 🏪 Restaurant KPIs
│   │   └── ...
│   ├── lwc/                           # 11 Lightning components
│   │   ├── financeDashboard/          # 💰 Finance analytics
│   │   ├── operationsCommandCenter/   # 🎯 Ops dashboard
│   │   ├── order_lifecycle/           # 📋 Order management
│   │   ├── refundApprovalConsole/     # ✅ Refund approvals
│   │   ├── restaurantApprovalConsole/ # 🏪 Restaurant approvals
│   │   └── ...
│   └── objects/                       # 8 custom objects
│       ├── Customer__c/
│       ├── Order__c/
│       ├── Restaurant__c/
│       ├── Payment_Transaction__c/
│       ├── Support_Ticket__c/
│       ├── Delivery_Agent__c/
│       ├── Customer_Credit__c/
│       └── Restaurant_Owners__c/
```

---

## 🔐 Authentication Flow

The platform uses a **Firebase → Salesforce bridge** pattern where Firebase handles identity and Salesforce handles authorization.

```
┌──────────┐     ┌──────────────┐     ┌──────────────────┐     ┌───────────────┐
│  User    │────▶│  Firebase    │────▶│  Google Identity │────▶│  Salesforce   │
│  Login   │     │  (idToken)   │     │  API (verify)    │     │  Customer__c  │
└──────────┘     └──────────────┘     └──────────────────┘     └───────────────┘
                                                                       │
                                                                       ▼
                                                               Found? → Return session
                                                               Not found? → Auto-create
```

**Key:** Every customer-facing API endpoint verifies the Firebase `idToken` server-side before processing any request. No raw Salesforce IDs are exposed to the client.

---

## 🗄️ Data Model

### Object Relationships

```
Customer__c ──┬── Order__c ──┬── Payment_Transaction__c
              │              ├── Support_Ticket__c
              │              └── Delivery_Agent__c (lookup)
              └── Customer_Credit__c

Restaurant__c ──── Restaurant_Owners__c
              └── Order__c (lookup)
```

### Core Objects

<details>
<summary><b>📋 Order__c</b> — 28+ fields, central to all operations</summary>

| Field | Purpose |
|:------|:--------|
| `Order_Status__c` | `PAYMENT_PENDING` → `CONFIRMED` → `ASSIGNED` → `OUT_FOR_DELIVERY` → `DELIVERED` |
| `Payment_Status__c` | `PENDING` / `PAID` / `REFUNDED` |
| `Order_Total__c` | Order amount |
| `Credits_Used__c` | Wallet credits applied |
| `Customer__c` | Lookup → Customer |
| `Restaurant__c` | Lookup → Restaurant |
| `Delivery_Agent__c` | Lookup → Agent |
| `SLA_Status__c` | SLA monitoring |
| `Refund_Requested__c` | Refund flag |
| `Support_Ticket__c` | Linked support case |
| `Ops_Priority__c` | Operations priority |

</details>

<details>
<summary><b>👤 Customer__c</b> — Identity mapping</summary>

| Field | Purpose |
|:------|:--------|
| `Firebase_UID__c` | Links Firebase ↔ Salesforce identity |
| `Full_Name__c` | Display name |
| `Phone__c` | Contact |
| `Address__c` | Delivery address |
| `Email__c` | From Firebase profile |

</details>

<details>
<summary><b>🏪 Restaurant__c</b> — Restaurant registry</summary>

| Field | Purpose |
|:------|:--------|
| `City__c` | Used for delivery agent matching |
| `Is_Active__c` | Active status |
| `Onboarding_Status__c` | Approval workflow state |
| `Avg_Prep_Time_Min__c` | Performance metric |
| `Prep_Time_Risk_Level__c` | Risk classification |
| `Restaurant_Owner__c` | Lookup → Owner |

</details>

<details>
<summary><b>💳 Payment_Transaction__c</b> — Stripe records</summary>

| Field | Purpose |
|:------|:--------|
| `Amount__c` | Transaction amount |
| `Transaction_Type__c` | `PAYMENT` / `REFUND` |
| `Status__c` | `SUCCESS` / `FAILED` / `PENDING` |
| `Stripe_Session_Id__c` | Checkout session reference |
| `Stripe_Payment_Intent_Id__c` | Payment intent reference |

</details>

<details>
<summary><b>🎫 Support_Ticket__c</b> — Issue & refund tracking</summary>

| Field | Purpose |
|:------|:--------|
| `Issue_Type__c` | Issue classification |
| `Ticket_Status__c` | `NEW` → `IN_PROGRESS` → `RESOLVED` → `CLOSED` |
| `Priority__c` | `HIGH` / `MEDIUM` / `LOW` |
| `Finance_Approval_Status__c` | Refund approval state |
| `Recommended_Refund_Amount__c` | Finance recommendation |

</details>

<details>
<summary><b>🚚 Delivery_Agent__c</b> — Driver fleet management</summary>

| Field | Purpose |
|:------|:--------|
| `Current_City__c` | Active city |
| `Service_Status__c` | `ONLINE` / `ON_BREAK` / `OFFLINE` |
| `Active_Orders_Count__c` | Current load |
| `Max_Active_Orders__c` | Capacity limit |

</details>

---

## 🔌 API Reference

All endpoints are under `/services/apexrest/`

### Authentication
| Method | Endpoint | Description |
|:------:|:---------|:------------|
| `POST` | `/auth/firebase` | Verify token → return/create customer session |

### Orders
| Method | Endpoint | Description |
|:------:|:---------|:------------|
| `POST` | `/order/create` | Create new order |
| `GET` | `/order/status/{id}` | Poll order status |
| `GET` | `/customer/orders` | List customer's orders |

### Payments
| Method | Endpoint | Description |
|:------:|:---------|:------------|
| `POST` | `/checkout/create-session` | Generate Stripe checkout session |
| `POST` | `/stripe/webhook` | Handle Stripe async events |

### Wallet
| Method | Endpoint | Description |
|:------:|:---------|:------------|
| `GET` | `/wallet/balance` | Fetch wallet balance |
| `POST` | `/wallet/add-funds` | Add credits to wallet |

### Profile & Support
| Method | Endpoint | Description |
|:------:|:---------|:------------|
| `PATCH` | `/customer/profile` | Update profile details |
| `POST` | `/case/create` | Raise support ticket |
| `GET` | `/case/list` | List support tickets |
| `GET` | `/restaurants` | Browse active restaurants |

---

## ⚙️ Automation Engines

Three **Invocable Apex Methods** power the platform's logistics and support automation:

### 🚚 Delivery Assignment Engine
> Auto-assigns the best available agent when an order is confirmed

```
Order CONFIRMED → Query agents (same city, ONLINE, has capacity)
    → Sort by current load (ASC) → Assign least-loaded agent
    → Update Order status → ASSIGNED
    → If agent hits max load → Set status ON_BREAK
```

### ✅ Delivery Completion Engine
> Handles post-delivery cleanup and agent availability

```
Order OUT_FOR_DELIVERY → Mark as DELIVERED
    → Decrement agent's active load
    → If below max → Restore agent to ONLINE
    → Stamp Order_Closed_At__c (idempotency)
```

### 🔄 Refund Request Engine
> Automates support ticket creation for refund workflows

```
Order flagged → Check for duplicate tickets (skip if exists)
    → Validate order status = DELIVERED
    → Create Support_Ticket__c (Priority: HIGH)
    → Route to Customer Service Queue
    → Update order → REFUND_REQUESTED
```

---

## 💳 Payment Flow (Stripe)

```
Cart Page                    Salesforce                      Stripe
────────                    ──────────                     ────────
POST /order/create    ──→   Create Order__c (PENDING)
                            Return orderId
                                │
Navigate to Checkout            │
POST /checkout/session  ──→   Create Payment_Transaction__c
                              Call Stripe API
                              Return checkoutUrl
                                │
Redirect to Stripe    ─────────────────────────────→    Hosted Checkout
                                                          │
                              POST /stripe/webhook  ←─────┘
                              Match by Session ID
                              Transaction → SUCCESS
                              Order → CONFIRMED + PAID
```

---

## 📱 Frontend Pages

| Page | Route | Description |
|:-----|:------|:------------|
| 🏠 Home | `/home` | Restaurant discovery, categories, trending, promo banners |
| 🍕 Restaurant | `/restaurant` | Full menu with category tabs and item cards |
| 🛒 Cart | `/cart` | Cart items, addon suggestions, wallet toggle, billing |
| 💳 Checkout | `/checkout` | Payment method selection, Stripe redirect |
| 📍 Tracking | `/tracking/:id` | Real-time order status polling |
| 📋 Orders | `/orders` | Complete order history |
| 👤 Profile | `/profile` | Edit name, phone, address |
| 💰 Wallet | `/wallet` | Balance, transaction history |
| 🆘 Support | `/support` | View raised tickets |
| 🔙 Raise Refund | `/raise-refund` | Submit refund request |

<details>
<summary><b>View all 18 pages</b></summary>

| Page | Route |
|:-----|:------|
| Landing | `/` |
| Onboarding | `/onboarding` |
| Onboarding Details | `/onboarding-details` |
| Home | `/home` |
| Discover | `/discover` |
| Restaurant | `/restaurant` |
| Cart | `/cart` |
| Checkout | `/checkout` |
| Payment Success | `/payment-success` |
| Payment Issue | `/payment-issue` |
| Tracking | `/tracking/:id` |
| Orders | `/orders` |
| Order Issue | `/order-issue` |
| Profile | `/profile` |
| Customer Wallet | `/wallet` |
| Wallet Payment | `/wallet-payment` |
| Support | `/support` |
| Raise Refund | `/raise-refund` |
| Features | `/features` |

</details>

---

## 🖥️ Admin Dashboards (Salesforce LWC)

Internal teams manage operations through purpose-built Lightning components:

| Component | Team | Capabilities |
|:----------|:----:|:-------------|
| 📊 **Finance Dashboard** | Finance | Revenue/refund KPIs, failure rates, leakage sources, transaction trends |
| 🎯 **Operations Command Center** | Ops | Ticket analytics, automated alerts, operational KPIs |
| 📋 **Order Lifecycle** | Ops | Active order management with edit-access enforcement |
| 🏪 **Restaurant Manager** | Ops | Top performers, problematic restaurants, recent approvals |
| ✅ **Restaurant Approval Console** | Ops | Pending/past restaurant approval processing |
| 💰 **Refund Approval Console** | Finance | Review tickets, adjust amounts, approve/reject refunds |
| 📝 **Onboarding Tracker** | Ops | Track restaurant submissions with approval timelines |

### Permission Model

| Permission Set | Components |
|:---------------|:-----------|
| `Finance_LWC_Components` | Finance Dashboard, Refund Approval Console |
| `Operation_LWC_Components` | Order Lifecycle |

---

## 🛡️ Security

### ✅ Implemented

| Feature | Details |
|:--------|:--------|
| 🔐 Server-side token verification | All customer APIs verify Firebase tokens via Google Identity API |
| 🔒 Customer data isolation | Orders scoped to authenticated customer only |
| 🛡️ Duplicate refund prevention | Blocked at both ticket and order field level |
| ✅ Record-level access checks | `UserRecordAccess` verified in order management |
| 🔑 Custom permission gates | Finance & Ops LWC controllers validate permissions |
| 🔄 Wallet row locking | `FOR UPDATE` prevents race conditions on balance |
| 🆔 Webhook idempotency | Stripe events checked against existing transaction state |

### ⚠️ Requires Attention Before Production

| Issue | Priority | Action Required |
|:------|:--------:|:----------------|
| Hardcoded Firebase API Key | 🔴 Critical | Move to Named Credential / Custom Metadata |
| Hardcoded Stripe Secret Key | 🔴 Critical | Move to Named Credential |
| No Stripe webhook signature check | 🔴 Critical | Implement `Stripe-Signature` header verification |
| `OrderStatusController` — no auth | 🟡 High | Add Firebase token verification |
| `SupportTicketStatusController` — uses raw ID | 🟡 High | Switch to token-based auth |

---

## 🔧 Environment Setup

### Frontend `.env`

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_BASE_URL=https://your-salesforce-domain.my.salesforce.com
```

### Salesforce Org Requirements

| Requirement | Details |
|:------------|:--------|
| Remote Site Settings | `identitytoolkit.googleapis.com`, `api.stripe.com` |
| Custom Permissions | `Finance_LWC_Components`, `Operation_LWC_Components` |
| Queues | `Customer Service Queue` |
| Approval Processes | `Restaurant_Approval`, `Refund Approval to Finance Team` |

---

## 🗺️ Roadmap

- [x] Firebase ↔ Salesforce authentication bridge
- [x] Restaurant discovery & ordering flow
- [x] Stripe payment integration
- [x] Wallet & credits system
- [x] Automated delivery assignment engine
- [x] Support ticket & refund workflows
- [x] Finance & Operations dashboards (LWC)
- [x] Restaurant approval pipelines
- [ ] Move API keys to Named Credentials
- [ ] Stripe webhook signature verification
- [ ] Push notifications (FCM)
- [ ] Real-time order tracking (Platform Events)
- [ ] Comprehensive Apex test coverage (>85%)
- [ ] PWA support & offline mode

---

<div align="center">

### Built With Passion by [Varun Shiyam](https://github.com/Varunshiyam)

**React** · **Salesforce Apex** · **Firebase** · **Stripe** · **Lightning Web Components**

</div>
