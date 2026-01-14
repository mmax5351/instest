# Quick Free Deployment Guide

## 🚀 Deploy to Render (Free) - Step by Step

### 1. Push Your Code to GitHub

```bash
# If you haven't already
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Deploy on Render

1. **Go to**: https://render.com
2. **Sign up** with GitHub (free)
3. **Click**: "New +" → "Web Service"
4. **Connect** your GitHub repository
5. **Configure**:
   - **Name**: `instagram-automation-server` (or any name)
   - **Environment**: `Node`
   - **Build Command**: 
     ```
     npm install && npx playwright install chromium --with-deps
     ```
   - **Start Command**: 
     ```
     node server/index.js
     ```
   - **Plan**: `Free`
6. **Add Environment Variables**:
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (Render uses this port)
7. **Click**: "Create Web Service"
8. **Wait**: First deployment takes 5-10 minutes

### 3. Get Your Server URL

After deployment, Render will give you a URL like:
```
https://instagram-automation-server.onrender.com
```

**Copy this URL!**

### 4. Update Your React App

1. **Create** a `.env` file in your React app root:
   ```env
   REACT_APP_API_URL=https://instagram-automation-server.onrender.com
   ```

2. **Restart** your React app:
   ```bash
   npm start
   ```

### 5. Test It!

Try logging in from your device - it should now work! 🎉

---

## ⚠️ Important Notes

### Free Tier Limitations:

- **Render Free Tier**:
  - Service spins down after 15 minutes of inactivity
  - First request after spin-down takes ~30 seconds (wake-up time)
  - 750 hours/month free (enough for most use cases)

### If You Need Always-On:

Consider upgrading to **Render Starter** ($7/month) for:
- Always-on service (no spin-down)
- Faster response times
- More resources

---

## 🔧 Troubleshooting

### Server Not Responding?
- Check Render logs: Dashboard → Your Service → Logs
- Make sure Playwright installed: Check build logs for errors
- Verify environment variables are set correctly

### Playwright Installation Fails?
- Render free tier should work, but if it fails:
  - Try Railway (alternative free option)
  - Or use a VPS (DigitalOcean, AWS EC2) - costs ~$5/month

### CORS Errors?
- The server already has CORS enabled
- Make sure your React app uses the correct API URL

---

## 📱 Alternative: Railway (Also Free)

1. Go to: https://railway.app
2. Sign up with GitHub
3. New Project → Deploy from GitHub
4. Railway auto-detects Node.js
5. Get your URL and update `.env` file

---

## 🎯 Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Web service created with correct build/start commands
- [ ] Environment variables set (NODE_ENV, PORT)
- [ ] Deployment successful
- [ ] Server URL copied
- [ ] `.env` file created in React app
- [ ] React app restarted
- [ ] Tested from device

Done! Your automation server is now live and accessible from anywhere! 🚀
