# SmartMeet — Subscriptions

## Feature Overview

The Subscription module tracks per-user subscription plans within the platform. It is currently a **minimal implementation** that stores subscription data as a sub-document on the User model and provides a single API endpoint for retrieval.

## Data Model

Subscription data is embedded within the User document:

```javascript
// User.subscription sub-document
{
  plan: String,              // Free, Pro, Enterprise, etc.
  price: Number,             // Monthly/yearly price
  currency: String,          // USD, EUR, etc.
  billingCycle: String,      // monthly, yearly
  renewalDate: Date,         // Next billing date
  stripeCustomerId: String,  // Stripe customer reference
  status: String,            // active, inactive, cancelled, past_due
}
```

## API Endpoint

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/subscription/me` | protect | Get current user's subscription |

**Response:**
```json
{
  "success": true,
  "subscription": {
    "plan": "Pro",
    "price": 29.99,
    "currency": "USD",
    "billingCycle": "monthly",
    "renewalDate": "2024-08-01T00:00:00.000Z",
    "stripeCustomerId": "cus_xxxxxxxxxxxx",
    "status": "active"
  }
}
```

## Frontend Store

**File:** `Front-end/src/stores/subscription.js`

```javascript
state: {
  subscription: null,
  loading: false,
  error: null,
}

actions: {
  fetch() { /* GET /api/subscription/me */ },
  refresh() { /* reset + fetch */ },
}
```

## Frontend Service

**File:** `Front-end/src/services/subscriptionService.js`

API service layer for subscription-related calls.

## Payment Integration

The frontend includes a Paymob checkout route (`/checkout/paymob`) via `PaymobCheckout.vue`, suggesting Paymob as the payment gateway. The Stripe customer ID field in the User model (`stripeCustomerId`) indicates dual payment provider readiness.

## Current Limitations & Future Roadmap

| Limitation | Future Enhancement |
|---|---|
| Read-only subscription data | Full CRUD for plan changes, upgrades, downgrades |
| Manual subscription data entry | Automated subscription lifecycle via Paymob/Stripe webhooks |
| No plan enforcement | Feature gating based on plan type |
| No payment webhook handling | Stripe/Paymob webhook endpoint |
| Single user-level subscription | Team/community-level billing |
| No trial management | Free trial period with automatic expiration |
| No invoice/receipt system | Automated invoicing via payment provider |
