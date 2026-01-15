# How to Find Root Directory in Railway

## Step-by-Step Guide:

### Step 1: Go to Your Service (Not Project Settings)
1. In Railway dashboard, you should see your **service** listed (e.g., "instagram-automation-server")
2. **Click directly on the service name/card** (not on "Settings" at the top)
3. This takes you to the **service view**, not the project view

### Step 2: Find Service Settings
Once you're in the service view:
1. Look for tabs: **"Deployments"**, **"Metrics"**, **"Logs"**, **"Settings"**
2. Click on **"Settings"** tab
3. Now you should see **service-specific settings**

### Step 3: Look for Root Directory
In the service Settings, scroll down and look for:
- **"Root Directory"** or
- **"Working Directory"** or  
- **"Source"** section

It might be under:
- **"Source"** section, or
- **"Build"** section, or
- **"Deploy"** section

### Alternative: Check Service Configuration
If you still don't see it:

1. Go back to **"Architecture"** tab
2. Click on your service card
3. Look for a **gear icon** or **"Configure"** button
4. Or click the **three dots** menu on the service card
5. Select **"Settings"** or **"Configure"**

### What to Look For:
The Root Directory field should:
- Be a text input field
- Currently show: `.` or empty or `/`
- You need to change it to: `server`

### If You Still Can't Find It:
Railway might have updated their UI. Try:
1. Click on the service in the Architecture view
2. Look for any configuration/gear icon
3. Or check if there's a "Variables" tab - sometimes it's there
4. Or Railway might auto-detect it from the `render.yaml` file

### Quick Fix: Use render.yaml
Since we have `render.yaml` with `rootDir: server`, Railway should pick it up automatically. If not, you might need to:
1. Make sure Railway is reading the `render.yaml` file
2. Or manually set it in the service configuration
