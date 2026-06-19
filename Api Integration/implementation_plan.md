# Full Frontend API Integration Plan

Integrating the complete API suite across the entire frontend (Dashboard, Auth, Landing Page, Public Profiles) is a massive undertaking. To ensure we handle loading states properly, set up `sonner` toasts, implement confirmation modals correctly, and avoid breaking the app, we must execute this in **Phases**. 

I have analyzed the project structure and here is the proposed phased approach:

## 🚧 Phased Execution Strategy

### Phase 1: Authentication & Onboarding (Priority 1) ✅ COMPLETED
Without authentication, we cannot access the dashboard APIs. This phase focuses on:
- `apps/web/app/auth/login`: Integrating `useLoginMutation`.
- `apps/web/app/auth/register`: Integrating `useRegisterMutation`.
- `apps/web/app/auth/verify-email`: Integrating `useVerifyOtpMutation` & resend logic.
- `apps/web/app/auth/setup-profile`: Integrating `useOnboardTenantMutation` (Tenant Profile creation).
- Global: Wrapping the app with Redux `<Provider>` (if not fully done) and checking for protected routes.

### Phase 2: Core Dashboard Modules (Priority 2) ✅ COMPLETED
Once Auth is working, we replace dummy data in the DJ Dashboard.
- **Bookings** (`dashboard/bookings`): Replaced `dummyBookings` with `useGetMyBookingsQuery`. Added popups for status updates.
- **Events** (`dashboard/events`): Integrated `useGetTenantEventsQuery`, `useCreateEventMutation`, etc. Added confirmation modals for deletion.
- **Profile** (`dashboard/profile`): Integrated `useGetCurrentProfileQuery`, `useUpdateCurrentProfileMutation`, and `useUpdateTenantProfileMutation`.

### Phase 3: Billing, Invoices & Settings (Priority 3) 🚀 NEXT UP
- **Billing** (`dashboard/billing`): Integrate `useGetMySubscriptionQuery`, `useGetPlansQuery`, `useSubscribeMutation`.
- **Invoices** (`dashboard/invoices`): Integrate `useGetMyInvoicesQuery`.
- **Themes** (`dashboard/manage-theme`): Integrate `useGetAllThemesQuery` and `useAssignThemeMutation`.
- **MixTapes**: Integrate CRUD for mixtapes.

### Phase 4: Public Site & Landing Page (Priority 4)
- **Landing Page**: Fetch dynamic hero, step, and service data using `useGetLandingPageContentQuery`.
- **Public DJ Profile** (`[username]`): Fetch public data dynamically based on the subdomain/username using `useGetPublicProfileQuery`.

## User Review Required
> [!IMPORTANT]
> Phase 1 and Phase 2 are fully completed. I have marked the corresponding endpoints in `api-proggres.md` as done. 
> 
> Are you ready to begin **Phase 3 (Billing, Invoices & Themes)**?

## Verification Plan
After each phase:
- I will check the checkboxes `[x]` in your `api-proggres.md` file to keep track.
- We will verify the UI loading states (`isLoading`, spinner components).
- We will verify `sonner` toast notifications on successes and errors.
- We will ensure confirmation popups work seamlessly.
