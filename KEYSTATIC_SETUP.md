# Keystatic Production Setup Guide

Since your app is already deployed on Vercel (`https://www.seeknext.online/`) and connected to GitHub (`farang-dev/next-seeker`), you just need to connect Keystatic to your repository.

## 1. Create a GitHub App
Keystatic needs permission to write to your repository.

1. Go to the [GitHub Apps page](https://github.com/settings/apps) in your settings.
2. Click **New GitHub App**.
3. **GitHub App Name**: `Next Seeker CMS` (or anything you like).
4. **Homepage URL**: `https://www.seeknext.online`
5. **Callback URL**: `https://www.seeknext.online/api/keystatic/github/oauth/callback`
   *(Important: This must match exactly)*
6. Uncheck **Expire user authorization tokens**.
7. **Webhook**: Uncheck "Active" (we don't need webhooks).

## 2. Set Permissions
In the **Permissions** section of the GitHub App creation form:

1. **Repository permissions**:
   - **Contents**: `Read and write` (to manage posts)
   - **Pull requests**: `Read and write` (optional, if you want PR workflow)
   - **Metadata**: `Read-only` (default)

2. Click **Create GitHub App**.

## 3. Install the App
After creating the app:
1. Go to **Install App** on the left sidebar.
2. Click **Install** next to your account (`fuminozawa` or organization).
3. Select **Only select repositories** and choose `farang-dev/next-seeker`.
4. Click **Install**.

## 4. Get Credentials
Back on your GitHub App's "General" settings page:
1. Copy the **Client ID**.
2. Generate a **Client Secret** and copy it.

## 5. Set Environment Variables on Vercel
Go to your [Vercel Project Settings](https://vercel.com/dashboard) > **Environment Variables** and add these:

| Key | Value |
| --- | --- |
| `NEXT_PUBLIC_GITHUB_REPO` | `farang-dev/next-seeker` |
| `NEXT_PUBLIC_KEYSTATIC_GITHUB_CLIENT_ID` | *(Paste your Client ID)* |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | *(Paste your Client Secret)* |
| `KEYSTATIC_SECRET` | *(Generate a random long string, e.g., using `openssl rand -hex 32`)* |

## 6. Redeploy
Trigger a new deployment in Vercel (or wait for the next push) for the environment variables to take effect.

---

Once done, you can access your admin dashboard at:
**[https://www.seeknext.online/keystatic](https://www.seeknext.online/keystatic)**
