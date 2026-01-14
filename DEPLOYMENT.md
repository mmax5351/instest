# Free Deployment Guide

## Option 1: Render (Recommended - Easiest)

### Steps:

1. **Create a GitHub repository** (if you haven't already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Sign up for Render**:
   - Go to https://render.com
   - Sign up with GitHub (free)

3. **Create a new Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Use these settings:
     - **Name**: instagram-automation-server
     - **Environment**: Node
     - **Build Command**: `npm install && npx playwright install chromium --with-deps`
     - **Start Command**: `node server/index.js`
     - **Plan**: Free

4. **Add Environment Variables** (in Render dashboard):
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (Render uses port 10000)

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment (first time takes ~5-10 minutes)

6. **Get your server URL**:
   - After deployment, you'll get a URL like: `https://instagram-automation-server.onrender.com`
   - Copy this URL

7. **Update your React app**:
   - Create a `.env` file in your React app root:
     ```
     REACT_APP_API_URL=https://instagram-automation-server.onrender.com
     ```
   - Restart your React app

---

## Option 2: Railway (Alternative)

1. **Sign up**: https://railway.app (free tier available)

2. **Create new project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository

3. **Configure**:
   - Railway auto-detects Node.js
   - Add environment variable: `PORT` = `3000` (or let Railway auto-assign)

4. **Deploy**:
   - Railway will automatically deploy
   - Get your URL from the dashboard

5. **Update React app**:
   - Use the Railway URL in your `.env` file

---

## Option 3: Fly.io (Another option)

1. **Install Fly CLI**: `curl -L https://fly.io/install.sh | sh`

2. **Login**: `fly auth login`

3. **Create app**: `fly launch`

4. **Deploy**: `fly deploy`

---

## Important Notes:

- **Free tiers have limitations**:
  - Render: Service spins down after 15 minutes of inactivity (takes ~30 seconds to wake up)
  - Railway: Limited hours per month
  - Fly.io: Limited resources

- **For production**, consider:
  - Upgrading to a paid plan
  - Using a VPS (DigitalOcean, AWS EC2) - costs ~$5/month

- **Playwright requirements**:
  - Make sure `playwright install chromium --with-deps` runs during build
  - Some free tiers may have issues with Playwright dependencies

---

## Quick Start (Render):

1. Push code to GitHub
2. Sign up at render.com
3. Connect GitHub repo
4. Use build command: `npm install && npx playwright install chromium --with-deps`
5. Use start command: `node server/index.js`
6. Deploy and get URL
7. Update React app `.env` with the URL
