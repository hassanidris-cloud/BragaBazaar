# Order insert troubleshooting

## 1. Same Supabase project?

- **Frontend (checkout):** uses `supabaseConfig.js` → URL is **hardcoded** there.
- **Vercel API** (`/api/admin-orders.js`): uses env vars `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

**Check:** The URL in `supabaseConfig.js` must match `NEXT_PUBLIC_SUPABASE_URL` in Vercel (Settings → Environment Variables). Same project = same URL.

Current URL in this repo: `https://mfebgreczlxoqkiabsln.supabase.co`

---

## 2. DevTools → Network

1. Open DevTools (F12) → **Network**.
2. Place an order from the checkout page.
3. Find the request: **POST** to `.../rest/v1/orders` (Supabase PostgREST).

**Response meaning:**

| Status | Likely cause |
|--------|----------------|
| **401 / 403** | RLS or policy: anon key not allowed to insert, or policy missing. |
| **400** | Schema/type mismatch. Very common: `client_order_id` type (e.g. table expects integer, app sends number from `Date.now()`). Check column types in Supabase → Table Editor → `orders`. |
| **201** | Insert succeeded. |

---

## 3. Supabase Logs

- **Supabase Dashboard** → **Logs** (or Logs Explorer).
- Filter for **rest** and **orders** to see the exact request/response and any DB errors.

---

## Quick checklist

- [ ] `supabaseConfig.js` URL = `NEXT_PUBLIC_SUPABASE_URL` on Vercel.
- [ ] In Network tab, confirm POST goes to `https://mfebgreczlxoqkiabsln.supabase.co/rest/v1/orders`.
- [ ] If 401/403 → RLS: ensure policy allows `INSERT` for `anon` on `orders` (e.g. "Allow anon insert orders").
- [ ] If 400 → compare payload types to `orders` columns (especially `client_order_id`: BIGINT vs number from `order.id`).
