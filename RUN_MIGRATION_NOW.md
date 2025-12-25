# 🚀 Quick Database Migration Guide

Since you don't have Supabase CLI installed, here's the easiest way to run the migration:

## Option 1: Use Supabase Dashboard (Recommended - 2 minutes)

1. **Go to Supabase SQL Editor:**
   https://supabase.com/dashboard/project/xkjbkhjqbpbapwuzcacx/sql/new

2. **Copy and paste this SQL:**

```sql
-- Add premium status to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS has_premium BOOLEAN DEFAULT FALSE;

-- Add stripe customer id for tracking
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);

-- Create payments table to track transactions
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    stripe_payment_intent_id TEXT UNIQUE NOT NULL,
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'usd' NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own payments
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
CREATE POLICY "Users can view own payments"
    ON payments FOR SELECT
    USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent_id ON payments(stripe_payment_intent_id);
```

3. **Click "Run" button**

4. **You should see:** "Success. No rows returned"

✅ **Done!** Your database is now ready for the paywall.

---

## Option 2: Install Supabase CLI (Optional)

If you want to use CLI in the future:

```bash
brew install supabase/tap/supabase
supabase login
supabase db push
```

---

## ⚠️ Important: Get Service Role Key

You also need to add your Supabase Service Role Key to `.env.local`:

1. Go to: https://supabase.com/dashboard/project/xkjbkhjqbpbapwuzcacx/settings/api
2. Scroll down to "Project API keys"
3. Copy the **"service_role"** key (NOT the anon key!)
4. Add to `.env.local`:

```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

---

## 🧪 After Migration

1. **Restart your dev server** (Ctrl+C, then `npm run dev`)
2. **Test the paywall:**
   - Add 10 applications
   - Try to add an 11th
   - Paywall should appear!

---

## 🐛 About the Hydration Error

The hydration error you're seeing is caused by a browser extension (`fusion-extension-loaded`). This is harmless and won't affect functionality. To fix it:

- Disable browser extensions temporarily, or
- Test in incognito mode, or
- Just ignore it - it won't affect the paywall functionality
