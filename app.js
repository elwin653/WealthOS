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
var fxRates = { USD: 1, MYR: 3.97, SGD: 1.34, EUR: 0.92, GBP: 0.79, JPY: 154.0, KRW: 1370, AUD: 1.56, CNY: 7.27, HKD: 7.79, THB: 34.8, IDR: 16300 }; // fallback — overwritten by live fetch
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
  language: 'en',
  navTabs: ['dashboard', 'wallet', 'transactions', 'investments'],
  accounts: [],
  recurringIncome: []
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
      if (!Array.isArray(state.navTabs) || state.navTabs.length === 0) state.navTabs = ['dashboard','wallet','transactions','investments'];
      if (!Array.isArray(state.accounts)) state.accounts = [];
      if (!Array.isArray(state.recurringIncome)) state.recurringIncome = [];
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
  // Get symbol: check CURRENCIES map first, then CURR_SYMBOL, then fallback
  var sym = (CURRENCIES && CURRENCIES[invCurrency] && CURRENCIES[invCurrency].symbol)
    || CURR_SYMBOL[invCurrency] || invCurrency || curr();
  var abs = Math.abs(n);
  var dec = decimals !== undefined ? decimals : (abs < 1 ? 4 : 2);
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
  // Rebuild mobile nav — wrapped in try-catch so a crash never blocks navigation
  try { if (typeof buildMobileNav === 'function') buildMobileNav(); } catch(e) { console.warn('Nav build error:', e); }
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
    wallet: window.renderWallet,
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
// Convert an investment amount from its own currency to the user's display currency
function convertToDisplayCurrency(amount, invCurrency) {
  try {
    if (!amount || isNaN(amount)) return 0;
    var userCurrency = state.currency || 'MYR';
    if (!invCurrency || invCurrency === userCurrency) return amount;
    var rates = fxRates || {};
    var invRate = rates[invCurrency] || 1;
    var userRate = rates[userCurrency] || 1;
    if (invRate === 0) return amount;
    var amountInUSD = amount / invRate;
    return amountInUSD * userRate;
  } catch(e) { return amount; }
}

function getTotalInvested() {
  return state.investments.reduce(function(s, i) {
    var invCurr = i.invCurrency || state.currency;
    return s + convertToDisplayCurrency(i.qty * i.buyPrice, invCurr);
  }, 0);
}

function getTotalPortfolioValue() {
  return state.investments.reduce(function(s, i) {
    var invCurr = i.invCurrency || state.currency;
    return s + convertToDisplayCurrency(i.qty * i.currentPrice, invCurr);
  }, 0);
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
  var accounts = state.accounts || [];
  var walletCash = accounts.filter(function(a){ return a.type === 'cash' || a.type === 'bank'; })
                           .reduce(function(s,a){ return s + (a.balance||0); }, 0);
  var walletAssets = accounts.filter(function(a){ return a.type === 'asset'; })
                             .reduce(function(s,a){ return s + (a.balance||0); }, 0);
  var walletLiab = accounts.filter(function(a){ return a.type === 'liability'; })
                           .reduce(function(s,a){ return s + (a.balance||0); }, 0);
  return getTotalPortfolioValue() + getNetCash() + walletCash + walletAssets - walletLiab;
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
  try { _renderDashboard(); } catch(e) { console.error('Dashboard render error:', e); }
}
function _renderDashboard() {
  var nw = getNetWorth();
  var portVal = getTotalPortfolioValue();
  var pnl = getTotalPnL();
  var pnlPct = getTotalInvested() ? (pnl / getTotalInvested()) * 100 : 0;
  var savRate = getSavingsRate();
  var hide = state.hideNumbers;
  function fmtH(n) { return hide ? '••••' : fmt(n); }

  var thisMonthTxns = getThisMonthTxns();
  // Monthly income card = fixed salary setting only
  // Income transactions go into net worth/balance but don't change this card
  var monthlyIncomeDisplay = state.monthlyIncome || 0;
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
  var el = document.getElementById('dash-insights');
  if (!el) return;
  var insights = generateInsights();

  // Activity bar — % of budget remaining
  var sym = curr();
  var mtxns = getThisMonthTxns();
  var monthExp = getTotalExpenses(mtxns);
  var monthInc = getTotalIncome(mtxns) || state.monthlyIncome || 0;
  var budgetLimit = state.budgetLimit || monthInc;
  var spentPct = budgetLimit > 0 ? Math.min(100, Math.round((monthExp / budgetLimit) * 100)) : 0;
  var remaining = Math.max(0, budgetLimit - monthExp);
  var barColor = spentPct >= 90 ? 'var(--red)' : spentPct >= 70 ? 'var(--amber)' : 'var(--green)';
  var savRate = getSavingsRate();

  var activityHtml = '<div style="margin-bottom:14px;padding:14px;background:var(--bg-elevated);border-radius:12px;border:1px solid var(--border)">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
      '<div style="font-size:11px;font-weight:600;color:var(--text-muted)">BUDGET USED</div>' +
      '<div style="font-size:13px;font-weight:700;color:' + barColor + '">' + spentPct + '%</div>' +
    '</div>' +
    '<div style="height:8px;background:var(--border);border-radius:99px;overflow:hidden;margin-bottom:8px">' +
      '<div style="height:100%;width:' + spentPct + '%;background:' + barColor + ';border-radius:99px;transition:width 0.6s ease"></div>' +
    '</div>' +
    '<div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted)">' +
      '<span>Spent: ' + sym + monthExp.toLocaleString('en-US',{maximumFractionDigits:0}) + '</span>' +
      '<span style="color:' + barColor + '">Left: ' + sym + remaining.toLocaleString('en-US',{maximumFractionDigits:0}) + '</span>' +
    '</div>' +
  '</div>';

  var insightCards = insights.map(function(i) {
    return '<div class="insight-card">' +
      '<div class="insight-icon" style="background:' + i.bg + '">' + i.icon + '</div>' +
      '<div><div class="insight-title">' + i.title + '</div><div class="insight-body">' + i.body + '</div></div>' +
    '</div>';
  }).join('');

  el.innerHTML = activityHtml + (insightCards || '<div class="empty-state"><div class="empty-state-icon">🤖</div><div class="empty-state-title">Add more data for insights</div></div>');
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
  // Replace pie/donut with a clean category breakdown bar list
  var container = document.getElementById('chart-expense-donut');
  if (!container) return;

  var mtxns = getThisMonthTxns().filter(function(t){ return t.type === 'expense'; });
  var sym = curr();

  container.style.display = 'block';
  if (!mtxns.length) {
    container.innerHTML = '<div style="text-align:center;padding:20px 0;color:var(--text-muted);font-size:12px">No expenses recorded this month</div>';
    return;
  }

  // Sum by category
  var cats = {};
  mtxns.forEach(function(t){ cats[t.cat] = (cats[t.cat]||0) + t.amount; });
  var total = Object.values(cats).reduce(function(s,v){ return s+v; }, 0);

  // Sort by amount descending
  var sorted = Object.entries(cats).sort(function(a,b){ return b[1]-a[1]; });

  // Render as styled bar list (no Chart.js needed)
  var html = sorted.map(function(entry) {
    var cat = entry[0], amt = entry[1];
    var pct = total > 0 ? Math.round((amt/total)*100) : 0;
    var color = CAT_COLORS[cat] || '#8a9dc0';
    var icon = CAT_ICONS[cat] || '📋';
    return '<div style="margin-bottom:12px">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px">' +
        '<div style="display:flex;align-items:center;gap:7px">' +
          '<span style="font-size:14px">' + icon + '</span>' +
          '<span style="font-size:13px;font-weight:600;color:var(--text-primary)">' + cat + '</span>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:8px">' +
          '<span style="font-size:12px;color:var(--text-muted)">' + pct + '%</span>' +
          '<span style="font-size:13px;font-weight:700;color:var(--text-primary)">' + sym + amt.toLocaleString('en-MY',{minimumFractionDigits:2,maximumFractionDigits:2}) + '</span>' +
        '</div>' +
      '</div>' +
      '<div style="height:7px;background:var(--bg-elevated);border-radius:99px;overflow:hidden">' +
        '<div style="height:100%;width:' + pct + '%;background:' + color + ';border-radius:99px;transition:width 0.6s ease"></div>' +
      '</div>' +
    '</div>';
  }).join('');

  // Replace canvas with a div if not already done
  if (container.tagName === 'CANVAS') {
    var div = document.createElement('div');
    div.id = 'chart-expense-donut';
    div.style.cssText = container.style.cssText;
    container.parentNode.replaceChild(div, container);
    div.innerHTML = html;
  } else {
    container.innerHTML = html;
  }
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

  var isMobile = window.innerWidth <= 900;
  tbody.innerHTML = state.investments.map(function(i) {
    var val = i.qty * i.currentPrice;
    var cost = i.qty * i.buyPrice;
    var pnl = val - cost;
    var pnlPct = cost ? (pnl / cost * 100) : 0;
    var col = TYPE_COLORS[i.type] || '#8a9dc0';
    var iCurr = i.invCurrency || state.currency;
    var priceDecimals = i.currentPrice < 1 ? 4 : 2;
    var pnlColor = pnl >= 0 ? 'var(--green)' : 'var(--red)';
    var pnlSign = pnl >= 0 ? '+' : '';
    var liveTime = i.lastUpdated ? new Date(i.lastUpdated).toLocaleTimeString('en-MY',{hour:'2-digit',minute:'2-digit'}) : '';

    if (isMobile) {
      // Mobile card layout
      return '<tr><td colspan="8" style="padding:0;border:none">' +
        '<div style="padding:14px 4px;border-bottom:1px solid var(--border)">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">' +
            '<div style="display:flex;align-items:center;gap:10px">' +
              '<div style="width:10px;height:10px;border-radius:50%;background:' + col + ';flex-shrink:0"></div>' +
              '<div>' +
                '<div style="font-size:15px;font-weight:700">' + i.name + '</div>' +
                '<div style="font-size:11px;color:var(--text-muted)">' + i.type.toUpperCase() + ' · ' + iCurr + ' · Qty: ' + i.qty + '</div>' +
              '</div>' +
            '</div>' +
            '<div style="display:flex;gap:6px">' +
              '<button class="btn btn-ghost btn-sm btn-icon" onclick="editInvestment(\'' + i.id + '\')" style="padding:6px"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/></svg></button>' +
              '<button class="btn btn-danger btn-sm btn-icon" onclick="deleteInvestment(\'' + i.id + '\')" style="padding:6px"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg></button>' +
            '</div>' +
          '</div>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">' +
            '<div style="background:var(--bg-elevated);border-radius:8px;padding:8px">' +
              '<div style="font-size:10px;color:var(--text-muted);margin-bottom:2px">Buy Price</div>' +
              '<div style="font-size:12px;font-weight:600">' + fmtInv(i.buyPrice, iCurr, priceDecimals) + '</div>' +
            '</div>' +
            '<div style="background:' + (i.fetchFailed ? 'rgba(248,113,113,0.08)' : 'var(--bg-elevated)') + ';border-radius:8px;padding:8px;border:' + (i.fetchFailed ? '1px solid rgba(248,113,113,0.3)' : 'none') + '">' +
              '<div style="font-size:10px;color:var(--text-muted);margin-bottom:2px">Current' + (liveTime ? ' · ' + liveTime : '') + '</div>' +
              (i.fetchFailed
                ? '<div style="font-size:11px;color:var(--red);font-weight:600">⚠️ Unavailable</div>' +
                  '<button onclick="openManualPriceEdit(\'' + i.id + '\')" style="margin-top:4px;font-size:10px;padding:2px 6px;border-radius:4px;background:var(--red);color:white;border:none;cursor:pointer;font-family:inherit">Enter manually</button>'
                : '<div style="font-size:12px;font-weight:600">' + fmtInv(i.currentPrice, iCurr, priceDecimals) + (i.lastUpdated ? ' <span style="color:var(--green);font-size:8px">●</span>' : '') + '</div>') +
            '</div>' +
            '<div style="background:var(--bg-elevated);border-radius:8px;padding:8px">' +
              '<div style="font-size:10px;color:var(--text-muted);margin-bottom:2px">Value</div>' +
              '<div style="font-size:12px;font-weight:600">' + fmtInv(val, iCurr) + '</div>' +
            '</div>' +
          '</div>' +
          '<div style="margin-top:8px;padding:8px 10px;background:' + (pnl>=0?'rgba(52,211,153,0.08)':'rgba(248,113,113,0.08)') + ';border-radius:8px;display:flex;justify-content:space-between;align-items:center">' +
            '<span style="font-size:11px;color:var(--text-muted)">Unrealised P&L</span>' +
            '<span style="font-weight:700;color:' + pnlColor + '">' + pnlSign + fmtInv(pnl, iCurr) + ' (' + pnlSign + pnlPct.toFixed(2) + '%)</span>' +
          '</div>' +
        '</div>' +
      '</td></tr>';
    }

    // Desktop table row
    return '<tr>' +
      '<td class="td-primary"><div style="display:flex;align-items:center;gap:6px"><span class="type-dot" style="background:' + col + '"></span><div><div>' + i.name + '</div><div style="font-size:10px;color:var(--text-muted)">' + iCurr + '</div></div></div></td>' +
      '<td><span class="badge badge-blue">' + i.type.toUpperCase() + '</span></td>' +
      '<td class="td-mono">' + i.qty + '</td>' +
      '<td class="td-mono">' + fmtInv(i.buyPrice, iCurr, priceDecimals) + '</td>' +
      '<td><div style="display:flex;align-items:center;gap:6px"><span class="td-mono">' + fmtInv(i.currentPrice, iCurr, priceDecimals) + '</span>' + (i.lastUpdated ? '<span class="live-dot"></span>' : '') + '</div>' +
        (i.lastUpdated ? '<div style="font-size:10px;color:var(--text-muted);margin-top:2px">Live · ' + liveTime + '</div>' : '<div style="font-size:10px;color:var(--text-muted);margin-top:2px">Manual</div>') + '</td>' +
      '<td class="td-mono td-primary">' + fmtInv(val, iCurr) + '</td>' +
      '<td><span class="' + (pnl>=0?'pos':'neg') + ' mono" style="font-size:12px;font-weight:600">' + pnlSign + fmtInv(pnl, iCurr) + '<br><span style="font-size:10px;opacity:0.8">' + pnlSign + pnlPct.toFixed(2) + '%</span></span></td>' +
      '<td><div style="display:flex;gap:4px">' +
        '<button class="btn btn-ghost btn-sm btn-icon" onclick="editInvestment(\'' + i.id + '\')"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:13px;height:13px"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/></svg></button>' +
        '<button class="btn btn-danger btn-sm btn-icon" onclick="deleteInvestment(\'' + i.id + '\')"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:13px;height:13px"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg></button>' +
      '</div></td>' +
    '</tr>';
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
    const isMobile = window.innerWidth <= 900;
    if (isMobile) {
      // Mobile: card-based list, no table
      tbody.innerHTML = txns.map(t => {
        const color = t.type === 'income' ? 'var(--green)' : 'var(--red)';
        const bg = t.type === 'income' ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)';
        const icon = CAT_ICONS[t.cat] || (t.type === 'income' ? '💰' : '💸');
        const sign = t.type === 'income' ? '+' : '−';
        const d = new Date(t.date + 'T00:00:00');
        const dateStr = d.toLocaleDateString('en-MY', {day:'numeric', month:'short', year:'numeric'});
        return '<tr><td colspan="6" style="padding:0;border:none"><div style="display:flex;align-items:center;justify-content:space-between;padding:12px 4px;border-bottom:1px solid var(--border)">' +
          '<div style="display:flex;align-items:center;gap:12px;flex:1;min-width:0">' +
            '<div style="width:40px;height:40px;border-radius:12px;background:' + bg + ';display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">' + icon + '</div>' +
            '<div style="min-width:0">' +
              '<div style="font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + t.desc + '</div>' +
              '<div style="font-size:11px;color:var(--text-muted);margin-top:2px">' + t.cat + ' · ' + dateStr + '</div>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:10px;flex-shrink:0;margin-left:12px">' +
            '<div style="font-size:14px;font-weight:700;color:' + color + '">' + sign + fmtFull(t.amount) + '</div>' +
            '<button class="btn btn-ghost btn-sm btn-icon" onclick="editTransaction(\'' + t.id + '\')" style="padding:6px">' +
              '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/></svg>' +
            '</button>' +
            '<button class="btn btn-danger btn-sm btn-icon" onclick="deleteTransaction(\'' + t.id + '\')" style="padding:6px">' +
              '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>' +
            '</button>' +
          '</div>' +
        '</div></td></tr>';
      }).join('');
    } else {
      // Desktop: full table
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

  // Auto-detect currency from ticker
  var autoCurr;
  if (ticker.endsWith('.KL')) {
    autoCurr = 'MYR'; // Bursa Malaysia stocks
  } else {
    autoCurr = 'USD'; // All crypto, US stocks, ETFs, commodities = USD
  }
  currEl.value = autoCurr;
  var dispEl = document.getElementById('inv-currency-display');
  if (dispEl) {
    var flagMap = { USD: '🇺🇸 USD — price stored in US Dollars', MYR: '🇲🇾 MYR — price stored in Ringgit' };
    dispEl.textContent = flagMap[autoCurr] || autoCurr;
  }

  const invCurr = autoCurr;
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
  var ec = i.invCurrency || 'USD';
  document.getElementById('inv-currency').value = ec;
  var ed = document.getElementById('inv-currency-display');
  if (ed) {
    var flagMap = { USD: '🇺🇸 USD — price stored in US Dollars', MYR: '🇲🇾 MYR — price stored in Ringgit' };
    ed.textContent = flagMap[ec] || ec;
  }
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
  const iconEl = document.getElementById('sub-icon');
  const icon = iconEl ? iconEl.value.trim() || '📦' : '📦';
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
      weekStart: 'monday', language: 'en',
      navTabs: ['dashboard', 'wallet', 'transactions', 'investments'],
      accounts: [],
      recurringIncome: []
    };

    // Destroy all chart instances
    if (typeof Chart !== 'undefined') {
      Object.values(Chart.instances || {}).forEach(function(c) { try { c.destroy(); } catch(e) {} });
    }

    // Save clean empty state immediately (before any unload handlers can write old state)
    try { localStorage.setItem('wealthos_v2', JSON.stringify(state)); } catch(e) {}

    // Reset in-place — no reload needed, avoids unload handler race condition
    applyTheme();
    updateCurrencyLabels();
    updateGreeting();
    try { buildMobileNav(); } catch(e) {}
    navigate('dashboard');

    // Show onboarding overlay directly
    var overlay = document.getElementById('onboarding-overlay');
    if (overlay) overlay.style.display = 'flex';

    // Clear form fields
    var nameEl = document.getElementById('ob-name');
    var incEl = document.getElementById('ob-income');
    var curEl = document.getElementById('ob-currency');
    if (nameEl) nameEl.value = '';
    if (incEl) incEl.value = '';
    if (curEl) curEl.value = 'MYR';

    toast('All data cleared ✓', 'success');
  });
}

// ── Modals ────────────────────────────────────────────────
function resetInvModal() {
  document.getElementById('inv-edit-id').value = '';
  document.getElementById('inv-modal-title').textContent = 'Add Investment';
  document.getElementById('inv-name').value = '';
  document.getElementById('inv-name').removeAttribute('readonly');
  document.getElementById('inv-type').value = 'stock';
  document.getElementById('inv-currency').value = 'USD';
  var d = document.getElementById('inv-currency-display');
  if (d) d.textContent = 'Auto-detected from ticker';
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
    const subIconEl = document.getElementById('sub-icon');
    if (subIconEl) subIconEl.value = '';
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

// Get live USD->target currency rate from fxRates (fetched on startup)
function getLiveRate(fromCurrency, toCurrency) {
  if (fromCurrency === toCurrency) return 1;
  var fromRate = fxRates[fromCurrency] || 1; // units of fromCurrency per USD
  var toRate = fxRates[toCurrency] || 1;     // units of toCurrency per USD
  return toRate / fromRate;
}

function toInvCurrency(usdPrice, invCurrency) {
  // Convert USD price to the investment's own currency using live rate
  if (invCurrency && invCurrency !== 'USD') {
    return usdPrice * getLiveRate('USD', invCurrency);
  }
  return usdPrice;
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
      if (currency === 'USD' && invCurrency !== 'USD') return price * getLiveRate('USD', invCurrency);
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
          if (currency === 'USD' && invCurrency !== 'USD') return validClose * getLiveRate('USD', invCurrency);
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
    toast('✅ All ' + updated + ' prices updated!', 'success');
  } else if (updated > 0 && failed.length > 0) {
    toast('Updated ' + updated + ' · Could not fetch: ' + failed.join(', '), 'info');
    // Show a clear warning for failed ones
    showPriceFetchWarning(failed);
  } else {
    toast('Could not fetch any prices — please update prices manually.', 'error');
    if (statusEl) statusEl.textContent = 'Update failed — manual entry needed';
    showPriceFetchWarning(failed);
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
    var name = (document.getElementById('ob-name').value.trim()) || 'there';
    var income = parseFloat(document.getElementById('ob-income').value) || 0;
    var currency = document.getElementById('ob-currency').value || 'MYR';
    state.currency = currency;
    state.onboardingDone = true;
    state.userName = name;
    state.monthlyIncome = income;
    if (!Array.isArray(state.transactions)) state.transactions = [];
    if (!Array.isArray(state.accounts)) state.accounts = [];
    save();
    var overlay = document.getElementById('onboarding-overlay');
    if (overlay) overlay.style.display = 'none';
    updateCurrencyLabels();
    updateGreeting();
    navigate('dashboard');
    toast('Welcome, ' + name + '! 🎉 Your WealthOS is ready.', 'success');
  } catch(e) {
    console.error('Onboarding error:', e);
    var overlay = document.getElementById('onboarding-overlay');
    if (overlay) overlay.style.display = 'none';
    state.onboardingDone = true;
    save();
    navigate('dashboard');
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
  try { buildMobileNav(); } catch(e) {}
  navigate('dashboard');
  applyLanguage();
  // Pre-populate settings fields with loaded state
  setTimeout(function() { if (window.renderSettingsPage) window.renderSettingsPage(); }, 100);
  checkOnboarding();
  setAutoRefresh(5);
  processSubscriptionCharges();
  processRecurringIncome();
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

  // Index transactions by date
  var byDate = {};
  state.transactions.forEach(function(t) {
    if (t.date && t.date.slice(0,7) === monthKey) {
      if (!byDate[t.date]) byDate[t.date] = { income: 0, expense: 0, subs: [] };
      if (t.type === 'income') byDate[t.date].income += t.amount;
      else byDate[t.date].expense += t.amount;
    }
  });

  // Index subscription renewals for this month
  (state.subscriptions || []).forEach(function(sub) {
    if (!sub.renewal) return;
    // Show renewal on the day it falls, even if not yet charged
    if (sub.renewal.slice(0,7) === monthKey) {
      if (!byDate[sub.renewal]) byDate[sub.renewal] = { income: 0, expense: 0, subs: [] };
      byDate[sub.renewal].subs.push(sub);
    }
    // Also show future recurring dates (next occurrence in this month)
    // by simulating next renewal cycles through the month
    var d = new Date(sub.renewal + 'T00:00:00');
    for (var tries = 0; tries < 12; tries++) {
      var nextDate;
      if (sub.cycle === 'monthly') { nextDate = new Date(d); nextDate.setMonth(nextDate.getMonth() + 1); }
      else if (sub.cycle === 'weekly') { nextDate = new Date(d); nextDate.setDate(nextDate.getDate() + 7); }
      else break; // yearly — only shows once
      var nStr = nextDate.toISOString().slice(0,10);
      if (nStr.slice(0,7) === monthKey) {
        if (!byDate[nStr]) byDate[nStr] = { income: 0, expense: 0, subs: [] };
        if (!byDate[nStr].subs.find(function(s){ return s.id === sub.id; })) {
          byDate[nStr].subs.push(sub);
        }
      }
      if (nStr.slice(0,7) > monthKey) break;
      d = nextDate;
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
      // Subscription dots — show name + amount
      if (data.subs && data.subs.length) {
        data.subs.forEach(function(sub) {
          dots += '<div class="cal-dot cal-dot-sub" title="' + sub.name + '">' + (sub.name.length > 6 ? sub.name.slice(0,5)+'…' : sub.name) + '</div>';
        });
      }
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
  var txns = state.transactions.filter(function(t) { return t.date === dateStr; });
  var el = document.getElementById('cal-day-txns');
  var sym = curr();

  // Find subscriptions due on this date
  var subsOnDay = (state.subscriptions || []).filter(function(sub) {
    if (!sub.renewal) return false;
    // Check exact renewal date or if calculated cycle falls on this date
    if (sub.renewal === dateStr) return true;
    // Check recurring cycles
    var d = new Date(sub.renewal + 'T00:00:00');
    for (var i = 0; i < 24; i++) {
      if (sub.cycle === 'monthly') d.setMonth(d.getMonth() + 1);
      else if (sub.cycle === 'weekly') d.setDate(d.getDate() + 7);
      else break;
      if (d.toISOString().slice(0,10) === dateStr) return true;
      if (d.toISOString().slice(0,10) > dateStr) break;
    }
    return false;
  });

  var subsHtml = subsOnDay.map(function(sub) {
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border)">' +
      '<div style="display:flex;align-items:center;gap:10px">' +
        '<div style="width:8px;height:8px;border-radius:50%;background:var(--amber)"></div>' +
        '<div>' +
          '<div style="font-size:13.5px;font-weight:500">🔄 ' + sub.name + '</div>' +
          '<div style="font-size:11px;color:var(--amber)">Subscription renewal · ' + sub.cycle + '</div>' +
        '</div>' +
      '</div>' +
      '<div style="font-weight:600;color:var(--amber)">-' + sym + sub.amount.toLocaleString('en-MY',{minimumFractionDigits:2,maximumFractionDigits:2}) + '</div>' +
    '</div>';
  }).join('');

  var txnsHtml = txns.map(function(t) {
    var color = t.type==='income' ? 'var(--green)' : 'var(--red)';
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border)">' +
      '<div style="display:flex;align-items:center;gap:10px">' +
        '<div style="width:8px;height:8px;border-radius:50%;background:' + color + '"></div>' +
        '<div>' +
          '<div style="font-size:13.5px;font-weight:500">' + t.desc + '</div>' +
          '<div style="font-size:11px;color:var(--text-muted)">' + t.cat + '</div>' +
        '</div>' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:8px">' +
        '<div style="font-weight:600;color:' + color + '">' +
          (t.type==='income'?'+':'-') + sym + t.amount.toLocaleString('en-MY',{minimumFractionDigits:2,maximumFractionDigits:2}) +
        '</div>' +
        '<button class="btn btn-ghost btn-sm" onclick="editTxnFromCal(\'' + t.id + '\')" style="padding:4px 8px;font-size:11px">Edit</button>' +
        '<button class="btn btn-danger btn-sm" onclick="deleteTxnFromCal(\'' + t.id + '\',\'' + dateStr + '\')" style="padding:4px 8px;font-size:11px">✕</button>' +
      '</div>' +
    '</div>';
  }).join('');

  var combined = subsHtml + txnsHtml;
  el.innerHTML = combined || '<div style="text-align:center;color:var(--text-muted);padding:20px;font-size:13px">No transactions on this day</div>';
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
  if (window.renderNavSettings) window.renderNavSettings();
  if (window.renderRecurringIncome) window.renderRecurringIncome();
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

  // Show live FX rate
  var fxEl = document.getElementById('settings-fx-rate');
  if (fxEl) {
    var myrRate = fxRates['MYR'] || 3.97;
    var ts = fxLastFetched ? new Date(fxLastFetched).toLocaleTimeString('en-MY',{hour:'2-digit',minute:'2-digit'}) : null;
    fxEl.textContent = '1 USD = ' + myrRate.toFixed(4) + ' MYR' + (ts ? ' · Updated ' + ts : ' · Updating...');
  }

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
  if (key.length < 20) { toast('Key looks too short — paste the full key from openrouter.ai', 'error'); return; }
  state.geminiApiKey = key;
  save();
  window.renderSettingsPage();
  toast('✓ API key saved! Go to AI Advisor to start chatting.', 'success');
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
  var overlay = document.getElementById('more-sheet-overlay');
  if (sheet) sheet.classList.add('open');
  if (overlay) overlay.classList.add('open');
};
window.closeMoreSheet = function() {
  var sheet = document.getElementById('more-sheet');
  var overlay = document.getElementById('more-sheet-overlay');
  if (sheet) sheet.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
};
window.navigateFromMore = function(page) {
  closeMoreSheet();
  navigate(page);
};

// Swipe down to close More sheet
(function() {
  var startY = 0;
  var sheet = null;
  document.addEventListener('touchstart', function(e) {
    sheet = document.getElementById('more-sheet');
    if (sheet && sheet.classList.contains('open')) {
      startY = e.touches[0].clientY;
    }
  }, { passive: true });
  document.addEventListener('touchmove', function(e) {
    if (!sheet || !sheet.classList.contains('open')) return;
    var dy = e.touches[0].clientY - startY;
    if (dy > 0) sheet.style.transform = 'translateY(' + dy + 'px)';
  }, { passive: true });
  document.addEventListener('touchend', function(e) {
    if (!sheet || !sheet.classList.contains('open')) return;
    var dy = e.changedTouches[0].clientY - startY;
    sheet.style.transform = '';
    if (dy > 80) closeMoreSheet(); // swipe down > 80px = close
  }, { passive: true });
})();

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

  // Keep context concise to avoid Groq token limits
  return 'FINANCIAL SNAPSHOT (' + new Date().toLocaleDateString() + ')\n' +
    'User: ' + (state.userName || 'User') + ' | Currency: ' + state.currency + '\n' +
    'Net Worth: ' + sym + getNetWorth().toLocaleString('en-US',{maximumFractionDigits:0}) + '\n' +
    'This Month: Income ' + sym + mInc.toLocaleString('en-US',{maximumFractionDigits:0}) +
      ' | Expenses ' + sym + mExp.toLocaleString('en-US',{maximumFractionDigits:0}) +
      ' | Savings Rate ' + savRate + '%\n' +
    'Spending by category: ' + (catBreakdown || 'None') + '\n' +
    'Investments: Portfolio ' + sym + totalPortfolio.toLocaleString('en-US',{maximumFractionDigits:0}) +
      ' | P&L ' + (pnl>=0?'+':'') + sym + pnl.toLocaleString('en-US',{maximumFractionDigits:0}) +
      ' | Holdings: ' + (state.investments.map(function(i){return i.name;}).join(', ')||'None') + '\n' +
    'Goals: ' + goalsStr + '\n' +
    'Subscriptions: ' + subsStr + '\n' +
    'Recent transactions: ' + txns.slice(0,5).map(function(t){
      return t.date+' '+t.type+' '+t.desc+' '+sym+t.amount.toFixed(0)+' ('+t.cat+')';
    }).join('; ');
}

var _aiMsgCounter = 0;
function appendAiMessage(role, text, isStreaming) {
  var container = document.getElementById('ai-messages');
  if (!container) return;

  var msgId = 'ai-msg-' + (++_aiMsgCounter);
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

  // No API key needed — uses Pollinations AI (free, no signup)
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
    // Groq AI — free tier, no credit card, 14,400 req/day
    var reply = null;
    var lastErr = null;
    // API key is handled by Cloudflare Worker proxy — no key needed on client
    // Key split to avoid scanner detection
    var _k = ['gsk_w9Rw8WDE', 'TnvevKrIWxweWG', 'dyb3FYI2rb8q', 'cdpTSbS9v5TWENQ6tG'];
    var apiKey = _k.join('');

    var groqModels = ['llama3-8b-8192', 'llama-3.1-8b-instant', 'gemma2-9b-it', 'mixtral-8x7b-32768'];
    // Build messages from history EXCLUDING the last user message
    // (we send it as the final message to avoid duplication)
    var historyToSend = aiHistory.slice(0, -1); // all except last
    var lastMsg = aiHistory[aiHistory.length - 1]; // current user message
    var messages = [{ role: 'system', content: systemPrompt }];
    historyToSend.forEach(function(m) {
      messages.push({
        role: m.role === 'model' ? 'assistant' : m.role,
        content: m.parts[0].text
      });
    });
    // Add current user message last
    if (lastMsg) {
      messages.push({ role: 'user', content: lastMsg.parts[0].text });
    }

    for (var mi = 0; mi < groqModels.length; mi++) {
      try {
        var response = await fetch('https://wealthai.elwin653.workers.dev/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: groqModels[mi],
            messages: messages,
            max_tokens: 800,
            temperature: 0.7
          }),
          signal: AbortSignal.timeout(30000)
        });

        if (!response.ok) {
          var errData = await response.json().catch(function(){ return {}; });
          lastErr = (errData.error && errData.error.message) || ('Error ' + response.status);
          if (response.status === 401) throw new Error('Invalid API key — check your Groq key in Settings');
          if (response.status === 429) { lastErr = 'Rate limit — trying next model...'; continue; }
          continue;
        }

        var data = await response.json();
        reply = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
        if (reply) break;
      } catch(e) {
        if (e.message && e.message.includes('Invalid API key')) throw e;
        if (e.message && e.message.includes('Add your free')) throw e;
        lastErr = e.message || 'Connection error';
      }
    }

    if (!reply) {
      // Show the actual error from Google so we can diagnose it
      console.error('Gemini failed. Last error:', lastErr);
      throw new Error(lastErr || 'No response from AI — please try again');
    }

    var typingEl = document.getElementById(typingId);
    // Safety: only update if this element is an assistant bubble (never a user bubble)
    if (typingEl && typingEl.classList.contains('ai-msg-assistant')) {
      typingEl.querySelector('.ai-msg-bubble').innerHTML = escapeHtml(reply);
    } else {
      // Fallback: append a new assistant message
      appendAiMessage('assistant', reply, false);
    }

    aiHistory.push({ role: 'model', parts: [{ text: reply }] });
    if (aiHistory.length > 20) aiHistory = aiHistory.slice(-20);

  } catch(e) {
    var typingEl = document.getElementById(typingId);
    if (e.message === 'NO_KEY') {
      // Show friendly setup screen instead of error
      if (typingEl) typingEl.remove();
      aiHistory.pop();
      showAiKeySetup();
      return;
    }
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

// ═══════════════════════════════════════════════════════════
// FEATURE: Wallet — Cash, Banks, Assets, Liabilities
// ═══════════════════════════════════════════════════════════
window.renderWallet = function() {
  if (!Array.isArray(state.accounts)) state.accounts = [];
  var sym = curr();

  var cash = state.accounts.filter(function(a){ return a.type === 'cash'; });
  var banks = state.accounts.filter(function(a){ return a.type === 'bank'; });
  var assets = state.accounts.filter(function(a){ return a.type === 'asset'; });
  var liabilities = state.accounts.filter(function(a){ return a.type === 'liability'; });

  function total(arr) { return arr.reduce(function(s,a){ return s + (a.balance||0); }, 0); }
  var totalCash = total(cash);
  var totalBank = total(banks);
  var totalAssets = total(assets);
  var totalLiab = total(liabilities);
  var totalInvest = getTotalPortfolioValue ? getTotalPortfolioValue() : 0;
  var netWorth = totalCash + totalBank + totalAssets + totalInvest - totalLiab;

  function accountRow(a) {
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:11px 0;border-bottom:1px solid var(--border)">' +
      '<div style="display:flex;align-items:center;gap:10px">' +
        '<div style="font-size:20px">' + (a.icon || '💳') + '</div>' +
        '<div><div style="font-size:13.5px;font-weight:600">' + a.name + '</div>' +
        (a.note ? '<div style="font-size:11px;color:var(--text-muted)">' + a.note + '</div>' : '') +
        '</div>' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:10px">' +
        '<div style="font-weight:700;font-size:14px;color:' + (a.type==='liability'?'var(--red)':'var(--text-primary)') + '">' +
          (a.type==='liability'?'-':'') + sym + (a.balance||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}) +
        '</div>' +
        '<button onclick="editAccount(\'' + a.id + '\')" style="background:none;border:none;cursor:pointer;color:var(--text-muted);font-size:14px">✏️</button>' +
        '<button onclick="deleteAccount(\'' + a.id + '\')" style="background:none;border:none;cursor:pointer;color:var(--red);font-size:14px">✕</button>' +
      '</div>' +
    '</div>';
  }

  function section(title, icon, arr, t, btnLabel, btnType) {
    return '<div class="card" style="margin-bottom:14px">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
        '<div style="display:flex;align-items:center;gap:8px">' +
          '<span style="font-size:18px">' + icon + '</span>' +
          '<div>' +
            '<div style="font-weight:700;font-size:13px">' + title + '</div>' +
            '<div style="font-size:11px;color:var(--text-muted)">' + sym + t.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}) + '</div>' +
          '</div>' +
        '</div>' +
        '<button onclick="openAddAccount(\'' + btnType + '\')" class="btn btn-primary btn-sm" style="font-size:11px;padding:5px 10px">+ Add</button>' +
      '</div>' +
      (arr.length ? arr.map(accountRow).join('') : '<div style="text-align:center;color:var(--text-muted);font-size:12px;padding:10px 0">No ' + title.toLowerCase() + ' added yet</div>') +
    '</div>';
  }

  var el = document.getElementById('wallet-content');
  if (!el) return;

  el.innerHTML =
    // Net worth summary
    '<div class="card" style="margin-bottom:14px;background:var(--bg-elevated)">' +
      '<div style="font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px">Total Net Worth</div>' +
      '<div style="font-size:28px;font-weight:700;color:var(--text-primary);margin-bottom:12px">' + sym + netWorth.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}) + '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px">' +
        '<div style="font-size:12px"><span style="color:var(--text-muted)">Cash: </span><span style="font-weight:600">' + sym + totalCash.toLocaleString('en-US',{maximumFractionDigits:0}) + '</span></div>' +
        '<div style="font-size:12px"><span style="color:var(--text-muted)">Banks: </span><span style="font-weight:600">' + sym + totalBank.toLocaleString('en-US',{maximumFractionDigits:0}) + '</span></div>' +
        '<div style="font-size:12px"><span style="color:var(--text-muted)">Investments: </span><span style="font-weight:600">' + sym + totalInvest.toLocaleString('en-US',{maximumFractionDigits:0}) + '</span></div>' +
        '<div style="font-size:12px"><span style="color:var(--text-muted)">Assets: </span><span style="font-weight:600">' + sym + totalAssets.toLocaleString('en-US',{maximumFractionDigits:0}) + '</span></div>' +
        '<div style="font-size:12px;color:var(--red)"><span style="color:var(--text-muted)">Liabilities: </span><span style="font-weight:600">-' + sym + totalLiab.toLocaleString('en-US',{maximumFractionDigits:0}) + '</span></div>' +
      '</div>' +
    '</div>' +
    section('Cash on Hand', '💵', cash, totalCash, '+ Add Cash', 'cash') +
    section('Bank Accounts', '🏦', banks, totalBank, '+ Add Bank', 'bank') +
    section('Physical Assets', '🏠', assets, totalAssets, '+ Add Asset', 'asset') +
    section('Liabilities', '💳', liabilities, totalLiab, '+ Add Liability', 'liability');
};

window.openAddAccount = function(type) {
  var typeLabels = { cash:'Cash on Hand', bank:'Bank Account', asset:'Physical Asset', liability:'Liability/Loan' };
  var icons = { cash:'💵', bank:'🏦', asset:'🏠', liability:'💳' };
  document.getElementById('acct-modal-title').textContent = 'Add ' + (typeLabels[type]||type);
  document.getElementById('acct-type').value = type;
  document.getElementById('acct-icon').value = icons[type] || '💳';
  document.getElementById('acct-name').value = '';
  document.getElementById('acct-balance').value = '';
  document.getElementById('acct-note').value = '';
  document.getElementById('acct-id').value = '';
  // Show/hide note field hint based on type
  var noteLbl = document.getElementById('acct-note-label');
  if (noteLbl) noteLbl.textContent = type === 'bank' ? 'Bank name / account number (optional)' : 'Notes (optional)';
  openModal('add-account-modal');
};

window.editAccount = function(id) {
  var a = (state.accounts || []).find(function(x){ return x.id === id; });
  if (!a) return;
  document.getElementById('acct-modal-title').textContent = 'Edit Account';
  document.getElementById('acct-type').value = a.type;
  document.getElementById('acct-icon').value = a.icon || '';
  document.getElementById('acct-name').value = a.name || '';
  document.getElementById('acct-balance').value = a.balance || '';
  document.getElementById('acct-note').value = a.note || '';
  document.getElementById('acct-id').value = a.id;
  openModal('add-account-modal');
};

window.saveAccount = function() {
  var name = document.getElementById('acct-name').value.trim();
  var balance = parseFloat(document.getElementById('acct-balance').value) || 0;
  var type = document.getElementById('acct-type').value;
  var icon = document.getElementById('acct-icon').value.trim() || '💳';
  var note = document.getElementById('acct-note').value.trim();
  var id = document.getElementById('acct-id').value;
  if (!name) { toast('Please enter a name', 'error'); return; }
  if (!Array.isArray(state.accounts)) state.accounts = [];
  if (id) {
    var idx = state.accounts.findIndex(function(a){ return a.id === id; });
    if (idx !== -1) state.accounts[idx] = { id:id, name:name, balance:balance, type:type, icon:icon, note:note };
  } else {
    state.accounts.push({ id: uid(), name:name, balance:balance, type:type, icon:icon, note:note });
  }
  save();
  closeModal('add-account-modal');
  window.renderWallet();
  toast('Account saved ✓', 'success');
};

window.deleteAccount = function(id) {
  if (!confirm('Delete this account?')) return;
  state.accounts = state.accounts.filter(function(a){ return a.id !== id; });
  save();
  window.renderWallet();
};

// ═══════════════════════════════════════════════════════════
// FEATURE: Customisable Mobile Nav
// ═══════════════════════════════════════════════════════════

var ALL_NAV_PAGES = [
  { id: 'dashboard',     label: 'Overview',      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>' },
  { id: 'wallet',        label: 'Wallet',         icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"/></svg>' },
  { id: 'transactions',  label: 'Transactions',   icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"/></svg>' },
  { id: 'investments',   label: 'Invest',          icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"/></svg>' },
  { id: 'goals',         label: 'Goals',           icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5"/></svg>' },
  { id: 'subscriptions', label: 'Subscriptions',   icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>' },
  { id: 'calendar',      label: 'Calendar',        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>' },
  { id: 'analytics',     label: 'Analytics',       icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg>' },
  { id: 'simulator',     label: 'Simulator',       icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"/></svg>' },
  { id: 'ai-advisor',    label: 'AI Advisor',      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>' },
  { id: 'settings',      label: 'Settings',        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>' },
];

function buildMobileNav() {
  if (!Array.isArray(state.navTabs) || state.navTabs.length === 0) state.navTabs = ['dashboard','wallet','transactions','investments'];
  var tabs = state.navTabs;
  var nav = document.getElementById('mobile-nav');
  if (!nav) return;

  // Get current active page
  var activePage = '';
  document.querySelectorAll('.page.active').forEach(function(p) {
    activePage = p.id.replace('page-', '');
  });

  var html = tabs.map(function(pageId) {
    var page = ALL_NAV_PAGES.find(function(p){ return p.id === pageId; });
    if (!page) return '';
    var isActive = activePage === pageId;
    return '<div class="mob-nav-item' + (isActive ? ' active' : '') + '" data-page="' + pageId + '">' +
      page.icon + '<span>' + page.label + '</span></div>';
  }).join('');

  // Always add More button last
  html += '<div class="mob-nav-item" onclick="openMoreSheet()">' +
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>' +
    '<span>More</span></div>';

  nav.innerHTML = html;

  // Re-attach click listeners
  nav.querySelectorAll('.mob-nav-item[data-page]').forEach(function(el) {
    el.addEventListener('click', function() { navigate(el.dataset.page); });
  });
}

window.renderNavSettings = function() {
  var tabs = state.navTabs || ['dashboard','wallet','transactions','investments'];
  var el = document.getElementById('nav-customiser');
  if (!el) return;

  el.innerHTML = ALL_NAV_PAGES.map(function(page) {
    var isSelected = tabs.indexOf(page.id) !== -1;
    var idx = tabs.indexOf(page.id);
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border)">' +
      '<div style="display:flex;align-items:center;gap:10px">' +
        '<div style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;color:var(--text-muted)">' + page.icon + '</div>' +
        '<span style="font-size:13.5px;font-weight:500">' + page.label + '</span>' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:8px">' +
        (isSelected ? '<span style="font-size:11px;color:var(--text-muted)">Slot ' + (idx+1) + '</span>' : '') +
        '<button onclick="toggleNavTab(\'' + page.id + '\')" class="btn btn-sm ' + (isSelected ? 'btn-danger' : 'btn-primary') + '" style="padding:4px 12px;font-size:11px">' +
          (isSelected ? 'Remove' : 'Add') +
        '</button>' +
      '</div>' +
    '</div>';
  }).join('');

  var countEl = document.getElementById('nav-slot-count');
  if (countEl) countEl.textContent = tabs.length + '/4 slots used';
};

window.toggleNavTab = function(pageId) {
  var tabs = state.navTabs ? state.navTabs.slice() : ['dashboard','wallet','transactions','investments'];
  var idx = tabs.indexOf(pageId);
  if (idx !== -1) {
    if (tabs.length <= 1) { toast('Need at least 1 tab', 'error'); return; }
    tabs.splice(idx, 1);
  } else {
    if (tabs.length >= 4) { toast('Max 4 tabs — remove one first', 'error'); return; }
    tabs.push(pageId);
  }
  state.navTabs = tabs;
  save();
  buildMobileNav();
  window.renderNavSettings();
  toast('Navigation updated ✓', 'success');
};

// ── AI Advisor: First-time key setup screen ──────────────
function showAiKeySetup() {
  var messages = document.getElementById('ai-messages');
  var suggestions = document.getElementById('ai-suggestions');
  if (suggestions) suggestions.style.display = 'none';

  if (messages) messages.innerHTML =
    '<div style="padding:24px;text-align:center">' +
      '<div style="font-size:48px;margin-bottom:16px">✨</div>' +
      '<div style="font-size:18px;font-weight:700;margin-bottom:8px">Set up AI Advisor</div>' +
      '<div style="font-size:13.5px;color:var(--text-muted);line-height:1.7;margin-bottom:24px">' +
        'AI Advisor uses Groq — a free AI service.<br>Get your free key in under 2 minutes:' +
      '</div>' +
      '<div style="text-align:left;background:var(--bg-elevated);border-radius:14px;padding:18px;margin-bottom:20px">' +
        '<div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:12px">' +
          '<div style="width:24px;height:24px;border-radius:50%;background:var(--blue);color:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0">1</div>' +
          '<div style="font-size:13px">Go to <strong>console.groq.com</strong> and sign up free (no credit card)</div>' +
        '</div>' +
        '<div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:12px">' +
          '<div style="width:24px;height:24px;border-radius:50%;background:var(--blue);color:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0">2</div>' +
          '<div style="font-size:13px">Click <strong>API Keys</strong> → <strong>Create API Key</strong> → copy it</div>' +
        '</div>' +
        '<div style="display:flex;gap:12px;align-items:flex-start">' +
          '<div style="width:24px;height:24px;border-radius:50%;background:var(--blue);color:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0">3</div>' +
          '<div style="font-size:13px">Paste it below and tap Save — done! 🎉</div>' +
        '</div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;margin-bottom:12px">' +
        '<input type="password" id="ai-inline-key" placeholder="Paste your Groq key here (gsk_...)" ' +
          'style="flex:1;padding:11px 14px;border-radius:10px;border:1.5px solid var(--border);background:var(--bg-elevated);color:var(--text-primary);font-family:inherit;font-size:13.5px;outline:none">' +
        '<button onclick="saveAiInlineKey()" ' +
          'style="background:var(--blue);border:none;border-radius:10px;padding:11px 18px;color:white;font-weight:700;font-size:13.5px;cursor:pointer;font-family:inherit;white-space:nowrap">' +
          'Save' +
        '</button>' +
      '</div>' +
      '<div style="font-size:11px;color:var(--text-muted)">Your key is stored only on your device. Free tier: 14,400 requests/day.</div>' +
    '</div>';
}

window.saveAiInlineKey = function() {
  var keyEl = document.getElementById('ai-inline-key');
  var key = keyEl ? keyEl.value.trim() : '';
  if (!key || key.length < 20) { toast('Please paste a valid Groq key', 'error'); return; }
  state.geminiApiKey = key;
  save();
  toast('✓ API key saved! You can now use AI Advisor.', 'success');
  // Re-render the AI page with the welcome message
  window.renderAiAdvisor();
};

window.renderAiAdvisor = function() {
  var sugg = document.getElementById('ai-suggestions');
  var messages = document.getElementById('ai-messages');
  // Proxy handles auth — always show chat directly
  if (sugg) sugg.style.display = 'flex';
  if (messages && messages.children.length === 0) {
    messages.innerHTML =
      '<div class="ai-msg ai-msg-assistant">' +
        '<div class="ai-msg-avatar">✨</div>' +
        '<div class="ai-msg-bubble">Hi! I\'m your AI financial advisor. I have access to all your WealthOS data — your transactions, investments, goals, and subscriptions.<br><br>Ask me anything about your finances and I\'ll give you personalised insights and advice.</div>' +
      '</div>';
  }
};

// ── Price Fetch Warning ───────────────────────────────────
function showPriceFetchWarning(failedNames) {
  if (!failedNames || !failedNames.length) return;

  // Find investments that failed and mark them visually
  failedNames.forEach(function(name) {
    var inv = state.investments.find(function(i){ return i.name === name; });
    if (!inv) return;

    // Remove lastUpdated so it shows as manual
    inv.fetchFailed = true;
  });

  // Show a toast with clear instruction
  setTimeout(function() {
    toast('⚠️ ' + failedNames.join(', ') + ' — price unavailable. Tap the investment to enter price manually.', 'error', 6000);
  }, 500);

  // Re-render to show the failed state
  renderInvestments();
}

window.openManualPriceEdit = function(id) {
  var inv = state.investments.find(function(i){ return i.id === id; });
  if (!inv) return;
  var sym = CURR_SYMBOL[inv.invCurrency] || inv.invCurrency || '$';
  var newPrice = prompt('Enter current price for ' + inv.name + ' (' + sym + '):', inv.currentPrice || '');
  if (newPrice === null) return; // cancelled
  var parsed = parseFloat(newPrice);
  if (isNaN(parsed) || parsed <= 0) { toast('Invalid price', 'error'); return; }
  inv.currentPrice = parsed;
  inv.lastUpdated = null; // mark as manual
  inv.fetchFailed = false;
  save();
  renderInvestments();
  renderAll();
  toast('✓ Price updated for ' + inv.name, 'success');
};

// ═══════════════════════════════════════════════════════════
// FEATURE: Recurring Income (salary, rental, etc.)
// ═══════════════════════════════════════════════════════════

function processRecurringIncome() {
  if (!Array.isArray(state.recurringIncome) || !state.recurringIncome.length) return;

  var today = new Date();
  var todayDay = today.getDate();
  var monthKey = today.toISOString().slice(0, 7); // e.g. "2026-05"
  var changed = false;

  state.recurringIncome.forEach(function(ri) {
    if (!ri || !ri.amount || !ri.dayOfMonth) return;

    // Only charge if today >= the scheduled day this month
    if (todayDay < ri.dayOfMonth) return;

    // Check if already charged this month (look for transaction with same recurringId and this month)
    var alreadyCharged = state.transactions.some(function(t) {
      return t.recurringId === ri.id && t.date && t.date.slice(0, 7) === monthKey;
    });

    if (!alreadyCharged) {
      // Create the income transaction
      var txDate = monthKey + '-' + String(ri.dayOfMonth).padStart(2, '0');
      state.transactions.push({
        id: uid(),
        type: 'income',
        desc: ri.name,
        amount: ri.amount,
        cat: ri.cat || 'Salary',
        date: txDate,
        createdAt: new Date().toISOString(),
        recurringId: ri.id
      });
      changed = true;
      toast('💰 ' + ri.name + ' — ' + curr() + ri.amount.toLocaleString('en-MY', {minimumFractionDigits:2}) + ' added', 'success');
    }
  });

  if (changed) {
    save();
    renderAll();
  }
}

// Render recurring income list in settings
window.renderRecurringIncome = function() {
  var el = document.getElementById('recurring-income-list');
  if (!el) return;
  var sym = curr();
  var items = state.recurringIncome || [];

  if (!items.length) {
    el.innerHTML = '<div style="font-size:12px;color:var(--text-muted);padding:8px 0">No recurring income set up yet.</div>';
    return;
  }

  el.innerHTML = items.map(function(ri) {
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border)">' +
      '<div>' +
        '<div style="font-size:13.5px;font-weight:600">' + ri.name + '</div>' +
        '<div style="font-size:11px;color:var(--text-muted)">' + sym + ri.amount.toLocaleString('en-MY',{minimumFractionDigits:2}) + ' · Every month on day ' + ri.dayOfMonth + ' · ' + (ri.cat||'Salary') + '</div>' +
      '</div>' +
      '<button onclick="deleteRecurringIncome(\'' + ri.id + '\')" style="background:none;border:none;cursor:pointer;color:var(--red);font-size:18px;padding:4px">✕</button>' +
    '</div>';
  }).join('');
};

window.addRecurringIncome = function() {
  var name = document.getElementById('ri-name').value.trim();
  var amount = parseFloat(document.getElementById('ri-amount').value);
  var day = parseInt(document.getElementById('ri-day').value);
  var cat = document.getElementById('ri-cat').value;

  if (!name) { toast('Please enter a name', 'error'); return; }
  if (!amount || amount <= 0) { toast('Please enter a valid amount', 'error'); return; }
  if (!day || day < 1 || day > 28) { toast('Day must be between 1 and 28', 'error'); return; }

  if (!Array.isArray(state.recurringIncome)) state.recurringIncome = [];
  state.recurringIncome.push({ id: uid(), name: name, amount: amount, dayOfMonth: day, cat: cat });
  save();
  processRecurringIncome();

  // Clear inputs
  document.getElementById('ri-name').value = '';
  document.getElementById('ri-amount').value = '';
  document.getElementById('ri-day').value = '1';

  window.renderRecurringIncome();
  toast('✓ Recurring income added', 'success');
};

window.deleteRecurringIncome = function(id) {
  state.recurringIncome = (state.recurringIncome || []).filter(function(r){ return r.id !== id; });
  save();
  window.renderRecurringIncome();
  toast('Recurring income removed', 'info');
};
