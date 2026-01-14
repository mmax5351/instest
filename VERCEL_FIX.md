# Fix Vercel Deployment Error

## The Problem
Vercel is trying to run your `server/` directory as a serverless function, which causes a crash because it contains Playwright (which needs a full OS environment).

## The Solution
Vercel should only deploy the **React app** (static files), not the server code.

## Steps to Fix:

### 1. Update Vercel Project Settings

1. Go to your Vercel project dashboard
2. Click **Settings** → **General**
3. Scroll to **Root Directory**
4. Make sure it's set to **`./`** (root) - NOT `server/`

### 2. Verify Build Settings

In Vercel Settings → **Build & Development Settings**:

- **Framework Preset**: `Create React App`
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install` (or leave empty)

### 3. Add Environment Variable

In Vercel Settings → **Environment Variables**:

- **Name**: `REACT_APP_API_URL`
- **Value**: Your Railway server URL (e.g., `https://instagram-automation-server-production.up.railway.app`)
- **Environments**: Check all (Production, Preview, Development)

### 4. Redeploy

1. Go to **Deployments** tab
2. Click the **three dots** (⋯) on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger redeploy

### 5. Alternative: Delete and Recreate Project

If it still doesn't work:

1. Delete the current Vercel project
2. Create a new project
3. Import the same GitHub repo
4. **Important**: Make sure Root Directory is `./` (NOT `server/`)
5. Configure as above
6. Deploy

---

## Why This Happens

Vercel auto-detects:
- `server/` directory → Tries to run as serverless function ❌
- `package.json` with Express → Tries to create API routes ❌

But we only want:
- Static React app build ✅
- No serverless functions ✅

The `.vercelignore` file and updated `vercel.json` should prevent this.
