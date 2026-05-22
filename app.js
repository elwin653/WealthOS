// ═══════════════════════════════════════════════════════
//  WealthOS — Core Application Logic
// ═══════════════════════════════════════════════════════

'use strict';

// ── Hoisted: constants used early in init ──
var CURRENCIES = {
  MYR: { symbol: 'RM',  name: 'Malaysian Ringgit' },
  USD: { symbol: '$',   name: 'US Dollar' },
  SGD: { symbol: 'S$',  name: 'Singapore Dollar' },
  EUR: { symbol: '€',   name: 'Euro' },
  GBP: { symbol: '£',   name: 'British Pound' },
  JPY: { symbol: '¥',   name: 'Japanese Yen' },
  KRW: { symbol: '₩',   name: 'South Korean Won' },
  AUD: { symbol: 'A$',  name: 'Australian Dollar' },
  CNY: { symbol: '¥',   name: 'Chinese Yuan' },
  HKD: { symbol: 'HK$', name: 'Hong Kong Dollar' },
  THB: { symbol: '฿',   name: 'Thai Baht' },
  IDR: { symbol: 'Rp',  name: 'Indonesian Rupiah' },
};
var fxRates = { USD: 1, MYR: 4.47, SGD: 1.34, EUR: 0.92, GBP: 0.79, JPY: 149.5, KRW: 1325, AUD: 1.53, CNY: 7.24, HKD: 7.82, THB: 35.1, IDR: 15800 };
var fxLastFetched = 0;
var LANG = {
  en: { dashboard:'Overview', overview:'Overview', transactions:'Transactions', investments:'Investments', portfolio:'Portfolio', goals:'Goals', subscriptions:'Subscriptions', settings:'Settings', calendar:'Calendar', analytics:'Analytics', simulator:'Simulator', save:'Save', cancel:'Cancel', addExpense:'Add Expense', addIncome:'Add Income', dashboardSub:"Here's your financial overview", netWorth:'Net Worth', monthlyIncome:'Monthly Income', monthlySpend:'Monthly Spend', savingsRate:'Savings Rate', recentTxns:'Recent', netWorthTrend:'Net Worth Trend', spending:'Spending', insights:'Insights', profile:'Profile', appearance:'Appearance', language:'Language', currency:'Currency', theme:'Theme', dark:'Dark', light:'Light', system:'System', data:'Data', resetAll:'Reset All Data', exportData:'Export Backup', importData:'Import Backup', yourName:'Your Name', budgetLimit:'Monthly Budget Limit', saveProfile:'Save Profile', hideNumbers:'Hide Sensitive Numbers', total:'Total', amount:'Amount', date:'Date', description:'Description', category:'Category' },
  ms: { dashboard:'Ringkasan', overview:'Ringkasan', transactions:'Transaksi', investments:'Pelaburan', portfolio:'Portfolio', goals:'Matlamat', subscriptions:'Langganan', settings:'Tetapan', calendar:'Kalendar', analytics:'Analitik', simulator:'Simulator', save:'Simpan', cancel:'Batal', addExpense:'Tambah Perbelanjaan', addIncome:'Tambah Pendapatan', dashboardSub:'Ringkasan kewangan anda', netWorth:'Nilai Bersih', monthlyIncome:'Pendapatan Bulanan', monthlySpend:'Perbelanjaan Bulanan', savingsRate:'Kadar Simpanan', recentTxns:'Terkini', netWorthTrend:'Trend Nilai Bersih', spending:'Perbelanjaan', insights:'Pandangan', profile:'Profil', appearance:'Penampilan', language:'Bahasa', currency:'Mata Wang', theme:'Tema', dark:'Gelap', light:'Cerah', system:'Sistem', data:'Data', resetAll:'Set Semula Data', exportData:'Sandaran', importData:'Import Sandaran', yourName:'Nama Anda', budgetLimit:'Had Bajet Bulanan', saveProfile:'Simpan Profil', hideNumbers:'Sembunyikan Nombor', total:'Jumlah', amount:'Amaun', date:'Tarikh', description:'Penerangan', category:'Kategori' },
  zh: { dashboard:'总览', overview:'总览', transactions:'交易', investments:'投资', portfolio:'投资组合', goals:'目标', subscriptions:'订阅', settings:'设置', calendar:'日历', analytics:'分析', simulator:'模拟器', save:'保存', cancel:'取消', addExpense:'添加支出', addIncome:'添加收入', dashboardSub:'您的财务概览', netWorth:'净资产', monthlyIncome:'月收入', monthlySpend:'月支出', savingsRate:'储蓄率', recentTxns:'近期', netWorthTrend:'净资产趋势', spending:'支出', insights:'洞察', profile:'个人资料', appearance:'外观', language:'语言', currency:'货币', theme:'主题', dark:'深色', light:'浅色', system:'系统', data:'数据', resetAll:'重置所有数据', exportData:'导出备份', importData:'导入备份', yourName:'您的姓名', budgetLimit:'月度预算', saveProfile:'保存资料', hideNumbers:'隐藏数字', total:'总计', amount:'金额', date:'日期', description:'描述', category:'类别' },
  ar: { dashboard:'نظرة عامة', overview:'نظرة عامة', transactions:'المعاملات', investments:'الاستثمارات', portfolio:'المحفظة', goals:'الأهداف', subscriptions:'الاشتراكات', settings:'الإعدادات', calendar:'التقويم', analytics:'التحليلات', simulator:'المحاكي', save:'حفظ', cancel:'إلغاء', addExpense:'إضافة مصروف', addIncome:'إضافة دخل', dashboardSub:'نظرة عامة على وضعك المالي', netWorth:'صافي الثروة', monthlyIncome:'الدخل الشهري', monthlySpend:'المصروفات الشهرية', savingsRate:'معدل الادخار', recentTxns:'الأخيرة', netWorthTrend:'اتجاه صافي الثروة', spending:'الإنفاق', insights:'الرؤى', profile:'الملف الشخصي', appearance:'المظهر', language:'اللغة', currency:'العملة', theme:'السمة', dark:'داكن', light:'فاتح', system:'النظام', data:'البيانات', resetAll:'إعادة تعيين الكل', exportData:'تصدير', importData:'استيراد', yourName:'اسمك', budgetLimit:'حد الميزانية', saveProfile:'حفظ', hideNumbers:'إخفاء الأرقام', total:'المجموع', amount:'المبلغ', date:'التاريخ', description:'الوصف', category:'الفئة' },
  es: { dashboard:'Resumen', overview:'Resumen', transactions:'Transacciones', investments:'Inversiones', portfolio:'Cartera', goals:'Objetivos', subscriptions:'Suscripciones', settings:'Ajustes', calendar:'Calendario', analytics:'Analíticas', simulator:'Simulador', save:'Guardar', cancel:'Cancelar', addExpense:'Añadir Gasto', addIncome:'Añadir Ingreso', dashboardSub:'Tu resumen financiero', netWorth:'Patrimonio Neto', monthlyIncome:'Ingreso Mensual', monthlySpend:'Gasto Mensual', savingsRate:'Tasa de Ahorro', recentTxns:'Recientes', netWorthTrend:'Tendencia', spending:'Gastos', insights:'Análisis', profile:'Perfil', appearance:'Apariencia', language:'Idioma', currency:'Moneda', theme:'Tema', dark:'Oscuro', light:'Claro', system:'Sistema', data:'Datos', resetAll:'Restablecer Todo', exportData:'Exportar', importData:'Importar', yourName:'Tu Nombre', budgetLimit:'Límite Mensual', saveProfile:'Guardar Perfil', hideNumbers:'Ocultar Cifras', total:'Total', amount:'Cantidad', date:'Fecha', description:'Descripción', category:'Categoría' },
  fr: { dashboard:'Aperçu', overview:'Aperçu', transactions:'Transactions', investments:'Investissements', portfolio:'Portefeuille', goals:'Objectifs', subscriptions:'Abonnements', settings:'Paramètres', calendar:'Calendrier', analytics:'Analyses', simulator:'Simulateur', save:'Enregistrer', cancel:'Annuler', addExpense:'Ajouter Dépense', addIncome:'Ajouter Revenu', dashboardSub:'Votre aperçu financier', netWorth:'Valeur Nette', monthlyIncome:'Revenu Mensuel', monthlySpend:'Dépense Mensuelle', savingsRate:"Taux d'Épargne", recentTxns:'Récents', netWorthTrend:'Tendance', spending:'Dépenses', insights:'Aperçus', profile:'Profil', appearance:'Apparence', language:'Langue', currency:'Devise', theme:'Thème', dark:'Sombre', light:'Clair', system:'Système', data:'Données', resetAll:'Tout Réinitialiser', exportData:'Exporter', importData:'Importer', yourName:'Votre Nom', budgetLimit:'Limite Mensuelle', saveProfile:'Enregistrer', hideNumbers:'Masquer Chiffres', total:'Total', amount:'Montant', date:'Date', description:'Description', category:'Catégorie' },
  de: { dashboard:'Übersicht', overview:'Übersicht', transactions:'Transaktionen', investments:'Investitionen', portfolio:'Portfolio', goals:'Ziele', subscriptions:'Abonnements', settings:'Einstellungen', calendar:'Kalender', analytics:'Analyse', simulator:'Simulator', save:'Speichern', cancel:'Abbrechen', addExpense:'Ausgabe', addIncome:'Einnahme', dashboardSub:'Ihre Finanzübersicht', netWorth:'Nettovermögen', monthlyIncome:'Monatseinkommen', monthlySpend:'Monatsausgaben', savingsRate:'Sparquote', recentTxns:'Neueste', netWorthTrend:'Trend', spending:'Ausgaben', insights:'Einblicke', profile:'Profil', appearance:'Aussehen', language:'Sprache', currency:'Währung', theme:'Thema', dark:'Dunkel', light:'Hell', system:'System', data:'Daten', resetAll:'Alles Zurücksetzen', exportData:'Exportieren', importData:'Importieren', yourName:'Ihr Name', budgetLimit:'Monatslimit', saveProfile:'Profil Speichern', hideNumbers:'Zahlen Verstecken', total:'Gesamt', amount:'Betrag', date:'Datum', description:'Beschreibung', category:'Kategorie' },
  ja: { dashboard:'概要', overview:'概要', transactions:'取引', investments:'投資', portfolio:'ポートフォリオ', goals:'目標', subscriptions:'サブスク', settings:'設定', calendar:'カレンダー', analytics:'分析', simulator:'シミュレータ', save:'保存', cancel:'キャンセル', addExpense:'支出追加', addIncome:'収入追加', dashboardSub:'あなたの家計概要', netWorth:'純資産', monthlyIncome:'月収', monthlySpend:'月間支出', savingsRate:'貯蓄率', recentTxns:'最近', netWorthTrend:'資産推移', spending:'支出', insights:'インサイト', profile:'プロフィール', appearance:'外観', language:'言語', currency:'通貨', theme:'テーマ', dark:'ダーク', light:'ライト', system:'システム', data:'データ', resetAll:'すべてリセット', exportData:'エクスポート', importData:'インポート', yourName:'お名前', budgetLimit:'月予算', saveProfile:'プロフィール保存', hideNumbers:'金額を隠す', total:'合計', amount:'金額', date:'日付', description:'説明', category:'カテゴリ' },
  ko: { dashboard:'개요', overview:'개요', transactions:'거래', investments:'투자', portfolio:'포트폴리오', goals:'목표', subscriptions:'구독', settings:'설정', calendar:'캘린더', analytics:'분석', simulator:'시뮬레이터', save:'저장', cancel:'취소', addExpense:'지출 추가', addIncome:'수입 추가', dashboardSub:'재무 개요', netWorth:'순자산', monthlyIncome:'월 수입', monthlySpend:'월 지출', savingsRate:'저축률', recentTxns:'최근', netWorthTrend:'추세', spending:'지출', insights:'인사이트', profile:'프로필', appearance:'모양', language:'언어', currency:'통화', theme:'테마', dark:'다크', light:'라이트', system:'시스템', data:'데이터', resetAll:'모두 재설정', exportData:'내보내기', importData:'가져오기', yourName:'이름', budgetLimit:'월 예산', saveProfile:'프로필 저장', hideNumbers:'금액 숨기기', total:'합계', amount:'금액', date:'날짜', description:'설명', category:'분류' },
  hi: { dashboard:'अवलोकन', overview:'अवलोकन', transactions:'लेन-देन', investments:'निवेश', portfolio:'पोर्टफोलियो', goals:'लक्ष्य', subscriptions:'सदस्यता', settings:'सेटिंग्स', calendar:'कैलेंडर', analytics:'विश्लेषण', simulator:'सिम्युलेटर', save:'सहेजें', cancel:'रद्द करें', addExpense:'खर्च जोड़ें', addIncome:'आय जोड़ें', dashboardSub:'आपका वित्तीय अवलोकन', netWorth:'कुल संपत्ति', monthlyIncome:'मासिक आय', monthlySpend:'मासिक खर्च', savingsRate:'बचत दर', recentTxns:'हाल का', netWorthTrend:'रुझान', spending:'खर्च', insights:'अंतर्दृष्टि', profile:'प्रोफ़ाइल', appearance:'दिखावट', language:'भाषा', currency:'मुद्रा', theme:'थीम', dark:'गहरा', light:'हल्का', system:'सिस्टम', data:'डेटा', resetAll:'सब रीसेट करें', exportData:'निर्यात', importData:'आयात', yourName:'आपका नाम', budgetLimit:'मासिक बजट', saveProfile:'प्रोफ़ाइल सहेजें', hideNumbers:'संख्या छुपाएं', total:'कुल', amount:'राशि', date:'तिथि', description:'विवरण', category:'श्रेणी' },
};

// ── State ──────────────────────────────────────────────
let state = {
  currency: 'MYR',
  darkMode: true,
  themeMode: 'dark',
  hideNumbers: false,
  transactions: [],
  investments: [],
  goals: [],
  subscriptions: [],
  networthHistory: [],
  selectedTxnType: 'income',
  selectedGoalIcon: '🎯',
  editingGoalId: null,
  charts: {},
  onboardingDone: false,
  userName: '',
  monthlyIncome: 0,
  budgetLimit: 0,
  language: 'en'
};

// ── Constants ───────────────────────────────────────────
const CURR_SYMBOL = { MYR: 'RM', USD: '$' };
const TYPE_COLORS = {
  stock: '#4d9fff', etf: '#00f5a0', crypto: '#b66dff',
  commodity: '#ffd166', bond: '#00d4aa', cash: '#8a9dc0',
  property: '#ff9f43'
};
const CAT_COLORS = {
  Food: '#ff6384', Transport: '#36a2eb', Bills: '#ffcd56',
  Investment: '#00f5a0', Lifestyle: '#b66dff', Salary: '#4d9fff',
  Other: '#8a9dc0'
};
const CAT_ICONS = {
  Food: '🍔', Transport: '🚗', Bills: '💡', Investment: '📈',
  Lifestyle: '🎭', Salary: '💼', Other: '📋'
};

// ── Storage ─────────────────────────────────────────────
function save() {
  try {
    // Never serialize charts — they contain non-serializable Chart.js objects
    const { charts, ...saveable } = state;
    const serialized = JSON.stringify(saveable);
    localStorage.setItem('wealthos_v2', serialized);
    // Verify it actually saved by reading it back
    const verify = localStorage.getItem('wealthos_v2');
    if (!verify) throw new Error('localStorage write failed silently');
  } catch(e) {
    console.error('Save failed:', e);
    // Try IndexedDB as fallback
    saveToIDB();
  }
}

// IndexedDB fallback for when localStorage is unavailable or full
function saveToIDB() {
  try {
    const req = indexedDB.open('wealthos', 1);
    req.onupgradeneeded = e => e.target.result.createObjectStore('data');
    req.onsuccess = e => {
      const db = e.target.result;
      const { charts, ...saveable } = state;
      const tx = db.transaction('data', 'readwrite');
      tx.objectStore('data').put(JSON.stringify(saveable), 'state');
    };
  } catch(e) { console.error('IDB save failed:', e); }
}

function loadFromIDB(cb) {
  try {
    const req = indexedDB.open('wealthos', 1);
    req.onupgradeneeded = e => e.target.result.createObjectStore('data');
    req.onsuccess = e => {
      const db = e.target.result;
      const tx = db.transaction('data', 'readonly');
      const get = tx.objectStore('data').get('state');
      get.onsuccess = () => cb(get.result || null);
      get.onerror = () => cb(null);
    };
    req.onerror = () => cb(null);
  } catch(e) { cb(null); }
}

function load() {
  try {
    const raw = localStorage.getItem('wealthos_v2');
    if (raw) {
      const saved = JSON.parse(raw);
      // Only wipe if it looks like truly empty/corrupt data (no key arrays at all)
      const hasRealData = saved.transactions !== undefined ||
                          saved.investments !== undefined ||
                          saved.goals !== undefined;
      if (!hasRealData) {
        localStorage.removeItem('wealthos_v2');
        return;
      }
      // Restore — always force charts:{} since Chart.js objects can't be serialized
      state = { ...state, ...saved, charts: {} };
      // Ensure all arrays exist (guard against old saved data missing fields)
      if (!Array.isArray(state.transactions)) state.transactions = [];
      if (!Array.isArray(state.investments)) state.investments = [];
      if (!Array.isArray(state.goals)) state.goals = [];
      if (!Array.isArray(state.subscriptions)) state.subscriptions = [];
      if (!Array.isArray(state.networthHistory)) state.networthHistory = [];
      // If onboardingDone somehow missing but they have real data, restore it
      if (!state.onboardingDone && (state.transactions.length || state.investments.length)) {
        state.onboardingDone = true;
      }
    }
  } catch(e) {
    console.error('Load error:', e);
    localStorage.removeItem('wealthos_v2');
  }
}

// ── Currency ────────────────────────────────────────────
function curr() {
  var c = state.currency || 'MYR';
  if (typeof CURRENCIES !== 'undefined' && CURRENCIES[c]) return CURRENCIES[c].symbol;
  return CURR_SYMBOL[c] || c;
}

function fmt(n, decimals = 2) {
  if (n === null || n === undefined || isNaN(n)) return curr() + '0.00';
  // Always show full numbers with commas, no K/M abbreviation
  var formatted = Math.abs(n).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
  return (n < 0 ? '-' : '') + curr() + formatted;
}

function fmtFull(n) {
  return curr() + Math.abs(n).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Format with a specific investment's own currency
function fmtInv(n, invCurrency, decimals) {
  const sym = CURR_SYMBOL[invCurrency] || invCurrency || curr();
  const abs = Math.abs(n);
  const dec = decimals !== undefined ? decimals : (abs < 1 ? 4 : 2);
  return sym + abs.toLocaleString('en-MY', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

// Get the symbol for an investment's currency
function invSym(inv) {
  return CURR_SYMBOL[inv.invCurrency] || CURR_SYMBOL[state.currency] || 'RM';
}

function toggleCurrency() {
  state.currency = state.currency === 'MYR' ? 'USD' : 'MYR';
  save();
  updateCurrencyLabels();
  renderAll();
}

function setCurrency(c) {
  state.currency = c;
  // Legacy elements (may not exist in new settings page)
  var myr = document.getElementById('curr-myr');
  var usd = document.getElementById('curr-usd');
  if (myr) myr.classList.toggle('active', c === 'MYR');
  if (usd) usd.classList.toggle('active', c === 'USD');
  save();
  updateCurrencyLabels();
  if (window.renderSettingsPage) window.renderSettingsPage();
  renderAll();
}
window.setCurrency = setCurrency;

// Fetch live FX rates on startup
setTimeout(function() { if (typeof fetchFxRates === 'function') fetchFxRates(); }, 2000);

function updateCurrencyLabels() {
  var sym = curr();
  var el = document.getElementById('currency-label');
  if (el) el.textContent = state.currency + ' (' + sym + ')';
  document.querySelectorAll('.txn-curr-label, .inv-curr-label, .goal-curr-label, .sub-curr-label, .price-curr-label, .fire-curr, .sim-curr').forEach(function(e) { e.textContent = sym; });
}

// ── Dark Mode ────────────────────────────────────────────
// themeMode: 'dark' | 'light' | 'system'
function setTheme(mode) {
  state.themeMode = mode;
  applyTheme();
  save();
  if (window.renderSettingsPage) window.renderSettingsPage();
}
window.setTheme = setTheme;

function applyTheme() {
  const mode = state.themeMode || (state.darkMode ? 'dark' : 'light');
  let isDark;
  if (mode === 'system') {
    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  } else {
    isDark = mode === 'dark';
  }
  document.body.classList.toggle('light-mode', !isDark);
  // Update legacy darkMode for backward compat
  state.darkMode = isDark;
}

// Listen for system theme changes when in system mode
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if ((state.themeMode || 'dark') === 'system') applyTheme();
});

function toggleDarkMode() {
  state.darkMode = !state.darkMode;
  state.themeMode = state.darkMode ? 'dark' : 'light';
  applyTheme();
  save();
}

// ── Navigation ───────────────────────────────────────────
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item, .mob-nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + page)?.classList.add('active');
  document.querySelectorAll('[data-page="' + page + '"]').forEach(n => n.classList.add('active'));
  window.scrollTo(0, 0);
  renderPage(page);
}

function renderPage(page) {
  // Use a function map that resolves at call time (not definition time)
  // so window.renderCalendar etc. defined later in the file still work
  var fnMap = {
    dashboard: renderDashboard,
    investments: renderInvestments,
    portfolio: renderPortfolio,
    transactions: renderTransactions,
    goals: renderGoals,
    analytics: renderAnalytics,
    simulator: runSimulator,
    subscriptions: renderSubscriptions,
    calendar: window.renderCalendar,
    'ai-advisor': window.renderAiAdvisor,
    // quickadd removed
    settings: window.renderSettingsPage,
  };
  var fn = fnMap[page];
  if (fn) fn();
  // Auto-fetch prices when opening investments page if last update > 2 min ago
  if (page === 'investments' && state.investments.length) {
    const anyLive = state.investments.some(i => i.lastUpdated);
    const lastUp = state.investments.reduce((latest, i) => {
      if (!i.lastUpdated) return latest;
      const t = new Date(i.lastUpdated).getTime();
      return t > latest ? t : latest;
    }, 0);
    const twoMinAgo = Date.now() - 2 * 60 * 1000;
    if (!anyLive || lastUp < twoMinAgo) {
      setTimeout(() => refreshAllPrices(), 300);
    }
  }
}

// ── Computed Values ──────────────────────────────────────
function getTotalInvested() {
  return state.investments.reduce((s, i) => s + (i.qty * i.buyPrice), 0);
}

function getTotalPortfolioValue() {
  return state.investments.reduce((s, i) => s + (i.qty * i.currentPrice), 0);
}

function getTotalPnL() {
  return getTotalPortfolioValue() - getTotalInvested();
}

function getTotalIncome(txns = state.transactions) {
  return txns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
}

function getTotalExpenses(txns = state.transactions) {
  return txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
}

function getNetWorth() {
  return getTotalPortfolioValue() + getNetCash();
}

function getNetCash() {
  // Total cash = all income ever (including opening balance) minus all expenses
  return getTotalIncome() - getTotalExpenses();
}

function getThisMonthTxns() {
  const now = new Date();
  return state.transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
}

function getSavingsRate() {
  const mtxns = getThisMonthTxns();
  // Exclude Opening Balance from savings rate calculation
  const realIncome = getTotalIncome(mtxns.filter(t => t.desc !== 'Opening Balance'));
  // Use profile income if no real transactions yet
  const inc = realIncome || state.monthlyIncome || 0;
  if (!inc) return 0;
  const exp = getTotalExpenses(mtxns);
  return Math.max(0, ((inc - exp) / inc) * 100);
}

// ── Dashboard ────────────────────────────────────────────
function renderDashboard() {
  var nw = getNetWorth();
  var portVal = getTotalPortfolioValue();
  var pnl = getTotalPnL();
  var pnlPct = getTotalInvested() ? (pnl / getTotalInvested()) * 100 : 0;
  var savRate = getSavingsRate();
  var hide = state.hideNumbers;
  function fmtH(n) { return hide ? '••••' : fmt(n); }

  var thisMonthTxns = getThisMonthTxns();
  var realIncomeTxns = thisMonthTxns.filter(function(t){ return t.type==='income' && t.desc!=='Opening Balance'; });
  var monthlyIncomeDisplay = realIncomeTxns.length > 0 ? getTotalIncome(realIncomeTxns) : (state.monthlyIncome || 0);
  var monthlyExpenseDisplay = thisMonthTxns.filter(function(t){ return t.type==='expense'; }).reduce(function(s,t){ return s+t.amount; }, 0);

  // Hero card
  var heroEl = document.getElementById('dash-networth-hero');
  if (heroEl) heroEl.textContent = fmtH(nw);
  var portEl = document.getElementById('dash-portfolio-hero');
  if (portEl) portEl.textContent = fmtH(portVal);
  var pnlEl = document.getElementById('dash-pnl-hero');
  if (pnlEl) {
    pnlEl.textContent = (pnl >= 0 ? '+' : '') + fmtH(Math.abs(pnl)) + ' (' + pnlPct.toFixed(1) + '%)';
    pnlEl.style.color = pnl >= 0 ? 'var(--green)' : 'var(--red)';
  }
  var savEl = document.getElementById('dash-savrate-hero');
  if (savEl) {
    savEl.textContent = savRate.toFixed(0) + '%';
    savEl.style.color = savRate > 20 ? 'var(--green)' : 'var(--amber)';
  }

  // Stat cards
  var incEl = document.getElementById('dash-income-val');
  if (incEl) incEl.textContent = fmtH(monthlyIncomeDisplay);
  var expEl = document.getElementById('dash-expense-val');
  if (expEl) expEl.textContent = fmtH(monthlyExpenseDisplay);

  // Update title with name
  var titleEl = document.getElementById('dash-title');
  if (titleEl) titleEl.textContent = state.userName ? state.userName + "'s Overview" : 'Overview';

  renderNetworthChart();
  renderExpenseDonut();
  renderDashTxns();
  renderInsights();
}

function renderDashTxns() {
  const recent = [...state.transactions].sort((a,b) => {
    const dateDiff = new Date(b.date) - new Date(a.date);
    if (dateDiff !== 0) return dateDiff;
    return (b.createdAt || 0) - (a.createdAt || 0);
  }).slice(0,8);
  const el = document.getElementById('dash-txn-list');
  if (!recent.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">💳</div><div class="empty-state-title">No transactions yet</div></div>';
    return;
  }
  el.innerHTML = recent.map(t => `
    <div class="sub-item">
      <div style="display:flex;align-items:center;gap:10px">
        <div class="sub-icon" style="background:${t.type==='income'?'var(--green-dim)':'var(--red-dim)'}">
          ${CAT_ICONS[t.cat] || '📋'}
        </div>
        <div>
          <div class="sub-name">${t.desc}</div>
          <div class="sub-cycle">${t.cat} · ${formatDate(t.date)}</div>
        </div>
      </div>
      <div class="sub-amount" style="color:${t.type==='income'?'var(--green)':'var(--red)'}">
        ${t.type==='income'?'+':'−'}${fmtFull(t.amount)}
      </div>
    </div>
  `).join('');
}

function renderInsights() {
  const insights = generateInsights();
  document.getElementById('dash-insights').innerHTML = insights.map(i => `
    <div class="insight-card">
      <div class="insight-icon" style="background:${i.bg}">${i.icon}</div>
      <div>
        <div class="insight-title">${i.title}</div>
        <div class="insight-body">${i.body}</div>
      </div>
    </div>
  `).join('') || '<div class="empty-state"><div class="empty-state-icon">🤖</div><div class="empty-state-title">Add more data for insights</div></div>';
}

function generateInsights() {
  const insights = [];
  const savRate = getSavingsRate();
  const mtxns = getThisMonthTxns();
  const monthExp = getTotalExpenses(mtxns);
  const monthInc = getTotalIncome(mtxns);
  const pnl = getTotalPnL();
  const pnlPct = getTotalInvested() ? (pnl / getTotalInvested()) * 100 : 0;

  if (savRate > 30) {
    insights.push({ icon: '🚀', bg: 'var(--green-dim)', title: 'Excellent Savings Rate!', body: `You're saving ${savRate.toFixed(0)}% of your income this month. Keep it up — you're on the wealth-building fast track.` });
  } else if (savRate > 10) {
    insights.push({ icon: '💡', bg: 'var(--blue-dim)', title: 'Good Savings Habit', body: `Your ${savRate.toFixed(0)}% savings rate is decent. Try to push toward 30% to accelerate your financial goals.` });
  } else if (monthInc > 0) {
    insights.push({ icon: '⚠️', bg: 'var(--amber-dim)', title: 'Savings Rate Alert', body: `You're saving only ${savRate.toFixed(0)}% this month. Review your spending and try to cut unnecessary expenses.` });
  }

  if (state.investments.length === 0) {
    insights.push({ icon: '📈', bg: 'var(--blue-dim)', title: 'Start Investing', body: 'You have no investments tracked. Consider starting with index ETFs like VOO or VWRA for diversified exposure.' });
  } else if (pnlPct < -5) {
    insights.push({ icon: '📉', bg: 'var(--red-dim)', title: 'Portfolio Down', body: `Your portfolio is down ${Math.abs(pnlPct).toFixed(1)}%. Consider averaging down or reviewing your positions.` });
  } else if (pnlPct > 10) {
    insights.push({ icon: '💰', bg: 'var(--green-dim)', title: 'Portfolio Performing Well', body: `Your investments are up ${pnlPct.toFixed(1)}%! Consider rebalancing if any single position exceeds 25% of your portfolio.` });
  }

  const foodExp = mtxns.filter(t => t.type==='expense' && t.cat==='Food').reduce((s,t) => s+t.amount, 0);
  if (foodExp > monthInc * 0.3 && monthInc > 0) {
    insights.push({ icon: '🍔', bg: 'var(--red-dim)', title: 'High Food Spending', body: `Food costs ${fmtFull(foodExp)} this month (${((foodExp/monthInc)*100).toFixed(0)}% of income). Consider meal prepping to reduce this.` });
  }

  const subTotal = getMonthlySubTotal();
  if (subTotal > 500) {
    insights.push({ icon: '🔄', bg: 'var(--amber-dim)', title: 'Subscription Costs', body: `You're spending ${fmtFull(subTotal)}/month on subscriptions. Review which ones you actively use.` });
  }

  if (state.goals.length === 0) {
    insights.push({ icon: '🎯', bg: 'var(--purple-dim)', title: 'Set Financial Goals', body: 'Define clear financial targets — an emergency fund, retirement fund, or dream vacation. Goals make saving intentional.' });
  }

  return insights.slice(0, 4);
}

// ── Net Worth Chart ──────────────────────────────────────
function renderNetworthChart() {
  const ctx = document.getElementById('chart-networth');
  if (!ctx) return;
  destroyChart('networth');

  const history = [...state.networthHistory];
  const now = new Date();
  const label = `${now.toLocaleString('default',{month:'short'})} '${String(now.getFullYear()).slice(2)}`;
  history.push({ label, value: getNetWorth() });

  const labels = history.map(h => h.label);
  const data = history.map(h => h.value);

  state.charts.networth = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data,
        borderColor: '#00f5a0',
        backgroundColor: 'rgba(0,245,160,0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#00f5a0',
        pointBorderColor: 'transparent',
        borderWidth: 2.5
      }]
    },
    options: chartDefaults({ yTickPrefix: curr() })
  });
}

// ── Expense Donut ────────────────────────────────────────
function renderExpenseDonut() {
  const ctx = document.getElementById('chart-expense-donut');
  if (!ctx) return;
  destroyChart('expDonut');
  const mtxns = getThisMonthTxns().filter(t => t.type === 'expense');
  if (!mtxns.length) { ctx.style.display='none'; return; }
  ctx.style.display='block';
  const cats = {};
  mtxns.forEach(t => cats[t.cat] = (cats[t.cat]||0) + t.amount);
  const keys = Object.keys(cats);
  state.charts.expDonut = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: keys,
      datasets: [{ data: keys.map(k => cats[k]), backgroundColor: keys.map(k => CAT_COLORS[k] || '#8a9dc0'), borderWidth: 0, hoverOffset: 6 }]
    },
    options: { ...chartDefaults(), cutout: '68%', plugins: { legend: { position: 'bottom', labels: { color: '#8a9dc0', font: { size: 11 }, padding: 12 } } } }
  });
}

// ── Investments ──────────────────────────────────────────
function renderInvestments() {
  const total = getTotalPortfolioValue();
  const invested = getTotalInvested();
  const pnl = total - invested;
  const pnlPct = invested ? (pnl / invested * 100) : 0;
  const best = state.investments.reduce((b, i) => {
    const p = ((i.currentPrice - i.buyPrice) / i.buyPrice * 100);
    return (!b || p > b.pct) ? { name: i.name, pct: p } : b;
  }, null);

  const hasMixed = state.investments.some(i => (i.invCurrency||state.currency) !== state.currency);
  document.getElementById('inv-stats').innerHTML = [
    { label: 'Total Invested', value: hasMixed ? '~'+fmt(invested) : fmt(invested), sub: hasMixed ? 'Mixed currencies' : '', color: 'var(--blue)', accent: 'var(--blue)' },
    { label: 'Current Value', value: hasMixed ? '~'+fmt(total) : fmt(total), sub: '', color: 'var(--text-primary)', accent: 'var(--green)' },
    { label: 'Total P&L', value: `${pnl>=0?'+':''}${fmt(pnl)}`, sub: `${pnlPct>=0?'+':''}${pnlPct.toFixed(2)}%`, color: pnl>=0?'var(--green)':'var(--red)', accent: pnl>=0?'var(--green)':'var(--red)' },
    { label: 'Best Performer', value: best ? best.name : '—', sub: best ? `+${best.pct.toFixed(1)}%` : '', color: 'var(--green)', accent: 'var(--amber)' }
  ].map(s => `
    <div class="stat-card" style="--accent-color:${s.accent}">
      <div class="stat-label">${s.label}</div>
      <div class="stat-value" style="font-size:20px;color:${s.color}">${s.value}</div>
      ${s.sub ? '<div style="font-size:11px;color:var(--text-muted);margin-top:3px">'+s.sub+'</div>' : ''}
    </div>
  `).join('');

  const tbody = document.getElementById('inv-table');
  const empty = document.getElementById('inv-empty');

  if (!state.investments.length) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  tbody.innerHTML = state.investments.map(i => {
    const val = i.qty * i.currentPrice;
    const cost = i.qty * i.buyPrice;
    const pnl = val - cost;
    const pnlPct = cost ? (pnl / cost * 100) : 0;
    const col = TYPE_COLORS[i.type] || '#8a9dc0';
    const iSym = invSym(i);
    const iCurr = i.invCurrency || state.currency;
    const priceDecimals = i.currentPrice < 1 ? 4 : 2;
    return `
      <tr>
        <td class="td-primary">
          <div style="display:flex;align-items:center;gap:6px">
            <span class="type-dot" style="background:${col}"></span>
            <div>
              <div>${i.name}</div>
              <div style="font-size:10px;color:var(--text-muted)">${iCurr}</div>
            </div>
          </div>
        </td>
        <td><span class="badge badge-blue">${i.type.toUpperCase()}</span></td>
        <td class="td-mono">${i.qty}</td>
        <td class="td-mono">${fmtInv(i.buyPrice, iCurr, priceDecimals)}</td>
        <td>
          <div style="display:flex;align-items:center;gap:6px">
            <span class="td-mono">${fmtInv(i.currentPrice, iCurr, priceDecimals)}</span>
            ${i.lastUpdated ? '<span class="live-dot" title="Live price"></span>' : ''}
          </div>
          ${i.lastUpdated ? '<div style="font-size:10px;color:var(--text-muted);margin-top:2px">Live · ' + new Date(i.lastUpdated).toLocaleTimeString('en-MY',{hour:'2-digit',minute:'2-digit'}) + '</div>' : '<div style="font-size:10px;color:var(--text-muted);margin-top:2px">Manual — <span style=\"cursor:pointer;text-decoration:underline\" onclick=\"openPriceEdit(\'' + i.id + '\')\">Edit</span></div>'}
        </td>
        <td class="td-mono td-primary">${fmtInv(val, iCurr)}</td>
        <td>
          <span class="${pnl>=0?'pos':'neg'} mono" style="font-size:12px;font-weight:600">
            ${pnl>=0?'+':''}${fmtInv(pnl, iCurr)}<br>
            <span style="font-size:10px;opacity:0.8">${pnlPct>=0?'+':''}${pnlPct.toFixed(2)}%</span>
          </span>
        </td>
        <td>
          <div style="display:flex;gap:4px">
            <button class="btn btn-ghost btn-sm btn-icon" onclick="editInvestment('${i.id}')">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:13px;height:13px"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/></svg>
            </button>
            <button class="btn btn-danger btn-sm btn-icon" onclick="deleteInvestment('${i.id}')">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:13px;height:13px"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// ── Portfolio ────────────────────────────────────────────
function renderPortfolio() {
  const total = getTotalPortfolioValue();
  const invested = getTotalInvested();
  const pnl = total - invested;

  document.getElementById('port-stats').innerHTML = [
    { label: 'Total Holdings', value: state.investments.length.toString(), accent: 'var(--blue)' },
    { label: 'Portfolio Value', value: fmt(total), accent: 'var(--green)' },
    { label: 'Overall Return', value: (invested ? ((pnl/invested)*100).toFixed(2) : '0') + '%', accent: pnl>=0?'var(--green)':'var(--red)' }
  ].map(s => `
    <div class="stat-card" style="--accent-color:${s.accent}">
      <div class="stat-label">${s.label}</div>
      <div class="stat-value" style="font-size:22px">${s.value}</div>
    </div>
  `).join('');

  renderAllocationChart();
  renderPerfTypeChart();
  renderPortfolioBreakdown();
}

function renderAllocationChart() {
  const ctx = document.getElementById('chart-allocation');
  if (!ctx) return;
  destroyChart('allocation');
  if (!state.investments.length) return;
  const byType = {};
  state.investments.forEach(i => {
    byType[i.type] = (byType[i.type]||0) + (i.qty * i.currentPrice);
  });
  const keys = Object.keys(byType);
  state.charts.allocation = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: keys.map(k => k.toUpperCase()),
      datasets: [{ data: keys.map(k => byType[k]), backgroundColor: keys.map(k => TYPE_COLORS[k] || '#8a9dc0'), borderWidth: 0, hoverOffset: 8 }]
    },
    options: { ...chartDefaults(), cutout: '60%', plugins: { legend: { position: 'bottom', labels: { color: '#8a9dc0', font: { size: 11 }, padding: 10 } } } }
  });
}

function renderPerfTypeChart() {
  const ctx = document.getElementById('chart-perf-type');
  if (!ctx) return;
  destroyChart('perfType');
  if (!state.investments.length) return;
  const byType = {};
  state.investments.forEach(i => {
    if (!byType[i.type]) byType[i.type] = { cost: 0, val: 0 };
    byType[i.type].cost += i.qty * i.buyPrice;
    byType[i.type].val += i.qty * i.currentPrice;
  });
  const keys = Object.keys(byType);
  const returns = keys.map(k => byType[k].cost ? ((byType[k].val - byType[k].cost) / byType[k].cost * 100) : 0);
  state.charts.perfType = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: keys.map(k => k.toUpperCase()),
      datasets: [{
        data: returns,
        backgroundColor: returns.map(r => r >= 0 ? 'rgba(0,245,160,0.6)' : 'rgba(255,77,109,0.6)'),
        borderColor: returns.map(r => r >= 0 ? '#00f5a0' : '#ff4d6d'),
        borderWidth: 1.5, borderRadius: 6
      }]
    },
    options: { ...chartDefaults({ yTickSuffix: '%' }), plugins: { legend: { display: false } } }
  });
}

function renderPortfolioBreakdown() {
  const total = getTotalPortfolioValue();
  const el = document.getElementById('portfolio-breakdown');
  if (!state.investments.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📊</div><div class="empty-state-title">No investments</div></div>';
    return;
  }
  const sorted = [...state.investments].sort((a,b) => (b.qty*b.currentPrice) - (a.qty*a.currentPrice));
  el.innerHTML = sorted.map(i => {
    const val = i.qty * i.currentPrice;
    const pct = total ? (val / total * 100) : 0;
    const pnl = val - (i.qty * i.buyPrice);
    const col = TYPE_COLORS[i.type] || '#8a9dc0';
    const iCurr = i.invCurrency || state.currency;
    return `
      <div style="margin-bottom:14px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
          <div style="display:flex;align-items:center;gap:8px">
            <span class="type-dot" style="background:${col}"></span>
            <span style="font-weight:600;font-size:13.5px">${i.name}</span>
            <span class="badge badge-blue" style="font-size:10px">${i.type}</span>
            <span style="font-size:10px;color:var(--text-muted)">${iCurr}</span>
          </div>
          <div style="text-align:right">
            <span class="mono" style="font-size:13.5px;font-weight:600">${fmtInv(val, iCurr)}</span>
            <span class="${pnl>=0?'pos':'neg'} mono" style="font-size:11px;margin-left:8px">${pnl>=0?'+':''}${fmtInv(pnl, iCurr)}</span>
          </div>
        </div>
        <div class="progress-bar" style="height:5px">
          <div class="progress-fill" style="width:${pct}%;background:${col}"></div>
        </div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:3px">${pct.toFixed(1)}% of portfolio · ${i.lastUpdated ? '<span style="color:var(--green)">● Live</span>' : 'Manual'}</div>
      </div>
    `;
  }).join('');
}

// ── Transactions ──────────────────────────────────────────
function renderTransactions() {
  const mtxns = getThisMonthTxns();
  const inc = getTotalIncome(mtxns);
  const exp = getTotalExpenses(mtxns);
  const net = inc - exp;

  document.getElementById('txn-stats').innerHTML = [
    { label: 'Monthly Income', value: fmt(inc), color: 'var(--green)', accent: 'var(--green)' },
    { label: 'Monthly Expenses', value: fmt(exp), color: 'var(--red)', accent: 'var(--red)' },
    { label: 'Net Cash Flow', value: fmt(net), color: net>=0?'var(--green)':'var(--red)', accent: 'var(--blue)' }
  ].map(s => `
    <div class="stat-card" style="--accent-color:${s.accent}">
      <div class="stat-label">${s.label}</div>
      <div class="stat-value" style="font-size:20px;color:${s.color}">${s.value}</div>
    </div>
  `).join('');

  const search = document.getElementById('txn-search')?.value?.toLowerCase() || '';
  const fType = document.getElementById('txn-filter-type')?.value || 'all';
  const fCat = document.getElementById('txn-filter-cat')?.value || 'all';

  let txns = [...state.transactions].sort((a,b) => {
    const dateDiff = new Date(b.date) - new Date(a.date);
    if (dateDiff !== 0) return dateDiff;
    return (b.createdAt || 0) - (a.createdAt || 0);
  });
  if (search) txns = txns.filter(t => t.desc.toLowerCase().includes(search) || t.cat.toLowerCase().includes(search));
  if (fType !== 'all') txns = txns.filter(t => t.type === fType);
  if (fCat !== 'all') txns = txns.filter(t => t.cat === fCat);

  const tbody = document.getElementById('txn-table');
  const empty = document.getElementById('txn-empty');

  if (!txns.length) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
    tbody.innerHTML = txns.map(t => `
      <tr>
        <td class="td-mono" style="font-size:12px">${formatDate(t.date)}</td>
        <td class="td-primary">${t.desc}</td>
        <td><span class="badge" style="background:${CAT_COLORS[t.cat]}22;color:${CAT_COLORS[t.cat]};border:1px solid ${CAT_COLORS[t.cat]}44">${CAT_ICONS[t.cat]||'📋'} ${t.cat}</span></td>
        <td><span class="badge ${t.type==='income'?'badge-green':'badge-red'}">${t.type}</span></td>
        <td class="td-mono td-primary" style="color:${t.type==='income'?'var(--green)':'var(--red)'}">
          ${t.type==='income'?'+':'−'}${fmtFull(t.amount)}
        </td>
        <td>
          <div style="display:flex;gap:4px">
            <button class="btn btn-ghost btn-sm btn-icon" onclick="editTransaction('${t.id}')">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:13px;height:13px"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/></svg>
            </button>
            <button class="btn btn-danger btn-sm btn-icon" onclick="deleteTransaction('${t.id}')">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:13px;height:13px"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }
  renderCashflowChart();
}

function renderCashflowChart() {
  const ctx = document.getElementById('chart-cashflow');
  if (!ctx) return;
  destroyChart('cashflow');
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push({ year: d.getFullYear(), month: d.getMonth(), label: d.toLocaleString('default', { month: 'short' }) });
  }
  const incomes = months.map(m => getTotalIncome(state.transactions.filter(t => {
    const d = new Date(t.date); return d.getMonth() === m.month && d.getFullYear() === m.year;
  })));
  const expenses = months.map(m => getTotalExpenses(state.transactions.filter(t => {
    const d = new Date(t.date); return d.getMonth() === m.month && d.getFullYear() === m.year;
  })));
  state.charts.cashflow = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months.map(m => m.label),
      datasets: [
        { label: 'Income', data: incomes, backgroundColor: 'rgba(0,245,160,0.6)', borderColor: '#00f5a0', borderWidth: 1.5, borderRadius: 5 },
        { label: 'Expenses', data: expenses, backgroundColor: 'rgba(255,77,109,0.6)', borderColor: '#ff4d6d', borderWidth: 1.5, borderRadius: 5 }
      ]
    },
    options: { ...chartDefaults({ yTickPrefix: curr() }), plugins: { legend: { display: true, labels: { color: '#8a9dc0', font: { size: 11 } } } } }
  });
}

// ── Goals ─────────────────────────────────────────────────
function renderGoals() {
  const el = document.getElementById('goals-list');
  if (!state.goals.length) {
    el.innerHTML = `
      <div class="card">
        <div class="empty-state">
          <div class="empty-state-icon">🎯</div>
          <div class="empty-state-title">No goals yet</div>
          <div class="empty-state-sub">Create your first financial goal to start tracking progress</div>
          <button class="btn btn-primary" style="margin-top:16px" onclick="openModal('add-goal-modal')">Create Goal</button>
        </div>
      </div>
    `;
    return;
  }

  el.innerHTML = '<div class="grid-2">' + state.goals.map(g => {
    const pct = Math.min(100, g.target > 0 ? (g.current / g.target * 100) : 0);
    const remaining = Math.max(0, g.target - g.current);
    const monthsLeft = g.monthly > 0 ? Math.ceil(remaining / g.monthly) : null;
    const targetDate = g.targetDate ? new Date(g.targetDate) : null;
    const daysLeft = targetDate ? Math.ceil((targetDate - new Date()) / (1000*60*60*24)) : null;

    return `
      <div class="card" style="position:relative">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="font-size:28px">${g.icon || '🎯'}</div>
            <div>
              <div style="font-weight:700;font-size:16px;letter-spacing:-0.02em">${g.name}</div>
              <div style="font-size:12px;color:var(--text-muted);margin-top:2px">
                ${targetDate ? `Target: ${formatDate(g.targetDate)}` : 'No deadline set'}
              </div>
            </div>
          </div>
          <div style="display:flex;gap:6px">
            <button class="btn btn-ghost btn-sm btn-icon" onclick="editGoal('${g.id}')">✏️</button>
            <button class="btn btn-danger btn-sm btn-icon" onclick="deleteGoal('${g.id}')">🗑️</button>
          </div>
        </div>

        <div style="margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px">
            <span style="font-size:22px;font-weight:800;font-family:'Syne',sans-serif;letter-spacing:-0.04em">${fmtFull(g.current)}</span>
            <span style="font-size:13px;color:var(--text-muted)">of ${fmtFull(g.target)}</span>
          </div>
          <div class="progress-bar" style="height:8px">
            <div class="progress-fill" style="width:${pct}%"></div>
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:6px">
            <span style="font-size:12px;color:var(--green);font-weight:600">${pct.toFixed(1)}% complete</span>
            <span style="font-size:12px;color:var(--text-muted)">${fmtFull(remaining)} left</span>
          </div>
        </div>

        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${monthsLeft !== null ? `<span class="badge badge-blue">~${monthsLeft} months to goal</span>` : ''}
          ${daysLeft !== null ? `<span class="badge ${daysLeft < 30 ? 'badge-red' : 'badge-amber'}">${daysLeft > 0 ? daysLeft + ' days left' : 'Overdue'}</span>` : ''}
          ${pct >= 100 ? '<span class="badge badge-green">🎉 Achieved!</span>' : ''}
        </div>

        <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border)">
          <div style="font-size:11px;color:var(--text-muted);margin-bottom:6px">UPDATE PROGRESS</div>
          <div style="display:flex;gap:8px">
            <input type="number" class="form-input" placeholder="${curr()}0" id="goal-update-${g.id}" style="flex:1" step="any">
            <button class="btn btn-primary btn-sm" onclick="updateGoalProgress('${g.id}')">Add</button>
          </div>
        </div>
      </div>
    `;
  }).join('') + '</div>';
}

function updateGoalProgress(id) {
  const goal = state.goals.find(g => g.id === id);
  const input = document.getElementById('goal-update-' + id);
  const amount = parseFloat(input.value);
  if (!goal || isNaN(amount) || amount <= 0) { toast('Enter a valid amount', 'error'); return; }
  goal.current = Math.min(goal.target, goal.current + amount);
  input.value = '';
  save();
  renderGoals();
  toast('Goal updated!', 'success');
}

// ── Analytics ─────────────────────────────────────────────
function renderAnalytics() {
  const savRate = getSavingsRate();
  const portReturn = getTotalInvested() ? (getTotalPnL() / getTotalInvested() * 100) : 0;
  const totalInc = getTotalIncome();
  const totalExp = getTotalExpenses();
  const netCash = totalInc - totalExp;

  document.getElementById('analytics-kpis').innerHTML = [
    { label: 'Savings Rate', value: savRate.toFixed(1) + '%', accent: savRate>20?'var(--green)':'var(--amber)' },
    { label: 'Investment Return', value: portReturn.toFixed(2) + '%', accent: portReturn>=0?'var(--green)':'var(--red)' },
    { label: 'Net Cash (All Time)', value: fmt(netCash), accent: netCash>=0?'var(--green)':'var(--red)' },
    { label: 'Total Transactions', value: state.transactions.length.toString(), accent: 'var(--blue)' }
  ].map(s => `
    <div class="stat-card" style="--accent-color:${s.accent}">
      <div class="stat-label">${s.label}</div>
      <div class="stat-value" style="font-size:22px">${s.value}</div>
    </div>
  `).join('');

  renderCatBarChart();
  renderRetirementChart();
  calcFire();
}

function renderCatBarChart() {
  const ctx = document.getElementById('chart-cat-bar');
  if (!ctx) return;
  destroyChart('catBar');
  const mtxns = getThisMonthTxns().filter(t => t.type === 'expense');
  const cats = {};
  mtxns.forEach(t => cats[t.cat] = (cats[t.cat]||0) + t.amount);
  const keys = Object.keys(cats).sort((a,b) => cats[b] - cats[a]);
  state.charts.catBar = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: keys,
      datasets: [{ data: keys.map(k => cats[k]), backgroundColor: keys.map(k => (CAT_COLORS[k] || '#8a9dc0') + 'aa'), borderColor: keys.map(k => CAT_COLORS[k] || '#8a9dc0'), borderWidth: 1.5, borderRadius: 8 }]
    },
    options: { ...chartDefaults({ yTickPrefix: curr() }), plugins: { legend: { display: false } } }
  });
}

function calcFire() {
  const expenses = parseFloat(document.getElementById('fire-expenses')?.value) || 3000;
  const savings = parseFloat(document.getElementById('fire-savings')?.value) || 50000;
  const monthly = parseFloat(document.getElementById('fire-monthly')?.value) || 2000;
  const returnRate = (parseFloat(document.getElementById('fire-return')?.value) || 7) / 100;
  const fireNumber = expenses * 12 * 25;
  const monthlyReturn = returnRate / 12;
  let years = 0;
  let portfolio = savings;
  while (portfolio < fireNumber && years < 100) {
    portfolio = portfolio * (1 + monthlyReturn) + monthly;
    years += 1/12;
  }
  const el = document.getElementById('fire-result');
  if (!el) return;
  el.innerHTML = `
    <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">FIRE NUMBER (25× Rule)</div>
    <div class="fire-number">${fmt(fireNumber)}</div>
    <div style="margin-top:12px;color:var(--text-secondary);font-size:13px">
      At <strong style="color:var(--text-primary)">${curr()}${monthly.toLocaleString()}/mo</strong> savings with 
      <strong style="color:var(--text-primary)">${(returnRate*100).toFixed(0)}%</strong> returns,
      you'll reach FIRE in
    </div>
    <div style="font-size:22px;font-weight:700;color:var(--green);margin-top:8px;font-family:'Syne',sans-serif">
      ${years >= 100 ? '100+ years' : years.toFixed(1) + ' years'}
    </div>
  `;
}

function renderRetirementChart() {
  const ctx = document.getElementById('chart-retirement');
  if (!ctx) return;
  destroyChart('retirement');
  const monthly = 1500;
  const returnRate = 0.08 / 12;
  const labels = [];
  const data = [];
  let portfolio = getTotalPortfolioValue();
  for (let y = 0; y <= 30; y++) {
    labels.push('Year ' + y);
    data.push(Math.round(portfolio));
    for (let m = 0; m < 12; m++) portfolio = portfolio * (1 + returnRate) + monthly;
  }
  state.charts.retirement = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{ label: 'Portfolio Value', data, borderColor: '#b66dff', backgroundColor: 'rgba(182,109,255,0.06)', fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: '#b66dff', borderWidth: 2 }]
    },
    options: { ...chartDefaults({ yTickPrefix: curr() }), plugins: { legend: { display: false } } }
  });
}

// ── Simulator ─────────────────────────────────────────────
function runSimulator() {
  const initial = parseFloat(document.getElementById('sim-initial')?.value) || 10000;
  const monthly = parseFloat(document.getElementById('sim-monthly')?.value) || 500;
  const monthlyB = parseFloat(document.getElementById('sim-monthly-b')?.value) || 1000;
  const annReturn = parseFloat(document.getElementById('sim-return')?.value) || 8;
  const years = parseInt(document.getElementById('sim-years')?.value) || 20;
  const r = annReturn / 100 / 12;
  const labels = [];
  const dataA = [], dataB = [], invested = [];
  let portA = initial, portB = initial, inv = initial;
  for (let y = 0; y <= years; y++) {
    labels.push('Yr ' + y);
    dataA.push(Math.round(portA));
    dataB.push(Math.round(portB));
    invested.push(Math.round(inv));
    for (let m = 0; m < 12; m++) {
      portA = portA * (1 + r) + monthly;
      portB = portB * (1 + r) + monthlyB;
      inv += monthly;
    }
  }
  const ctx = document.getElementById('chart-sim');
  if (ctx) {
    destroyChart('sim');
    state.charts.sim = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: `Scenario A (${curr()}${monthly}/mo)`, data: dataA, borderColor: '#00f5a0', backgroundColor: 'rgba(0,245,160,0.06)', fill: true, tension: 0.4, pointRadius: 2, borderWidth: 2.5 },
          { label: `Scenario B (${curr()}${monthlyB}/mo)`, data: dataB, borderColor: '#4d9fff', backgroundColor: 'rgba(77,159,255,0.06)', fill: true, tension: 0.4, pointRadius: 2, borderWidth: 2.5 },
          { label: 'Total Invested', data: invested, borderColor: '#8a9dc0', backgroundColor: 'transparent', tension: 0.4, pointRadius: 0, borderWidth: 1.5, borderDash: [5,5] }
        ]
      },
      options: { ...chartDefaults({ yTickPrefix: curr() }), plugins: { legend: { display: true, labels: { color: '#8a9dc0', font: { size: 11 }, padding: 12 } } } }
    });
  }

  const finalA = dataA[dataA.length-1];
  const finalB = dataB[dataB.length-1];
  const totalInvA = initial + monthly * years * 12;
  const totalInvB = initial + monthlyB * years * 12;

  const sumEl = document.getElementById('sim-summary');
  if (sumEl) sumEl.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div style="background:var(--green-dim);border:1px solid var(--border-accent);border-radius:12px;padding:14px">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--green);margin-bottom:6px">Scenario A</div>
        <div style="font-size:18px;font-weight:800;font-family:'Syne',sans-serif;color:var(--green)">${fmt(finalA)}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:3px">Gain: ${fmt(finalA - totalInvA)}</div>
      </div>
      <div style="background:var(--blue-dim);border:1px solid rgba(77,159,255,0.25);border-radius:12px;padding:14px">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--blue);margin-bottom:6px">Scenario B</div>
        <div style="font-size:18px;font-weight:800;font-family:'Syne',sans-serif;color:var(--blue)">${fmt(finalB)}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:3px">Gain: ${fmt(finalB - totalInvB)}</div>
      </div>
    </div>
  `;
}

// ── Subscriptions ─────────────────────────────────────────
function getMonthlySubTotal() {
  return state.subscriptions.reduce((s, sub) => {
    let monthly = sub.amount;
    if (sub.cycle === 'yearly') monthly = sub.amount / 12;
    if (sub.cycle === 'weekly') monthly = sub.amount * 4.33;
    return s + monthly;
  }, 0);
}

function renderSubscriptions() {
  const monthly = getMonthlySubTotal();
  const yearly = monthly * 12;
  document.getElementById('sub-stats').innerHTML = [
    { label: 'Monthly Total', value: fmtFull(monthly), accent: 'var(--red)' },
    { label: 'Yearly Total', value: fmtFull(yearly), accent: 'var(--amber)' },
    { label: 'Active Subscriptions', value: state.subscriptions.length.toString(), accent: 'var(--blue)' }
  ].map(s => `
    <div class="stat-card" style="--accent-color:${s.accent}">
      <div class="stat-label">${s.label}</div>
      <div class="stat-value" style="font-size:20px">${s.value}</div>
    </div>
  `).join('');

  const el = document.getElementById('sub-list');
  const empty = document.getElementById('sub-empty');
  if (!state.subscriptions.length) {
    el.style.display = 'none';
    empty.style.display = 'block';
    return;
  }
  el.style.display = 'block';
  empty.style.display = 'none';
  const sorted = [...state.subscriptions].sort((a,b) => {
    let am = a.amount; if (a.cycle==='yearly') am/=12; if(a.cycle==='weekly') am*=4.33;
    let bm = b.amount; if (b.cycle==='yearly') bm/=12; if(b.cycle==='weekly') bm*=4.33;
    return bm - am;
  });
  el.innerHTML = sorted.map(sub => {
    let mo = sub.amount;
    if (sub.cycle === 'yearly') mo = sub.amount / 12;
    if (sub.cycle === 'weekly') mo = sub.amount * 4.33;
    const renewal = sub.renewal ? new Date(sub.renewal) : null;
    const daysToRenew = renewal ? Math.ceil((renewal - new Date()) / (1000*60*60*24)) : null;
    return `
      <div class="sub-item">
        <div style="display:flex;align-items:center;gap:12px">
          <div class="sub-icon" style="background:var(--bg-elevated);font-size:18px">${sub.icon || '📦'}</div>
          <div>
            <div class="sub-name">${sub.name}</div>
            <div class="sub-cycle">${sub.cat} · ${sub.cycle} · ${fmtFull(sub.amount)}/${sub.cycle === 'monthly' ? 'mo' : sub.cycle === 'yearly' ? 'yr' : 'wk'}</div>
            ${daysToRenew !== null ? `<div style="font-size:11px;color:${daysToRenew<=7?'var(--red)':'var(--text-muted)'};margin-top:1px">Renews in ${daysToRenew} days</div>` : ''}
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          <div style="text-align:right">
            <div class="sub-amount">${fmtFull(mo)}<span style="font-size:10px;color:var(--text-muted)">/mo</span></div>
          </div>
          <button class="btn btn-danger btn-sm btn-icon" onclick="deleteSubscription('${sub.id}')">🗑️</button>
        </div>
      </div>
    `;
  }).join('');
}

// ── CRUD: Transactions ────────────────────────────────────
function selectTxnType(type) {
  state.selectedTxnType = type;
  document.getElementById('txn-type-income').classList.toggle('active', type === 'income');
  document.getElementById('txn-type-expense').classList.toggle('active', type === 'expense');
  // Update save button color
  var saveBtn = document.querySelector('#add-txn-modal .btn-primary[onclick="saveTransaction()"]');
  if (saveBtn) {
    if (type === 'expense') {
      saveBtn.style.background = 'var(--red)';
      saveBtn.style.borderColor = 'var(--red)';
      saveBtn.style.boxShadow = '0 0 20px rgba(255,77,109,0.3)';
      saveBtn.textContent = '− Save Expense';
    } else {
      saveBtn.style.background = '';
      saveBtn.style.borderColor = '';
      saveBtn.style.boxShadow = '';
      saveBtn.textContent = '+ Save Income';
    }
  }
}

function saveTransaction() {
  const id = document.getElementById('txn-edit-id').value;
  const desc = document.getElementById('txn-desc').value.trim();
  const amount = parseFloat(document.getElementById('txn-amount').value);
  const cat = document.getElementById('txn-cat').value;
  const date = document.getElementById('txn-date').value;

  if (!desc) { toast('Please enter a description', 'error'); return; }
  if (!amount || amount <= 0) { toast('Please enter a valid amount', 'error'); return; }
  if (!date) { toast('Please select a date', 'error'); return; }

  if (id) {
    const idx = state.transactions.findIndex(t => t.id === id);
    if (idx !== -1) state.transactions[idx] = { ...state.transactions[idx], desc, amount, cat, date, type: state.selectedTxnType, updatedAt: Date.now() };
    toast('Transaction updated', 'success');
  } else {
    state.transactions.push({ id: uid(), desc, amount, cat, date, type: state.selectedTxnType, createdAt: Date.now() });
    toast('Transaction added', 'success');
  }
  save();
  closeModal('add-txn-modal');
  renderAll();
}

function editTransaction(id) {
  const t = state.transactions.find(t => t.id === id);
  if (!t) return;
  document.getElementById('txn-edit-id').value = t.id;
  document.getElementById('txn-modal-title').textContent = 'Edit Transaction';
  document.getElementById('txn-desc').value = t.desc;
  document.getElementById('txn-amount').value = t.amount;
  document.getElementById('txn-cat').value = t.cat;
  document.getElementById('txn-date').value = t.date;
  selectTxnType(t.type);
  openModal('add-txn-modal');
}

function deleteTransaction(id) {
  showConfirm('Delete this transaction?', () => {
    state.transactions = state.transactions.filter(t => t.id !== id);
    save(); renderAll(); toast('Transaction deleted', 'info');
  });
}

// ── CRUD: Investments ─────────────────────────────────────
// Fetch price into modal (called by "Fetch Price" button)
const SPIN_SVG = '<svg class="spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>';
const REFRESH_SVG = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>';

function fmtPrice(p, sym) {
  if (!p && p !== 0) return (sym || '') + '—';
  const dec = p < 1 ? 6 : p < 100 ? 4 : 2;
  return (sym || '') + p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: dec });
}

// Shared price card renderer used by both add and edit flows
function showPriceCard(currentPrice, buyPrice, qty, invCurr, purchaseDate, lastUpdated, buyLabel) {
  const sym = CURR_SYMBOL[invCurr] || invCurr || 'RM';
  const q = qty || 1;
  const pnl = (currentPrice - buyPrice) * q;
  const pnlPct = buyPrice ? ((currentPrice - buyPrice) / buyPrice * 100) : 0;
  const label = buyLabel || (purchaseDate ? new Date(purchaseDate + 'T00:00:00').toLocaleDateString('en-MY',{day:'numeric',month:'short',year:'numeric'}) : 'Purchase date');
  const updLabel = lastUpdated ? 'Live · ' + new Date(lastUpdated).toLocaleTimeString('en-MY',{hour:'2-digit',minute:'2-digit'}) : 'Live now';
  const resultEl = document.getElementById('inv-fetch-result');
  resultEl.style.display = 'block';
  resultEl.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
      <div style="background:var(--bg-card);border-radius:10px;padding:12px;border:1px solid var(--border)">
        <div style="font-size:10px;color:var(--green);font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:4px">Current Price</div>
        <div style="font-family:'DM Mono',monospace;font-size:16px;font-weight:700;color:var(--text-primary)">${fmtPrice(currentPrice, sym)}</div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:3px">${updLabel}</div>
      </div>
      <div style="background:var(--bg-card);border-radius:10px;padding:12px;border:1px solid var(--border)">
        <div style="font-size:10px;color:var(--blue);font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:4px">Buy Price</div>
        <div style="font-family:'DM Mono',monospace;font-size:16px;font-weight:700;color:var(--text-primary)">${fmtPrice(buyPrice, sym)}</div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:3px">${label}</div>
      </div>
      <div style="background:var(--bg-card);border-radius:10px;padding:12px;border:1px solid ${pnl>=0?'rgba(0,245,160,0.2)':'rgba(255,77,109,0.2)'}">
        <div style="font-size:10px;color:${pnl>=0?'var(--green)':'var(--red)'};font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:4px">P&amp;L (×${q})</div>
        <div class="pnl-preview" style="font-family:'DM Mono',monospace;font-size:16px;font-weight:700;color:${pnl>=0?'var(--green)':'var(--red)'}">${pnl>=0?'+':''}${fmtPrice(Math.abs(pnl),sym)}</div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:3px">${pnlPct>=0?'+':''}${pnlPct.toFixed(2)}%</div>
      </div>
    </div>
  `;
}

async function invFetchPrice() {
  const ticker   = document.getElementById('inv-name').value.trim().toUpperCase();
  const typeEl   = document.getElementById('inv-type');
  const dateEl   = document.getElementById('inv-date');
  const currEl   = document.getElementById('inv-currency');
  const btn      = document.getElementById('inv-fetch-btn');
  const statusEl = document.getElementById('inv-save-status');
  const resultEl = document.getElementById('inv-fetch-result');

  if (!ticker) { toast('Enter a ticker symbol first', 'error'); return; }
  if (!dateEl.value) { toast('Set your purchase date first', 'error'); return; }

  const invCurr = currEl.value || state.currency;
  const purchaseDate = dateEl.value;

  // Auto-detect type from ticker
  if (CRYPTO_IDS[ticker]) typeEl.value = 'crypto';
  else if (COMMODITY_SYMBOLS[ticker]) typeEl.value = 'commodity';
  const type = typeEl.value;

  btn.disabled = true;
  btn.innerHTML = SPIN_SVG + ' Fetching...';
  statusEl.textContent = 'Fetching live price...';
  resultEl.style.display = 'none';
  resultEl.innerHTML = '';

  try {
    // Step 1: live current price
    const currentPrice = await fetchSinglePrice({ name: ticker, type }, invCurr);

    // Step 2: historical buy price on purchase date
    let buyPrice = currentPrice;
    let buyLabel = 'Purchased today';
    const purchaseDateObj = new Date(purchaseDate + 'T00:00:00');
    const today = new Date(); today.setHours(0,0,0,0);

    if (purchaseDateObj < today) {
      statusEl.textContent = 'Fetching price on ' + purchaseDateObj.toLocaleDateString('en-MY',{day:'numeric',month:'short',year:'numeric'}) + '...';
      try {
        buyPrice = await fetchHistoricalPrice(ticker, type, purchaseDate, invCurr);
        buyLabel = 'Closing price ' + purchaseDateObj.toLocaleDateString('en-MY',{day:'numeric',month:'short',year:'numeric'});
      } catch(histErr) {
        buyLabel = '⚠️ Historical unavailable — edit manually';
        toast('Could not get price for ' + purchaseDate + '. You can edit the buy price manually.', 'info');
      }
    }

    // Step 3: fill hidden field + store on btn
    document.getElementById('inv-buy').value = buyPrice.toFixed(buyPrice < 1 ? 6 : 2);
    btn.dataset.fetchedCurrentPrice = currentPrice;
    btn.dataset.fetchedBuyPrice = buyPrice;
    btn.dataset.fetchedAt = new Date().toISOString();

    // Step 4: render card
    const qty = parseFloat(document.getElementById('inv-qty').value) || 1;
    showPriceCard(currentPrice, buyPrice, qty, invCurr, purchaseDate, new Date().toISOString(), buyLabel);
    statusEl.textContent = '✅ Done — adjust quantity if needed, then Save';

  } catch(e) {
    console.error('Fetch error:', e);
    statusEl.textContent = '⚠️ Could not fetch — check ticker symbol';
    toast('Could not fetch ' + ticker + '. Is the ticker correct?', 'error');
  }

  btn.disabled = false;
  btn.innerHTML = REFRESH_SVG + ' Fetch Price';
}


// Recalculate P&L preview when qty changes after fetch
function updatePnlPreview() {
  const fetchBtn = document.getElementById('inv-fetch-btn');
  const resultEl = document.getElementById('inv-fetch-result');
  if (!fetchBtn.dataset.fetchedCurrentPrice || resultEl.style.display === 'none') return;
  const currentPrice = parseFloat(fetchBtn.dataset.fetchedCurrentPrice);
  const buyPrice     = parseFloat(fetchBtn.dataset.fetchedBuyPrice || fetchBtn.dataset.fetchedCurrentPrice);
  const qty          = parseFloat(document.getElementById('inv-qty').value) || 1;
  const invCurr      = document.getElementById('inv-currency').value || state.currency;
  const sym          = CURR_SYMBOL[invCurr] || invCurr;
  const pnl    = (currentPrice - buyPrice) * qty;
  const pnlPct = buyPrice ? ((currentPrice - buyPrice) / buyPrice * 100) : 0;
  const pnlEl  = resultEl.querySelector('.pnl-preview');
  if (pnlEl) {
    pnlEl.style.color = pnl >= 0 ? 'var(--green)' : 'var(--red)';
    pnlEl.innerHTML = (pnl>=0?'+':'') + fmtPrice(Math.abs(pnl), sym) + ' &nbsp;<span style="font-size:12px">(' + (pnlPct>=0?'+':'') + pnlPct.toFixed(2) + '%)</span>';
  }
}

async function saveInvestment() {
  const id         = document.getElementById('inv-edit-id').value;
  const name       = document.getElementById('inv-name').value.trim().toUpperCase();
  const type       = document.getElementById('inv-type').value;
  const invCurrency= document.getElementById('inv-currency').value || state.currency;
  const qty        = parseFloat(document.getElementById('inv-qty').value);
  const buyPriceEl = parseFloat(document.getElementById('inv-buy').value);
  const date       = document.getElementById('inv-date').value || new Date().toISOString().slice(0,10);
  const fetchBtn   = document.getElementById('inv-fetch-btn');
  const saveBtn    = document.getElementById('inv-save-btn');
  const statusEl   = document.getElementById('inv-save-status');

  if (!name) { toast('Enter a ticker symbol', 'error'); return; }
  if (!qty || qty <= 0) { toast('Enter a valid quantity', 'error'); return; }

  // Pull prices: prefer what was fetched (which correctly separates buy vs current)
  let currentPrice = fetchBtn.dataset.fetchedCurrentPrice ? parseFloat(fetchBtn.dataset.fetchedCurrentPrice) : null;
  let buyPrice     = fetchBtn.dataset.fetchedBuyPrice     ? parseFloat(fetchBtn.dataset.fetchedBuyPrice)     : null;

  // If user manually edited the buy price field, honour it
  if (!isNaN(buyPriceEl) && buyPriceEl > 0) buyPrice = buyPriceEl;

  // If we still don't have prices, auto-fetch now
  if (!currentPrice || !buyPrice) {
    saveBtn.disabled = true;
    saveBtn.innerHTML = SPIN_SVG + ' Fetching prices...';
    statusEl.textContent = 'Fetching prices...';
    try {
      currentPrice = await fetchSinglePrice({ name, type }, invCurrency);
      if (!buyPrice) {
        try {
          buyPrice = await fetchHistoricalPrice(name, type, date, invCurrency);
        } catch(e) {
          buyPrice = currentPrice; // fallback
        }
      }
      document.getElementById('inv-buy').value = buyPrice.toFixed(buyPrice < 1 ? 6 : 2);
    } catch(e) {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Investment';
      statusEl.textContent = '';
      toast('Could not fetch prices — please enter buy price manually', 'error');
      return;
    }
    saveBtn.disabled = false;
    saveBtn.textContent = 'Save Investment';
  }

  const lastUpdated = fetchBtn.dataset.fetchedAt || new Date().toISOString();

  if (id) {
    const idx = state.investments.findIndex(i => i.id === id);
    if (idx !== -1) {
      state.investments[idx] = { ...state.investments[idx], name, type, invCurrency, qty, buyPrice, currentPrice, date, lastUpdated };
    }
    toast('Investment updated', 'success');
  } else {
    state.investments.push({ id: uid(), name, type, invCurrency, qty, buyPrice, currentPrice, date, lastUpdated });
    toast(name + ' added! P&L calculated from ' + (date || 'today'), 'success');
  }
  save(); closeModal('add-inv-modal'); renderAll();
}

function editInvestment(id) {
  const i = state.investments.find(inv => inv.id === id);
  if (!i) return;

  // Set edit ID FIRST so openModal knows not to reset the form
  document.getElementById('inv-edit-id').value = i.id;
  openModal('add-inv-modal');

  // Now populate after modal is open
  document.getElementById('inv-modal-title').textContent = 'Edit Investment';
  document.getElementById('inv-name').value = i.name;
  document.getElementById('inv-name').setAttribute('readonly', 'readonly'); // ticker shouldn't change on edit
  document.getElementById('inv-type').value = i.type;
  document.getElementById('inv-currency').value = i.invCurrency || state.currency;
  document.getElementById('inv-qty').value = i.qty;
  document.getElementById('inv-buy').value = i.buyPrice ? i.buyPrice.toFixed(i.buyPrice < 1 ? 6 : 2) : '';
  document.getElementById('inv-date').value = i.date || '';

  const fetchBtn = document.getElementById('inv-fetch-btn');
  fetchBtn.dataset.fetchedCurrentPrice = i.currentPrice;
  fetchBtn.dataset.fetchedBuyPrice = i.buyPrice;
  fetchBtn.dataset.fetchedAt = i.lastUpdated || '';
  fetchBtn.innerHTML = REFRESH_SVG + ' Refresh Prices';

  // Show existing price card
  showPriceCard(i.currentPrice, i.buyPrice, i.qty, i.invCurrency || state.currency, i.date, i.lastUpdated);
  document.getElementById('inv-save-status').textContent = 'Click "Refresh Prices" to update to latest.';
}

function deleteInvestment(id) {
  showConfirm('Remove this investment?', () => {
    state.investments = state.investments.filter(i => i.id !== id);
    save(); renderAll(); toast('Investment removed', 'info');
  });
}

function openPriceEdit(id) {
  const i = state.investments.find(i => i.id === id);
  if (!i) return;
  document.getElementById('price-edit-id').value = id;
  document.getElementById('price-new').value = i.currentPrice;
  openModal('edit-price-modal');
}

function updatePrice() {
  const id = document.getElementById('price-edit-id').value;
  const price = parseFloat(document.getElementById('price-new').value);
  if (!price || price <= 0) { toast('Invalid price', 'error'); return; }
  const i = state.investments.find(i => i.id === id);
  if (i) { i.currentPrice = price; save(); renderAll(); closeModal('edit-price-modal'); toast('Price updated', 'success'); }
}

// ── CRUD: Goals ───────────────────────────────────────────
function saveGoal() {
  const id = document.getElementById('goal-edit-id').value;
  const name = document.getElementById('goal-name').value.trim();
  const target = parseFloat(document.getElementById('goal-target').value);
  const current = parseFloat(document.getElementById('goal-current').value) || 0;
  const monthly = parseFloat(document.getElementById('goal-monthly').value) || 0;
  const targetDate = document.getElementById('goal-date').value;

  if (!name) { toast('Enter goal name', 'error'); return; }
  if (!target || target <= 0) { toast('Enter target amount', 'error'); return; }

  const icon = state.selectedGoalIcon || '🎯';
  if (id) {
    const idx = state.goals.findIndex(g => g.id === id);
    if (idx !== -1) state.goals[idx] = { ...state.goals[idx], name, target, current, monthly, targetDate, icon };
    toast('Goal updated', 'success');
  } else {
    state.goals.push({ id: uid(), name, target, current, monthly, targetDate, icon });
    toast('Goal created', 'success');
  }
  save(); closeModal('add-goal-modal'); renderGoals();
}

function editGoal(id) {
  const g = state.goals.find(g => g.id === id);
  if (!g) return;
  document.getElementById('goal-edit-id').value = g.id;
  document.getElementById('goal-modal-title').textContent = 'Edit Goal';
  document.getElementById('goal-name').value = g.name;
  document.getElementById('goal-target').value = g.target;
  document.getElementById('goal-current').value = g.current;
  document.getElementById('goal-monthly').value = g.monthly;
  document.getElementById('goal-date').value = g.targetDate || '';
  selectGoalIcon(g.icon || '🎯');
  openModal('add-goal-modal');
}

function deleteGoal(id) {
  showConfirm('Delete this goal?', () => {
    state.goals = state.goals.filter(g => g.id !== id);
    save(); renderGoals(); toast('Goal deleted', 'info');
  });
}

function selectGoalIcon(icon) {
  state.selectedGoalIcon = icon;
  document.querySelectorAll('.goal-icon-opt').forEach(el => {
    el.classList.toggle('selected', el.dataset.icon === icon);
  });
}

// ── CRUD: Subscriptions ───────────────────────────────────
function saveSubscription() {
  const id = document.getElementById('sub-edit-id').value;
  const name = document.getElementById('sub-name').value.trim();
  const icon = document.getElementById('sub-icon').value.trim() || '📦';
  const amount = parseFloat(document.getElementById('sub-amount').value);
  const cycle = document.getElementById('sub-cycle').value;
  const cat = document.getElementById('sub-cat').value;
  const renewal = document.getElementById('sub-renewal').value;

  if (!name) { toast('Enter service name', 'error'); return; }
  if (!amount || amount <= 0) { toast('Enter valid amount', 'error'); return; }

  if (id) {
    const idx = state.subscriptions.findIndex(s => s.id === id);
    if (idx !== -1) state.subscriptions[idx] = { ...state.subscriptions[idx], name, icon, amount, cycle, cat, renewal };
    toast('Updated', 'success');
  } else {
    state.subscriptions.push({ id: uid(), name, icon, amount, cycle, cat, renewal });
    toast('Subscription added', 'success');
  }
  save(); closeModal('add-sub-modal'); renderSubscriptions();
}

function deleteSubscription(id) {
  showConfirm('Remove subscription?', () => {
    state.subscriptions = state.subscriptions.filter(s => s.id !== id);
    save(); renderSubscriptions(); toast('Removed', 'info');
  });
}

// ── Net Worth Snapshot ────────────────────────────────────
function takeNetworthSnapshot() {
  const now = new Date();
  const label = `${now.toLocaleString('default',{month:'short'})} '${String(now.getFullYear()).slice(2)}`;
  const existing = state.networthHistory.findIndex(h => h.label === label);
  const snap = { label, value: getNetWorth() };
  if (existing !== -1) state.networthHistory[existing] = snap;
  else state.networthHistory.push(snap);
  if (state.networthHistory.length > 24) state.networthHistory.shift();
  save(); toast('Snapshot saved!', 'success');
}

// ── Data Export / Import ──────────────────────────────────
function exportData() {
  const data = JSON.stringify(state, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wealthos-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast('Data exported!', 'success');
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const imported = JSON.parse(e.target.result);
      if (!imported.transactions && !imported.investments) throw new Error('Invalid format');
      Object.assign(state, imported);
      save(); renderAll();
      toast('Data imported successfully!', 'success');
    } catch(err) {
      toast('Invalid backup file', 'error');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

function confirmReset() {
  showConfirm('⚠️ Reset ALL data? This will permanently delete all transactions, investments, goals, subscriptions, and settings. This cannot be undone.', function() {
    // Clear ALL localStorage keys (in case any stale ones exist)
    try {
      var keysToRemove = [];
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key && (key.startsWith('wealthos') || key.startsWith('wos') || key === 'wealthos_v2' || key === 'wealthos_last_snap')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(function(k) { localStorage.removeItem(k); });
    } catch(e) {}

    // Also clear IndexedDB fallback
    try {
      indexedDB.deleteDatabase('wealthos');
    } catch(e) {}

    // Fully reset state to defaults
    state = {
      currency: 'MYR', darkMode: true, themeMode: 'dark', hideNumbers: false,
      transactions: [], investments: [], goals: [], subscriptions: [], networthHistory: [],
      selectedTxnType: 'income', selectedGoalIcon: '🎯', editingGoalId: null, charts: {},
      onboardingDone: false, userName: '', monthlyIncome: 0, budgetLimit: 0,
      weekStart: 'monday', language: 'en'
    };

    // Destroy all chart instances to prevent leaks
    if (typeof Chart !== 'undefined') {
      Object.values(Chart.instances || {}).forEach(function(c) { try { c.destroy(); } catch(e) {} });
    }

    // Force a full page reload to make sure nothing stale remains
    toast('All data cleared. Reloading...', 'info');
    setTimeout(function() {
      window.location.reload();
    }, 800);
  });
}

// ── Modals ────────────────────────────────────────────────
function resetInvModal() {
  document.getElementById('inv-edit-id').value = '';
  document.getElementById('inv-modal-title').textContent = 'Add Investment';
  document.getElementById('inv-name').value = '';
  document.getElementById('inv-name').removeAttribute('readonly');
  document.getElementById('inv-type').value = 'stock';
  document.getElementById('inv-currency').value = state.currency;
  document.getElementById('inv-qty').value = '';
  document.getElementById('inv-buy').value = '';
  document.getElementById('inv-date').value = new Date().toISOString().slice(0,10);
  const fetchBtn = document.getElementById('inv-fetch-btn');
  fetchBtn.dataset.fetchedCurrentPrice = '';
  fetchBtn.dataset.fetchedBuyPrice = '';
  fetchBtn.dataset.fetchedAt = '';
  fetchBtn.disabled = false;
  fetchBtn.innerHTML = REFRESH_SVG + ' Fetch Price';
  const resEl = document.getElementById('inv-fetch-result');
  resEl.style.display = 'none';
  resEl.innerHTML = '';
  document.getElementById('inv-save-status').textContent = 'Enter date & ticker, then click Fetch Price';
  const saveBtn = document.getElementById('inv-save-btn');
  saveBtn.disabled = false;
  saveBtn.textContent = 'Save Investment';
}

function openModal(id) {
  document.getElementById(id).classList.add('open');
  // Only reset if opening fresh (not called from editX functions)
  if (id === 'add-txn-modal' && !document.getElementById('txn-edit-id').value) {
    document.getElementById('txn-modal-title').textContent = 'Add Transaction';
    document.getElementById('txn-desc').value = '';
    document.getElementById('txn-amount').value = '';
    document.getElementById('txn-date').value = new Date().toISOString().slice(0,10);
    // Don't reset type here — caller (quickAddExpense/Income) sets it before openModal
    // Only default to income if no type has been set yet
    if (!state.selectedTxnType) selectTxnType('income');
  }
  if (id === 'add-inv-modal' && !document.getElementById('inv-edit-id').value) {
    resetInvModal();
  }
  if (id === 'add-goal-modal' && !document.getElementById('goal-edit-id').value) {
    document.getElementById('goal-modal-title').textContent = 'New Financial Goal';
    document.getElementById('goal-name').value = '';
    document.getElementById('goal-target').value = '';
    document.getElementById('goal-current').value = '';
    document.getElementById('goal-monthly').value = '';
    document.getElementById('goal-date').value = '';
    selectGoalIcon('🎯');
  }
  if (id === 'add-sub-modal' && !document.getElementById('sub-edit-id').value) {
    document.getElementById('sub-modal-title').textContent = 'Add Subscription';
    document.getElementById('sub-name').value = '';
    document.getElementById('sub-icon').value = '';
    document.getElementById('sub-amount').value = '';
    document.getElementById('sub-renewal').value = '';
  }
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

// Close on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});

// ── Charts Helper ─────────────────────────────────────────
function chartDefaults(opts = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0d1421',
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        titleColor: '#f0f4ff',
        bodyColor: '#8a9dc0',
        padding: 10,
        cornerRadius: 10,
        callbacks: {
          label: ctx => {
            const v = ctx.parsed.y ?? ctx.parsed;
            if (opts.yTickPrefix) return ' ' + opts.yTickPrefix + v.toLocaleString();
            if (opts.yTickSuffix) return ' ' + v.toFixed(2) + opts.yTickSuffix;
            return ' ' + v;
          }
        }
      }
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false }, ticks: { color: '#4a5c7a', font: { size: 10 } } },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
        ticks: {
          color: '#4a5c7a', font: { size: 10 },
          callback: v => opts.yTickPrefix ? opts.yTickPrefix + v.toLocaleString() : opts.yTickSuffix ? v.toFixed(1) + opts.yTickSuffix : v
        }
      }
    }
  };
}

function destroyChart(key) {
  if (state.charts[key]) { state.charts[key].destroy(); delete state.charts[key]; }
}


// ── Live Price Fetching ────────────────────────────────────

// Maps common commodity tickers to Yahoo Finance symbols
const COMMODITY_SYMBOLS = {
  GOLD: 'GC=F', XAUUSD: 'GC=F', XAU: 'GC=F',
  SILVER: 'SI=F', XAG: 'SI=F',
  OIL: 'CL=F', WTI: 'CL=F',
  BRENT: 'BZ=F',
  GAS: 'NG=F',
};

// CoinGecko IDs for common crypto
const CRYPTO_IDS = {
  BTC: 'bitcoin', ETH: 'ethereum', BNB: 'binancecoin',
  SOL: 'solana', XRP: 'ripple', ADA: 'cardano',
  DOGE: 'dogecoin', DOT: 'polkadot', MATIC: 'matic-network',
  AVAX: 'avalanche-2', LINK: 'chainlink', UNI: 'uniswap',
  LTC: 'litecoin', ATOM: 'cosmos', NEAR: 'near',
  OP: 'optimism', ARB: 'arbitrum', TRX: 'tron',
};

// ── Price API helpers ─────────────────────────────────────

const MYR_RATE = 4.47;

function toInvCurrency(usdPrice, invCurrency) {
  return invCurrency === 'MYR' ? usdPrice * MYR_RATE : usdPrice;
}

// ── Stocks & ETFs: use Yahoo Finance via multiple reliable proxies ──

// Helper: parse Yahoo JSON and extract regularMarketPrice
function parseYahooLive(text, invCurrency) {
  if (!text) return null;
  // Reject obvious non-JSON responses (HTML error pages from proxies)
  const trimmed = text.trimStart();
  if (!trimmed.startsWith('{')) return null;
  try {
    const data = JSON.parse(text);
    const result = data?.chart?.result?.[0];
    const price = result?.meta?.regularMarketPrice;
    const currency = result?.meta?.currency || 'USD';
    if (price && price > 0) {
      if (currency === 'USD' && invCurrency === 'MYR') return price * MYR_RATE;
      return price;
    }
  } catch(e) {}
  return null;
}

// Helper: build all proxy URLs for a Yahoo URL
function yahooProxyUrls(yahooUrl) {
  return [
    // corsproxy.io — often fastest and most reliable for Yahoo
    `https://corsproxy.io/?url=${encodeURIComponent(yahooUrl)}`,
    // allorigins query1
    `https://api.allorigins.win/raw?url=${encodeURIComponent(yahooUrl)}`,
    // Try query2 domain via allorigins (Yahoo sometimes serves different data)
    `https://api.allorigins.win/raw?url=${encodeURIComponent(yahooUrl.replace('query1.finance', 'query2.finance'))}`,
    // corsproxy.io with query2
    `https://corsproxy.io/?url=${encodeURIComponent(yahooUrl.replace('query1.finance', 'query2.finance'))}`,
    // thingproxy as final fallback
    `https://thingproxy.freeboard.io/fetch/${yahooUrl}`,
  ];
}

async function fetchYahooPrice(ticker, invCurrency) {
  const symbol = COMMODITY_SYMBOLS[ticker.toUpperCase()] || ticker;
  const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;

  for (const proxyUrl of yahooProxyUrls(yahooUrl)) {
    try {
      const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) continue;
      const text = await res.text();
      const price = parseYahooLive(text, invCurrency);
      if (price) return price;
    } catch(e) { /* try next */ }
  }
  throw new Error('Could not fetch price for ' + ticker + ' — try again or enter manually');
}

// ── Yahoo historical price ──
async function fetchYahooHistorical(ticker, date, invCurrency) {
  const symbol = COMMODITY_SYMBOLS[ticker.toUpperCase()] || ticker;
  const from = Math.floor((date.getTime() - 4 * 86400000) / 1000);
  const to   = Math.floor((date.getTime() + 5 * 86400000) / 1000);
  const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&period1=${from}&period2=${to}`;

  for (const proxyUrl of yahooProxyUrls(yahooUrl)) {
    try {
      const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(12000) });
      if (!res.ok) continue;
      const text = await res.text();
      const trimmed = text?.trimStart();
      if (!trimmed || !trimmed.startsWith('{')) continue;
      const data = JSON.parse(text);
      const result = data?.chart?.result?.[0];
      const closes = result?.indicators?.quote?.[0]?.close;
      const currency = result?.meta?.currency || 'USD';
      if (closes?.length) {
        const validClose = [...closes].reverse().find(p => p != null && p > 0);
        if (validClose) {
          if (currency === 'USD' && invCurrency === 'MYR') return validClose * MYR_RATE;
          return validClose;
        }
      }
    } catch(e) { /* try next */ }
  }
  throw new Error('Historical price unavailable for ' + ticker + ' on that date');
}

// ── Crypto: Binance public API (no API key needed, no CORS issues) ──

// Map our tickers to Binance USDT trading pairs
function toBinanceSymbol(ticker) {
  const t = ticker.toUpperCase();
  const overrides = { XRP: 'XRPUSDT', ADA: 'ADAUSDT', DOGE: 'DOGEUSDT', MATIC: 'MATICUSDT', BNB: 'BNBUSDT' };
  return overrides[t] || (t + 'USDT');
}

async function fetchCryptoPrice(ticker, invCurrency) {
  const t = ticker.toUpperCase();
  if (!CRYPTO_IDS[t]) throw new Error('Unknown crypto: ' + ticker + '. Supported: BTC, ETH, SOL, BNB, XRP, ADA, DOGE...');
  const symbol = toBinanceSymbol(t);
  const url = `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error('Binance error ' + res.status);
  const data = await res.json();
  const priceUsd = parseFloat(data?.price);
  if (!priceUsd || priceUsd <= 0) throw new Error('No price returned for ' + ticker);
  return toInvCurrency(priceUsd, invCurrency);
}

// ── Crypto historical: Binance klines API ──
async function fetchCryptoHistorical(ticker, date, invCurrency) {
  const t = ticker.toUpperCase();
  if (!CRYPTO_IDS[t]) throw new Error('Unknown crypto: ' + ticker);
  const symbol = toBinanceSymbol(t);

  // Try exact date first, then search forward up to 30 days
  // (handles weekends, holidays, and pre-listing dates)
  const startTime = date.getTime();

  // First attempt: exact date window (7 days forward to catch any gaps)
  const url1 = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d&startTime=${startTime}&endTime=${startTime + 7 * 86400000}&limit=5`;
  let res = await fetch(url1, { signal: AbortSignal.timeout(12000) });
  if (res.ok) {
    const data = await res.json();
    if (data?.length) {
      const closePrice = parseFloat(data[0][4]);
      if (closePrice > 0) return toInvCurrency(closePrice, invCurrency);
    }
  }

  // Second attempt: if date is before coin listing, fetch the very first available candle
  // by querying from startTime with a large limit and taking the first result
  const url2 = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d&startTime=${startTime}&limit=1`;
  res = await fetch(url2, { signal: AbortSignal.timeout(12000) });
  if (res.ok) {
    const data = await res.json();
    if (data?.length) {
      const closePrice = parseFloat(data[0][4]);
      if (closePrice > 0) {
        // Let the caller know this is the earliest available, not exact date
        return toInvCurrency(closePrice, invCurrency);
      }
    }
  }

  // Third attempt: query earliest ever listing (no startTime = from Binance epoch)
  const url3 = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1w&limit=1`;
  res = await fetch(url3, { signal: AbortSignal.timeout(12000) });
  if (res.ok) {
    const data = await res.json();
    if (data?.length) {
      const closePrice = parseFloat(data[0][4]);
      if (closePrice > 0) return toInvCurrency(closePrice, invCurrency);
    }
  }

  throw new Error('No historical data available for ' + ticker + ' — please enter buy price manually');
}

async function fetchHistoricalPrice(ticker, type, dateStr, invCurrency) {
  if (!dateStr) throw new Error('No date provided');
  const date  = new Date(dateStr + 'T00:00:00');
  const today = new Date(); today.setHours(0,0,0,0);
  if (date >= today) return fetchSinglePrice({ name: ticker, type }, invCurrency);
  if (type === 'crypto') return fetchCryptoHistorical(ticker, date, invCurrency);
  return fetchYahooHistorical(ticker, date, invCurrency);
}

async function fetchSinglePrice(inv, invCurrency) {
  const ticker = inv.name.toUpperCase().trim();
  const c = invCurrency || inv.invCurrency || state.currency;
  if (inv.type === 'crypto') return fetchCryptoPrice(ticker, c);
  return fetchYahooPrice(ticker, c);
}


let refreshTimer = null;

async function refreshAllPrices() {
  if (!state.investments.length) { toast('No investments to refresh', 'info'); return; }

  const btn = document.getElementById('btn-refresh-prices');
  const statusEl = document.getElementById('price-refresh-status');
  if (btn) { btn.disabled = true; btn.innerHTML = `<svg class="spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg> Fetching...`; }
  if (statusEl) statusEl.textContent = 'Updating...';

  let updated = 0, failed = [];

  // Fetch CURRENT (live) prices only — never touch buyPrice
  const results = await Promise.allSettled(
    state.investments.map(inv =>
      fetchSinglePrice(inv, inv.invCurrency || state.currency).then(price => ({ inv, price }))
    )
  );

  results.forEach((result, idx) => {
    if (result.status === 'fulfilled') {
      const { price } = result.value;
      const rounded = Math.round(price * 10000) / 10000;
      state.investments[idx].currentPrice = rounded;
      state.investments[idx].lastUpdated = new Date().toISOString();
      updated++;
    } else {
      failed.push(state.investments[idx].name);
    }
  });

  save();
  renderInvestments();
  renderAll();

  const now = new Date().toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' });
  if (statusEl) statusEl.textContent = `Updated ${now}`;
  if (btn) { btn.disabled = false; btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg> Refresh Prices`; }

  if (updated > 0 && failed.length === 0) {
    toast(`✅ All ${updated} prices updated!`, 'success');
  } else if (updated > 0) {
    toast(`Updated ${updated} · Failed: ${failed.join(', ')}`, 'info');
  } else {
    toast(`Could not fetch prices. Check ticker symbols.`, 'error');
    if (statusEl) statusEl.textContent = 'Update failed';
  }
}

function setAutoRefresh(minutes) {
  if (refreshTimer) clearInterval(refreshTimer);
  if (!minutes) return;
  refreshTimer = setInterval(() => {
    if (document.getElementById('page-investments').classList.contains('active')) {
      refreshAllPrices();
    }
  }, minutes * 60 * 1000);
}

// ── Utils ─────────────────────────────────────────────────
function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

function formatDate(d) {
  if (!d) return '';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── Custom Confirm Dialog ─────────────────────────────────
function showConfirm(msg, onYes) {
  document.getElementById('confirm-msg').textContent = msg;
  document.getElementById('confirm-overlay').style.display = 'flex';
  document.getElementById('confirm-yes').onclick = () => {
    document.getElementById('confirm-overlay').style.display = 'none';
    onYes();
  };
  document.getElementById('confirm-no').onclick = () => {
    document.getElementById('confirm-overlay').style.display = 'none';
  };
}

function toast(msg, type = 'info') {
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.innerHTML = `<span class="toast-icon">${icons[type]}</span>${msg}`;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => {
    el.classList.add('fadeout');
    setTimeout(() => el.remove(), 300);
  }, 3000);
}

function renderAll() {
  const active = document.querySelector('.page.active')?.id?.replace('page-', '');
  if (active) renderPage(active);
}

// ── Event Listeners ───────────────────────────────────────
document.querySelectorAll('.nav-item[data-page], .mob-nav-item[data-page]').forEach(el => {
  el.addEventListener('click', () => navigate(el.dataset.page));
});

document.querySelectorAll('.goal-icon-opt').forEach(el => {
  el.addEventListener('click', () => selectGoalIcon(el.dataset.icon));
});

// ── PWA ───────────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js').catch(() => {});
}

// ── Greeting ──────────────────────────────────────────────
function updateGreeting() {
  const h = new Date().getHours();
  let greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const name = state.userName ? (', ' + state.userName) : '';
  const dash = document.querySelector('#page-dashboard .page-title');
  if (dash) dash.textContent = greeting + name + ' 👋';
  const qa = document.getElementById('qa-greeting');
  if (qa) qa.textContent = greeting + name + ' 👋';
}

// ── Onboarding ────────────────────────────────────────────
window.checkOnboarding = function checkOnboarding() {
  if (!state.onboardingDone) {
    document.getElementById('onboarding-overlay').style.display = 'flex';
  }
};

window.closeOnboarding = function() {
  try {
    const nameEl = document.getElementById('ob-name');
    const incomeEl = document.getElementById('ob-income');
    const cashEl = document.getElementById('ob-cash');
    const currEl = document.getElementById('ob-currency');
    const name = (nameEl && nameEl.value.trim()) || 'there';
    const income = incomeEl ? (parseFloat(incomeEl.value) || 0) : 0;
    const cash = cashEl ? (parseFloat(cashEl.value) || 0) : 0;
    const currency = currEl ? currEl.value : 'MYR';
    state.currency = currency;
    state.onboardingDone = true;
    state.userName = name;
    state.monthlyIncome = income;
    if (!Array.isArray(state.transactions)) state.transactions = [];
    if (cash > 0) {
      state.transactions.push({ id: uid(), type: 'income', desc: 'Opening Balance', amount: cash, cat: 'Other', date: new Date().toISOString().slice(0,10) });
    }
    save();
    const overlay = document.getElementById('onboarding-overlay');
    if (overlay) overlay.style.display = 'none';
    updateCurrencyLabels();
    updateGreeting();
    renderDashboard();
    toast('Welcome, ' + name + '! 🎉 Your WealthOS is ready.', 'success');
  } catch(e) {
    console.error('Onboarding error:', e);
    // Force close even on error
    const overlay = document.getElementById('onboarding-overlay');
    if (overlay) overlay.style.display = 'none';
    state.onboardingDone = true;
    save();
    renderDashboard();
  }
};

// ── Init ──────────────────────────────────────────────────
function init() {
  load();
  applyTheme();
  updateCurrencyLabels();
  updateGreeting();
  Chart.defaults.color = '#8a9dc0';
  Chart.defaults.font.family = "'DM Sans', sans-serif";
  navigate('dashboard');
  applyLanguage();
  // Pre-populate settings fields with loaded state
  setTimeout(function() { if (window.renderSettingsPage) window.renderSettingsPage(); }, 100);
  checkOnboarding();
  setAutoRefresh(5);
  processSubscriptionCharges();
  const snapshotKey = 'wealthos_last_snap';
  const lastSnap = localStorage.getItem(snapshotKey);
  const today = new Date().toISOString().slice(0,7);
  if (lastSnap !== today && state.onboardingDone) {
    setTimeout(() => { takeNetworthSnapshot(); localStorage.setItem(snapshotKey, today); }, 2000);
  }
}

// ── Mobile save safety ─────────────────────────────────────
// Save whenever app is backgrounded/closed on mobile
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') save();
});

// pagehide fires on iOS Safari when swiping away
window.addEventListener('pagehide', () => save());

// beforeunload for desktop browsers
window.addEventListener('beforeunload', () => save());

init();

// ═══════════════════════════════════════════════════════════
// FEATURE: Edit Monthly Income
// ═══════════════════════════════════════════════════════════
window.openEditIncome = function() {
  document.getElementById('edit-income-val').value = state.monthlyIncome || '';
  openModal('edit-income-modal');
};

window.saveMonthlyIncome = function() {
  const val = parseFloat(document.getElementById('edit-income-val').value);
  if (isNaN(val) || val < 0) { toast('Please enter a valid amount', 'error'); return; }
  state.monthlyIncome = val;
  save();
  closeModal('edit-income-modal');
  renderDashboard();
  toast('Monthly income updated ✓', 'success');
};

// ═══════════════════════════════════════════════════════════
// FEATURE: Calendar
// ═══════════════════════════════════════════════════════════
let calYear, calMonth;

window.renderCalendar = function() {
  const now = new Date();
  if (calYear === undefined) calYear = now.getFullYear();
  if (calMonth === undefined) calMonth = now.getMonth();
  buildCalendar();
};

function buildCalendar() {
  var el = document.getElementById('calendar-grid');
  if (!el) return;

  var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  document.getElementById('cal-month-label').textContent = monthNames[calMonth] + ' ' + calYear;

  var firstDay = new Date(calYear, calMonth, 1).getDay();
  var daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  var today = new Date();
  var todayStr = today.toISOString().slice(0,10);
  var monthKey = calYear + '-' + String(calMonth+1).padStart(2,'0');
  var sym = state.currency === 'MYR' ? 'RM' : '$';

  var byDate = {};
  state.transactions.forEach(function(t) {
    if (t.date && t.date.slice(0,7) === monthKey) {
      if (!byDate[t.date]) byDate[t.date] = { income: 0, expense: 0 };
      if (t.type === 'income') byDate[t.date].income += t.amount;
      else byDate[t.date].expense += t.amount;
    }
  });

  var html = '<div class="cal-day-header">Sun</div><div class="cal-day-header">Mon</div><div class="cal-day-header">Tue</div><div class="cal-day-header">Wed</div><div class="cal-day-header">Thu</div><div class="cal-day-header">Fri</div><div class="cal-day-header">Sat</div>';

  for (var i = 0; i < firstDay; i++) html += '<div class="cal-cell cal-empty"></div>';

  for (var d = 1; d <= daysInMonth; d++) {
    var dateStr = calYear + '-' + String(calMonth+1).padStart(2,'0') + '-' + String(d).padStart(2,'0');
    var isToday = dateStr === todayStr;
    var data = byDate[dateStr];
    var dots = '';
    if (data) {
      if (data.income > 0) dots += '<div class="cal-dot cal-dot-income">+' + (data.income >= 1000 ? (data.income/1000).toFixed(1)+'k' : data.income.toFixed(0)) + '</div>';
      if (data.expense > 0) dots += '<div class="cal-dot cal-dot-expense">-' + (data.expense >= 1000 ? (data.expense/1000).toFixed(1)+'k' : data.expense.toFixed(0)) + '</div>';
    }
    html += '<div class="cal-cell' + (isToday ? ' cal-today' : '') + '" onclick="openCalDay(\'' + dateStr + '\')">' +
      '<div class="cal-day-num' + (isToday ? ' cal-today-num' : '') + '">' + d + '</div>' +
      dots +
      '</div>';
  }

  el.innerHTML = html;
}

window.calPrev = function() { calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; } buildCalendar(); };
window.calNext = function() { calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; } buildCalendar(); };

window.openCalDay = function(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  const label = date.toLocaleDateString('en-MY', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  document.getElementById('cal-day-label').textContent = label;
  document.getElementById('cal-day-date').value = dateStr;
  renderCalDayTxns(dateStr);
  openModal('cal-day-modal');
};

function renderCalDayTxns(dateStr) {
  const txns = state.transactions.filter(t => t.date === dateStr);
  const el = document.getElementById('cal-day-txns');
  const sym = state.currency === 'MYR' ? 'RM' : '$';

  if (!txns.length) {
    el.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:20px;font-size:13px">No transactions on this day</div>';
    return;
  }

  el.innerHTML = txns.map(t => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border)">
      <div style="display:flex;align-items:center;gap:10px">
        <div style="width:8px;height:8px;border-radius:50%;background:${t.type==='income'?'var(--green)':'var(--red)'}"></div>
        <div>
          <div style="font-size:13.5px;font-weight:500">${t.desc}</div>
          <div style="font-size:11px;color:var(--text-muted)">${t.cat}</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <div style="font-weight:600;color:${t.type==='income'?'var(--green)':'var(--red)'}">
          ${t.type==='income'?'+':'-'}${sym}${t.amount.toLocaleString('en-MY',{minimumFractionDigits:2,maximumFractionDigits:2})}
        </div>
        <button class="btn btn-ghost btn-sm" onclick="editTxnFromCal('${t.id}')" style="padding:4px 8px;font-size:11px">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteTxnFromCal('${t.id}','${dateStr}')" style="padding:4px 8px;font-size:11px">✕</button>
      </div>
    </div>
  `).join('');
}

window.editTxnFromCal = function(id) {
  closeModal('cal-day-modal');
  editTransaction(id);
};

window.deleteTxnFromCal = function(id, dateStr) {
  if (!confirm('Delete this transaction?')) return;
  state.transactions = state.transactions.filter(t => t.id !== id);
  save();
  renderCalDayTxns(dateStr);
  buildCalendar();
  renderAll();
};

window.addTxnForCalDay = function() {
  const dateStr = document.getElementById('cal-day-date').value;
  closeModal('cal-day-modal');
  // Pre-fill date in add transaction modal
  openModal('add-txn-modal');
  setTimeout(() => {
    const dateEl = document.getElementById('txn-date');
    if (dateEl) dateEl.value = dateStr;
  }, 50);
};

// ═══════════════════════════════════════════════════════════
// FEATURE: Quick-add homepage
// ═══════════════════════════════════════════════════════════
window.renderQuickAdd = function() {
  const today = new Date();
  const todayStr = today.toISOString().slice(0,10);
  const sym = state.currency === 'MYR' ? 'RM' : '$';
  const hide = state.hideNumbers;
  function fmt(n) { return hide ? '••••' : sym + n.toLocaleString('en-MY', {minimumFractionDigits:2, maximumFractionDigits:2}); }

  // Update greeting
  const h = today.getHours();
  const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const name = state.userName ? ', ' + state.userName : '';
  const greetEl = document.getElementById('qa-greeting');
  if (greetEl) greetEl.textContent = greeting + name + ' 👋';

  // Month summary
  const thisMonth = todayStr.slice(0,7);
  const mtxns = state.transactions.filter(function(t) { return t.date && t.date.slice(0,7) === thisMonth; });
  const totalInc = mtxns.filter(function(t){return t.type==='income';}).reduce(function(s,t){return s+t.amount;},0);
  const totalExp = mtxns.filter(function(t){return t.type==='expense';}).reduce(function(s,t){return s+t.amount;},0);
  const net = totalInc - totalExp;
  const budgetLimit = state.budgetLimit || 0;
  const budgetPct = budgetLimit > 0 ? Math.min(100, (totalExp / budgetLimit) * 100) : 0;
  const budgetColor = budgetPct >= 90 ? 'var(--red)' : budgetPct >= 70 ? 'var(--amber)' : 'var(--green)';

  var budgetBar = '';
  if (budgetLimit > 0) {
    budgetBar = '<div style="margin-top:14px"><div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);margin-bottom:5px"><span>Monthly Budget</span><span style="color:' + budgetColor + '">' + fmt(totalExp) + ' / ' + fmt(budgetLimit) + '</span></div><div style="height:6px;background:var(--bg-elevated);border-radius:99px;overflow:hidden"><div style="height:100%;width:' + budgetPct + '%;background:' + budgetColor + ';border-radius:99px;transition:width 0.4s"></div></div></div>';
  }

  document.getElementById('quickadd-summary').innerHTML =
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">' +
      '<div style="background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.2);border-radius:12px;padding:14px;text-align:center">' +
        '<div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">Income</div>' +
        '<div style="font-weight:700;color:var(--green);font-size:15px">' + fmt(totalInc) + '</div>' +
      '</div>' +
      '<div style="background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.2);border-radius:12px;padding:14px;text-align:center">' +
        '<div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">Spent</div>' +
        '<div style="font-weight:700;color:var(--red);font-size:15px">' + fmt(totalExp) + '</div>' +
      '</div>' +
      '<div style="background:rgba(96,165,250,0.08);border:1px solid rgba(96,165,250,0.2);border-radius:12px;padding:14px;text-align:center">' +
        '<div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">Net</div>' +
        '<div style="font-weight:700;color:' + (net>=0?'var(--green)':'var(--red)') + ';font-size:15px">' + fmt(Math.abs(net)) + '</div>' +
      '</div>' +
    '</div>' + budgetBar;

  // Subscription reminders (due within 3 days)
  var remEl = document.getElementById('quickadd-reminders');
  var in3 = new Date(today); in3.setDate(in3.getDate() + 3);
  var upcoming = (state.subscriptions || []).filter(function(sub) {
    if (!sub.renewal) return false;
    var r = new Date(sub.renewal + 'T00:00:00');
    return r >= today && r <= in3;
  }).sort(function(a,b){ return a.renewal.localeCompare(b.renewal); });

  if (upcoming.length) {
    var remRows = upcoming.map(function(sub) {
      var r = new Date(sub.renewal + 'T00:00:00');
      var daysLeft = Math.ceil((r - today) / (1000*60*60*24));
      var label = daysLeft === 0 ? 'Due today' : daysLeft === 1 ? 'Due tomorrow' : 'Due in ' + daysLeft + ' days';
      var urgentColor = daysLeft <= 1 ? 'var(--red)' : 'var(--amber)';
      return '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">' +
        '<div style="display:flex;align-items:center;gap:10px">' +
          '<span style="font-size:18px">' + (sub.icon || '📦') + '</span>' +
          '<div>' +
            '<div style="font-size:13px;font-weight:600">' + sub.name + '</div>' +
            '<div style="font-size:11px;color:' + urgentColor + '">' + label + '</div>' +
          '</div>' +
        '</div>' +
        '<div style="font-weight:700;font-size:13px">' + fmt(sub.amount) + '</div>' +
      '</div>';
    }).join('');
    remEl.style.display = 'block';
    remEl.innerHTML = '<div class="card" style="border-left:3px solid var(--amber);margin-bottom:16px">' +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">' +
        '<span style="font-size:16px">🔔</span>' +
        '<div style="font-weight:700;font-size:13.5px">Upcoming Payments</div>' +
      '</div>' + remRows + '</div>';
  } else {
    remEl.style.display = 'none';
    remEl.innerHTML = '';
  }

  // Recent transactions
  var catIcons = { Salary:'💼', Food:'🍔', Transport:'🚗', Bills:'⚡', Investment:'📈', Lifestyle:'🛍️', Other:'💡' };
  var recent = state.transactions.slice().sort(function(a,b){ return b.date.localeCompare(a.date); }).slice(0,8);
  document.getElementById('quickadd-recent').innerHTML = recent.length ? recent.map(function(t) {
    var icon = catIcons[t.cat] || (t.type==='income'?'💰':'💸');
    var bg = t.type==='income' ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)';
    var col = t.type==='income' ? 'var(--green)' : 'var(--red)';
    var sign = t.type==='income' ? '+' : '-';
    var dateLabel = new Date(t.date+'T00:00:00').toLocaleDateString('en-MY',{day:'numeric',month:'short'});
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border)">' +
      '<div style="display:flex;align-items:center;gap:10px">' +
        '<div style="width:36px;height:36px;border-radius:10px;background:' + bg + ';display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">' + icon + '</div>' +
        '<div>' +
          '<div style="font-size:13.5px;font-weight:500">' + t.desc + '</div>' +
          '<div style="font-size:11px;color:var(--text-muted)">' + t.cat + ' · ' + dateLabel + '</div>' +
        '</div>' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:8px">' +
        '<div style="font-weight:700;color:' + col + '">' + sign + fmt(t.amount) + '</div>' +
        '<button class="btn btn-ghost btn-sm" onclick="editTransaction(\'' + t.id + '\')" style="padding:3px 7px;font-size:11px">✏️</button>' +
      '</div>' +
    '</div>';
  }).join('') : '<div style="text-align:center;color:var(--text-muted);padding:24px;font-size:13px">No transactions yet — add your first one above 👆</div>';
};


window.quickAddExpense = function() {
  openModal('add-txn-modal');
  // Set AFTER openModal so it overrides any default reset
  setTimeout(function() {
    selectTxnType('expense');
    document.getElementById('txn-date').value = new Date().toISOString().slice(0,10);
  }, 10);
};

window.quickAddIncome = function() {
  openModal('add-txn-modal');
  setTimeout(function() {
    selectTxnType('income');
    document.getElementById('txn-date').value = new Date().toISOString().slice(0,10);
  }, 10);
};

// ═══════════════════════════════════════════════════════════
// FEATURE: Auto-charge subscriptions
// ═══════════════════════════════════════════════════════════
function processSubscriptionCharges() {
  if (!state.subscriptions || !state.subscriptions.length) return;
  const today = new Date(); today.setHours(0,0,0,0);
  const todayStr = today.toISOString().slice(0,10);
  let charged = [];

  state.subscriptions.forEach(sub => {
    if (!sub.renewal) return;
    const renewal = new Date(sub.renewal + 'T00:00:00');
    if (renewal <= today) {
      // Check we haven't already auto-charged today for this sub
      const alreadyCharged = state.transactions.some(t =>
        t.subId === sub.id && t.date === sub.renewal
      );
      if (!alreadyCharged) {
        // Add expense transaction
        state.transactions.push({
          id: uid(),
          type: 'expense',
          desc: sub.name + ' (auto)',
          amount: sub.amount,
          cat: sub.cat || 'Bills',
          date: sub.renewal,
          subId: sub.id
        });
        charged.push(sub.name);
      }

      // Bump renewal date forward based on cycle
      let next = new Date(sub.renewal + 'T00:00:00');
      if (sub.cycle === 'monthly') next.setMonth(next.getMonth() + 1);
      else if (sub.cycle === 'yearly') next.setFullYear(next.getFullYear() + 1);
      else if (sub.cycle === 'weekly') next.setDate(next.getDate() + 7);
      // Keep bumping until renewal is in the future
      while (next <= today) {
        if (sub.cycle === 'monthly') next.setMonth(next.getMonth() + 1);
        else if (sub.cycle === 'yearly') next.setFullYear(next.getFullYear() + 1);
        else if (sub.cycle === 'weekly') next.setDate(next.getDate() + 7);
      }
      sub.renewal = next.toISOString().slice(0,10);
    }
  });

  if (charged.length) {
    save();
    setTimeout(() => {
      charged.forEach(name => toast(`💳 ${name} auto-charged & logged as expense`, 'info'));
    }, 1500);
  }
}

// ═══════════════════════════════════════════════════════════
// FEATURE: Full Settings Page Render
// ═══════════════════════════════════════════════════════════
window.renderSettingsPage = function() {
  var themeMode = state.themeMode || 'dark';
  var lang = state.language || 'en';

  // Theme buttons — use data-val + event delegation to avoid quote escaping issues
  var themeEl = document.getElementById('settings-theme-btns');
  if (themeEl) {
    themeEl.innerHTML = [
      ['dark','🌙 Dark'], ['light','☀️ Light'], ['system','📱 System']
    ].map(function(p) {
      return '<button data-val="' + p[0] + '" class="theme-btn set-theme-btn' + (themeMode===p[0]?' active':'') + '">' + p[1] + '</button>';
    }).join('');
    themeEl.querySelectorAll('.set-theme-btn').forEach(function(btn) {
      btn.addEventListener('click', function() { window.setTheme(btn.dataset.val); });
    });
  }

  // Currency — full dropdown with live rates
  var currSel = document.getElementById('settings-currency-sel');
  if (currSel) {
    currSel.value = state.currency || 'MYR';
  }

  // Language dropdown
  var langSel = document.getElementById('settings-language-sel');
  if (langSel) {
    langSel.value = lang;
  }

  // Hide numbers toggle
  var hideToggle = document.getElementById('settings-hide-numbers');
  if (hideToggle) hideToggle.checked = !!state.hideNumbers;

  // Auto-refresh select
  var refreshSel = document.getElementById('settings-refresh-sel');
  if (refreshSel) refreshSel.value = state.autoRefreshMinutes || 5;

  // Profile fields
  var nameEl = document.getElementById('settings-name');
  if (nameEl) nameEl.value = state.userName || '';
  var incomeEl = document.getElementById('settings-income');
  if (incomeEl) incomeEl.value = state.monthlyIncome || '';
  var budgetEl = document.getElementById('settings-budget');
  if (budgetEl) budgetEl.value = state.budgetLimit || '';

  // Gemini key
  var keyEl = document.getElementById('settings-gemini-key');
  if (keyEl) keyEl.value = state.geminiApiKey || '';
  var keyStatus = document.getElementById('gemini-key-status');
  if (keyStatus) {
    if (state.geminiApiKey) {
      keyStatus.style.color = 'var(--green)';
      keyStatus.textContent = '✓ API key saved — AI Advisor is ready to use';
    } else {
      keyStatus.style.color = 'var(--text-muted)';
      keyStatus.textContent = 'No key saved yet';
    }
  }
};

window.saveGeminiKey = function() {
  var keyEl = document.getElementById('settings-gemini-key');
  var key = keyEl ? keyEl.value.trim() : '';
  if (!key) { toast('Please paste your API key first', 'error'); return; }
  if (!key.startsWith('AIza')) { toast('Invalid key — it should start with AIza', 'error'); return; }
  state.geminiApiKey = key;
  save();
  window.renderSettingsPage();
  toast('✓ Gemini API key saved! Go to AI Advisor to start chatting.', 'success');
};

// (CURRENCIES, fxRates, fxLastFetched are declared at the top of the file)

async function fetchFxRates() {
  if (Date.now() - fxLastFetched < 3600000) return; // cache 1hr

  // Try multiple FX APIs in order (all free, no API key needed)
  var apis = [
    'https://api.exchangerate-api.com/v4/latest/USD',
    'https://open.er-api.com/v6/latest/USD',
    'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
  ];

  for (var i = 0; i < apis.length; i++) {
    try {
      var res = await fetch(apis[i], { signal: AbortSignal.timeout(8000) });
      if (!res.ok) continue;
      var data = await res.json();
      // Different APIs have different response shapes
      var rates = data.rates || data.conversion_rates || (data.usd ? data.usd : null);
      if (rates) {
        // jsdelivr returns lowercase keys
        var found = false;
        Object.keys(CURRENCIES).forEach(function(c) {
          var rate = rates[c] || rates[c.toLowerCase()];
          if (rate && rate > 0) { fxRates[c] = rate; found = true; }
        });
        if (found) {
          fxLastFetched = Date.now();
          console.log('FX rates updated from', apis[i]);
          return;
        }
      }
    } catch(e) { /* try next */ }
  }
  console.warn('FX rate fetch failed — using cached rates');
}

// Convert amount from USD to target currency
function toDisplayCurrency(usdAmount) {
  var c = state.currency || 'MYR';
  var rate = fxRates[c] || 1;
  return usdAmount * rate;
}

function currSymbol() {
  var c = state.currency || 'MYR';
  return (CURRENCIES[c] && CURRENCIES[c].symbol) || c;
}

window.setCurrencyNew = async function(c) {
  var prev = state.currency || 'MYR';
  if (prev === c) return;
  toast('Fetching live exchange rates...', 'info');
  // Force refresh FX rates before conversion to ensure accuracy
  fxLastFetched = 0;
  await fetchFxRates();
  var prevRate = fxRates[prev] || 1;
  var newRate = fxRates[c] || 1;
  var ratio = newRate / prevRate;
  state.transactions.forEach(function(t) {
    t.amount = Math.round(t.amount * ratio * 100) / 100;
  });
  state.goals.forEach(function(g) {
    if (g.target) g.target = Math.round(g.target * ratio * 100) / 100;
    if (g.current) g.current = Math.round(g.current * ratio * 100) / 100;
    if (g.monthly) g.monthly = Math.round(g.monthly * ratio * 100) / 100;
  });
  state.subscriptions.forEach(function(s) {
    if (s.amount) s.amount = Math.round(s.amount * ratio * 100) / 100;
  });
  if (state.monthlyIncome) state.monthlyIncome = Math.round(state.monthlyIncome * ratio * 100) / 100;
  if (state.budgetLimit) state.budgetLimit = Math.round(state.budgetLimit * ratio * 100) / 100;
  state.currency = c;
  save();
  updateCurrencyLabels();
  if (window.renderSettingsPage) window.renderSettingsPage();
  renderAll();
  toast('Currency changed to ' + c + ' — amounts converted', 'success');
};

// ── Language strings ──
// (LANG is declared at the top of the file)
function t(key) { var l = state.language || 'en'; return (LANG[l] && LANG[l][key]) || LANG.en[key] || key; }

window.setLanguage = function(lang) {
  state.language = lang;
  save();
  applyLanguage();
  if (window.renderSettingsPage) window.renderSettingsPage();
  renderAll();
  toast('Language updated ✓', 'success');
};

function applyLanguage() {
  if (typeof LANG === 'undefined' || !LANG) return; // safety guard
  var l = state.language || 'en';
  var L = LANG[l] || LANG.en;
  if (!L) return;
  // Nav labels — mobile bottom nav
  var navMap = {
    dashboard: L.dashboard,
    transactions: L.transactions,
    investments: L.investments,
    goals: L.goals,
    subscriptions: L.subscriptions,
    settings: L.settings,
    calendar: L.calendar,
    analytics: L.analytics,
  };
  document.querySelectorAll('.mob-nav-item[data-page], .nav-item[data-page]').forEach(function(el) {
    var page = el.dataset.page;
    var label = navMap[page];
    if (label) {
      var span = el.querySelector('span');
      if (span) span.textContent = label;
      // sidebar text node (nav-item has text directly)
      el.childNodes.forEach(function(n) {
        if (n.nodeType === 3 && n.textContent.trim()) n.textContent = ' ' + label;
      });
    }
  });
  // Page subtitles and section headers via data-i18n attributes
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var key = el.dataset.i18n;
    if (L[key]) el.textContent = L[key];
  });
  // RTL for Arabic
  document.documentElement.dir = (l === 'ar') ? 'rtl' : 'ltr';
}

window.saveSettingsProfile = function() {
  var name = document.getElementById('settings-name').value.trim();
  var income = parseFloat(document.getElementById('settings-income').value) || 0;
  var budget = parseFloat(document.getElementById('settings-budget').value) || 0;
  if (name) state.userName = name;
  state.monthlyIncome = income;
  state.budgetLimit = budget;
  save();
  updateGreeting();
  renderAll(); // re-renders dashboard, home, etc with new income
  window.renderSettingsPage(); // keep settings fields in sync
  toast('Profile saved ✓', 'success');
};

window.toggleHideNumbers = function() {
  state.hideNumbers = !state.hideNumbers;
  save();
  renderSettingsPage();
  renderAll();
};


// ═══════════════════════════════════════════════════════════
// FEATURE: Mobile "More" sheet
// ═══════════════════════════════════════════════════════════
window.openMoreSheet = function() {
  var sheet = document.getElementById('more-sheet');
  if (sheet) sheet.classList.add('open');
};
window.closeMoreSheet = function() {
  var sheet = document.getElementById('more-sheet');
  if (sheet) sheet.classList.remove('open');
};
window.navigateFromMore = function(page) {
  closeMoreSheet();
  navigate(page);
};

// ═══════════════════════════════════════════════════════════
// FEATURE: AI Advisor (Claude-powered financial chat)
// ═══════════════════════════════════════════════════════════

var aiHistory = []; // conversation history for multi-turn chat

window.renderAiAdvisor = function() {
  // Reset suggestions visibility when page loads
  var sugg = document.getElementById('ai-suggestions');
  if (sugg) sugg.style.display = 'flex';
};

// Build a context string from the user's actual data
function buildFinancialContext() {
  var sym = curr();
  var txns = state.transactions.slice().sort(function(a,b){ return b.date.localeCompare(a.date); });
  var totalInc = txns.filter(function(t){ return t.type==='income'; }).reduce(function(s,t){ return s+t.amount; }, 0);
  var totalExp = txns.filter(function(t){ return t.type==='expense'; }).reduce(function(s,t){ return s+t.amount; }, 0);

  // This month
  var thisMonth = new Date().toISOString().slice(0,7);
  var mTxns = txns.filter(function(t){ return t.date && t.date.slice(0,7) === thisMonth; });
  var mInc = mTxns.filter(function(t){ return t.type==='income'; }).reduce(function(s,t){ return s+t.amount; }, 0);
  var mExp = mTxns.filter(function(t){ return t.type==='expense'; }).reduce(function(s,t){ return s+t.amount; }, 0);

  // Category breakdown this month
  var cats = {};
  mTxns.filter(function(t){ return t.type==='expense'; }).forEach(function(t) {
    cats[t.cat] = (cats[t.cat] || 0) + t.amount;
  });
  var catBreakdown = Object.entries(cats).sort(function(a,b){ return b[1]-a[1]; })
    .map(function(e){ return e[0] + ': ' + sym + e[1].toLocaleString('en-US', {maximumFractionDigits:2}); }).join(', ');

  // Investments
  var totalInvested = state.investments.reduce(function(s,i){ return s + (i.buyPrice||0)*(i.qty||0); }, 0);
  var totalPortfolio = state.investments.reduce(function(s,i){ return s + (i.currentPrice||i.buyPrice||0)*(i.qty||0); }, 0);
  var pnl = totalPortfolio - totalInvested;

  // Goals
  var goalsStr = state.goals.map(function(g) {
    var pct = g.target > 0 ? Math.round((g.current/g.target)*100) : 0;
    return g.name + ' (' + pct + '% complete, target: ' + sym + (g.target||0).toLocaleString('en-US') + ')';
  }).join('; ') || 'No goals set';

  // Subscriptions
  var subsStr = state.subscriptions.map(function(s) {
    return s.name + ' ' + sym + (s.amount||0).toFixed(2) + '/' + s.cycle;
  }).join(', ') || 'No subscriptions';

  // Savings rate
  var savRate = (mInc > 0) ? Math.round(((mInc - mExp) / mInc) * 100) : 0;

  return 'USER FINANCIAL DATA (as of ' + new Date().toLocaleDateString() + '):\n' +
    'Name: ' + (state.userName || 'User') + '\n' +
    'Currency: ' + state.currency + '\n' +
    'Net Worth: ' + sym + (getNetWorth()).toLocaleString('en-US', {maximumFractionDigits:2}) + '\n' +
    '\nTHIS MONTH (' + thisMonth + '):\n' +
    '- Income: ' + sym + mInc.toLocaleString('en-US', {maximumFractionDigits:2}) + '\n' +
    '- Expenses: ' + sym + mExp.toLocaleString('en-US', {maximumFractionDigits:2}) + '\n' +
    '- Net: ' + sym + (mInc - mExp).toLocaleString('en-US', {maximumFractionDigits:2}) + '\n' +
    '- Savings Rate: ' + savRate + '%\n' +
    '- Expense Breakdown: ' + (catBreakdown || 'None') + '\n' +
    '\nALL TIME:\n' +
    '- Total Income: ' + sym + totalInc.toLocaleString('en-US', {maximumFractionDigits:2}) + '\n' +
    '- Total Expenses: ' + sym + totalExp.toLocaleString('en-US', {maximumFractionDigits:2}) + '\n' +
    '\nINVESTMENTS:\n' +
    '- Portfolio Value: ' + sym + totalPortfolio.toLocaleString('en-US', {maximumFractionDigits:2}) + '\n' +
    '- Total Invested: ' + sym + totalInvested.toLocaleString('en-US', {maximumFractionDigits:2}) + '\n' +
    '- P&L: ' + (pnl >= 0 ? '+' : '') + sym + pnl.toLocaleString('en-US', {maximumFractionDigits:2}) + '\n' +
    '- Holdings: ' + (state.investments.map(function(i){ return i.name; }).join(', ') || 'None') + '\n' +
    '\nGOALS: ' + goalsStr + '\n' +
    '\nSUBSCRIPTIONS: ' + subsStr + '\n' +
    '\nRECENT TRANSACTIONS (last 10):\n' +
    txns.slice(0,10).map(function(t) {
      return '- ' + t.date + ' | ' + t.type + ' | ' + t.desc + ' | ' + sym + t.amount.toFixed(2) + ' | ' + t.cat;
    }).join('\n');
}

function appendAiMessage(role, text, isStreaming) {
  var container = document.getElementById('ai-messages');
  if (!container) return;

  var msgId = 'ai-msg-' + Date.now();
  var isUser = role === 'user';
  var avatar = isUser ? (state.userName ? state.userName[0].toUpperCase() : 'U') : '✨';

  var div = document.createElement('div');
  div.className = 'ai-msg ' + (isUser ? 'ai-msg-user' : 'ai-msg-assistant');
  div.id = msgId;
  div.innerHTML =
    '<div class="ai-msg-avatar">' + avatar + '</div>' +
    '<div class="ai-msg-bubble">' + (isStreaming ? '<span class="ai-typing">●●●</span>' : escapeHtml(text)) + '</div>';

  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return msgId;
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\n/g,'<br>').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');
}

window.sendAiSuggestion = function(btn) {
  var text = btn.textContent;
  document.getElementById('ai-suggestions').style.display = 'none';
  document.getElementById('ai-input').value = text;
  sendAiMessage();
};

window.sendAiMessage = async function() {
  var input = document.getElementById('ai-input');
  var sendBtn = document.getElementById('ai-send-btn');
  var text = (input.value || '').trim();
  if (!text) return;

  var apiKey = state.geminiApiKey || '';
  if (!apiKey) {
    toast('Add your free Gemini API key in Settings first', 'error');
    navigate('settings');
    setTimeout(function() {
      var el = document.getElementById('settings-gemini-key');
      if (el) { el.focus(); el.scrollIntoView({behavior:'smooth'}); }
    }, 400);
    return;
  }

  input.value = '';
  sendBtn.disabled = true;
  sendBtn.style.opacity = '0.5';

  appendAiMessage('user', text, false);
  aiHistory.push({ role: 'user', parts: [{ text: text }] });
  var typingId = appendAiMessage('assistant', '', true);

  try {
    var systemPrompt = 'You are a friendly, expert personal financial advisor inside WealthOS finance app. ' +
      'You have the user real financial data below. Give specific, actionable advice based on their actual numbers. ' +
      'Be concise but thorough. Use bullet points where helpful. ' +
      'Always reference their specific amounts. Be encouraging but honest.' +
      buildFinancialContext();

    // Try multiple model names in case one is unavailable
    var models = ['gemini-2.0-flash-exp', 'gemini-1.5-flash-latest', 'gemini-1.5-pro-latest', 'gemini-pro'];
    var reply = null;
    var lastErr = null;

    for (var mi = 0; mi < models.length; mi++) {
      // Try v1beta first, fall back to v1 if needed
      var baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/';
      var url = baseUrl + models[mi] + ':generateContent?key=' + apiKey;
      // Build contents: inject system prompt into first user turn only
      var contents = [];
      for (var hi = 0; hi < aiHistory.length; hi++) {
        if (hi === 0) {
          // First user message gets the financial context prepended
          contents.push({
            role: 'user',
            parts: [{ text: systemPrompt + '\n\nMy question: ' + aiHistory[hi].parts[0].text }]
          });
        } else {
          contents.push(aiHistory[hi]);
        }
      }
      var reqBody = JSON.stringify({
        contents: contents,
        generationConfig: { maxOutputTokens: 800, temperature: 0.7 }
      });

      // Retry up to 2 times for 429 (rate limit)
      for (var attempt = 0; attempt < 2; attempt++) {
        if (attempt > 0) await new Promise(function(r){ setTimeout(r, 3000); }); // wait 3s before retry

        var response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: reqBody,
          signal: AbortSignal.timeout(20000)
        });

        if (response.ok) {
          var data = await response.json();
          reply = data.candidates &&
                  data.candidates[0] &&
                  data.candidates[0].content &&
                  data.candidates[0].content.parts &&
                  data.candidates[0].content.parts[0] &&
                  data.candidates[0].content.parts[0].text;
          if (reply) break;
        } else if (response.status === 429) {
          lastErr = 'Rate limited — retrying...';
          // Update typing indicator to show retrying
          var te = document.getElementById(typingId);
          if (te) te.querySelector('.ai-msg-bubble').innerHTML = '<em style="color:var(--text-muted)">Rate limited, retrying in 3s...</em>';
          continue; // retry
        } else if (response.status === 404) {
          // Model not found — try next model
          var errJ = await response.json().catch(function(){ return {}; });
          lastErr = (errJ.error && errJ.error.message) || 'Model not available';
          break; // break retry loop, outer model loop continues
        } else if (response.status === 400) {
          // Bad request — show actual error, no point trying other models
          var errJ = await response.json().catch(function(){ return {}; });
          lastErr = (errJ.error && errJ.error.message) || 'Bad request';
          throw new Error('API error: ' + lastErr);
        } else {
          var errData = await response.json().catch(function(){ return {}; });
          lastErr = (errData.error && errData.error.message) || ('Error ' + response.status);
          if (response.status === 400 && lastErr.includes('API_KEY')) {
            lastErr = 'Invalid API key — check your key in Settings.';
            throw new Error(lastErr); // no point retrying bad key
          }
          break;
        }
      }
      if (reply) break;
    }

    if (!reply) {
      // Show the actual error from Google so we can diagnose it
      console.error('Gemini failed. Last error:', lastErr);
      throw new Error(lastErr || 'No response from AI — please try again');
    }

    var typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.querySelector('.ai-msg-bubble').innerHTML = escapeHtml(reply);

    aiHistory.push({ role: 'model', parts: [{ text: reply }] });
    if (aiHistory.length > 20) aiHistory = aiHistory.slice(-20);

  } catch(e) {
    var typingEl = document.getElementById(typingId);
    if (typingEl) {
      typingEl.querySelector('.ai-msg-bubble').innerHTML = '⚠️ ' + (e.message || 'Connection error. Check your API key and internet.');
    }
    aiHistory.pop();
  }

  sendBtn.disabled = false;
  sendBtn.style.opacity = '1';
  var container = document.getElementById('ai-messages');
  if (container) container.scrollTop = container.scrollHeight;
};
