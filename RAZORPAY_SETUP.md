# Razorpay Payment Integration Guide

This document describes the complete Razorpay payment workflow for PerksNest Premium upgrades.

## Overview

The Razorpay payment workflow enables users to upgrade from Free to Premium tier for $20, converted to INR before creating the Razorpay order. The implementation follows a secure backend-verified approach:

1. **Frontend**: User initiates payment by clicking upgrade button
2. **Backend**: Creates Razorpay order (only backend knows amounts)
3. **Razorpay**: User fills payment details in checkout modal
4. **Frontend**: Receives payment ID and signature
5. **Backend**: Verifies signature using secret key
6. **Database**: Only updates user plan AFTER verification

## Setup Requirements

### Environment Variables

Both backend and frontend need Razorpay credentials:

**Backend (.env):**
```env
RAZORPAY_KEY_ID=rzp_test_RznqZurPHXgoYa
RAZORPAY_KEY_SECRET=VO6K7cqSn8Luz1HGBeTL2e0k
PREMIUM_PLAN_USD=20
USD_TO_INR_RATE=94.87
```

**Frontend (.env):**
```env
VITE_RAZORPAY_KEY=rzp_test_RznqZurPHXgoYa
```

### Database Setup

Run these SQL migrations in Supabase SQL Editor:

```bash
# Migration 1: Create payment_orders table
# Location: backend/sql/04-create-payment-orders-table.sql

# Migration 2: Create payment_history table  
# Location: backend/sql/05-create-payment-history-table.sql
```

Execute both migrations to create tables for storing payment records.

### Backend Dependencies

Razorpay SDK is already in `package.json`:
```json
"razorpay": "^2.9.6"
```

## API Endpoints

### 1. POST /api/create-order

Creates a Razorpay order for payment.

**Request:**
```javascript
POST /api/create-order
Headers: {
  'x-user-id': '<userId>',
  'Content-Type': 'application/json'
}
Body: {} (empty)
```

**Response (Success):**
```json
{
  "success": true,
  "order_id": "order_Ld6S3xaVEzDYAZ",
  "amount": 189740,
  "currency": "INR"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "User is already premium" // or other error
}
```

**Features:**
- Validates user authentication
- Prevents duplicate orders for already-premium users
- Returns unique receipt ID to prevent duplicates
- Stores order in `payment_orders` table
- Amount hardcoded as 2000 paise (₹20)

### 2. POST /api/verify-payment

Verifies Razorpay payment and upgrades user to premium.

**Request:**
```javascript
POST /api/verify-payment
Headers: {
  'x-user-id': '<userId>',
  'Content-Type': 'application/json'
}
Body: {
  "payment_id": "pay_Ld6S3xaVEzDYAZ",
  "order_id": "order_Ld6S3xaVEzDYAZ",
  "signature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Payment verified and user upgraded to premium",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "plan": "premium",
    "name": "John Doe",
    ...
  }
}
```

**Response (Error - Invalid Signature):**
```json
{
  "success": false,
  "error": "Invalid payment signature - payment verification failed"
}
```

**Security Features:**
- ✅ Verifies HMAC-SHA256 signature using secret key
- ✅ Only upgrades user AFTER successful verification
- ✅ Never trusts frontend data about payment
- ✅ Returns full updated user object
- ✅ Stores payment record in `payment_history` table

## Frontend Components

### useRazorpayPayment Hook

Location: `frontend/src/lib/razorpay.ts`

Comprehensive hook handling entire payment flow:

```typescript
const {
  isProcessing,
  isLoading,
  handlePremiumUpgrade,
  error
} = useRazorpayPayment(
  (user) => { /* on success */ },
  (error) => { /* on error */ }
);
```

**Features:**
- Loads Razorpay script dynamically
- Creates order on backend
- Opens Razorpay checkout modal
- Handles payment success/failure
- Verifies payment on backend
- Redirects to dashboard on success

### PremiumUpgradeButton Component

Location: `frontend/src/components/PremiumUpgradeButton.tsx`

Reusable button component for premium upgrade:

```jsx
import PremiumUpgradeButton from '@/components/PremiumUpgradeButton';

// Basic usage
<PremiumUpgradeButton />

// With callbacks
<PremiumUpgradeButton
  onSuccess={(user) => console.log('Upgraded!', user)}
  onError={(error) => console.error('Failed:', error)}
/>

// With custom text
<PremiumUpgradeButton buttonText="Upgrade Now – $20/year" />

// Full width
<PremiumUpgradeButton fullWidth />
```

**Features:**
- Auto-login redirect if not authenticated
- Shows "Already Premium ✅" for premium users
- Handles disabled state during processing
- Shows loading spinner during payment
- Error toast notifications

## Pricing Page Integration

Location: `frontend/src/pages/Pricing.tsx`

The pricing page now uses the new PremiumUpgradeButton:

```jsx
<PremiumUpgradeButton
  size="lg"
  fullWidth
  buttonText="Upgrade to Premium – $20"
  onSuccess={(user) => {
    setTimeout(() => {
      window.location.href = '/customer';
    }, 1500);
  }}
  onError={(error) => {
    toast.error(`Payment failed: ${error}`);
  }}
/>
```

## Testing Workflow

### Test Cards (Razorpay)

Use these test card numbers in development:

**Success (2D Secure):**
- Card: `4111 1111 1111 1111`
- Expiry: Any future date
- CVV: Any 3 digits
- OTP: `123456` (auto-submitted)

**Success (Non-3D):**
- Card: `5555 5555 5555 4444`
- Expiry: Any future date
- CVV: Any 3 digits

### Testing Steps

1. **Login to PerksNest**
   - Create test account or use existing account with `plan='free'`

2. **Navigate to Pricing**
   - Click "Upgrade to Premium – $20"

3. **Razorpay Checkout Opens**
   - Enter test card details above
   - Fill email and name (auto-filled)
   - Submit payment

4. **Verify Payment**
   - Check browser console for success message
   - Verify toast: "🎉 Payment successful! You are now a Premium member."
   - Should redirect to `/customer` dashboard

5. **Verify Database**
   - Check `users.plan` = `'premium'` for user
   - Check `payment_orders` table has order entry
   - Check `payment_history` table has payment record

### Debug Endpoints

**Verify database setup:**
```bash
curl http://localhost:3000/api/debug/claimed-deals?userId=<userId>
```

Response should show database connectivity status.

## Production Deployment

### 1. Get Production Credentials

- Visit https://dashboard.razorpay.com
- Navigate to Settings → API Keys
- Copy Live Key ID and Secret
- Update production `.env` files

### 2. Update Environment Variables

**Backend production .env:**
```env
RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY
RAZORPAY_KEY_SECRET=YOUR_LIVE_SECRET
```

**Frontend production .env:**
```env
VITE_RAZORPAY_KEY=rzp_live_YOUR_LIVE_KEY
```

### 3. Update Payment Amount (if needed)

Current amount: **$20 converted to INR**. With the default `USD_TO_INR_RATE=94.87`, Razorpay receives **189740 paise (about Rs 1,897.40)**.

To change:
1. Update backend `.env`: `PREMIUM_PLAN_USD=20`
2. Update backend `.env`: `USD_TO_INR_RATE=<current rate>`
3. Update button text in components if the visible plan price changes

### 4. Test in Production

- Use real test cards from Razorpay dashboard
- Verify full workflow before making live
- Enable webhook notifications if needed

## Security Considerations

### ✅ Implemented

- [x] Signature verification with HMAC-SHA256
- [x] Secret key stored in backend only
- [x] User upgrade only after verification
- [x] Unique receipt IDs to prevent duplicates
- [x] User authentication check on all endpoints
- [x] Comprehensive error logging
- [x] Timeout and retry logic on frontend

### 🔒 Additional Recommendations

- [ ] Implement webhook handler for payment updates
- [ ] Add rate limiting on create-order endpoint
- [ ] Add fraud detection checks
- [ ] Implement payment webhook notifications
- [ ] Set up monitoring for payment failures
- [ ] Add manual payment reconciliation job

## Troubleshooting

### Problem: "Razorpay key not configured"

**Solution:**
- Check `VITE_RAZORPAY_KEY` in `.env`
- Rebuild frontend: `npm run build`
- Check browser console Network tab

### Problem: "Failed to create order"

**Solution:**
- Check backend logs for 500 error
- Verify `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in backend `.env`
- Check user authentication header `x-user-id`
- Verify user is not already premium

### Problem: "Invalid payment signature"

**Solution:**
- Verify `RAZORPAY_KEY_SECRET` is correct in backend
- Check payment ID and order ID from frontend match
- Enable [PAYMENT] logs to see exact values
- Verify database connection is working

### Problem: User not upgraded after payment

**Solution:**
- Check `payment_orders` table has entry
- Check `payment_history` table has entry
- Verify `users.plan` is 'free' before payment
- Check backend logs for signature verification errors
- Check user has `id` in response

## Logging

All payment operations are logged with `[PAYMENT]` prefix:

```
[PAYMENT] Creating order for user 123e4567...
[PAYMENT] Order created successfully: order_Ld6S3xaVEzDYAZ
[PAYMENT] Signature verification for user 123e4567: { isValid: true, ... }
[PAYMENT] Valid signature. Upgrading user 123e4567 to premium...
[PAYMENT] User 123e4567 successfully upgraded to premium
```

View in:
- Backend: Terminal output or logs file
- Frontend: Browser DevTools Console (filter for [PAYMENT])

## API Response Formats

### Success Response

```json
{
  "success": true,
  "message": "...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "plan": "premium",
    "role": "user",
    "claimedDeals": [],
    ...
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

## File Structure

```
perksnest-new/
├── backend/
│   ├── server.js           (Contains /api/create-order and /api/verify-payment)
│   ├── sql/
│   │   ├── 04-create-payment-orders-table.sql
│   │   └── 05-create-payment-history-table.sql
│   └── .env                (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
│
└── frontend/
    ├── src/
    │   ├── lib/
    │   │   ├── razorpay.ts (useRazorpayPayment hook)
    │   │   ├── api.ts       (API functions)
    │   │   └── auth.tsx     (Auth context)
    │   ├── components/
    │   │   └── PremiumUpgradeButton.tsx
    │   └── pages/
    │       └── Pricing.tsx
    └── .env                 (VITE_RAZORPAY_KEY)
```

## Next Steps

1. **Run SQL migrations** in Supabase to create payment tables
2. **Test with test cards** in development
3. **Verify database** stores payment records correctly
4. **Deploy to staging** and test end-to-end
5. **Get production credentials** from Razorpay
6. **Deploy to production** with live credentials

## Support

For issues:
- Check [PAYMENT] logs in console
- Verify environment variables are set
- Confirm database tables exist
- Test with different browsers/devices
- Contact Razorpay support for payment issues
