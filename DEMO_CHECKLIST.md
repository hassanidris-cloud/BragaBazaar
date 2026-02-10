# Demo checklist (Vercel + Supabase)

Use this before showing the site to your client.

---

## 1. Supabase tables

In **Supabase Dashboard → Table Editor**, ensure these tables exist with the right columns.

### `products`
Columns used by the app: `id`, `name`, `price`, `stock_level`, `category`, `image_url`, `on_sale`, `old_price`.

- If you use **UUID** for `id`: ensure `id` has a default (e.g. `gen_random_uuid()`).
- Add at least one product so the homepage has something to show.

### `orders`
Columns used by checkout: `client_order_id`, `full_name`, `phone`, `email`, `address`, `postal`, `city`, `location`, `country`, `payment`, `instructions`, `total`, `status`.  
Also: `created_at` (optional; admin uses it for sorting).

- If your table uses `id SERIAL`, the app will work. If `id UUID`, ensure the insert returns `id` (e.g. `.select()` after insert) so `order_items` can use it.

### `order_items`
Columns: `order_id`, `name`, `price`, `qty`.

- `order_id` must match the `orders.id` type (integer or UUID).

### RLS (Row Level Security)
- For a demo, you can disable RLS on these tables, or add policies that allow anon to SELECT/INSERT/UPDATE as needed. If the anon key can’t read/write, the app will fall back to localStorage (orders) or show “could not load products”.

---

## 2. Supabase Auth URL (after Vercel deploy)

1. Deploy the site on Vercel and note the URL (e.g. `https://braga-bazaar.vercel.app`).
2. In **Supabase Dashboard → Authentication → URL Configuration**:
   - **Site URL:** set to your Vercel URL.
   - **Redirect URLs:** add `https://your-vercel-url.vercel.app/**` (and `http://localhost:*` if you test locally).
3. Save. Otherwise login/signup may fail on the live site.

---

## 3. Admin user

- Your admin email is in **`supabaseConfig.js`** → `ADMIN_EMAILS` (e.g. `bragabazaar@gmail.com`).
- Log in with that email to reach the admin page after login.

---

## 4. Quick test flow (before the demo)

1. **Homepage:** Open the Vercel URL. Products load from Supabase (or you see an error message).
2. **Search:** Type in the search bar; product list filters.
3. **Categories:** Open sidebar, click a category; products filter by category.
4. **Add to cart:** Click “Adicionar” on a product. Cart total updates. Click cart icon → cart overlay with items. Change qty or remove. “Proceed to checkout” opens login/signup modal if not logged in.
5. **Signup:** Create a new account; you should be redirected to checkout with form prefilled.
6. **Checkout:** Fill any missing fields, choose payment, submit. You should see “Pedido confirmado” and be redirected to the homepage; cart is empty.
7. **Admin:** Log in with the admin email. You should land on the admin page. Orders list shows the order; you can mark it “completed”. Products list shows products; you can add/edit and set stock.
8. **Other pages:** Footer links (Contact, Delivery, FAQ, Orders, Account, Wishlist, Privacy, Terms), wishlist hearts on products, back-to-top, quick-view modal.

---

## 5. If something breaks

- **Products not loading:** Check Supabase table name (`products`), columns, and RLS. Check browser console for errors.
- **Login/signup fails on Vercel:** Add the Vercel URL to Supabase Redirect URLs and Site URL (step 2).
- **Orders not in admin:** Check `orders` and `order_items` table names and columns; check browser console on checkout and on admin load.
- **Admin page blank:** Open the site over HTTPS (Vercel), not `file://`. Ensure you’re logged in with an email in `ADMIN_EMAILS`.
