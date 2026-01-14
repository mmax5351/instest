const express = require('express');
const cors = require('cors');
const { automateInstagramLogin } = require('./playwright-automation');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/automate-login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      error: 'Username and password are required' 
    });
  }
  
  try {
    console.log('Starting Instagram automation...');
    const result = await automateInstagramLogin(username, password);
    res.json(result);
  } catch (error) {
    console.error('Automation error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to automate login' 
    });
  }
});

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Automation server running on ${HOST}:${PORT}`);
});
