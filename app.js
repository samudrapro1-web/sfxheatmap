// ============================================================
//  SFX Heatmap — logika utama
// ============================================================

const grid       = document.getElementById('grid');
const tabs       = document.getElementById('tabs');
const refreshBtn = document.getElementById('refreshBtn');
const configWarn = document.getElementById('configWarn');
const srcLabel   = document.getElementById('src');
const clickSound = document.getElementById('clickSound');
document.getElementById('year').textContent = new Date().getFullYear();

let activeCat = 'all';

const DEMO = !CONFIG.API_KEY || CONFIG.API_KEY.trim() === '';
if (DEMO) configWarn.style.display = 'block';
srcLabel.textContent = DEMO ? 'Demo Mode (simulasi)' : 'Twelve Data (live)';

// ---------- SUARA KLIK (dari file click.mp3) ----------
function playClick() {
  if (!clickSound || !clickSound.src) return;
  try {
    clickSound.currentTime = 0;          // ulang dari awal tiap klik
    clickSound.play().catch(() => {});   // diam saja kalau file belum ada
  } catch (e) {}
}

// ---------- jam WIB ----------
function tick() {
  document.getElementById('clock').textContent = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Jakarta'
  });
}
setInterval(tick, 1000); tick();

// ---------- format harga per kategori ----------
function fmt(price, cat) {
  if (price == null || isNaN(price)) return '—';
  if (cat === 'crypto') return price >= 100 ? price.toLocaleString('en-US', {maximumFractionDigits: 2}) : price.toFixed(4);
  if (cat === 'metal')  return price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  return price.toFixed(price > 50 ? 3 : 5);
}

// ---------- hitung sinyal ----------
function computeSignal(series) {
  if (!series || series.length < 5) return { sig: 'neutral', strength: 0 };
  const last = series[series.length - 1];
  const avg  = series.slice(-5).reduce((a, b) => a + b, 0) / 5;
  const pct  = ((last - avg) / avg) * 100;
  const strength = Math.min(100, Math.round(Math.abs(pct) * 800));
  if (pct > 0.02)  return { sig: 'call', strength };
  if (pct < -0.02) return { sig: 'put',  strength };
  return { sig: 'neutral', strength: Math.round(strength / 2) };
}

// ---------- warna heatmap sel (berdasarkan sinyal + kekuatan) ----------
function heatColor(sig, strength) {
  const a = 0.18 + (strength / 100) * 0.55;   // intensitas 0.18 - 0.73
  if (sig === 'call') return `rgba(21,196,126,${a.toFixed(2)})`;
  if (sig === 'put')  return `rgba(255,77,109,${a.toFixed(2)})`;
  return `rgba(245,185,66,${(a * 0.7).toFixed(2)})`;
}

// ---------- DEMO data ----------
const DEMO_BASE = {
  'EUR/USD':1.0850,'GBP/USD':1.2710,'USD/JPY':151.30,'AUD/USD':0.6620,
  'USD/CHF':0.9020,'USD/CAD':1.3650,'NZD/USD':0.6080,'EUR/JPY':164.20,
  'XAU/USD':2330.50,'XAG/USD':27.40,'BTC/USD':67500,'ETH/USD':3450,
  'SOL/USD':165,'XRP/USD':0.52
};
function demoSeries(symbol) {
  const base = DEMO_BASE[symbol] || 1;
  const arr = []; let v = base;
  for (let i = 0; i < 24; i++) { v += (Math.random() - 0.48) * base * 0.004; arr.push(v); }
  return arr;
}

// ---------- fetch live (Twelve Data) ----------
async function fetchLive(symbol) {
  const url = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(symbol)}`
            + `&interval=15min&outputsize=24&apikey=${CONFIG.API_KEY}`;
  const res = await fetch(url);
  const json = await res.json();
  if (json.status === 'error' || !json.values) throw new Error(json.message || 'API error');
  return json.values.map(v => parseFloat(v.close)).reverse();
}

async function getData(item) {
  let series;
  if (DEMO) series = demoSeries(item.symbol);
  else { try { series = await fetchLive(item.symbol); } catch (e) { series = demoSeries(item.symbol); } }
  const last = series[series.length - 1];
  const prev = series[series.length - 2];
  const change = ((last - prev) / prev) * 100;
  const signal = computeSignal(series);
  return { ...item, last, change, signal };
}

// ---------- render satu sel heatmap ----------
function cellHTML(d, idx) {
  const sig = d.signal.sig;
  const txt = sig === 'call' ? '#7dffc4' : sig === 'put' ? '#ff9fb0' : '#ffe1a3';
  const label = sig === 'call' ? 'CALL ▲' : sig === 'put' ? 'PUT ▼' : 'NETRAL ◆';
  const up = d.change >= 0;
  const bg = heatColor(sig, d.signal.strength);
  return `
  <div class="cell" style="background:${bg};animation-delay:${idx * 40}ms">
    <div>
      <div class="sym">${d.symbol}</div>
      <div class="nm">${d.name}</div>
      <div class="pr">${fmt(d.last, d.category)}</div>
    </div>
    <div class="row">
      <span class="sig" style="color:${txt}">${label}</span>
      <span class="chg" style="color:${txt}">${up ? '▲' : '▼'} ${Math.abs(d.change).toFixed(2)}%</span>
    </div>
  </div>`;
}

async function load() {
  refreshBtn.classList.add('spin');
  grid.innerHTML = `<div style="grid-column:1/-1;color:var(--muted);font-family:'Space Mono',monospace;padding:30px;text-align:center">Memuat data…</div>`;
  const items = CONFIG.SYMBOLS.filter(s => activeCat === 'all' || s.category === activeCat);
  const results = await Promise.all(items.map(getData));
  grid.innerHTML = results.map((d, i) => cellHTML(d, i)).join('');
  refreshBtn.classList.remove('spin');
}

// ---------- klik tab (dengan suara) ----------
tabs.addEventListener('click', e => {
  const btn = e.target.closest('.tab');
  if (!btn) return;
  playClick();
  [...tabs.children].forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeCat = btn.dataset.cat;
  load();
});

// ---------- klik refresh (dengan suara) ----------
refreshBtn.addEventListener('click', () => { playClick(); load(); });

// ---------- klik sel heatmap (suara saja) ----------
grid.addEventListener('click', e => { if (e.target.closest('.cell')) playClick(); });

if (CONFIG.REFRESH_SECONDS > 0) setInterval(load, CONFIG.REFRESH_SECONDS * 1000);

load();
