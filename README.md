# Discord OAuth Setup - Complete Solution

## 🐛 Why You Got "Invalid Form Body" Error

You were getting this error because **Discord OAuth requires a backend server** to properly exchange the authorization code for an access token. You can't do this securely in frontend JavaScript!

The error happens when:
- ❌ Missing proper `Content-Type: application/x-www-form-urlencoded` header
- ❌ Sending JSON instead of URL-encoded form data
- ❌ Missing or incorrect parameters
- ❌ Trying to do it all in the frontend (unsafe!)

## ✅ The Solution

I've created a complete working implementation with:
1. Backend server (`server.js`) - handles the token exchange properly
2. Callback page (`callback.html`) - receives the code and sends it to backend
3. Environment setup (`.env` template)
4. Documentation

## 🚀 Quick Start

### Step 1: Install Node.js Dependencies

```bash
npm install
```

### Step 2: Create `.env` File

Create a file named `.env` in your project root:

```env
DISCORD_CLIENT_ID=892280455032877096
DISCORD_CLIENT_SECRET=your_secret_from_discord_portal
DISCORD_REDIRECT_URI=https://interactdevelopments.me/callback
PORT=3000
```

**How to get your Client Secret:**
1. Go to https://discord.com/developers/applications
2. Click on your application
3. Go to **OAuth2** tab
4. Click **Reset Secret** and copy it
5. Paste in your `.env` file

### Step 3: Configure Discord Developer Portal

In the Discord Developer Portal → Your App → OAuth2:
- Add redirect URI: `https://interactdevelopments.me/callback`
- For local testing, also add: `http://localhost/callback`

### Step 4: Start the Backend Server

```bash
# Development (auto-restarts)
npm run dev

# OR Production
npm start
```

You should see: `🚀 Discord OAuth Backend running on http://localhost:3000`

### Step 5: Deploy Everything

Upload these files to your server:
- `index.html` (your main page)
- `callback.html` (OAuth callback page)
- `server.js` (backend server)
- `package.json` (dependencies)
- `.env` (your credentials)
- `node_modules/` (run `npm install` on server)

Make sure your server runs Node.js and the backend is accessible at `https://interactdevelopments.me/api/discord-callback`

## 📁 Project Structure

```
your-website/
├── index.html              # Main page with Discord sign-in button
├── callback.html           # Handles OAuth callback
├── server.js               # Backend (Node.js/Express)
├── package.json            # Dependencies
├── .env                    # Your Discord credentials (SECRET!)
├── env.template            # Template for .env
└── node_modules/           # Installed dependencies
```

## 🔄 How It Works

```
User clicks "Sign in with Discord"
    ↓
index.html → Redirects to Discord
    ↓
User authorizes on Discord
    ↓
Discord → callback.html (with code)
    ↓
callback.html → Sends code to server.js
    ↓
server.js → Exchanges code for token (proper format!)
    ↓
server.js → Fetches user data from Discord
    ↓
callback.html → Receives user data → Redirects to index.html
    ↓
User is logged in! ✅
```

## 🛠️ Testing

1. **Test backend health:**
   ```bash
   curl http://localhost:3000/api/health
   ```

2. **Test OAuth flow:**
   - Click "Sign in with Discord" button
   - Authorize the application
   - Should redirect back with user data

## ⚠️ Important Security Notes

✅ **DO:**
- Keep `.env` file secret (add to `.gitignore`)
- Use HTTPS in production
- Validate all user data on backend
- Implement proper session management

❌ **DON'T:**
- Commit `.env` to git
- Expose Client Secret in frontend code
- Use HTTP in production
- Trust frontend data without backend validation

## 📚 Additional Documentation

- `SETUP_INSTRUCTIONS.md` - Detailed setup guide
- `DISCORD_OAUTH_SETUP.md` - Discord Developer Portal guide
- `env.template` - Environment variables template

## 🐛 Troubleshooting

**Backend won't start:**
- Make sure Node.js is installed (`node --version`)
- Run `npm install` first
- Check if port 3000 is available

**"Invalid Client" error:**
- Double-check Client ID in `.env`
- Make sure it matches Discord Developer Portal

**"Invalid Grant" error:**
- Code expired (try again)
- Redirect URI mismatch
- Code already used

**Callback not working:**
- Make sure callback.html is in the root directory
- Check browser console for errors
- Verify backend is running

## 🎉 Success Checklist

- [ ] Backend server running
- [ ] .env file configured
- [ ] Discord Developer Portal configured
- [ ] Tested OAuth flow locally
- [ ] Deployed to production
- [ ] Tested on production domain

## 📞 Need Help?

Check the console logs for detailed error messages. The backend logs will show exactly what's happening during the OAuth flow.

---

**Files Created:**
- `server.js` - Backend Express server
- `callback.html` - OAuth callback page  
- `package.json` - Node.js dependencies
- `env.template` - Environment template
- `SETUP_INSTRUCTIONS.md` - Setup guide
- `DISCORD_OAUTH_SETUP.md` - Discord setup guide
- `.gitignore` - Git ignore rules
- `README.md` - This file

