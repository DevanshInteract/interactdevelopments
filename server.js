// Discord OAuth Backend Server
// Install dependencies: npm install express cors dotenv axios

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for your frontend domain
app.use(cors({
  origin: ['https://interactdevelopments.me', 'http://localhost'],
  credentials: true
}));

app.use(express.json());

// In-memory OTP store. Replace with a persistent store in production.
const otpStore = new Map(); // key: email, value: { code, expiresAt, attempts }

function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// Send OTP endpoint
app.post('/api/send-otp', (req, res) => {
  const { email } = req.body || {};
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  const now = Date.now();
  const existing = otpStore.get(email);
  // Basic rate limiting: deny if previous code still valid for >30s to avoid spamming
  if (existing && existing.expiresAt - now > 120000) {
    return res.status(429).json({ error: 'Too many requests. Please wait before requesting another code.' });
  }

  const code = generateOtpCode();
  const expiresAt = now + 5 * 60 * 1000; // 5 minutes
  otpStore.set(email, { code, expiresAt, attempts: 0 });

  // TODO: Integrate real email/SMS provider here (e.g., nodemailer, SendGrid, Twilio)
  // For now, we log the OTP to the server console for testing.
  console.log(`OTP for ${email}: ${code} (expires in 5 minutes)`);

  return res.json({ success: true, message: 'OTP sent. Please check your email.' });
});

// Verify OTP endpoint
app.post('/api/verify-otp', (req, res) => {
  const { email, code } = req.body || {};
  if (!email || typeof email !== 'string' || !code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Email and OTP code are required' });
  }

  const record = otpStore.get(email);
  if (!record) {
    return res.status(400).json({ error: 'No OTP requested for this email' });
  }

  const now = Date.now();
  if (now > record.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ error: 'OTP expired. Please request a new one.' });
  }

  if (record.attempts >= 5) {
    otpStore.delete(email);
    return res.status(429).json({ error: 'Too many attempts. Please request a new OTP.' });
  }

  if (record.code !== code.trim()) {
    record.attempts += 1;
    otpStore.set(email, record);
    return res.status(400).json({ error: 'Invalid OTP. Please try again.' });
  }

  // Success: clear OTP and return a simple session indicator
  otpStore.delete(email);
  return res.json({ success: true, user: { email } });
});

// Discord OAuth callback endpoint
app.post('/api/discord-callback', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'No authorization code provided' });
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', 
      new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    // Use the access token to get user information
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });

    const user = userResponse.data;
    const { id, username, discriminator, avatar, email, verified } = user;

    // Optional: Get user's guilds (servers they're in)
    const guildsResponse = await axios.get('https://discord.com/api/users/@me/guilds', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });

    // Return user data
    res.json({
      user: {
        id,
        username,
        discriminator,
        avatar,
        email,
        verified,
        avatar_url: avatar 
          ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`
          : null
      },
      guilds: guildsResponse.data,
      tokens: {
        access_token,
        refresh_token,
        expires_in
      }
    });

  } catch (error) {
    console.error('Discord OAuth Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to authenticate with Discord',
      details: error.response?.data || error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Discord OAuth Backend is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Discord OAuth Backend running on http://localhost:${PORT}`);
  console.log('Make sure to set up your .env file with Discord credentials!');
});

