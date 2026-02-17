# Files to send so someone can run the full website

Send these so the other person can **see the whole site and use all features** (shop, cart, checkout, login, signup, account, orders).

---

## 1. Essential files and folders (minimum)

| What | Why |
|------|-----|
| **All `.html`** in the project root | Every page: index, checkout, login, signup, account, orders, category, contact, delivery, faq, privacy, terms, wishlist, etc. |
| **`style.css`** | Main styles |
| **`global.css`** | Global/header/cart styles |
| **`supabaseConfig.js`** | Supabase URL + anon key; **required** for login, signup, products, orders |
| **`js/`** folder (e.g. `location.js`) | Any script used by the HTML pages |
| **`assets/`** (if present) | Images, favicon, icons (e.g. `favicon.png`, `icon.png`, `strawberries.jpg`) |
| **`manifest.webmanifest`** | PWA/manifest if you use it |
| **`vercel.json`** | Only if they will deploy on Vercel |
| **`package.json`** | Needed if they deploy (e.g. Vercel uses it for `api/` and deps) |
| **`api/`** folder | Serverless route `/api/admin-orders`; optional unless they need that API |

So in practice, send the **whole project folder** minus:

- `.git/` (optional: include it if you want them to have git history)
- `node_modules/` (they run `npm install` if deploying)
- `.env*` (do **not** send; they use their own or your Supabase keys via instructions)

---

## 2. What they need for “all functions” to work

The site talks to **Supabase** for:

- **Auth** – login, signup, sign out  
- **Data** – products, orders, order_items  

So either:

- **Option A – Use your Supabase project**  
  Leave `supabaseConfig.js` as is (your URL + anon key). They’ll see your data and use your auth. No extra setup.

- **Option B – Use their own Supabase project**  
  1. They create a project at [supabase.com](https://supabase.com).  
  2. They replace the URL and anon key in `supabaseConfig.js` with theirs.  
  3. They run your SQL migrations in Supabase (e.g. `supabase/migrations/*.sql`, `create_orders_tables_from_scratch.sql`, `fix_orders_rls_anon_insert.sql`, products setup if you have it) so tables and RLS exist.

---

## 3. How they can run it

- **Local:** Open `index.html` in a browser, or run a small static server (e.g. `npx serve .`).  
- **Deploy:** Push to Vercel/Netlify (or similar). If they use Vercel and need `/api/admin-orders`, set env vars: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.

---

## 4. Quick checklist for “send everything for the website”

- [ ] All root **.html** files  
- [ ] **style.css**, **global.css**  
- [ ] **supabaseConfig.js**  
- [ ] **js/** (e.g. location.js)  
- [ ] **assets/** (images, favicon)  
- [ ] **api/** (if they need the admin-orders API)  
- [ ] **package.json** (and they run `npm install` when deploying)  
- [ ] **vercel.json** (if deploying on Vercel)  
- [ ] **supabase/migrations/** (and optionally other SQL) so they can set up their own DB if needed  

Easiest: send the **entire repo as a zip** (excluding `node_modules` and `.env*`); they have everything. If they use your Supabase, they don’t need to run any SQL.
