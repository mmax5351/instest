# Deploy React App to Vercel (Free) - Get Real URL

## Why Deploy React App?

Currently, your React app runs on `localhost:3000` which only works on your computer. To use it on a real device, you need a public URL.

## Step-by-Step: Deploy to Vercel

### 1. Make Sure Your Code is on GitHub

Your code is already on GitHub at: `https://github.com/Tejas1252/instest.git`

### 2. Deploy to Vercel

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** with GitHub (free)
3. **Click "Add New..." → "Project"**
4. **Import your repository**: `Tejas1252/instest`
5. **Configure Project**:
   - **Framework Preset**: `Create React App` (auto-detected)
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `build` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

6. **Add Environment Variable**:
   - Click "Environment Variables"
   - Add:
     - **Name**: `REACT_APP_API_URL`
     - **Value**: Your Railway server URL (e.g., `https://instagram-automation-server-production.up.railway.app`)
     - **Environment**: Production, Preview, Development (check all)

7. **Click "Deploy"**
8. **Wait 2-3 minutes** for deployment

### 3. Get Your React App URL

After deployment, Vercel will give you a URL like:
```
https://instest.vercel.app
```

**This is your real URL!** You can use this on any device, anywhere.

### 4. Test on Your Device

1. Open the Vercel URL on your device: `https://instest.vercel.app`
2. Try logging in - it should work!

---

## Alternative: Deploy to Netlify

If you prefer Netlify:

1. **Go to**: https://netlify.com
2. **Sign up** with GitHub
3. **New site from Git** → Select `Tejas1252/instest`
4. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `build`
5. **Add Environment Variable**:
   - `REACT_APP_API_URL` = Your Railway server URL
6. **Deploy**

You'll get a URL like: `https://instest.netlify.app`

---

## Update Your Railway Server URL

Make sure your Railway server is running and get its URL:

1. Go to Railway dashboard
2. Click on your service
3. Go to Settings → Domains
4. Copy the public domain URL
5. Use this URL in the `REACT_APP_API_URL` environment variable

---

## That's It!

Once deployed, you'll have:
- ✅ React App: `https://instest.vercel.app` (or Netlify URL)
- ✅ Backend Server: `https://your-server.railway.app`
- ✅ Works on any device, anywhere!
