# How to Expose Your Railway Service

## The Problem
Your service shows "Unexposed service" which means it doesn't have a public URL yet.

## Solution: Generate a Public Domain

### Steps:

1. **Go to Settings tab** in your Railway service
2. **Click on "Networking"** in the right sidebar (or find Networking section)
3. **Click the "Generate Domain" button** (purple button with lightning icon)
4. Railway will create a public URL like: `https://your-service-name.up.railway.app`
5. **Copy this new URL**

### Alternative: If you don't see Generate Domain

1. In the **Settings** tab, look for **"Networking"** section
2. Under "Public Networking", click **"Generate Domain"**
3. Or look for **"Public Domain"** option

### After Generating Domain:

1. **Test the server:**
   - Visit: `https://your-new-url.up.railway.app/health`
   - Should see: `{"status":"ok","message":"Server is running"}`

2. **Update your `.env` file:**
   ```env
   REACT_APP_API_URL=https://your-new-url.up.railway.app
   ```

3. **Restart your React app:**
   ```bash
   npm start
   ```

## Quick Test Commands:

After exposing, test with:
```bash
# Health check
curl https://your-url.up.railway.app/health

# Root endpoint
curl https://your-url.up.railway.app/
```

Both should return JSON, not HTML!
