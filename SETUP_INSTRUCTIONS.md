# Why You're Getting "Invalid Form Body" Error

## The Problem

The **"Invalid Form Body"** error occurs because you're trying to exchange the authorization code for an access token, but the request format is incorrect. This happens when:

1. ❌ **Missing or incorrect `Content-Type` header** - Must be `application/x-www-form-urlencoded`
2. ❌ **Wrong parameter format** - Discord expects URL-encoded form data, not JSON
3. ❌ **Missing required parameters** - `grant_type`, `code`, `client_id`, `client_secret`, `redirect_uri`
4. ❌ **Redirect URI mismatch** - The URI must exactly match what's registered in Discord Developer Portal

## The Solution

You need to create a **backend server** that properly handles the OAuth token exchange. I've created all the files you need!

## Quick Start Guide

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the project root:

```bash
# Copy the template
cp env.template .env

# Edit .env and add your credentials:
DISCORD_CLIENT_ID=892280455032877096
DISCORD_CLIENT_SECRET=your_secret_here
DISCORD_REDIRECT_URI=https://interactdevelopments.me/callback
PORT=3000
```

### 3. Get Your Client Secret

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application (Client ID: 892280455032877096)
3. Go to **OAuth2** → **Client Secret**
4. Click **Reset Secret** and copy it
5. Paste it in your `.env` file

### 4. Configure Discord Developer Portal

Make sure these redirect URLs are added:
- `https://interactdevelopments.me/callback`
- `http://localhost/callback` (for local testing)

### 5. Start the Backend Server

```bash
# Development mode (auto-restarts on changes)
npm run dev

# OR production mode
npm start
```

You should see: `🚀 Discord OAuth Backend running on http://localhost:3000`

### 6. Update Your Frontend Code

In `index.html`, update the callback handler:

```javascript
// Update the backend URL in callback.html (line ~45)
const backendUrl = 'https://interactdevelopments.me/api/discord-callback';
```

## How It Works Now

```
1. User clicks "Sign in with Discord"
   ↓
2. Redirects to: https://discord.com/oauth2/authorize?...
   ↓
3. User authorizes your app
   ↓
4. Discord redirects to: https://interactdevelopments.me/callback?code=ABC123
   ↓
5. callback.html sends code to YOUR backend server
   ↓
6. Backend exchanges code for access token (proper format!)
   ↓
7. Backend fetches user data from Discord API
   ↓
8. Returns user data to frontend
   ↓
9. User is logged in! ✅
```

## Files Created

- ✅ `server.js` - Backend server with proper token exchange
- ✅ `callback.html` - Handles the OAuth callback
- ✅ `package.json` - Node.js dependencies
- ✅ `env.template` - Environment variables template

## Testing Locally

1. Update Discord Developer Portal to include `http://localhost:3000/api/discord-callback`
2. Change redirect URI to: `DISCORD_REDIRECT_URI=http://localhost:3000/api/discord-callback`
3. Update frontend redirect URI to match
4. Run `npm run dev`
5. Test the OAuth flow

## Troubleshooting

### Error: "Missing Access" or "Missing Permissions"
- Make sure you added the redirect URI in Discord Developer Portal
- URI must **exactly match** (including protocol and trailing slashes)

### Error: "Invalid Client"
- Double-check your `DISCORD_CLIENT_ID` in `.env`
- Make sure it's exactly: `892280455032877096`

### Error: "Invalid Client Secret"
- Reset your secret in Discord Developer Portal
- Copy the new secret to your `.env` file

### Error: "Invalid Grant"
- Authorization code is expired (tokens expire in ~10 minutes)
- Try signing in again

## Security Notes

✅ **DO:**
- Keep your `.env` file secret (never commit it)
- Use environment variables for credentials
- Run backend on HTTPS in production
- Validate user sessions

❌ **DON'T:**
- Expose Client Secret in frontend JavaScript
- Share your `.env` file publicly
- Use HTTP in production
- Store sensitive data in localStorage without encryption

## Next Steps

After getting this working, you'll want to:
1. Add session management (cookies/JWT tokens)
2. Store user data in a database
3. Implement logout functionality
4. Add role-based access control

## Need Help?

- Check the console logs for detailed error messages
- Make sure both backend and frontend are running
- Verify all environment variables are set correctly
- Test the `/api/health` endpoint first

