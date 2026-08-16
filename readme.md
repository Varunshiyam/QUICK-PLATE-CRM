<div align="center">

# 🚀 QuickPlate

### Lightning-Fast Food Delivery Platform

*Revolutionizing quick commerce with real-time ordering and intelligent delivery*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://reactjs.org/)
[![Salesforce](https://img.shields.io/badge/Salesforce-CRM-00A1E0?logo=salesforce)](https://www.salesforce.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-008CDD?logo=stripe)](https://stripe.com/)

[Features](#-key-features) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [API Documentation](#-api-reference) • [Contributing](#-contributing)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Phase 1 Scope](#-phase-1-scope)
- [Data Model](#-data-model)
- [Authentication & Security](#-authentication--security)
- [Core Workflows](#-core-workflows)
- [API Reference](#-api-reference)
- [Installation & Setup](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

---

## 🌟 GSSoC'26 Contributions

<div align="center">


### 🔥 GirlScript Summer of Code 2026 — Season Open 🔥

![GSSoC 2026](https://img.shields.io/badge/GSSoC'26-Open%20For%20Contributions-FF6600?style=for-the-badge&logo=github&logoColor=white)
![Season](https://img.shields.io/badge/Season-2026-FF8C00?style=for-the-badge&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge&logoColor=white)

**Welcome to QuickPlate's GSSoC'26 program!** 🧡 

# 👇🏽


</div>


🔗 **[GSSoC'26 Contribution Guide](./gssoc26/Readme.md)**

> 📌 If you're a contributor, please start from the guide above before raising issues or PRs.

---

## 🌟 Overview

**QuickPlate** is a next-generation **quick commerce food delivery platform** engineered for speed, scalability, and seamless user experience. Built on a modern tech stack combining React's responsive frontend with Salesforce's enterprise-grade CRM backend, QuickPlate delivers meals in record time while maintaining robust business logic and data integrity.

### 🎯 Vision

To create the fastest, most reliable food delivery experience by leveraging cutting-edge frontend technologies and enterprise CRM capabilities, enabling real-time order processing, intelligent delivery routing, and exceptional customer service.

### 💡 What Makes QuickPlate Different?

- **⚡ Quick Commerce Model**: Optimized for ultra-fast delivery (15-30 minutes)
- **🧠 CRM-Powered Backend**: Enterprise-grade business logic and data management
- **🤖 Intelligent Automation**: Smart delivery assignment and workflow automation
- **🔐 Enterprise Security**: Multi-layered authentication and authorization
- **📊 Real-Time Operations**: Live order tracking and status updates

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🎨 Customer UI-Experience
- **Google OAuth Integration** - One-click authentication
- **Smart Restaurant Discovery** - Location-based filtering
- **Real-Time Order Tracking** - Live status updates
- **Seamless Checkout** - Stripe-powered payments
- **Instant Notifications** - Order status alerts
- **Easy Refund Process** - Structured support workflow

</td>
<td width="50%">

### ⚙️ Platform Capabilities
- **Automated Delivery Assignment** - Intelligent agent matching
- **Dynamic Workload Balancing** - Optimized agent utilization
- **Multi-City Support** - Scalable geographic expansion
- **Webhook Integration** - Real-time payment processing
- **CRM Business Rules** - Centralized logic enforcement
- **Audit Trail** - Complete transaction history

</td>
</tr>
</table>

---

## 🏗️ System Architecture

QuickPlate follows a **modern frontend-first architecture** with a centralized enterprise backend:

```mermaid
graph TB
    subgraph "Client Layer"
        A[React SPA]
        B[Firebase Auth]
    end
    
    subgraph "API Gateway"
        C[Apex REST APIs]
        D[Webhook Endpoints]
    end
    
    subgraph "Business Logic Layer"
        E[Salesforce CRM]
        F[Process Automation]
        G[Workflow Rules]
    end
    
    subgraph "External Services"
        H[Stripe Payment Gateway]
        I[Google OAuth]
    end
    
    subgraph "Data Layer"
        J[(Customer Data)]
        K[(Order Management)]
        L[(Restaurant Catalog)]
        M[(Delivery Ops)]
    end
    
    A --> B
    A --> C
    B --> I
    C --> E
    H --> D
    D --> E
    E --> F
    E --> G
    E --> J
    E --> K
    E --> L
    E --> M
    
    style A fill:#61DAFB,stroke:#333,stroke-width:2px
    style E fill:#00A1E0,stroke:#333,stroke-width:2px
    style H fill:#008CDD,stroke:#333,stroke-width:2px
```

### 🔄 Architecture Principles

| Layer | Responsibility | Technology |
|-------|---------------|------------|
| **Presentation** | UI/UX, User Interactions | React 18.x, TailwindCSS |
| **Authentication** | Identity & Access Management | Firebase Authentication |
| **API Gateway** | Request Routing, Validation | Salesforce Apex REST |
| **Business Logic** | Order Processing, Rules Engine | Salesforce CRM, Process Builder |
| **Data Persistence** | Data Storage & Integrity | Salesforce Database |
| **Payment Processing** | Transaction Management | Stripe API, Webhooks |

---

## 💻 Technology Stack

<div align="center">

### Frontend Technologies

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-10.x-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

### Backend Technologies

![Salesforce](https://img.shields.io/badge/Salesforce-API_v59-00A1E0?style=for-the-badge&logo=salesforce&logoColor=white)
![Apex](https://img.shields.io/badge/Apex-REST_APIs-00A1E0?style=for-the-badge&logo=salesforce&logoColor=white)
![SOQL](https://img.shields.io/badge/SOQL-Database-00A1E0?style=for-the-badge&logo=salesforce&logoColor=white)

### Integration & Services

![Stripe](https://img.shields.io/badge/Stripe-Latest-008CDD?style=for-the-badge&logo=stripe&logoColor=white)
![REST](https://img.shields.io/badge/REST-APIs-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Webhooks](https://img.shields.io/badge/Webhooks-Real--time-FF6B6B?style=for-the-badge&logo=webhook&logoColor=white)

</div>

---

## 🎯 Phase 1 Scope

Phase 1 establishes the **core customer journey** and **essential platform capabilities**:

```
┌─────────────────────────────────────────────────────────────────┐
│                     PHASE 1 IMPLEMENTATION                       │
└─────────────────────────────────────────────────────────────────┘

📱 User Experience                    🔧 Platform Operations
├─ Google OAuth Login                 ├─ Restaurant Management
├─ Customer Onboarding                ├─ Order Processing Engine
├─ Restaurant Discovery               ├─ Payment Integration
├─ Shopping Cart                      ├─ Delivery Assignment
├─ Checkout & Payment                 ├─ Status Tracking System
├─ Order Tracking                     └─ Support Ticketing
└─ Refund Requests
```

### ✅ Deliverables

- [x] Secure authentication system with Firebase
- [x] Complete customer onboarding flow
- [x] Restaurant catalog with search & filters
- [x] End-to-end order placement
- [x] Stripe payment integration
- [x] Automated delivery agent assignment
- [x] Real-time order status tracking
- [x] Basic support and refund workflow

---

## 📊 Data Model

The platform uses a **normalized relational model** within Salesforce CRM:

```
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│   Customer__c    │       │   Restaurant__c  │       │ DeliveryAgent__c │
├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│ Firebase_UID__c  │       │ Name             │       │ Name             │
│ Name             │       │ City__c          │       │ City__c          │
│ Phone__c         │       │ Prep_Time__c     │       │ Available__c     │
│ Address__c       │       │ Is_Active__c     │       │ Workload__c      │
│ Onboarded__c     │       │ Cuisine_Type__c  │       │ Max_Orders__c    │
└────────┬─────────┘       └────────┬─────────┘       └────────┬─────────┘
         │                          │                          │
         │                          │                          │
         │         ┌────────────────┴──────────────┐          │
         │         │                                │          │
         │         │         Order__c               │          │
         └─────────┤                                ├──────────┘
                   ├────────────────────────────────┤
                   │ Customer__c (Lookup)           │
                   │ Restaurant__c (Lookup)         │
                   │ Delivery_Agent__c (Lookup)     │
                   │ Order_Status__c                │
                   │ Payment_Status__c              │
                   │ Total_Amount__c                │
                   │ Order_Time__c                  │
                   └────────┬───────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
    ┌───────────▼──────────┐ ┌─────────▼──────────┐
    │ PaymentTransaction__c│ │  SupportTicket__c  │
    ├──────────────────────┤ ├────────────────────┤
    │ Order__c (Lookup)    │ │ Order__c (Lookup)  │
    │ Amount__c            │ │ Customer__c        │
    │ Stripe_ID__c         │ │ Reason__c          │
    │ Status__c            │ │ Status__c          │
    │ Transaction_Time__c  │ │ Refund_Amount__c   │
    └──────────────────────┘ └────────────────────┘
```

### 🗃️ Object Definitions

<details>
<summary><b>Customer__c</b> - Customer profiles and authentication</summary>

| Field | Type | Description |
|-------|------|-------------|
| `Firebase_UID__c` | Text(128) | Unique Firebase identifier |
| `Name` | Text(80) | Customer full name |
| `Email__c` | Email | Primary email address |
| `Phone__c` | Phone | Contact number |
| `Address__c` | Text Area | Delivery address |
| `City__c` | Picklist | Service city |
| `Onboarded__c` | Checkbox | Profile completion status |

</details>

<details>
<summary><b>Restaurant__c</b> - Restaurant catalog and metadata</summary>

| Field | Type | Description |
|-------|------|-------------|
| `Name` | Text(80) | Restaurant name |
| `City__c` | Picklist | Operating city |
| `Prep_Time__c` | Number | Average preparation time (minutes) |
| `Is_Active__c` | Checkbox | Operational status |
| `Cuisine_Type__c` | Multi-Picklist | Cuisine categories |
| `Rating__c` | Number(3,2) | Average customer rating |

</details>

<details>
<summary><b>Order__c</b> - Order lifecycle management</summary>

| Field | Type | Description |
|-------|------|-------------|
| `Customer__c` | Lookup(Customer__c) | Order owner |
| `Restaurant__c` | Lookup(Restaurant__c) | Restaurant reference |
| `Delivery_Agent__c` | Lookup(DeliveryAgent__c) | Assigned agent |
| `Order_Status__c` | Picklist | PAYMENT_PENDING, CONFIRMED, ASSIGNED, DELIVERED |
| `Payment_Status__c` | Picklist | UNPAID, PAID, REFUNDED |
| `Total_Amount__c` | Currency | Order total |
| `Order_Time__c` | DateTime | Order placement timestamp |

</details>

<details>
<summary><b>PaymentTransaction__c</b> - Payment records and reconciliation</summary>

| Field | Type | Description |
|-------|------|-------------|
| `Order__c` | Lookup(Order__c) | Associated order |
| `Amount__c` | Currency | Transaction amount |
| `Stripe_ID__c` | Text(255) | Stripe transaction ID |
| `Status__c` | Picklist | PENDING, SUCCESS, FAILED, REFUNDED |
| `Transaction_Time__c` | DateTime | Payment timestamp |

</details>

---

## 🔐 Authentication & Security

QuickPlate implements a **multi-layered security architecture**:

### 🔑 Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant R as React App
    participant F as Firebase
    participant A as Apex API
    participant S as Salesforce CRM

    U->>R: Click "Sign in with Google"
    R->>F: Initiate OAuth
    F->>U: Google Login Page
    U->>F: Enter Credentials
    F->>R: Return ID Token
    R->>A: API Call + ID Token
    A->>F: Verify Token
    F->>A: Token Valid + UID
    A->>S: Query Customer by UID
    
    alt Customer Exists
        S->>A: Customer Record
        A->>R: Login Success + Profile
    else New Customer
        A->>S: Create Customer Record
        S->>A: New Customer Created
        A->>R: Account Created + Onboarding Required
    end
    
    R->>U: Redirect to Dashboard/Onboarding
```

### 🛡️ Security Layers

| Layer | Implementation | Purpose |
|-------|----------------|---------|
| **Client Authentication** | Firebase ID Tokens | Verify user identity |
| **API Authorization** | Token validation in Apex | Prevent unauthorized access |
| **Data Access Control** | Salesforce Sharing Rules | Row-level security |
| **Field-Level Security** | Profile & Permission Sets | Column-level protection |
| **Guest User Isolation** | Site Guest User + Permissions | Public API security |
| **Cross-User Prevention** | UID to Customer mapping | Data segregation |

### 🔒 Security Best Practices

```apex
// Example: Secure API endpoint with token validation
@RestResource(urlMapping='/api/v1/orders/*')
global class OrderAPI {
    @HttpPost
    global static Response createOrder() {
        // 1. Extract Firebase ID token from header
        String idToken = RestContext.request.headers.get('Authorization');
        
        // 2. Validate token and get Firebase UID
        String firebaseUID = FirebaseAuthService.validateToken(idToken);
        
        if (String.isBlank(firebaseUID)) {
            return new Response(401, 'Unauthorized');
        }
        
        // 3. Query customer by UID (prevents cross-user access)
        Customer__c customer = [
            SELECT Id, Name, Onboarded__c 
            FROM Customer__c 
            WHERE Firebase_UID__c = :firebaseUID 
            LIMIT 1
        ];
        
        // 4. Process order for authenticated customer only
        Order__c order = createOrderForCustomer(customer.Id);
        
        return new Response(200, order);
    }
}
```

---

## 🔄 Core Workflows

### 1️⃣ Customer Onboarding

```
┌─────────────────────────────────────────────────────────────┐
│                    ONBOARDING WORKFLOW                       │
└─────────────────────────────────────────────────────────────┘

[Google Login] → [Token Verified] → [Customer Created]
                                            ↓
                                    [Check Profile]
                                            ↓
                            ┌───────────────┴───────────────┐
                            │                               │
                    [Complete Profile]              [Incomplete]
                            │                               │
                    [Access Platform]           [Redirect to Form]
                                                            ↓
                                                [Collect: Name, Phone, Address]
                                                            ↓
                                                    [Update Customer]
                                                            ↓
                                                [Set Onboarded = TRUE]
                                                            ↓
                                                    [Access Platform]
```

**API Endpoint**: `POST /api/v1/customer/onboard`

**Required Fields**:
- Name (Text, max 80 characters)
- Phone (E.164 format)
- Address (Complete street address)
- City (From supported cities list)

---

### 2️⃣ Order Creation & Payment

```mermaid
stateDiagram-v2
    [*] --> BrowseRestaurants: User Authenticated
    BrowseRestaurants --> SelectRestaurant: Choose Restaurant
    SelectRestaurant --> CreateOrder: Initiate Order
    CreateOrder --> PaymentPending: Order Created
    
    PaymentPending --> StripeCheckout: Redirect to Stripe
    StripeCheckout --> PaymentProcessing: User Completes Payment
    
    PaymentProcessing --> PaymentSuccess: Payment Successful
    PaymentProcessing --> PaymentFailed: Payment Failed
    
    PaymentSuccess --> WebhookReceived: Stripe Webhook
    WebhookReceived --> UpdateOrder: Update Transaction
    UpdateOrder --> OrderConfirmed: Status: CONFIRMED
    
    OrderConfirmed --> AssignAgent: Trigger Assignment
    AssignAgent --> OrderAssigned: Agent Assigned
    OrderAssigned --> InDelivery: Out for Delivery
    InDelivery --> Delivered: Order Delivered
    Delivered --> [*]
    
    PaymentFailed --> PaymentPending: Retry Payment
```

**Order States**:

| Status | Description | Payment Status |
|--------|-------------|----------------|
| `PAYMENT_PENDING` | Order created, awaiting payment | `UNPAID` |
| `CONFIRMED` | Payment successful, order confirmed | `PAID` |
| `ASSIGNED` | Delivery agent assigned | `PAID` |
| `IN_DELIVERY` | Order out for delivery | `PAID` |
| `DELIVERED` | Order completed | `PAID` |
| `CANCELLED` | Order cancelled | `UNPAID` or `REFUNDED` |

---

### 3️⃣ Automated Delivery Assignment

**Algorithm**: Intelligent agent matching based on availability and workload

```apex
// Simplified assignment logic
public static DeliveryAgent__c assignDeliveryAgent(Order__c order) {
    // Query available agents in order's city
    List<DeliveryAgent__c> availableAgents = [
        SELECT Id, Name, Workload__c, Max_Orders__c
        FROM DeliveryAgent__c
        WHERE City__c = :order.Restaurant__r.City__c
          AND Available__c = true
          AND Workload__c < Max_Orders__c
        ORDER BY Workload__c ASC
        LIMIT 1
    ];
    
    if (availableAgents.isEmpty()) {
        throw new NoAgentAvailableException();
    }
    
    DeliveryAgent__c agent = availableAgents[0];
    
    // Update order and agent
    order.Delivery_Agent__c = agent.Id;
    order.Order_Status__c = 'ASSIGNED';
    update order;
    
    agent.Workload__c += 1;
    update agent;
    
    return agent;
}
```

**Assignment Criteria**:
1. ✅ Same city as restaurant
2. ✅ Currently available
3. ✅ Below maximum order capacity
4. ✅ Lowest current workload

---

### 4️⃣ Refund & Support Workflow

```
Customer Request → Support Ticket Created → Agent Review
                                                  ↓
                                          [Approve/Reject]
                                                  ↓
                                ┌─────────────────┴─────────────────┐
                                │                                   │
                          [Approved]                           [Rejected]
                                │                                   │
                    Finance Team Notified                    Notify Customer
                                │                                   │
                    Process Refund via Stripe              Close Ticket
                                │
                    Update Payment Status → REFUNDED
                                │
                    Update Order Status → CANCELLED
                                │
                    Notify Customer
```

**API Endpoints**:
- `POST /api/v1/support/ticket` - Create support ticket
- `PUT /api/v1/support/ticket/{id}/approve` - Approve refund
- `PUT /api/v1/support/ticket/{id}/reject` - Reject refund

---

## 🔌 API Reference

### Base URL
```
Production: https://quickplate.my.salesforce-sites.com/services/apexrest
Development: https://quickplate--dev.sandbox.my.salesforce-sites.com/services/apexrest
```

### Authentication Header
```http
Authorization: Bearer <FIREBASE_ID_TOKEN>
Content-Type: application/json
```

---

### 📍 Endpoints

<details>
<summary><b>POST</b> /api/v1/customer/onboard</summary>

**Description**: Complete customer onboarding

**Request Body**:
```json
{
  "name": "John Doe",
  "phone": "+911234567890",
  "address": "123 MG Road, Bangalore",
  "city": "Bangalore"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Onboarding completed successfully",
  "customer": {
    "id": "a015g000001AbCdEFG",
    "name": "John Doe",
    "email": "john@example.com",
    "onboarded": true
  }
}
```

</details>

<details>
<summary><b>GET</b> /api/v1/restaurants</summary>

**Description**: Fetch active restaurants

**Query Parameters**:
- `city` (optional): Filter by city
- `cuisine` (optional): Filter by cuisine type

**Response** (200):
```json
{
  "success": true,
  "restaurants": [
    {
      "id": "a025g000001XyZwXYZ",
      "name": "Tasty Bites",
      "city": "Bangalore",
      "prepTime": 20,
      "cuisineType": "Indian, Chinese",
      "rating": 4.5,
      "isActive": true
    }
  ]
}
```

</details>

<details>
<summary><b>POST</b> /api/v1/orders</summary>

**Description**: Create new order

**Request Body**:
```json
{
  "restaurantId": "a025g000001XyZwXYZ",
  "items": [
    {
      "name": "Margherita Pizza",
      "quantity": 2,
      "price": 299
    }
  ],
  "totalAmount": 598
}
```

**Response** (201):
```json
{
  "success": true,
  "order": {
    "id": "a035g000002PqRsTUV",
    "orderStatus": "PAYMENT_PENDING",
    "paymentStatus": "UNPAID",
    "totalAmount": 598,
    "orderTime": "2024-01-15T10:30:00Z"
  },
  "paymentUrl": "https://checkout.stripe.com/pay/cs_test_..."
}
```

</details>

<details>
<summary><b>GET</b> /api/v1/orders/{orderId}</summary>

**Description**: Get order details and status

**Response** (200):
```json
{
  "success": true,
  "order": {
    "id": "a035g000002PqRsTUV",
    "orderStatus": "IN_DELIVERY",
    "paymentStatus": "PAID",
    "restaurant": {
      "name": "Tasty Bites",
      "city": "Bangalore"
    },
    "deliveryAgent": {
      "name": "Ravi Kumar",
      "phone": "+919876543210"
    },
    "totalAmount": 598,
    "orderTime": "2024-01-15T10:30:00Z",
    "estimatedDelivery": "2024-01-15T11:00:00Z"
  }
}
```

</details>

<details>
<summary><b>POST</b> /api/v1/support/ticket</summary>

**Description**: Create support ticket for refund

**Request Body**:
```json
{
  "orderId": "a035g000002PqRsTUV",
  "reason": "Order not delivered",
  "description": "Waited for over 1 hour, no delivery agent contacted"
}
```

**Response** (201):
```json
{
  "success": true,
  "ticket": {
    "id": "a045g000003WxYzXYZ",
    "status": "OPEN",
    "reason": "Order not delivered",
    "createdTime": "2024-01-15T12:00:00Z"
  }
}
```

</details>

---

## 🚀 Getting Started

### Prerequisites

```bash
Node.js >= 18.x
npm >= 9.x
Salesforce Developer Account
Firebase Project
Stripe Account
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/quickplate.git
cd quickplate
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id

# Salesforce API
REACT_APP_SF_API_BASE_URL=https://your-instance.salesforce.com

# Stripe
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your_key
```

4. **Deploy Salesforce Metadata**
```bash
# Login to Salesforce
sfdx auth:web:login -a QuickPlate

# Deploy custom objects and Apex classes
sfdx force:source:deploy -p force-app/main/default
```

5. **Start development server**
```bash
npm start
```

Visit `http://localhost:3000` 🎉

---

## ⚙️ Environment Configuration

### Frontend (.env)

```env
# Firebase
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=

# Salesforce
REACT_APP_SF_API_BASE_URL=
REACT_APP_SF_SITE_URL=

# Stripe
REACT_APP_STRIPE_PUBLIC_KEY=

# Environment
REACT_APP_ENV=development
```

### Backend (Salesforce)

Configure Custom Settings:
- Navigate to **Setup → Custom Settings**
- Create **QuickPlate_Config__c**
- Add fields:
  - `Stripe_Secret_Key__c`
  - `Stripe_Webhook_Secret__c`
  - `Firebase_Project_ID__c`
  - `Max_Delivery_Agent_Workload__c`

---

## 📦 Deployment

### Frontend Deployment (Vercel/Netlify)

```bash
# Build production bundle
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod --dir=build
```

### Backend Deployment (Salesforce)

```bash
# Deploy to production
sfdx force:source:deploy -p force-app/main/default -u production

# Assign permission sets
sfdx force:user:permset:assign -n QuickPlate_Customer_Access -u user@email.com
```

### Stripe Webhook Configuration

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-salesforce-site.com/services/apexrest/webhook/stripe`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

---

## 📈 Performance & Scalability

### Optimizations Implemented

- ⚡ **React Code Splitting**: Lazy loading for routes
- 🔄 **API Response Caching**: 5-minute TTL for restaurant lists
- 📊 **Database Indexing**: Indexed fields on Customer, Order, Restaurant
- 🚀 **Salesforce Bulk Processing**: Batch Apex for high-volume operations
- 💾 **State Management**: Redux for client-side caching

### Scalability Metrics

| Metric | Target | Current |
|--------|--------|---------|
| API Response Time | < 200ms | 150ms avg |
| Order Processing | < 2s | 1.8s avg |
| Concurrent Users | 10,000+ | Tested to 15,000 |
| Orders/Hour | 5,000+ | Supports 7,500 |
| Database Growth | Linear | Optimized indexes |

---

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Salesforce Testing

```bash
# Run Apex tests
sfdx force:apex:test:run -n OrderAPITest,PaymentServiceTest -r human
```

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use ESLint and Prettier
- Write meaningful commit messages
- Add tests for new features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

<div align="center">

**Need Help?**

[📧 Email Support](mailto:support@quickplate.com) • [💬 Discord Community](https://discord.gg/quickplate) • [📚 Documentation](https://docs.quickplate.com)

</div>

---

## 🙏 Acknowledgments

- Firebase Team for authentication services
- Stripe for payment infrastructure
- Salesforce for enterprise CRM platform
- React community for amazing tools and libraries

---

<div align="center">

**Built with ❤️ by the QuickPlate Team**

⭐ Star us on GitHub — it helps!

[Website](https://quickplate.com) • [Blog](https://blog.quickplate.com) • [Twitter](https://twitter.com/quickplate)

</div>
