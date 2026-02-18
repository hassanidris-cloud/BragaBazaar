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

The app does **not** send emails automatically when you change an order’s status. To add that, you need a small backend that runs when status is updated and sends an email.

**Options:**

1. **Supabase Edge Function + Resend (or SendGrid)**  
   - Create an Edge Function that accepts `order_id` and `new_status`.  
   - Look up the order (and customer email) in the `orders` table.  
   - Call Resend/SendGrid to send “Your order has been shipped” or “Your order has been delivered”.  
   - Call this function from your admin page **after** a successful status update (e.g. from admin-orders.html after `supabase.from('orders').update(...)` succeeds).

2. **Supabase Database Webhooks**  
   - In Supabase Dashboard: Database → Webhooks.  
   - Create a webhook on `orders` table, event **Update**, so it fires when a row (e.g. `status`) changes.  
   - Point the webhook to a serverless function (e.g. Vercel serverless or another endpoint) that reads the updated order and sends the email via Resend/SendGrid.

3. **Third-party (e.g. Zapier)**  
   - Connect Supabase to Zapier and trigger an email when `orders` is updated.

Once one of these is in place, customers can receive an email when you set status to Shipped or Delivered; the in-app status in "As minhas encomendas" will already be correct after you run the RLS migration and refresh.
