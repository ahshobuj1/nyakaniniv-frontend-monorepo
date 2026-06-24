# API Integration Progress & Plan

This document tracks the progress of integrating the backend APIs into the frontend applications.

## 📝 Integration Strategy
1. **Redux Setup & RTK Query configuration**: Initialize `baseApi` with the appropriate `baseUrl` (`http://localhost:3030`). This allows us to handle all API calls efficiently.
2. **Authentication Flow**: Prioritize the `Auth` module first (Register, Login, OTP, Me) as most other endpoints require a Bearer token.
3. **Public/Landing Page Features**: Integrate public endpoints (Landing Page Content, Public Tenant Profiles).
4. **Tenant/DJ Features**: Integrate DJ-specific modules (Events, MixTapes, Bookings, Settings).
5. **Admin Features**: Integrate Super Admin modules (Theme Management, User Management, Analytics).

## 🗂️ API Endpoint Checklist

### 🔑 Auth Module
- [x] `POST /auth/v1/register` - Register User
- [x] `POST /auth/v1/login` - Login
- [x] `POST /auth/v1/verify` - Verify OTP
- [x] `POST /auth/v1/resend-otp` - Resend Verification OTP
- [ ] `POST /auth/v1/logout` - Logout
- [ ] `POST /auth/v1/forgot-password` - Forgot Password
- [ ] `POST /auth/v1/reset-password` - Reset Password

### 👤 User Module
- [x] `GET /users/v1/me` - Get Current Profile
- [x] `PATCH /users/v1/me` - Update Current Profile
- [ ] `GET /users/v1/` - Get All Users (Admin)
- [ ] `PATCH /users/v1/:id/status` - Update User Status (Admin)
- [ ] `PATCH /users/v1/:id/role` - Update User Role (Admin)
- [ ] `DELETE /users/v1/:id` - Delete User (Admin)

### 🏢 Tenant Module
- [x] `POST /tenant/v1/onboard` - Create Tenant Profile (Onboarding)
- [x] `GET /tenant/v1/:subdomain` - Get Public Profile
- [x] `PUT /tenant/v1/profile` - Update Tenant Profile
- [ ] `PUT /tenant/v1/theme` - Assign Theme
- [ ] `GET /tenant/v1/` - Get All Tenants (Admin Only)

### 🌐 Landing Page Module
- [x] `GET /landing-page/v1/content` - Get Landing Page Content
- [ ] `POST/PATCH/DELETE /landing-page/v1/hero` - Manage Hero Content (Admin)
- [ ] `POST/PATCH/DELETE /landing-page/v1/step` - Manage Step Content (Admin)
- [ ] `POST/PATCH/DELETE /landing-page/v1/service` - Manage Service Content (Admin)
- [ ] `POST/PATCH/DELETE /landing-page/v1/faq` - Manage FAQ Content (Admin)
- [ ] `POST/PATCH/DELETE /landing-page/v1/marquee` - Manage Marquee Content (Admin)

### 🎨 Theme Module
- [x] `GET /themes/v1/` - Get All Available Themes
- [x] `PATCH /tenant/v1/theme` - Assign Theme to Tenant
- [ ] `GET /themes/v1/slug/:slug` - Get Theme by Slug
- [ ] `POST /themes/v1/` - Create Theme (Admin)
- [ ] `PATCH /themes/v1/:id` - Update Theme (Admin)
- [ ] `DELETE /themes/v1/:id` - Delete Theme (Admin)

### 📅 Event Module
- [x] `GET /events/v1/tenant/:tenantId` - Get Tenant Events
- [ ] `GET /events/v1/:id` - Get Event by ID
- [x] `POST /events/v1/` - Create Event (DJ)
- [x] `PATCH /events/v1/:id` - Update Event (DJ)
- [x] `DELETE /events/v1/:id` - Delete Event (DJ)

### 🎵 MixTape Module
- [x] `POST /mixtapes/v1/` - Create MixTape
- [x] `GET /mixtapes/v1/tenant/:tenantId` - Get Tenant MixTapes
- [x] `PATCH /mixtapes/v1/:id` - Update MixTape
- [x] `DELETE /mixtapes/v1/:id` - Delete MixTape
- [x] `POST /mixtapes/v1/reorder` - Reorder MixTapes

### 📆 Booking Module
- [ ] `POST /bookings/v1/` - Create Booking (Public)
- [x] `GET /bookings/v1/` - Get My Bookings (DJ)
- [x] `PATCH /bookings/v1/:id/status` - Update Booking Status (DJ)
- [ ] `PATCH /bookings/v1/:id/request-cash` - Request Cash Payment (Public)

### 💳 Subscription Module
- [x] `GET /subscriptions/v1/plans` - Get All Subscription Plans
- [ ] `POST /subscriptions/v1/plans` - Create Subscription Plan (Admin)
- [ ] `PATCH /subscriptions/v1/plans/:id` - Update Subscription Plan (Admin)
- [ ] `DELETE /subscriptions/v1/plans/:id` - Delete Subscription Plan (Admin)
- [x] `GET /subscriptions/v1/my-subscription` - Get My Active Subscription (DJ)
- [x] `POST /subscriptions/v1/subscribe` - Subscribe to Plan
- [x] `POST /subscriptions/v1/cancel` - Cancel Subscription

### 💳 Unified Invoice Module (Payments & Subscriptions)
- [ ] `GET /invoices/v1/all` - Get All Invoices (Admin)
- [x] `GET /invoices/v1/my-invoices` - Get My Invoices (DJ)
- [ ] `POST /invoices/v1/:id/pay` - Pay Booking (Public)
- [x] `PATCH /invoices/v1/:id/mark-paid` - Mark Booking Paid (Cash) (DJ)


### 🔗 Stripe Connect Module
- [ ] `POST /stripe-connect/v1/onboard` - Get Onboarding Link (DJ)
- [ ] `GET /stripe-connect/v1/status` - Check Account Status (DJ)

### 👥 Client Module
- [ ] `GET /clients/v1/` - Get My Clients (DJ)
- [ ] `GET /clients/v1/:id` - Get Client Details (DJ)

### 📊 Analytics Module
- [ ] `GET /analytics/v1/admin` - Get Admin Analytics
- [ ] `GET /analytics/v1/admin/charts` - Get Admin Charts
- [ ] `GET /analytics/v1/tenant` - Get Tenant Analytics
- [ ] `GET /analytics/v1/tenant/charts` - Get Tenant Charts

### 🎫 Support Ticket Module
- [ ] `POST /tickets/v1/` - Create Ticket
- [ ] `GET /tickets/v1/my-tickets` - Get My Tickets (User)
- [ ] `GET /tickets/v1/` - Get All Tickets (Admin)
- [ ] `PATCH /tickets/v1/:id/status` - Update Ticket Status (Admin)

### 🔔 Notification Module
- [ ] `GET /notifications/v1/` - Get My Notifications
- [ ] `PATCH /notifications/v1/:id/read` - Mark Notification as Read
- [ ] `POST /notifications/v1/broadcast` - Broadcast Notification (Admin)

---
## 💡 Additional Notes & Next Steps
- **API Base Configuration**: We should first ensure `packages/store/src/api/baseApi.ts` is fully setup with RTK Query and the base URL `http://localhost:3030`.
- **Token Management**: The Redux setup should be updated so that all API requests inject the Bearer token (JWT) if it exists.
- **Start with Auth Module**: The most logical step is to implement the **Auth endpoints** first since almost all other API modules require authorization.

