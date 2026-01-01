# Domain Setup for seeknext.online

Congratulations on getting your official domain! Here is the checklist to switch your Production environment to `https://seeknext.online`.

## 1. Vercel (Hosting)
1. Go to your project settings in Vercel.
2. Navigate to **Domains**.
3. Add `seeknext.online`.
4. Follow the instructions to update your DNS records (usually adding an A record or CNAME).

## 2. Supabase (Authentication)
1. Go to your Supabase Dashboard > **Authentication** > **URL Configuration**.
2. **Site URL**: Change to `https://seeknext.online`.
3. **Redirect URLs**: Add the following:
   - `https://seeknext.online/**`
   - `https://seeknext.online/auth/callback`

## 3. Stripe (Payments)
1. **Webhooks**:
   - Go to Stripe Dashboard > **Developers** > **Webhooks**.
   - Add a new Endpoint (Limit to **Production** mode if ready, otherwise test with Test mode).
   - Endpoint URL: `https://seeknext.online/api/stripe/webhook`
   - Events: `checkout.session.completed`
   - **Important**: Get the new `Signing secret` (`whsec_...`) and update your Vercel Environment Variables (`STRIPE_WEBHOOK_SECRET`).

2. **Public Details**:
   - Go to **Settings** > **Public Details**.
   - Update your website URL to `https://seeknext.online`.

## 4. Google OAuth (If using Google Login)
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Select your project > **APIs & Services** > **Credentials**.
3. Edit your **OAuth 2.0 Client ID**.
4. **Authorized Javascript Origins**: Add `https://seeknext.online`.
5. **Authorized Redirect URIs**: Add `https://seeknext.online/auth/callback`.

## 5. Environment Variables (Vercel)
Update your Environment Variables in Vercel to match the production domain:

- **NEXT_PUBLIC_APP_URL**: `https://seeknext.online` (If you use this variable in your code)
