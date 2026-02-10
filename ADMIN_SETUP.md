# Make a Supabase user an admin

When a user is an **admin**, they are redirected to the **admin page** after login instead of checkout.

---

## Option A: Admin by email (easiest — no Supabase UI)

You don’t need a “role” option in Supabase. Add your email in code:

1. Open **`supabaseConfig.js`** in this project.
2. Find the **`ADMIN_EMAILS`** array.
3. Add your login email (the one you use on the site), for example:
   ```js
   export const ADMIN_EMAILS = [
     'your-email@gmail.com',
   ];
   ```
4. Save the file. When that user logs in, they will be sent to **admin.html** automatically.

---

## Option B: Supabase user metadata (optional)

If you prefer to set the role in Supabase:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) and open your project.
2. In the left sidebar: **Authentication** → **Users**.
3. Click the **user row** (the email you want to make admin).
4. On the user detail page, look for **“Raw user meta data”** or **“User Metadata”** (sometimes under a “…” menu or at the bottom).
5. If it’s empty, set it to: `{"role":"admin"}`. If there is existing JSON, add `"role": "admin"` inside the existing object and save.
6. Save.

The app treats a user as admin if **either** Option A (email in `ADMIN_EMAILS`) **or** Option B (metadata `role: "admin"`) is set.

---

**Security:** Do not share or paste your Supabase API keys in chat, in public repos, or in screenshots. Keep the anon/public key in the frontend; never put the service_role key in the browser.
