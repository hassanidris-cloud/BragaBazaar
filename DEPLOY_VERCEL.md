# Deploy Braga Bazaar to Vercel

## Option 1: Vercel Dashboard (recommended)

1. Go to [vercel.com](https://vercel.com) and sign in.
2. Click **Add New** → **Project**.
3. Import your Git repository (GitHub, GitLab, or Bitbucket). If the repo is not connected, connect it first.
4. **Root Directory:** leave as `.` (or set to the folder that contains `index.html`).
5. **Framework Preset:** leave as **Other** (static site).
6. **Build Command:** leave empty.
7. **Output Directory:** leave as `.` or leave empty.
8. Click **Deploy**.

Your site will be live at `https://your-project.vercel.app`.

## Option 2: Vercel CLI

1. Install the CLI: `npm i -g vercel`
2. In the project folder (where `index.html` is), run:
   ```bash
   vercel
   ```
3. Log in if asked, then follow the prompts. Link to an existing project (e.g. with project ID `prj_p8c5OfWaRe5dsHea2ucEP4fCdd5B`) when asked, or create a new one.
4. To deploy to production: `vercel --prod`

## After deployment

- Your site will be served over **HTTPS** (required for Supabase auth and a good PWA experience).
- Update **Supabase**: in your Supabase project, go to **Authentication** → **URL Configuration** and add your Vercel URL (e.g. `https://braga-bazaar.vercel.app`) to **Redirect URLs** and **Site URL** so login/signup and redirects work correctly.
