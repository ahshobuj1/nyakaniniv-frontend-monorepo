# UpBeat Africa: Multi-Currency Subscription & Billing API Documentation (Frontend Integration)

This document provides complete API reference, payload types, error codes, and integration guidelines for frontend developers working on DJ Billing (`/dashboard/billing`), Public Pricing (`/pricing`), and the Admin Currency & Revenue Dashboard.

---

## 1. Summary of Changes & African Multi-Currency Rails
* **Base Currencies enabled out-of-the-box:** `KES` and `USD`.
* **Configured African currencies ready to toggle:** `NGN`, `GHS`, `ZAR`, `UGX`, `TZS`, `RWF`, `XOF`, `XAF`, `ZMW`.
* **Server-side validation & fallback:** If a visitor or DJ requests an inactive currency or a currency without an active price, the server automatically defaults to `USD`.
* **Provider routing:**
  * `USD` -> Paystack (Cards & Apple Pay)
  * `KES` -> Pesapal (M-Pesa, Airtel Money, East African cards)
  * Other currencies -> Flutterwave (upon admin enabling)

---

## 2. API Endpoints

### 2.1 Get Chargeable Currencies
Fetch the list of all supported currencies, their display symbols, and active/inactive status.

* **Method:** `GET`
* **Path:** `/subscriptions/v1/currencies`
* **Auth:** Public / Optional Bearer token
* **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Currencies retrieved successfully",
  "data": [
    {
      "id": 1,
      "code": "KES",
      "name": "Kenyan Shilling",
      "symbol": "KSh",
      "decimals": 2,
      "isActive": true
    },
    {
      "id": 2,
      "code": "USD",
      "name": "US Dollar",
      "symbol": "$",
      "decimals": 2,
      "isActive": true
    },
    {
      "id": 3,
      "code": "NGN",
      "name": "Nigerian Naira",
      "symbol": "₦",
      "decimals": 2,
      "isActive": false
    }
  ]
}
```

---

### 2.2 Fetch Subscription Plans (With Localized Currency)
Fetch available subscription plans localized to a selected currency.

* **Method:** `GET`
* **Path:** `/subscriptions/v1/plans?currency=KES`
* **Query Parameters:**
  * `currency` *(optional, string)*: ISO code (e.g. `KES`, `USD`, `NGN`). If omitted or disabled, server defaults to DJ's tenant country currency or `USD`.
  * `all` *(optional, boolean)*: Set `true` to include inactive plans (Admin only).
* **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Plans retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Starter",
      "currencyCode": "KES",
      "priceMonthly": 500,
      "priceAnnually": 5000,
      "discountPercentage": 16,
      "features": {
        "CUSTOM_SUBDOMAIN": true,
        "BASIC_PROFILE": true,
        "MANUAL_BOOKINGS": true,
        "MAX_EVENTS": 5
      },
      "isActive": true,
      "availablePrices": [
        {
          "id": "e2bc...",
          "planId": 1,
          "currencyCode": "KES",
          "priceMonthly": 500,
          "priceAnnually": 5000,
          "isActive": true
        },
        {
          "id": "f4ad...",
          "planId": 1,
          "currencyCode": "USD",
          "priceMonthly": 5,
          "priceAnnually": 50,
          "isActive": true
        }
      ]
    }
  ]
}
```

---

### 2.3 Preview Upgrade / Proration (With Local Currency)
Generate a real-time proration calculation before confirming a plan change or renewal.

* **Method:** `GET`
* **Path:** `/subscriptions/v1/preview-upgrade?planId=2&billingCycle=monthly&currency=KES`
* **Headers:** `Authorization: Bearer <DJ_JWT_TOKEN>`
* **Query Parameters:**
  * `planId` *(required, number)*
  * `billingCycle` *(required, 'monthly' | 'annually')*
  * `currency` *(optional, string)*: e.g. `KES`, `USD`
* **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Subscription upgrade preview generated",
  "data": {
    "isUpgrade": true,
    "isSamePlanAndCycle": false,
    "isDowngrade": false,
    "downgradeMessage": null,
    "currentPlan": {
      "id": 1,
      "name": "Starter",
      "billingCycle": "monthly",
      "pricePaid": 500,
      "periodEnd": "2026-11-20T00:00:00.000Z",
      "remainingDays": 24
    },
    "targetPlan": {
      "id": 2,
      "name": "Pro",
      "billingCycle": "monthly",
      "price": 750
    },
    "unusedCredit": 400,
    "appliedCredit": 400,
    "amountToPay": 350,
    "currency": "KES"
  }
}
```

---

### 2.4 Subscribe / Initiate Payment
Initiate subscription checkout. The server verifies currency, determines price, generates invoice, and returns payment checkout URL.

* **Method:** `POST`
* **Path:** `/subscriptions/v1/subscribe`
* **Headers:** `Authorization: Bearer <DJ_JWT_TOKEN>`
* **Request Body:**
```json
{
  "planId": 2,
  "billingCycle": "monthly",
  "currency": "KES",
  "gateway": "PESAPAL",
  "successUrl": "https://app.upbeat.africa/dashboard/billing?success=true",
  "cancelUrl": "https://app.upbeat.africa/dashboard/billing?canceled=true"
}
```
* **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Subscription process initiated",
  "data": {
    "url": "https://cybqa.pesapal.com/pesapalv3/api/Payments/...",
    "isUpgrade": true,
    "isInstantUpgrade": false,
    "appliedCredit": 400,
    "amountToPay": 350
  }
}
```
*(If `isInstantUpgrade: true`, `url: null`. The remaining balance completely covered the upgrade and the new tier was activated instantly).*

---

### 2.5 Admin: Manage Plan Prices per Currency
Set or update localized prices for any plan and currency.

* **Method:** `PUT`
* **Path:** `/subscriptions/v1/plans/:id/prices/:currencyCode`
* **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`
* **Request Body:**
```json
{
  "priceMonthly": 7500,
  "priceAnnually": 75000,
  "isActive": true
}
```
* **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Plan price updated successfully",
  "data": {
    "id": "guid",
    "planId": 2,
    "currencyCode": "NGN",
    "priceMonthly": 7500,
    "priceAnnually": 75000,
    "isActive": true
  }
}
```

---

### 2.6 Admin: Toggle Currency Availability
Enable or disable a currency platform-wide with zero redeploy.

* **Method:** `PATCH`
* **Path:** `/subscriptions/v1/currencies/:code`
* **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`
* **Request Body:**
```json
{
  "isActive": true
}
```
* **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Currency status updated successfully",
  "data": {
    "code": "NGN",
    "name": "Nigerian Naira",
    "symbol": "₦",
    "isActive": true
  }
}
```

---

### 2.7 Admin: Multi-Currency Revenue Analytics
Retrieve consolidated platform revenue without mixing different currencies.

* **Method:** `GET`
* **Path:** `/admin/analytics?currency=ALL`
* **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`
* **Query Parameters:**
  * `currency` *(optional)*: `ALL` (default, converts every currency to USD equivalent permanently captured at payment time), or specific ISO code like `KES`, `USD`, `NGN`.
* **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Admin analytics retrieved successfully",
  "data": {
    "totalUsers": 142,
    "totalTenants": 89,
    "totalBookings": 312,
    "reportingCurrency": "USD",
    "totalRevenue": 14250.75,
    "revenueByCurrency": [
      {
        "currency": "KES",
        "amount": 950000,
        "amountUsd": 7315.38,
        "count": 120
      },
      {
        "currency": "USD",
        "amount": 6935.37,
        "amountUsd": 6935.37,
        "count": 45
      }
    ],
    "subscriptions": {
      "active": 85,
      "canceled": 4,
      "pastDue": 2,
      "total": 91
    }
  }
}
```
