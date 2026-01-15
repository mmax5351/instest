# Running from Your Real Device - Setup Guide

## Step 1: Get Your Railway Server URL

1. Go to Railway dashboard: https://railway.app
2. Click on your service: `instagram-automation-server`
3. Go to the **Settings** tab
4. Find **Public Domain** or **Generate Domain**
5. Copy the URL (e.g., `https://instagram-automation-server-production.up.railway.app`)

## Step 2: Update .env File

1. Open the `.env` file in your project root
2. Replace `YOUR_RAILWAY_URL_HERE` with your actual Railway URL:
   ```
   REACT_APP_API_URL=https://instagram-automation-server-production.up.railway.app
   ```
3. Save the file

## Step 3: Run React App and Access from Device

### Option A: Same Wi-Fi Network (Easiest)

1. **Find your computer's local IP address:**
   - Mac: System Settings → Network → Wi-Fi → IP Address
   - Or run: `ifconfig | grep "inet " | grep -v 127.0.0.1`
   - Example: `192.168.1.100`

2. **Start React app:**
   ```bash
   npm start
   ```

3. **On your device:**
   - Make sure your device is on the **same Wi-Fi network**
   - Open browser and go to: `http://YOUR_LOCAL_IP:3000`
   - Example: `http://192.168.1.100:3000`

### Option B: Deploy React App Too (Best for Production)

Deploy your React app to a free hosting service:

**Option B1: Vercel (Recommended for React)**
1. Go to https://vercel.com
2. Sign up with GitHub
3. Import your repository: `Tejas1252/instest`
4. Configure:
   - Framework Preset: `Create React App`
   - Root Directory: `./` (root)
   - Build Command: `npm run build`
   - Output Directory: `build`
5. Add Environment Variable:
   - `REACT_APP_API_URL` = Your Railway server URL
6. Deploy!

**Option B2: Netlify**
1. Go to https://netlify.com
2. Sign up with GitHub
3. New site from Git → Select your repo
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
5. Add Environment Variable:
   - `REACT_APP_API_URL` = Your Railway server URL
6. Deploy!

**Option B3: Railway (Same Platform)**
1. In Railway, create a **new service**
2. Connect same repo: `Tejas1252/instest`
3. Settings:
   - Root Directory: `./` (root, not server)
   - Build Command: `npm install && npm run build`
   - Start Command: `npx serve -s build -l 3000`
4. Add Environment Variable:
   - `REACT_APP_API_URL` = Your Railway server URL
5. Deploy!

### Option C: Use ngrok (Quick Testing)

1. **Install ngrok**: https://ngrok.com/download

2. **Start React app:**
   ```bash
   npm start
   ```

3. **In another terminal, run ngrok:**
   ```bash
   ngrok http 3000
   ```

4. **Copy the ngrok URL** (e.g., `https://abc123.ngrok.io`)

5. **Access from your device:**
   - Open the ngrok URL on your device's browser
   - Works from anywhere!

## Quick Checklist

- [ ] Got Railway server URL
- [ ] Updated `.env` file with Railway URL
- [ ] Chose access method (local network / deploy / ngrok)
- [ ] Started React app (`npm start`)
- [ ] Accessed from device
- [ ] Tested login functionality

## Troubleshooting

**Can't connect from device?**
- Make sure both devices are on same Wi-Fi (for local network)
- Check firewall isn't blocking port 3000
- Try using ngrok instead

**API calls failing?**
- Verify Railway server is online (check Railway dashboard)
- Check `.env` file has correct URL
- Restart React app after changing `.env`

**CORS errors?**
- Server already has CORS enabled
- Make sure API URL in `.env` matches Railway URL exactly
