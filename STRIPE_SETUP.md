# Stripe Paywall Setup Guide

This guide will help you set up the Stripe paywall for limiting free users to 10 applications.

## Prerequisites

- Stripe account (you already have the credentials)
- Supabase project with database access

## Step 1: Add Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key_here
STRIPE_SECRET_KEY=your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Supabase Service Role Key (needed for webhook)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Important:** You need to get your `SUPABASE_SERVICE_ROLE_KEY` from your Supabase project settings.

## Step 2: Run Database Migration

Run the migration to add premium status tracking:

```bash
# If using Supabase CLI
supabase db push

# Or manually run the SQL from:
# supabase/migrations/20251225000000_add_premium_status.sql
```

This migration will:
- Add `has_premium` column to profiles table
- Add `stripe_customer_id` column to profiles table
- Create a `payments` table to track transactions
- Set up appropriate indexes and RLS policies

## Step 3: Set Up Stripe Webhook

1. Go to your Stripe Dashboard: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Set the endpoint URL to: `https://your-domain.com/api/stripe/webhook`
4. Select the following events to listen to:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
5. Copy the webhook signing secret (starts with `whsec_`)
6. Add it to your `.env.local` as `STRIPE_WEBHOOK_SECRET`

## Step 4: Test the Paywall

### Testing in Development

For local testing, you'll need to use Stripe CLI to forward webhooks:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

This will give you a webhook secret starting with `whsec_` - use this for local development.

### Testing the Flow

1. Create a test user account
2. Add 10 job applications
3. Try to add an 11th application
4. The paywall dialog should appear
5. Click "Upgrade to Premium"
6. Complete the Stripe checkout (use test card: 4242 4242 4242 4242)
7. You should be redirected to the success page
8. Now you can add unlimited applications

## Step 5: Production Deployment

1. Make sure all environment variables are set in your production environment
2. Update the webhook URL in Stripe Dashboard to your production domain
3. Deploy your application

## How It Works

### User Flow

1. **Free Users (0-10 applications):**
   - Can add up to 10 job applications
   - No payment required

2. **Attempting 11th Application:**
   - PaywallDialog appears
   - Shows $6 one-time payment option
   - User clicks "Upgrade to Premium"

3. **Stripe Checkout:**
   - User is redirected to Stripe Checkout
   - Enters payment details
   - Completes $6 payment

4. **Webhook Processing:**
   - Stripe sends webhook to `/api/stripe/webhook`
   - Webhook handler updates user's `has_premium` to `true`
   - Records payment in `payments` table

5. **Premium Access:**
   - User is redirected to success page
   - Can now add unlimited applications
   - Premium status persists forever (one-time payment)

### Technical Implementation

- **AddApplicationDialog:** Checks application count and premium status before allowing new applications
- **PaywallDialog:** Beautiful modal that explains premium benefits and initiates Stripe checkout
- **Checkout API:** Creates Stripe checkout session with $6 one-time payment
- **Webhook API:** Processes successful payments and grants premium access
- **Database:** Tracks premium status and payment history

## Troubleshooting

### Webhook not working

- Verify webhook secret is correct
- Check webhook endpoint is accessible (not behind auth)
- Check Stripe Dashboard webhook logs for errors

### Payment successful but premium not granted

- Check webhook is properly configured
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Check application logs for webhook processing errors

### User can still add applications after limit

- Verify database migration ran successfully
- Check `has_premium` column exists in profiles table
- Refresh the page to get updated premium status

## Support

If you encounter any issues, check:
1. Stripe Dashboard webhook logs
2. Application server logs
3. Supabase database logs
4. Browser console for client-side errors
