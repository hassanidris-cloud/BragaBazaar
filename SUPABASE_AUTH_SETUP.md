# Supabase Auth & verification email setup

## See signed-up users in Supabase

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project.
2. Go to **Authentication** → **Users**.
3. Every user who signs up (from your app’s signup page) appears here with email, created date, and **Email confirmed** (yes/no).

They are stored by Supabase Auth; you do not need a separate “users” table to see them. If you want to see or edit profile data (name, address, etc.) in a table, that comes from **user_metadata** on each user, or from a `profiles` table if you add one.

---

## Send verification email on signup

1. In Supabase: **Authentication** → **Providers** → **Email**.
2. Turn **ON** “Confirm email”.
3. Save.

After this, when someone signs up:

- Supabase sends a **verification email** to their address.
- Until they click the link in that email, they do not have a session (they cannot log in).
- In your app they see: “We’ve sent you a verification email. Check your inbox and click the link. Then log in—your details will be saved for checkout.”
- They click the link → email is confirmed → they go to **Login**, enter email/password → they are logged in and their details (from signup) are loaded for checkout.

### Redirect URL for the verification link

1. **Authentication** → **URL Configuration**.
2. **Site URL:** your app URL (e.g. `https://your-app.vercel.app` or `http://localhost:3000`).
3. **Redirect URLs:** add the same URL and allow the path Supabase uses for email confirmation, e.g.:
   - `https://your-app.vercel.app/**`
   - `http://localhost:3000/**`

Supabase will redirect users to your **Site URL** after they click “Confirm” in the email (you can later add a dedicated “Email confirmed” page if you want).

---

## Flow summary

1. **Sign up** → User fills form → Supabase creates user and sends verification email (if “Confirm email” is ON).
2. **User clicks link in email** → Email marked confirmed in Supabase (user appears in Authentication → Users with “Email confirmed”).
3. **User goes to Login** → Enters email + password → App loads their details from Supabase `user_metadata` into `bragaBazaarUser` (localStorage) so they don’t need to enter details again.
4. **Checkout** → Form is prefilled; they see “Your details are saved. Review and confirm below, then pay.” → They choose payment and confirm order.

If “Confirm email” is **OFF**, signup creates a session immediately and the app redirects to checkout without asking them to verify email first.

---

## Signup still doesn't work?

1. **Use the live URL** – Open the site at your **Vercel URL**, not as a local file. Signup needs a proper origin for Supabase.
2. **Add your Vercel URL in Supabase** – **Authentication** → **URL Configuration** → **Redirect URLs**: add `https://your-domain.vercel.app/**` and set **Site URL** to that domain.
3. **Check the message on the page** – Red = error (e.g. user already registered). Green = success; if it says "We've sent you a verification email", go to **Login** after clicking the link in the email.
4. **If nothing happens** – Hard refresh (Ctrl+F5). If you see "Could not load signup. Use the live site URL...", open the site via the Vercel URL.
5. **Redeploy** – Push to Git so Vercel redeploys (`git push origin master`). See **DEPLOY_VERCEL.md**.
