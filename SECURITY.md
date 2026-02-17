# ENV variable protection

- **Frontend (browser):** Only the **anon (public) key** must be used. It is set in `supabaseConfig.js`. Never put the `service_role` key in any HTML/JS that runs in the browser.
- **Backend (Vercel `/api/*`):** The `service_role` key may be used only in server-side code, via environment variables (e.g. `SUPABASE_SERVICE_ROLE_KEY`). It must never be committed or sent to the client.
- If the `service_role` key has been exposed in frontend code or in a public repo, **rotate it immediately** in Supabase Dashboard → Project Settings → API.
