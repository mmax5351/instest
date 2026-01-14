# Deployment Alternatives for Playwright

## Issue with Render Free Tier

Render's free tier has limitations with Playwright because:
- Limited system dependencies
- Browser installation can fail
- Resource constraints

## Alternative Solutions

### Option 1: Railway (Recommended for Playwright)

Railway has better support for Playwright:

1. **Go to**: https://railway.app
2. **Sign up** with GitHub (free tier available)
3. **New Project** → Deploy from GitHub
4. **Select repo**: `Tejas1252/instest`
5. **Settings**:
   - Root Directory: `server`
   - Build Command: `npm install && npx playwright install chromium`
   - Start Command: `npm start`
6. **Environment Variables**:
   - `NODE_ENV` = `production`
   - `PORT` = (Railway auto-assigns, check after deploy)

Railway's free tier is more lenient with Playwright.

---

### Option 2: Fly.io (Good for Playwright)

1. **Install Fly CLI**: 
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login**: 
   ```bash
   fly auth login
   ```

3. **Create app**:
   ```bash
   cd server
   fly launch
   ```

4. **Deploy**:
   ```bash
   fly deploy
   ```

---

### Option 3: Use ngrok for Local Development

If deployment is too complex, use ngrok to expose your local server:

1. **Install ngrok**: https://ngrok.com/download
2. **Run your server locally**: `npm run server`
3. **In another terminal**: `ngrok http 3001`
4. **Copy the ngrok URL** (e.g., `https://abc123.ngrok.io`)
5. **Update React app `.env`**:
   ```
   REACT_APP_API_URL=https://abc123.ngrok.io
   ```

This works for testing but requires your computer to be on.

---

### Option 4: VPS (Best for Production)

For reliable production use, consider a VPS:

**DigitalOcean Droplet** ($5/month):
1. Create Ubuntu droplet
2. SSH into server
3. Install Node.js and dependencies
4. Clone repo and run server
5. Use PM2 to keep it running

**AWS EC2** (Free tier available):
- Similar setup to DigitalOcean

---

## Current Status

The code is pushed to GitHub. Try Railway first as it has better Playwright support than Render's free tier.
