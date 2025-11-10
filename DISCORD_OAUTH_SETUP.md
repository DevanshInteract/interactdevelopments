# Discord OAuth Setup Guide

## Step-by-Step Instructions for Discord Developer Portal

### 1. Create Your Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **"New Application"** button
3. Enter your application name (e.g., "Interact Developments")
4. Click **"Create"**

### 2. Configure OAuth2

1. In your application dashboard, select **"OAuth2"** from the left sidebar
2. Under **"OAuth2 Redirects"**, click **"Add Redirect"**
3. Add your redirect URL: `https://interactdevs.com/callback` (or your domain)
4. Click **"Save Changes"**

### 3. Get Your Client Credentials

1. In the OAuth2 section, find your **"Client ID"** and copy it
2. Under **"Client Secret"**, click **"Reset Secret"** to generate one (copy and store safely!)
3. Keep these credentials secure - you'll need them for your code

### 4. Update Your Code

Replace `YOUR_CLIENT_ID` in `index.html` (line 1900) with your actual Client ID from the Discord Developer Portal.

### 5. Important Security Note

⚠️ **You MUST implement OAuth on a backend server**. The current JavaScript implementation is insecure because:
- The authorization code must be exchanged for an access token using your **Client Secret**
- The Client Secret must NEVER be exposed in frontend JavaScript
- You need a backend API to securely handle the token exchange

### 6. OAuth Flow Overview

```
User clicks "Sign in with Discord"
    ↓
Redirected to Discord authorization page
    ↓
User authorizes your application
    ↓
Discord redirects back to: https://interactdevs.com/callback?code=ABC123
    ↓
Your BACKEND server receives the code
    ↓
Backend exchanges code for access token (using Client Secret)
    ↓
Backend uses access token to get user data
    ↓
Backend sends user data to frontend (establish session/cookie)
    ↓
User is logged in!
```

### 7. Required Scopes

The current implementation requests these scopes:
- `identify` - Get basic user information
- `email` - Get user's email
- `guilds` - Get user's Discord servers

### 8. Backend Example (Node.js)

You'll need to create a backend endpoint like this:

```javascript
// Backend endpoint: /api/discord-callback
app.get('/api/discord-callback', async (req, res) => {
  const { code } = req.query;
  
  // Exchange code for access token
  const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: process.env.DISCORD_REDIRECT_URI,
    }),
  });
  
  const tokens = await tokenResponse.json();
  
  // Get user data
  const userResponse = await fetch('https://discord.com/api/users/@me', {
    headers: {
      'Authorization': `Bearer ${tokens.access_token}`,
    },
  });
  
  const user = await userResponse.json();
  
  // Create session/cookie and redirect
  // ... your session logic here
  
  res.redirect('/dashboard');
});
```

### 9. Helpful Resources

- [Discord OAuth2 Documentation](https://discord.com/developers/docs/topics/oauth2)
- [Discord API Documentation](https://discord.com/developers/docs/intro)
- [Example Implementations](https://github.com/topics/discord-oauth2)

### 10. Testing Locally

For local development, add these redirect URLs:
- `http://localhost:3000/callback` (or your local port)
- Make sure your Discord application allows both local and production URLs

---

## Current Implementation Status

✅ **Frontend OAuth URL** - Implemented  
⚠️ **Backend Token Exchange** - NEEDS IMPLEMENTATION  
⚠️ **User Data Fetching** - NEEDS IMPLEMENTATION  
⚠️ **Session Management** - NEEDS IMPLEMENTATION  

Your next steps:
1. Set up a backend server (Node.js, Python, PHP, etc.)
2. Implement the token exchange endpoint
3. Add session/cookie management
4. Update the frontend to handle authenticated state

