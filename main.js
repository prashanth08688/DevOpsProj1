// main.js
// Electron main process (CommonJS)
// Save/replace as: app/main.js

const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fetch = require('node-fetch'); // v2 in package.json
const { URL } = require('url');

let mainWindow;
let lastPomodoroState = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.once('ready-to-show', () => mainWindow.show());

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (mainWindow === null) createWindow(); });

/* ---------- Helpers ---------- */
function extractYouTubeId(url) {
  try {
    if (/^[A-Za-z0-9_-]{11}$/.test(url)) return url;
    const u = new URL(url);
    const h = u.hostname.replace('www.', '').toLowerCase();
    if (h === 'youtu.be') return u.pathname.slice(1).split('?')[0];
    if (u.searchParams.has('v')) return u.searchParams.get('v');
    const m = u.pathname.match(/\/embed\/([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    const fallback = url.match(/([A-Za-z0-9_-]{11})/);
    return fallback ? fallback[1] : null;
  } catch (e) {
    const fallback = url.match(/([A-Za-z0-9_-]{11})/);
    return fallback ? fallback[1] : null;
  }
}

async function safeFetch(url, opts = {}) {
  const controller = new AbortController();
  const timeout = opts.timeout || 10000;
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...opts, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

function decodeEntities(str) {
  if (!str) return str;
  return str.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
}
function parseDescriptionFromHtml(html) {
  if (!html) return null;
  let m = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i);
  if (m && m[1]) return decodeEntities(m[1]);
  m = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
  if (m && m[1]) return decodeEntities(m[1]);
  m = html.match(/"shortDescription"\s*:\s*"([^"]*)"/);
  if (m && m[1]) return decodeEntities(m[1]);
  return null;
}
function parseCommentsFromHtml(html, max = 8) {
  if (!html) return [];
  const found = [];
  const seen = new Set();
  const regex = /"commentText"\s*:\s*\{\s*"runs"\s*:\s*\[\s*\{\s*"text"\s*:\s*"([^"]+?)"/g;
  let match;
  while ((match = regex.exec(html)) && found.length < max) {
    const txt = decodeEntities(match[1].trim());
    if (txt && !seen.has(txt)) { seen.add(txt); found.push(txt); }
  }
  const regex2 = /"simpleText"\s*:\s*"([^"]+?)"/g;
  while (found.length < max && (match = regex2.exec(html))) {
    const txt = decodeEntities(match[1].trim());
    if (txt && !seen.has(txt)) { seen.add(txt); found.push(txt); }
  }
  return found;
}

const INVIDIOUS_LIST = [
  'https://yewtu.cafe',
  'https://yewtu.eu',
  'https://yewtu.snopyta.org',
];

/* ---------- IPC: fetch-youtube-data (server-side) ---------- */
ipcMain.handle('fetch-youtube-data', async (event, url) => {
  try {
    if (typeof url !== 'string' || !url.trim()) return { ok: false, error: 'invalid-url' };
    let parsed;
    try { parsed = new URL(url); } catch (e) { parsed = null; }
    if (parsed) {
      const hostname = parsed.hostname.toLowerCase();
      if (!hostname.includes('youtube.com') && !hostname.includes('youtu.be')) {
        if (!/^[A-Za-z0-9_-]{11}$/.test(url)) return { ok: false, error: 'unsupported-domain' };
      }
    }
    const videoId = extractYouTubeId(url);
    if (!videoId) return { ok: false, error: 'could-not-extract-video-id' };
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // oEmbed
    let oembed = null;
    try {
      const oe = `https://noembed.com/embed?url=${encodeURIComponent(watchUrl)}`;
      const r = await safeFetch(oe, { timeout: 8000 });
      if (r.ok) oembed = await r.json();
    } catch(e){ oembed = null; }

    // fetch HTML
    let html = null;
    try {
      const r = await safeFetch(watchUrl, { timeout: 12000, headers: { 'User-Agent': 'Mozilla/5.0 (Electron)' } });
      if (r.ok) html = await r.text();
    } catch (e) {
      // jina.ai fallback
      try {
        const jina = 'https://r.jina.ai/http://';
        const r2 = await safeFetch(jina + watchUrl.replace(/^https?:\/\//,''), { timeout: 10000 });
        if (r2.ok) html = await r2.text();
      } catch (_) { html = null; }
    }

    const description = parseDescriptionFromHtml(html);
    let comments = parseCommentsFromHtml(html, 12);
    if ((!comments || comments.length === 0)) {
      for (const inst of INVIDIOUS_LIST) {
        try {
          const cu = `${inst}/api/v1/comments/${videoId}`;
          const rc = await safeFetch(cu, { timeout: 8000, headers: { 'User-Agent': 'Mozilla/5.0 (Electron)' } });
          if (!rc.ok) continue;
          const j = await rc.json();
          let items = [];
          if (Array.isArray(j)) items = j;
          else if (j && Array.isArray(j.comments)) items = j.comments;
          else if (j && Array.isArray(j.data)) items = j.data;
          if (items && items.length) {
            comments = items.slice(0,12).map(c => {
              if (typeof c === 'string') return c;
              const content = c.content || c.text || c.comment || JSON.stringify(c);
              return String(content);
            });
            break;
          }
        } catch (e) { continue; }
      }
    }

    return {
      ok: true,
      videoId,
      oembed: oembed || null,
      description: description || null,
      comments: (comments && comments.length) ? comments : null
    };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});

/* ---------- IPC: GPT proxy (server-side) ---------- */
ipcMain.handle('gpt-proxy', async (event, payload) => {
  try {
    // payload may be a string or { message, history }
    const message = (typeof payload === 'string') ? payload : (payload?.message || '');
    const history = payload?.history || [];
    if (!message) return { ok: false, error: 'empty-message' };

    const body = {
      model: 'gpt-3.5-turbo',
      messages: [...history, { role: 'user', content: message }],
      max_tokens: 600
    };

    const endpoints = [
      'https://api.gptfree.top/v1/chat/completions',
      'https://freegpt.one/api/v1/chat/completions'
    ];

    for (const ep of endpoints) {
      try {
        const r = await safeFetch(ep, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          timeout: 12000
        });
        if (!r.ok) continue;
        const j = await r.json();
        const text = j.choices?.[0]?.message?.content || j.result || j.output?.[0]?.content?.[0]?.text || null;
        if (text) return { ok: true, reply: String(text) };
      } catch (e) {
        continue;
      }
    }
    // fallback
    return { ok: true, reply: `Echo: ${message}` };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});

/* ---------- IPC: Pomodoro update broadcasting ---------- */
ipcMain.on('pomodoro-update', (event, state) => {
  lastPomodoroState = state;
  // broadcast to renderer(s)
  try {
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send('pomodoro-update', state);
    }
  } catch (e) { /* ignore */ }
});

/* ---------- other existing handlers ---------- */
ipcMain.handle('open-external', async (event, url) => {
  if (typeof url !== 'string') return { ok: false, error: 'invalid-url' };
  if (!/^https?:\/\//i.test(url)) return { ok: false, error: 'unsupported-protocol' };
  try { await shell.openExternal(url); return { ok: true }; } catch (err) { return { ok:false, error:String(err) }; }
});
ipcMain.handle('app-info', async () => ({ name: app.name || 'ElectronApp', platform: process.platform, version: app.getVersion ? app.getVersion() : '0.0.0' }));
