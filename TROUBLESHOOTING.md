# Troubleshooting: Session Not Found Error

## Problem
Getting `404 (Not Found)` or `{success: false, error: 'Session not found'}` when calling the API.

## Common Causes & Solutions

### 1. Using Old/Invalid Session ID

**Problem:** The session ID you're using doesn't exist on the server.

**Solution:**
1. **Click the login button** in your React app
2. **Check the browser console** - you'll see:
   ```
   Session created: session_1234567890_abc123
   To control from anywhere, call: POST ...
   ```
3. **Copy the session ID** from the console (it will look like `session_1234567890_abc123`)
4. **Use that exact session ID** in your API call

**Example:**
```javascript
// First, click login in your app to get a fresh session ID
// Then use it:
fetch('https://instest-production.up.railway.app/api/set-state', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    sessionId: 'session_1234567890_abc123', // Use the REAL session ID from console
    command: 'incorrectCredentials'
  })
}).then(r=>r.json()).then(console.log);
```

### 2. Railway Server Not Running

**Problem:** The Railway server might be down or not deployed correctly.

**Check:**
1. Visit: `https://instest-production.up.railway.app/health`
2. Should return: `{"status":"ok","message":"Server is running"}`
3. If you get an error, the server is not running

**Solution:**
1. Go to Railway dashboard: https://railway.app
2. Check if your service is running
3. Check the logs for errors
4. Redeploy if needed

### 3. Wrong API URL

**Problem:** The React app might be using the wrong API URL.

**Check:**
1. Open browser console in your React app
2. Look for: `Starting to poll for sessionId: ...`
3. Check what URL it's using

**Solution:**
Make sure your React app has the correct `REACT_APP_API_URL`:
- In Vercel/Netlify: Set environment variable `REACT_APP_API_URL` = `https://instest-production.up.railway.app`
- Locally: Create `.env` file with `REACT_APP_API_URL=https://instest-production.up.railway.app`

### 4. Session Expired

**Problem:** Sessions expire after 1 hour of inactivity.

**Solution:**
- Click login again to create a new session
- Use the new session ID immediately

### 5. CORS Issues

**Problem:** Browser blocking the request.

**Check:**
- Open browser console
- Look for CORS errors (red messages)

**Solution:**
The server already has CORS configured. If you see CORS errors, check Railway logs.

---

## Step-by-Step Debugging

### Step 1: Verify Server is Running
```bash
curl https://instest-production.up.railway.app/health
```
Should return: `{"status":"ok","message":"Server is running"}`

### Step 2: Create a Session
1. Open your React app
2. Click login button
3. Check console for session ID

### Step 3: Test Get State
```javascript
// Replace with your actual session ID
fetch('https://instest-production.up.railway.app/api/get-state/session_1234567890_abc123')
  .then(r=>r.json())
  .then(console.log);
```
Should return: `{success: true, state: "waiting", ...}`

### Step 4: Set State
```javascript
// Replace with your actual session ID
fetch('https://instest-production.up.railway.app/api/set-state', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    sessionId: 'session_1234567890_abc123', // Use real session ID
    command: 'incorrectCredentials'
  })
}).then(r=>r.json()).then(console.log);
```

---

## Quick Test Script

Run this in your browser console **after clicking login**:

```javascript
// This will automatically get the session ID from the console logs
// Or manually replace SESSION_ID_HERE with the one from console

const SESSION_ID = 'SESSION_ID_HERE'; // Replace this!

// Test 1: Get state
fetch(`https://instest-production.up.railway.app/api/get-state/${SESSION_ID}`)
  .then(r=>r.json())
  .then(data => {
    console.log('Current state:', data);
    
    // Test 2: Set state
    if (data.success) {
      return fetch('https://instest-production.up.railway.app/api/set-state', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          sessionId: SESSION_ID,
          command: 'incorrectCredentials'
        })
      });
    }
  })
  .then(r=>r.json())
  .then(console.log)
  .catch(console.error);
```

---

## Still Not Working?

1. **Check Railway Logs:**
   - Go to Railway dashboard
   - Click on your service
   - Check "Logs" tab
   - Look for errors

2. **Check Browser Console:**
   - Open DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

3. **Verify Environment Variables:**
   - Make sure `REACT_APP_API_URL` is set correctly
   - Rebuild/redeploy if you changed it

4. **Test Locally:**
   - Run server locally: `cd server && npm start`
   - Update `.env`: `REACT_APP_API_URL=http://localhost:3001`
   - Test if it works locally first
