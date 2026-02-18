# Multi-user: many users, own signups, own orders, admin sees all

The site is built so that **many users can use it at the same time**, each with their **own signup**, **own orders**, and **all orders are stored and shown in the admin panel**.

---

## How it works

### 1. Many users at the same time
- The app is **stateless**: each request (signup, login, checkout) talks to **Supabase** (auth + database). There is no single “session” store that would limit concurrency.
- **Supabase** handles many simultaneous signups, logins, and order inserts. Each user’s data is separate.

### 2. Own signups
- **Signup** (`signup.html`): each call to `supabase.auth.signUp({ email, password, options: { data: { ...user } } })` creates a **new auth user** and stores profile data in `user_metadata`. No limit on number of users.
- Each user has their own **email/password** and optional profile (name, phone, address) saved in Supabase and in **localStorage** (`bragaBazaarUser`) on their device.

### 3. Placing orders by themselves
- **Checkout** (`checkout.html`): each order is one **new row** in the `orders` table, with that request’s `full_name`, `phone`, `email`, address, items, total, etc.
- **No “current user” is required** to place an order: both **guest** (anon) and **logged-in** (authenticated) users can insert. So many people can place orders at the same time; each insert is independent.
- **RLS** (Row Level Security): policies `anon_insert_orders` and `authenticated_insert_orders` allow inserts from the browser. Run `supabase/migrations/fix_orders_rls_anon_insert.sql` in Supabase if you haven’t already.

### 4. Orders are recorded
- Every successful checkout does:
  - `supabase.from('orders').insert([{ ... }]).select('id').single()`
  - `supabase.from('order_items').insert([...])` for each line item
- All orders are stored in **Supabase** (and optionally in **localStorage** as backup). They are **not** tied to a single user id; they are tied to the **customer’s phone/email** on the order so they can be shown in “My orders”.

### 5. Shown on admin panel
- **Admin** (`admin.html` and `admin-orders.html`):
  - Load orders with:  
    `supabase.from('orders').select('*').order('created_at', { ascending: false })`
  - There is **no filter** by user or customer: the admin sees **all orders** from **all customers**.
- **RLS**: policies `authenticated_select_orders` and `anon_select_orders` use `USING (true)`, so when the admin is logged in (authenticated), they can **select all rows** in `orders`. So every order placed by any user is visible in the admin panel.

### 6. Customers see only their orders
- **Order history** (`orders.html`): orders are loaded with a filter by the **current user’s phone/email** (from profile/localStorage). So each customer sees only **their** orders; the admin sees **everyone’s** orders.

---

## Checklist (if something doesn’t work)

- [ ] **RLS migrations applied** in Supabase (SQL Editor):  
  `fix_orders_rls_anon_insert.sql` and `ensure_orders_update_policy.sql`  
  so that anon/authenticated can INSERT and SELECT orders, and authenticated can UPDATE.
- [ ] **Admin is logged in** when opening admin or admin-orders (so Supabase uses the `authenticated` role and RLS allows select/update).
- [ ] **No extra filter** in admin: the code uses `.select('*')` with no `.eq('user_id', ...)` or similar, so all orders are shown.

Once RLS is set correctly and admin is logged in, the site supports many concurrent users, each with their own signup and orders, and all orders are recorded and visible in the admin panel.
