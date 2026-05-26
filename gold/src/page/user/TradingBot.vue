<template>
  <div class="bot-page" dir="rtl">

    <!-- ── هدر مستقل ── -->
    <div class="bot-topbar">
      <div class="bot-topbar-inner">
        <div class="bot-topbar-left">
          <div class="bot-logo">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/></svg>
          </div>
          <div>
            <div class="bot-topbar-title">ربات معامله‌گر</div>
            <div class="bot-topbar-sub">هوشمند · طلای آب‌شده</div>
          </div>
        </div>
        <div class="bot-topbar-right">
          <div class="live-badge" v-if="livePrice">
            <span class="live-dot"></span>
            <span class="live-val">{{ fmt(livePrice) }}</span>
            <span class="live-unit">T</span>
            <span :class="liveChange >= 0 ? 'up' : 'down'" class="live-pct">
              {{ liveChange >= 0 ? '▲' : '▼' }} {{ Math.abs(liveChangePct).toFixed(2) }}٪
            </span>
          </div>
          <div class="sub-pill" :class="subStatus === 'active' ? 'active' : 'inactive'">
            <span class="sub-dot"></span>
            <span class="sub-text">{{ subStatus === 'active' ? 'فعال' : 'غیرفعال' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── محتوا ── -->
    <div class="bot-body">

      <!-- لودینگ اولیه -->
      <div v-if="loading" class="bot-loader">
        <div class="spinner"></div>
        <span>در حال بارگذاری...</span>
      </div>

      <!-- اشتراک نداره -->
      <div v-else-if="subStatus !== 'active'" class="purchase-area">
        <div class="purchase-glow"></div>
        <div class="purchase-card">
          <div class="purchase-icon">🤖</div>
          <h2 class="purchase-title">ربات معامله‌گر طلا</h2>
          <p class="purchase-desc">با فعال‌سازی اشتراک، ربات هوشمند به‌صورت خودکار در بهترین نقاط طلای آب‌شده معامله می‌کند و سود روزانه واقعی بر اساس نوسان بازار برای شما محاسبه می‌کند.</p>

          <div class="features-grid">
            <div class="feature-item">
              <span class="f-icon">📈</span>
              <span class="f-label">سود روزانه<br><b>تا ۱.۵٪</b></span>
            </div>
            <div class="feature-item">
              <span class="f-icon">🔄</span>
              <span class="f-label">معاملات<br><b>خودکار</b></span>
            </div>
            <div class="feature-item">
              <span class="f-icon">📊</span>
              <span class="f-label">گزارش<br><b>روزانه</b></span>
            </div>
            <div class="feature-item">
              <span class="f-icon">⚙️</span>
              <span class="f-label">تنظیمات<br><b>سفارشی</b></span>
            </div>
          </div>

          <div class="price-tag">
            <span class="price-amount">۱,۰۰۰,۰۰۰</span>
            <span class="price-unit">تومان / ۳۰ روز</span>
          </div>

          <button class="buy-btn" @click="purchase" :disabled="purchasing">
            <span v-if="purchasing" class="btn-spinner"></span>
            <span v-else>🚀</span>
            {{ purchasing ? 'در حال پردازش...' : 'فعال‌سازی اشتراک' }}
          </button>
          <div v-if="buyError" class="buy-error">{{ buyError }}</div>
        </div>
      </div>

      <!-- داشبورد ربات -->
      <div v-else class="dashboard">

        <!-- ── تب‌های ناوبری ── -->
        <div class="tab-bar">
          <button :class="['tab-btn', activeTab === 'stats' ? 'active' : '']" @click="activeTab = 'stats'">
            📊 آمار
          </button>
          <button :class="['tab-btn', activeTab === 'trades' ? 'active' : '']" @click="activeTab = 'trades'">
            🔄 معاملات
          </button>
          <button :class="['tab-btn', activeTab === 'settings' ? 'active' : '']" @click="activeTab = 'settings'">
            ⚙️ تنظیمات
          </button>
        </div>

        <!-- ── تب آمار ── -->
        <div v-show="activeTab === 'stats'">

          <!-- ربات متوقف است -->
          <div v-if="stats.botPaused" class="paused-banner">
            <span>⏸️</span>
            <div>
              <b>ربات متوقف است</b>
              <p>برای فعال‌سازی مجدد به تنظیمات بروید</p>
            </div>
            <button class="go-settings-btn" @click="activeTab = 'settings'">تنظیمات</button>
          </div>

          <!-- کارت‌های آمار -->
          <div class="stats-row">
            <div class="stat-box green">
              <div class="stat-icon">💰</div>
              <div class="stat-val">{{ fmt(stats.currentInvestment) }}</div>
              <div class="stat-lbl">سرمایه فعال (تومان)</div>
            </div>
            <div class="stat-box gold">
              <div class="stat-icon">📅</div>
              <div class="stat-val">{{ fmt(stats.todayProfit) }}</div>
              <div class="stat-lbl">سود امروز (تومان)</div>
              <div class="stat-pct" v-if="stats.profitPercent && stats.profitPercent !== '0.00'">{{ stats.profitPercent }}٪</div>
            </div>
            <div class="stat-box purple">
              <div class="stat-icon">🏆</div>
              <div class="stat-val">{{ fmt(stats.totalProfit) }}</div>
              <div class="stat-lbl">سود کل (تومان)</div>
            </div>
            <div class="stat-box blue">
              <div class="stat-icon">⚡</div>
              <div class="stat-val">{{ stats.totalTrades || 0 }}</div>
              <div class="stat-lbl">کل معاملات</div>
            </div>
          </div>

          <!-- اطلاعات بازار ۲۴ ساعته -->
          <div class="market-card">
            <div class="market-header">
              <div class="market-title">
                <span class="market-dot"></span>
                نوسان بازار — ۲۴ ساعت گذشته
              </div>
              <div class="market-note">از داده‌های ساعتی ذخیره‌شده</div>
            </div>

            <div v-if="stats.marketInfo" class="market-grid">
              <div class="market-item">
                <div class="mi-label">بالاترین</div>
                <div class="mi-val high">{{ fmt(stats.marketInfo.highPrice) }}</div>
              </div>
              <div class="market-item">
                <div class="mi-label">پایین‌ترین</div>
                <div class="mi-val low">{{ fmt(stats.marketInfo.lowPrice) }}</div>
              </div>
              <div class="market-item">
                <div class="mi-label">ابتدای روز</div>
                <div class="mi-val">{{ fmt(stats.marketInfo.openPrice) }}</div>
              </div>
              <div class="market-item">
                <div class="mi-label">انتهای روز</div>
                <div class="mi-val">{{ fmt(stats.marketInfo.closePrice) }}</div>
              </div>
            </div>
            <div v-else class="market-no-data">
              <span>⏳</span>
              <span>داده‌های ۲۴ ساعته در حال جمع‌آوری — هر ساعت یک رکورد ثبت می‌شود</span>
            </div>

            <!-- قیمت لحظه‌ای -->
            <div class="live-row" v-if="livePrice">
              <div class="live-label">قیمت لحظه‌ای طلا آب‌شده</div>
              <div class="live-price-big">
                {{ fmt(livePrice) }} <span>تومان</span>
                <span class="live-refresh-note">هر دقیقه به‌روز می‌شود</span>
              </div>
              <div class="live-change-big" :class="liveChange >= 0 ? 'up' : 'down'">
                {{ liveChange >= 0 ? '▲' : '▼' }} {{ fmt(Math.abs(liveChange)) }} ({{ Math.abs(liveChangePct).toFixed(2) }}٪)
              </div>
            </div>
          </div>

          <!-- دکمه به‌روزرسانی -->
          <button class="refresh-fab" @click="loadData" :disabled="refreshing">
            <span v-if="refreshing" class="btn-spinner dark"></span>
            <span v-else>🔄</span>
            {{ refreshing ? '' : 'به‌روزرسانی' }}
          </button>
        </div>

        <!-- ── تب معاملات ── -->
        <div v-show="activeTab === 'trades'">
          <div class="trades-card">
            <div class="trades-header">
              <div class="trades-title">معاملات اخیر ربات</div>
              <div class="trades-count" v-if="trades.length">{{ trades.length }} معامله</div>
            </div>

            <div v-if="trades.length === 0" class="trades-empty">
              <span>📋</span>
              <p>هنوز معامله‌ای ثبت نشده</p>
              <small>بعد از اولین روز فعالیت، معاملات اینجا نمایش داده می‌شوند</small>
            </div>

            <div v-else class="trades-list">
              <div v-for="t in trades" :key="t.id" class="trade-row">
                <div class="trade-type-badge" :class="t.type === 'BUY' ? 'buy' : 'sell'">
                  {{ t.type === 'BUY' ? '↑ خرید' : '↓ فروش' }}
                </div>
                <div class="trade-info">
                  <div class="trade-price">{{ fmt(t.price) }} <span>T/گرم</span></div>
                  <div class="trade-amount">{{ t.amount }} گرم</div>
                </div>
                <div class="trade-right">
                  <div class="trade-profit" :class="t.profit >= 0 ? 'up' : 'down'">
                    {{ t.profit >= 0 ? '+' : '' }}{{ fmt(t.profit) }} T
                  </div>
                  <div class="trade-time">{{ fmtTime(t.time) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── تب تنظیمات ── -->
        <div v-show="activeTab === 'settings'">
          <div class="settings-card">
            <div class="settings-title">⚙️ تنظیمات ربات</div>

            <!-- وضعیت ربات -->
            <div class="setting-row">
              <div class="setting-info">
                <div class="setting-label">وضعیت ربات</div>
                <div class="setting-desc">ربات را فعال یا متوقف کنید</div>
              </div>
              <div
                class="toggle-switch"
                :class="settings.botEnabled ? 'on' : 'off'"
                @click="toggleBot"
              >
                <div class="toggle-thumb"></div>
              </div>
            </div>

            <div class="setting-divider"></div>

            <!-- سرمایه سفارشی -->
            <div class="setting-row column">
              <div class="setting-info">
                <div class="setting-label">سرمایه سفارشی (تومان)</div>
                <div class="setting-desc">
                  میزان سرمایه‌ای که ربات با آن کار کند.
                  صفر = استفاده از سرمایه پیش‌فرض ({{ fmt(stats.currentInvestment) }} تومان)
                </div>
              </div>
              <div class="inv-input-wrap">
                <input
                  v-model.number="settings.customInvestment"
                  type="number"
                  class="inv-input"
                  placeholder="مثلاً: 5000000"
                  min="0"
                  max="100000000"
                  step="500000"
                />
                <span class="inv-unit">تومان</span>
              </div>
            </div>

            <div class="setting-divider"></div>

            <!-- سطح ریسک -->
            <div class="setting-row column">
              <div class="setting-info">
                <div class="setting-label">سطح ریسک</div>
                <div class="setting-desc">میزان تهاجمی بودن استراتژی معاملاتی ربات</div>
              </div>
              <div class="risk-selector">
                <button
                  v-for="r in riskOptions"
                  :key="r.value"
                  :class="['risk-btn', settings.riskLevel === r.value ? 'active ' + r.value : '']"
                  @click="settings.riskLevel = r.value"
                >
                  {{ r.icon }} {{ r.label }}
                </button>
              </div>
              <div class="risk-desc-box" v-if="selectedRisk">
                {{ selectedRisk.desc }}
              </div>
            </div>

            <div class="setting-divider"></div>

            <!-- دکمه ذخیره -->
            <button class="save-btn" @click="saveSettings" :disabled="savingSettings">
              <span v-if="savingSettings" class="btn-spinner dark"></span>
              {{ savingSettings ? 'در حال ذخیره...' : '💾 ذخیره تنظیمات' }}
            </button>
            <div v-if="settingsMsg" class="settings-msg" :class="settingsMsgType">{{ settingsMsg }}</div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
const API = process.env.VUE_APP_API_URL || '';

export default {
  name: 'TradingBot',
  data() {
    return {
      loading: true,
      purchasing: false,
      buyError: '',
      refreshing: false,
      savingSettings: false,
      settingsMsg: '',
      settingsMsgType: 'ok',
      subStatus: 'inactive',
      livePrice: 0,
      liveChange: 0,
      liveChangePct: 0,
      stats: {},
      trades: [],
      activeTab: 'stats',
      settings: {
        botEnabled: true,
        customInvestment: 0,
        riskLevel: 'medium',
      },
      riskOptions: [
        { value: 'low',    icon: '🟢', label: 'محافظه‌کار', desc: 'معاملات کمتر، سود پایدارتر و ریسک کمتر. مناسب برای سرمایه‌گذاران محتاط.' },
        { value: 'medium', icon: '🟡', label: 'متعادل',     desc: 'تعادل بین ریسک و سود. پیش‌فرض و توصیه‌شده برای اکثر کاربران.' },
        { value: 'high',   icon: '🔴', label: 'تهاجمی',     desc: 'معاملات بیشتر با پتانسیل سود بالاتر و ریسک بیشتر. برای کاربران حرفه‌ای.' },
      ],
      refreshTimer: null,
    };
  },
  computed: {
    selectedRisk() {
      return this.riskOptions.find(r => r.value === this.settings.riskLevel);
    }
  },
  async mounted() {
    await this.init();
    this.refreshTimer = setInterval(this.refreshLive, 60000);
  },
  beforeUnmount() {
    clearInterval(this.refreshTimer);
  },
  methods: {
    token() { return localStorage.getItem('token'); },
    headers() { return { Authorization: `Bearer ${this.token()}` }; },

    async init() {
      this.loading = true;
      if (!this.token()) { this.$router.push('/login'); return; }
      await this.checkSub();
      if (this.subStatus === 'active') {
        await Promise.all([this.loadData(), this.loadSettings()]);
      }
      await this.refreshLive();
      this.loading = false;
    },

    async checkSub() {
      try {
        const r = await axios.get(`${API}/bot/subscription`, { headers: this.headers() });
        this.subStatus = r.data.status;
      } catch { this.subStatus = 'inactive'; }
    },

    async loadData() {
      this.refreshing = true;
      try {
        const [statsR, tradesR] = await Promise.all([
          axios.get(`${API}/bot/stats`, { headers: this.headers() }),
          axios.get(`${API}/bot/trades`, { headers: this.headers() }),
        ]);
        this.stats = statsR.data;
        this.trades = tradesR.data || [];
      } catch (e) {
        console.error('loadData error:', e.message);
      } finally {
        this.refreshing = false;
      }
    },

    async loadSettings() {
      try {
        const r = await axios.get(`${API}/bot/settings`, { headers: this.headers() });
        this.settings.botEnabled = r.data.botEnabled !== false;
        this.settings.customInvestment = r.data.customInvestment || 0;
        this.settings.riskLevel = r.data.riskLevel || 'medium';
      } catch { /* silent */ }
    },

    async saveSettings() {
      this.savingSettings = true;
      this.settingsMsg = '';
      try {
        await axios.put(`${API}/bot/settings`, {
          botEnabled: this.settings.botEnabled,
          customInvestment: this.settings.customInvestment,
          riskLevel: this.settings.riskLevel,
        }, { headers: this.headers() });
        this.settingsMsg = '✅ تنظیمات با موفقیت ذخیره شد';
        this.settingsMsgType = 'ok';
        // reload stats to reflect new investment
        await this.loadData();
        setTimeout(() => { this.settingsMsg = ''; }, 3000);
      } catch (e) {
        this.settingsMsg = e.response?.data?.error || '❌ خطا در ذخیره تنظیمات';
        this.settingsMsgType = 'err';
      } finally {
        this.savingSettings = false;
      }
    },

    toggleBot() {
      this.settings.botEnabled = !this.settings.botEnabled;
    },

    async refreshLive() {
      try {
        const r = await axios.get(`${API}/bot/current-price`, { headers: this.headers() });
        this.livePrice = r.data.price;
        this.liveChange = r.data.change;
        this.liveChangePct = r.data.changePercent;
      } catch { /* silent */ }
    },

    async purchase() {
      this.purchasing = true;
      this.buyError = '';
      try {
        const r = await axios.post(`${API}/bot/purchase`, {}, { headers: this.headers() });
        if (r.data.success) {
          this.subStatus = 'active';
          await Promise.all([this.loadData(), this.loadSettings()]);
        }
      } catch (e) {
        this.buyError = e.response?.data?.error || 'خطا در خرید اشتراک';
      } finally {
        this.purchasing = false;
      }
    },

    fmt(v) {
      if (!v && v !== 0) return '—';
      return Number(v).toLocaleString('fa-IR');
    },
    fmtTime(t) {
      if (!t) return '—';
      return new Date(t).toLocaleString('fa-IR', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
    },
  }
};
</script>

<style scoped>
/* ─── base ─────────────────────────────────── */
.bot-page {
  min-height: 100vh;
  background: #080d0b;
  font-family: inherit;
}

/* ─── topbar ────────────────────────────────── */
.bot-topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(8,13,11,0.95);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(185,241,207,0.08);
}
.bot-topbar-inner {
  max-width: 640px;
  margin: 0 auto;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.bot-topbar-left  { display: flex; align-items: center; gap: 8px; }
.bot-topbar-right { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }

.bot-logo {
  width: 32px; height: 32px;
  background: linear-gradient(135deg, #ffd26a, #f97316);
  border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  color: #1a1305;
  flex-shrink: 0;
}
.bot-logo svg { width: 15px; height: 15px; }

.bot-topbar-title { font-size: 14px; font-weight: 800; color: #fff; }
.bot-topbar-sub   { font-size: 10px; color: rgba(255,255,255,.4); }

.live-badge {
  display: flex; align-items: center; gap: 4px;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.09);
  border-radius: 7px;
  padding: 4px 8px;
  font-size: 11px; font-weight: 700; color: #ffd47a;
}
.live-val { font-size: 11px; }
.live-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: #4ade80; box-shadow: 0 0 4px #4ade80;
  animation: blink 1.4s ease-in-out infinite;
  flex-shrink: 0;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
.live-unit { font-size: 9px; color: rgba(255,255,255,.3); font-weight: 400; }
.live-pct  { font-size: 10px; font-weight: 700; }
.live-pct.up   { color: #4ade80; }
.live-pct.down { color: #f87171; }

.sub-pill {
  display: flex; align-items: center; gap: 4px;
  border-radius: 20px; padding: 3px 8px;
  font-size: 11px; font-weight: 700;
}
.sub-pill.active   { background: rgba(74,222,128,.12); color: #4ade80; border: 1px solid rgba(74,222,128,.25); }
.sub-pill.inactive { background: rgba(248,113,113,.12); color: #f87171; border: 1px solid rgba(248,113,113,.25); }
.sub-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
.sub-text { display: none; }
@media(min-width: 380px) { .sub-text { display: inline; } }

/* ─── body ──────────────────────────────────── */
.bot-body {
  max-width: 640px;
  margin: 0 auto;
  padding: 16px 12px 80px;
}

/* ─── loader ────────────────────────────────── */
.bot-loader {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 14px; min-height: 60vh; color: rgba(255,255,255,.4); font-size: 14px;
}
.spinner {
  width: 32px; height: 32px;
  border: 3px solid rgba(255,210,106,.15);
  border-top-color: #ffd26a;
  border-radius: 50%;
  animation: spin .8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ─── purchase ──────────────────────────────── */
.purchase-area {
  position: relative;
  display: flex; align-items: center; justify-content: center;
  min-height: 75vh;
}
.purchase-glow {
  position: absolute;
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(255,210,106,.07), transparent 70%);
  top: 50%; left: 50%; transform: translate(-50%,-50%);
  pointer-events: none;
}
.purchase-card {
  background: linear-gradient(160deg, #111a13, #0e1710);
  border: 1px solid rgba(255,196,76,.2);
  border-radius: 22px;
  padding: 28px 20px;
  text-align: center;
  width: 100%;
  position: relative; z-index: 1;
  box-shadow: 0 20px 50px rgba(0,0,0,.5);
}
.purchase-icon { font-size: 2.5rem; margin-bottom: 10px; }
.purchase-title { font-size: 1.35rem; font-weight: 800; color: #fff; margin-bottom: 8px; }
.purchase-desc  { font-size: 13px; color: rgba(255,255,255,.5); line-height: 1.8; margin-bottom: 20px; }

.features-grid {
  display: grid; grid-template-columns: repeat(4,1fr); gap: 6px;
  margin-bottom: 20px;
}
.feature-item {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 10px; padding: 10px 4px;
  display: flex; flex-direction: column; align-items: center; gap: 5px;
}
.f-icon  { font-size: 1.3rem; }
.f-label { font-size: 10px; color: rgba(255,255,255,.5); line-height: 1.5; }
.f-label b { display: block; color: #ffd47a; font-size: 11px; }

.price-tag {
  background: rgba(255,196,76,.08);
  border: 1px solid rgba(255,196,76,.2);
  border-radius: 10px; padding: 12px;
  margin-bottom: 16px;
}
.price-amount { font-size: 1.5rem; font-weight: 800; color: #ffd47a; }
.price-unit   { font-size: 12px; color: rgba(255,255,255,.4); margin-right: 6px; }

.buy-btn {
  width: 100%;
  background: linear-gradient(135deg, #ffd26a, #f97316);
  color: #1a1305; font-size: 15px; font-weight: 800;
  padding: 14px; border-radius: 13px;
  display: flex; align-items: center; justify-content: center; gap: 7px;
  transition: all .25s;
  box-shadow: 0 8px 22px rgba(255,210,106,.22);
}
.buy-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(255,210,106,.33); }
.buy-btn:disabled { opacity:.6; cursor:not-allowed; }
.buy-error { margin-top: 8px; font-size: 13px; color: #f87171; }

/* ─── tab bar ───────────────────────────────── */
.tab-bar {
  display: flex; gap: 6px;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 14px;
  padding: 5px;
  margin-bottom: 14px;
}
.tab-btn {
  flex: 1;
  padding: 8px 4px;
  border-radius: 10px;
  font-size: 12px; font-weight: 700;
  color: rgba(255,255,255,.4);
  background: transparent;
  transition: all .2s;
  cursor: pointer;
}
.tab-btn.active {
  background: rgba(255,210,106,.12);
  color: #ffd47a;
  border: 1px solid rgba(255,210,106,.2);
}

/* ─── dashboard ─────────────────────────────── */
.dashboard { display: flex; flex-direction: column; gap: 0; }

/* paused banner */
.paused-banner {
  display: flex; align-items: center; gap: 10px;
  background: rgba(248,113,113,.08);
  border: 1px solid rgba(248,113,113,.2);
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 12px;
  font-size: 13px; color: rgba(255,255,255,.7);
}
.paused-banner span { font-size: 1.5rem; flex-shrink: 0; }
.paused-banner div { flex: 1; }
.paused-banner b { display: block; color: #f87171; font-size: 13px; margin-bottom: 2px; }
.paused-banner p { font-size: 11px; margin: 0; color: rgba(255,255,255,.4); }
.go-settings-btn {
  background: rgba(248,113,113,.15); border: 1px solid rgba(248,113,113,.25);
  color: #f87171; font-size: 12px; font-weight: 700;
  padding: 5px 10px; border-radius: 8px; white-space: nowrap; cursor: pointer;
}

/* stats row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 12px;
}
@media(min-width: 480px) { .stats-row { grid-template-columns: repeat(4, 1fr); } }

.stat-box {
  border-radius: 16px;
  padding: 14px 12px;
  border: 1px solid;
  position: relative;
  overflow: hidden;
}
.stat-box.green  { background: rgba(74,222,128,.07);  border-color: rgba(74,222,128,.2);  }
.stat-box.gold   { background: rgba(255,210,106,.07); border-color: rgba(255,210,106,.2); }
.stat-box.purple { background: rgba(168,85,247,.07);  border-color: rgba(168,85,247,.2);  }
.stat-box.blue   { background: rgba(96,165,250,.07);  border-color: rgba(96,165,250,.2);  }

.stat-icon { font-size: 1.2rem; margin-bottom: 6px; }
.stat-val  { font-size: 1rem; font-weight: 800; color: #fff; line-height: 1.2; margin-bottom: 3px; word-break: break-all; }
.stat-lbl  { font-size: 10px; color: rgba(255,255,255,.4); }
.stat-pct  {
  position: absolute; top: 10px; left: 10px;
  font-size: 10px; font-weight: 700;
  background: rgba(255,210,106,.15); color: #ffd47a;
  padding: 2px 6px; border-radius: 20px;
}

/* market card */
.market-card {
  background: linear-gradient(160deg, #0f1a12, #0c1510);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 18px;
  padding: 16px;
  margin-bottom: 12px;
}
.market-header {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 6px;
  margin-bottom: 14px;
}
.market-title {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 700; color: #fff;
}
.market-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #ffd26a; box-shadow: 0 0 5px #ffd26a;
}
.market-note { font-size: 10px; color: rgba(255,255,255,.28); }

.market-grid {
  display: grid; grid-template-columns: repeat(2, 1fr);
  gap: 7px; margin-bottom: 14px;
}
@media(min-width: 400px) { .market-grid { grid-template-columns: repeat(4, 1fr); } }

.market-item {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 10px; padding: 10px;
  text-align: center;
}
.mi-label { font-size: 9px; color: rgba(255,255,255,.38); margin-bottom: 4px; }
.mi-val   { font-size: 12px; font-weight: 800; color: #e8f5e9; }
.mi-val.high { color: #4ade80; }
.mi-val.low  { color: #f87171; }

.market-no-data {
  display: flex; align-items: center; gap: 8px;
  padding: 14px; font-size: 12px; color: rgba(255,255,255,.32);
  background: rgba(255,255,255,.03); border-radius: 10px;
  margin-bottom: 14px;
}

.live-row {
  background: rgba(255,196,76,.06);
  border: 1px solid rgba(255,196,76,.14);
  border-radius: 12px;
  padding: 12px 14px;
}
.live-label    { font-size: 10px; color: rgba(255,255,255,.38); margin-bottom: 3px; }
.live-price-big { font-size: 1.2rem; font-weight: 800; color: #ffd47a; display: flex; align-items: baseline; gap: 5px; flex-wrap: wrap; }
.live-price-big span { font-size: 11px; color: rgba(255,255,255,.35); font-weight: 400; }
.live-refresh-note { font-size: 9px; color: rgba(255,255,255,.25); }
.live-change-big  { font-size: 12px; font-weight: 700; margin-top: 2px; }
.live-change-big.up   { color: #4ade80; }
.live-change-big.down { color: #f87171; }

/* refresh fab */
.refresh-fab {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  width: 100%;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 12px;
  color: rgba(255,255,255,.5);
  font-size: 13px; font-weight: 600;
  padding: 11px;
  transition: all .2s; cursor: pointer;
  margin-bottom: 4px;
}
.refresh-fab:hover:not(:disabled) { color: #ffd47a; border-color: rgba(255,196,76,.3); }
.refresh-fab:disabled { opacity:.5; cursor:not-allowed; }

/* ─── trades ────────────────────────────────── */
.trades-card {
  background: linear-gradient(160deg, #0f1a12, #0c1510);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 18px;
  padding: 16px;
}
.trades-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 14px;
}
.trades-title { font-size: 13px; font-weight: 700; color: #fff; }
.trades-count { font-size: 11px; color: rgba(255,255,255,.35); background: rgba(255,255,255,.06); padding: 2px 8px; border-radius: 20px; }

.trades-empty {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 28px; color: rgba(255,255,255,.28); font-size: 13px;
}
.trades-empty span { font-size: 1.8rem; }
.trades-empty p    { margin: 0; }
.trades-empty small{ font-size: 11px; color: rgba(255,255,255,.2); text-align:center; }

.trades-list { display: flex; flex-direction: column; gap: 7px; }

.trade-row {
  display: flex; align-items: center; gap: 10px;
  background: rgba(255,255,255,.03);
  border: 1px solid rgba(255,255,255,.05);
  border-radius: 11px;
  padding: 10px 12px;
  transition: all .18s;
}
.trade-row:hover { background: rgba(255,255,255,.05); }

.trade-type-badge {
  font-size: 11px; font-weight: 700;
  padding: 3px 8px; border-radius: 7px;
  white-space: nowrap; flex-shrink: 0;
}
.trade-type-badge.buy  { background: rgba(74,222,128,.12); color: #4ade80; }
.trade-type-badge.sell { background: rgba(248,113,113,.12); color: #f87171; }

.trade-info { flex: 1; min-width: 0; }
.trade-price  { font-size: 12px; font-weight: 700; color: #e8f5e9; }
.trade-price span { font-size: 9px; color: rgba(255,255,255,.3); font-weight: 400; }
.trade-amount { font-size: 10px; color: rgba(255,255,255,.38); margin-top: 1px; }

.trade-right { text-align: left; flex-shrink: 0; }
.trade-profit { font-size: 12px; font-weight: 700; }
.trade-profit.up   { color: #4ade80; }
.trade-profit.down { color: #f87171; }
.trade-time { font-size: 9px; color: rgba(255,255,255,.28); margin-top: 1px; }

/* ─── settings ──────────────────────────────── */
.settings-card {
  background: linear-gradient(160deg, #0f1a12, #0c1510);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 18px;
  padding: 18px 16px;
}
.settings-title {
  font-size: 14px; font-weight: 800; color: #fff;
  margin-bottom: 18px;
}

.setting-row {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
}
.setting-row.column { flex-direction: column; align-items: stretch; gap: 10px; }

.setting-info { flex: 1; min-width: 0; }
.setting-label { font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 2px; }
.setting-desc  { font-size: 11px; color: rgba(255,255,255,.38); line-height: 1.6; }

.setting-divider { height: 1px; background: rgba(255,255,255,.06); margin: 4px 0; }

/* toggle switch */
.toggle-switch {
  width: 46px; height: 26px;
  border-radius: 13px;
  position: relative;
  cursor: pointer;
  transition: background .25s;
  flex-shrink: 0;
}
.toggle-switch.on  { background: rgba(74,222,128,.3); border: 1px solid rgba(74,222,128,.4); }
.toggle-switch.off { background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.15); }
.toggle-thumb {
  position: absolute;
  top: 3px;
  width: 18px; height: 18px;
  border-radius: 50%;
  transition: all .25s;
}
.toggle-switch.on  .toggle-thumb { right: 4px; background: #4ade80; box-shadow: 0 0 8px rgba(74,222,128,.5); }
.toggle-switch.off .toggle-thumb { right: 22px; background: rgba(255,255,255,.35); }

/* investment input */
.inv-input-wrap {
  display: flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 10px;
  padding: 0 12px;
}
.inv-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  padding: 12px 0;
  direction: ltr;
  text-align: left;
}
.inv-input::placeholder { color: rgba(255,255,255,.25); font-weight: 400; }
.inv-unit { font-size: 12px; color: rgba(255,255,255,.35); }

/* risk selector */
.risk-selector {
  display: flex; gap: 6px;
}
.risk-btn {
  flex: 1;
  padding: 8px 4px;
  border-radius: 10px;
  font-size: 11px; font-weight: 700;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  color: rgba(255,255,255,.5);
  cursor: pointer;
  transition: all .2s;
}
.risk-btn.active.low    { background: rgba(74,222,128,.12);  border-color: rgba(74,222,128,.3);  color: #4ade80; }
.risk-btn.active.medium { background: rgba(250,204,21,.12);  border-color: rgba(250,204,21,.3);  color: #facc15; }
.risk-btn.active.high   { background: rgba(248,113,113,.12); border-color: rgba(248,113,113,.3); color: #f87171; }

.risk-desc-box {
  font-size: 11px; color: rgba(255,255,255,.4);
  background: rgba(255,255,255,.03);
  border: 1px solid rgba(255,255,255,.06);
  border-radius: 8px;
  padding: 8px 10px;
  line-height: 1.6;
}

/* save button */
.save-btn {
  width: 100%;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff; font-size: 14px; font-weight: 800;
  padding: 13px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center; gap: 7px;
  margin-top: 14px;
  transition: all .25s;
  box-shadow: 0 6px 18px rgba(34,197,94,.2);
  cursor: pointer;
}
.save-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 10px 24px rgba(34,197,94,.28); }
.save-btn:disabled { opacity:.6; cursor:not-allowed; }

.btn-spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin .7s linear infinite;
}
.btn-spinner.dark {
  border: 2px solid rgba(0,0,0,.2);
  border-top-color: rgba(0,0,0,.6);
}

.settings-msg {
  margin-top: 10px;
  font-size: 13px;
  text-align: center;
  padding: 8px;
  border-radius: 8px;
}
.settings-msg.ok  { color: #4ade80; background: rgba(74,222,128,.08); }
.settings-msg.err { color: #f87171; background: rgba(248,113,113,.08); }
</style>
