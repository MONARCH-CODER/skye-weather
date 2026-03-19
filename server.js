// ============================================================
//  SKYE Weather — Secure Proxy Server
//  Your API key lives here on the server, never in the browser
// ============================================================

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const fetch   = (...a) => import('node-fetch').then(({default: f}) => f(...a));

const app  = express();
const PORT = process.env.PORT || 3000;
const KEY  = process.env.OPENWEATHER_API_KEY;

if (!KEY) {
  console.error('❌  OPENWEATHER_API_KEY is missing from your .env file!');
  process.exit(1);
}

// Allow requests only from your own frontend
// ⚠️ After deploying: replace '*' with your actual Render URL for extra security e.g:
// app.use(cors({ origin: 'https://skye-weather.onrender.com' }));
app.use(cors({ origin: '*' }));
app.use(express.static('public')); // Serves weather-app.html from the /public folder

const OW_BASE = 'https://api.openweathermap.org/data/2.5';

// ── Helper: forward a query to OpenWeatherMap ──
async function proxyOW(path, query, res) {
  try {
    const params = new URLSearchParams({ ...query, appid: KEY });
    const url    = `${OW_BASE}/${path}?${params}`;
    const owRes  = await fetch(url);
    const data   = await owRes.json();
    if (!owRes.ok) return res.status(owRes.status).json({ error: data.message || 'OpenWeatherMap error' });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error — check your internet connection.' });
  }
}

// ── Route: geocoding autocomplete (city name → lat/lon list) ──
app.get('/api/geo', async (req, res) => {
  const { q, limit = 6 } = req.query;
  if (!q) return res.status(400).json({ error: 'Provide q parameter.' });
  try {
    const params = new URLSearchParams({ q, limit, appid: KEY });
    const url = `https://api.openweathermap.org/geo/1.0/direct?${params}`;
    const owRes = await fetch(url);
    const data  = await owRes.json();
    if (!owRes.ok) return res.status(owRes.status).json({ error: data.message || 'Geocoding error' });
    // Return only the fields the frontend needs
    const clean = data.map(r => ({
      name: r.name,
      state: r.state || '',
      country: r.country || '',
      lat: r.lat,
      lon: r.lon
    }));
    res.json(clean);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during geocoding.' });
  }
});

// ── Route: current weather by city name ──
app.get('/api/weather', (req, res) => {
  const { q, lat, lon, units = 'metric' } = req.query;
  const query = units ? { units } : {};
  if (q)         { query.q   = q;   return proxyOW('weather', query, res); }
  if (lat && lon){ query.lat = lat; query.lon = lon; return proxyOW('weather', query, res); }
  res.status(400).json({ error: 'Provide either q (city) or lat+lon.' });
});

// ── Route: 5-day / 3-hour forecast ──
app.get('/api/forecast', (req, res) => {
  const { q, lat, lon, units = 'metric', cnt = 40 } = req.query;
  const query = { units, cnt };
  if (q)         { query.q   = q;   return proxyOW('forecast', query, res); }
  if (lat && lon){ query.lat = lat; query.lon = lon; return proxyOW('forecast', query, res); }
  res.status(400).json({ error: 'Provide either q (city) or lat+lon.' });
});

app.listen(PORT, () => {
  console.log(`✅  SKYE proxy server running at http://localhost:${PORT}`);
  console.log(`    API key is secure — never exposed to the browser.`);
});
