# SKYE Weather AI App 🌤️

A beautiful AI-powered weather app with a **secure backend proxy** — your API key is never exposed in the browser.

---

## 📁 Project Structure

```
skye-weather/
├── server.js          ← Secure Node.js proxy (holds your API key)
├── .env               ← Your secret API key lives HERE (never share this)
├── .gitignore         ← Prevents .env from being uploaded to GitHub
├── package.json       ← Project dependencies
└── public/
    └── index.html     ← The weather app frontend
```

---

## 🚀 Setup (5 minutes)

### Step 1 — Get a free API key
1. Go to https://openweathermap.org → Sign Up (free, no credit card)
2. Log in → click your username → **API keys**
3. Copy your default key (or create a new one)
4. **Wait 10–15 minutes** after signing up for the key to activate

### Step 2 — Add your key to .env
Open the `.env` file and replace `paste_your_key_here`:
```
OPENWEATHER_API_KEY=abc123yourkeyhere
```

### Step 3 — Install dependencies
Open your terminal in the `skye-weather` folder and run:
```bash
npm install
```

### Step 4 — Start the server
```bash
npm start
```

### Step 5 — Open the app
Go to http://localhost:3000 in your browser. Done! 🎉

---

## 🔒 Why This Is Secure

| Method | Security |
|--------|----------|
| ❌ API key in HTML/JS | Anyone can steal it from DevTools |
| ✅ API key in .env + proxy | Key never leaves your server |

**How it works:**
```
Browser → your server (/api/weather) → OpenWeatherMap (with secret key)
                                    ← returns data ← 
Browser ← your server returns data
```

The browser only ever talks to YOUR server. It never sees the API key.

---

## 🌍 Deploying to the Web

### Option A — Render.com (free, recommended)
1. Push your project to GitHub (**make sure .env is in .gitignore** ✓ already done)
2. Go to https://render.com → New Web Service → connect your repo
3. In Render dashboard → **Environment** tab → add:
   - Key: `OPENWEATHER_API_KEY`
   - Value: your actual API key
4. Deploy — Render gives you a live URL

### Option B — Railway.app (free tier)
1. Push to GitHub
2. Go to https://railway.app → New Project → Deploy from GitHub
3. Add environment variable `OPENWEATHER_API_KEY` in the dashboard
4. Railway auto-deploys on every push

### Option C — VPS / Your own server
```bash
# On your server:
git clone your-repo
cd skye-weather
npm install
# Create .env with your key
npm start
# Use nginx or pm2 to keep it running
```

---

## 🛠️ For Development (auto-restart on file changes)
```bash
npm run dev
```
(uses nodemon — restarts server automatically when you edit files)

---

## ⚙️ API Routes (proxy endpoints)

| Endpoint | Parameters | Description |
|----------|-----------|-------------|
| `GET /api/weather` | `q=London` or `lat=51&lon=-0.1` + `units=metric` | Current weather |
| `GET /api/forecast` | Same as above + `cnt=40` | 5-day / 3-hour forecast |

---

## 📝 Notes
- Free OpenWeatherMap tier: 60 calls/minute, 1,000,000 calls/month — more than enough
- The `.env` file is already in `.gitignore` — safe to push to GitHub
- Never paste your API key directly into any JavaScript file
