// ============================================================
//  KONFIGURASI SFX Heatmap
//  ------------------------------------------------------------
//  Penyedia data: TWELVE DATA (paling cocok untuk forex/emas/crypto)
//
//  CARA AKTIFKAN HARGA LIVE:
//  1. Daftar GRATIS di https://twelvedata.com
//  2. Salin API key kamu (formatnya panjang, huruf+angka).
//  3. Tempel di API_KEY di bawah ini.
//  4. Simpan, commit, push ke GitHub.
//
//  CATATAN: API key yang kamu kirim sebelumnya
//  (d8c35fhr...) itu key FINNHUB, bukan Twelve Data.
//  Finnhub gratis tidak mendukung forex, jadi tidak dipakai.
//  Kalau API_KEY kosong, situs jalan dalam MODE DEMO.
// ============================================================

const CONFIG = {
  // Tempel API key TWELVE DATA kamu di sini:
  API_KEY: "2e17930862544ff2a98735e8bac44bdf",

  PROVIDER: "twelvedata",

  // Auto-refresh tiap berapa detik (0 = matikan).
  REFRESH_SECONDS: 60,

  SYMBOLS: [
    { symbol: "EUR/USD", name: "Euro / USD",      category: "forex" },
    { symbol: "GBP/USD", name: "Pound / USD",     category: "forex" },
    { symbol: "USD/JPY", name: "USD / Yen",       category: "forex" },
    { symbol: "AUD/USD", name: "Aussie / USD",    category: "forex" },
    { symbol: "USD/CHF", name: "USD / Franc",     category: "forex" },
    { symbol: "USD/CAD", name: "USD / Loonie",    category: "forex" },
    { symbol: "NZD/USD", name: "Kiwi / USD",      category: "forex" },
    { symbol: "EUR/JPY", name: "Euro / Yen",      category: "forex" },
    { symbol: "XAU/USD", name: "Emas / USD",      category: "metal" },
    { symbol: "XAG/USD", name: "Perak / USD",     category: "metal" },
    { symbol: "BTC/USD", name: "Bitcoin / USD",   category: "crypto" },
    { symbol: "ETH/USD", name: "Ethereum / USD",  category: "crypto" },
    { symbol: "SOL/USD", name: "Solana / USD",    category: "crypto" },
    { symbol: "XRP/USD", name: "XRP / USD",       category: "crypto" }
  ]
};
