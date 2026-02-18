# Order status not changing / User not getting email

## 1. Status not changing

**Admin side:** When you set "Shipped" or "Delivered" in admin-orders, the update can fail if Row Level Security (RLS) does not allow it.

- **Fix:** Run the SQL in **Supabase Dashboard → SQL Editor**:
  - Open **`supabase/migrations/ensure_orders_update_policy.sql`**
  - Copy its contents, paste in a new query, and run it.
- **Then:** Use admin-orders only when **logged in** as admin (bragabazaar@gmail.com). The page will redirect to login if you are not. Logged-in admin uses the `authenticated` role, which the policy allows to UPDATE orders.

**User side:** Customers see status in **As minhas encomendas** (orders.html). Orders are loaded from Supabase by **phone** and **email** (from the saved profile). If the profile phone/email does not match the order’s, that order will not appear. After you run the RLS policy above and update status as admin, customers will see the new status when they **refresh** "As minhas encomendas".

---

## 2. Email when status changes (Shipped / Delivered)

When admin clicks **Shipped** or **Delivered** in the admin panel, the app calls the Edge Function `send-order-status-email`, which emails the customer (if the order has an email and Resend is configured).

**Setup:**

1. **Deploy the Edge Function**
   ```bash
   supabase functions deploy send-order-status-email
   ```

2. **Set secrets in Supabase Dashboard** (Project → Edge Functions → send-order-status-email → Secrets):
   - `RESEND_API_KEY` – your [Resend](https://resend.com) API key.
   - `FROM_EMAIL` (optional) – e.g. `Braga Bazaar <orders@yourdomain.com>`. Defaults to Resend’s onboarding address if not set.
   - `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_URL` are usually set automatically for Edge Functions.

3. **Verify Resend**
   - In Resend, add and verify your domain (or use their test domain for development).
   - If `RESEND_API_KEY` is not set, the function skips sending and returns `ok: true, skipped: true` so admin still sees “Order updated”.

After this, when you set an order to Shipped or Delivered, the customer receives an email and the order tracker in “As minhas encomendas” shows the green truck and green progress line.
