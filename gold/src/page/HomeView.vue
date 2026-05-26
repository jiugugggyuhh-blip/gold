<template>
  <div class="home" dir="rtl">

    <!-- ══ HERO ══════════════════════════════════════════════ -->
    <section class="hero-section">
      <div class="hero-bg-orb orb1"></div>
      <div class="hero-bg-orb orb2"></div>
      <div class="hero-bg-orb orb3"></div>

      <div class="hero-inner">
        <!-- متن -->
        <div class="hero-text">
          <div class="hero-chip">
            <span class="chip-dot"></span>
            پلتفرم خرید و فروش آنلاین طلا و نقره
          </div>
          <h1 class="hero-h1">
            سرمایه‌گذاری روی
            <span class="rotating-word-wrap">
              <span class="rotating-word" :key="rotWord">{{ rotWord }}</span>
            </span>
            <br>
            <span class="hero-highlight-anim">
              <span
                v-for="(w, i) in highlightWords"
                :key="w"
                class="hw"
                :style="{ animationDelay: i * 0.18 + 's' }"
              >{{ w }}</span>
            </span>
            و همیشه در دسترس
          </h1>
          <p class="hero-desc">
            خرید و فروش طلای آب‌شده با قیمت لحظه‌ای، کارمزد شفاف و تسویه سریع.
            یک تجربه حرفه‌ای برای مدیریت دارایی طلا از موبایل یا دسکتاپ.
          </p>

          <!-- CTA -->
          <div class="hero-cta">
            <router-link to="/login" class="cta-primary">
              <span>شروع سرمایه‌گذاری</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </router-link>
            <router-link to="/fees" class="cta-ghost">مشاهده کارمزدها</router-link>
          </div>

          <!-- آمار سریع -->
          <div class="hero-stats">
            <div class="hstat" v-for="s in heroStats" :key="s.label">
              <div class="hstat-val">{{ s.value }}</div>
              <div class="hstat-lbl">{{ s.label }}</div>
            </div>
          </div>
        </div>

        <!-- کارت قیمت زنده -->
        <div class="hero-card">
          <div class="hcard-header">
            <div class="hcard-title">
              <span class="live-dot-anim"></span>
              قیمت لحظه‌ای
            </div>
            <div class="hcard-time">{{ liveTime }}</div>
          </div>

          <div class="hcard-prices">
            <div class="hprice-row" v-for="item in liveItems" :key="item.symbol">
              <div class="hprice-left">
                <div class="hprice-icon" :style="{ background: item.color }">{{ item.icon }}</div>
                <div>
                  <div class="hprice-name">{{ item.name }}</div>
                  <div class="hprice-sym">{{ item.sym }}</div>
                </div>
              </div>
              <div class="hprice-right">
                <div class="hprice-val" v-if="item.price">{{ fmtNum(item.price) }}</div>
                <div class="hprice-val loading-bar" v-else></div>
                <div class="hprice-chg" :class="item.change >= 0 ? 'up' : 'down'" v-if="item.price">
                  {{ item.change >= 0 ? '▲' : '▼' }} {{ Math.abs(item.change).toFixed(2) }}٪
                </div>
              </div>
            </div>
          </div>

          <router-link to="/login" class="hcard-btn">
            خرید طلا همین الان
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ══ نمودار ══════════════════════════════════════════════ -->
    <section class="chart-section">
      <div class="section-inner">
        <div class="section-header">
          <div class="section-badge">📊 نمودار تاریخی</div>
          <h2 class="section-title">نمودار قیمت طلای آب‌شده</h2>
          <p class="section-desc">قیمت لحظه‌ای و تاریخچه نوسانات بازار طلا</p>
        </div>
        <GoldChart />
      </div>
    </section>

    <!-- ══ مزایا ═══════════════════════════════════════════════ -->
    <section class="features-section">
      <div class="section-inner">
        <div class="section-header">
          <div class="section-badge">✨ چرا ما</div>
          <h2 class="section-title">مزایای مکسی گلد</h2>
        </div>
        <div class="features-grid">
          <div class="feat-card" v-for="f in features" :key="f.title">
            <div class="feat-icon-wrap" :style="{ background: f.bg }">
              <span class="feat-icon">{{ f.icon }}</span>
            </div>
            <h3 class="feat-title">{{ f.title }}</h3>
            <p class="feat-text">{{ f.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ نحوه کار ════════════════════════════════════════════ -->
    <section class="how-section">
      <div class="section-inner">
        <div class="section-header">
          <div class="section-badge">🚀 شروع آسان</div>
          <h2 class="section-title">در ۳ قدم شروع کن</h2>
        </div>
        <div class="steps-grid">
          <div class="step-card" v-for="(s, i) in steps" :key="i">
            <div class="step-num">{{ fa(i + 1) }}</div>
            <div class="step-icon">{{ s.icon }}</div>
            <h3 class="step-title">{{ s.title }}</h3>
            <p class="step-text">{{ s.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ فروشگاه ═════════════════════════════════════════════ -->
    <section class="shop-section" id="shop">
      <div class="section-inner">
        <div class="section-header">
          <div class="section-badge">🛍️ فروشگاه</div>
          <h2 class="section-title">خرید طلا و نقره</h2>
          <p class="section-desc">انتخاب محصول، مشاهده قیمت تقریبی و ثبت سفارش سریع</p>
        </div>
        <GoldShop />
      </div>
    </section>

    <!-- ══ آمار پلتفرم ════════════════════════════════════════ -->
    <section class="platform-stats-section">
      <div class="section-inner">
        <div class="pstats-grid">
          <div class="pstat" v-for="s in platformStats" :key="s.label">
            <div class="pstat-val">{{ s.value }}</div>
            <div class="pstat-lbl">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ FAQ ════════════════════════════════════════════════ -->
    <section class="faq-section" id="faq">
      <div class="section-inner">
        <div class="section-header">
          <div class="section-badge">❓ سوالات</div>
          <h2 class="section-title">سوالات پرتکرار</h2>
        </div>
        <div class="faq-list">
          <details class="faq-item" v-for="(q, i) in faqs" :key="i">
            <summary class="faq-q">
              <span>{{ q.question }}</span>
              <span class="faq-chevron">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="h-4 w-4"><path d="M6 9l6 6 6-6"/></svg>
              </span>
            </summary>
            <div class="faq-a">{{ q.answer }}</div>
          </details>
        </div>
      </div>
    </section>

    <!-- ══ CTA بنر ════════════════════════════════════════════ -->
    <section class="cta-banner">
      <div class="cta-banner-orb"></div>
      <div class="section-inner cta-inner">
        <h2 class="cta-h2">همین الان شروع کن</h2>
        <p class="cta-p">با چند هزار تومان سرمایه‌گذاری خود را آغاز کن</p>
        <router-link to="/login" class="cta-primary large">
          ثبت‌نام رایگان
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </router-link>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import GoldShop from '@/components/GoldShop.vue'
import GoldChart from '@/components/GoldChart.vue'

const url = process.env.VUE_APP_API_URL || ''

// ── rotating word در hero ──────────────────
const rotatingWords = ['طلا', 'نقره', 'آینده']
const rotWordIdx = ref(0)
const rotWord = ref(rotatingWords[0])
let rotTimer = null

const highlightWords = ['ساده،', 'امن،', 'مطمئن']

const liveTime = ref('در حال بارگذاری...')
const liveItems = ref([
  { symbol: 'gold18',   name: 'طلای ۱۸ عیار',   sym: 'GOLD 18K',   icon: '🥇', color: 'rgba(255,210,106,.15)', price: 0, change: 0 },
  { symbol: 'goldMelt', name: 'طلای آب‌شده',     sym: 'GOLD MELT',  icon: '✨', color: 'rgba(255,179,50,.15)',  price: 0, change: 0 },
  { symbol: 'silver',   name: 'نقره ۹۹۹',        sym: 'SILVER 999', icon: '🥈', color: 'rgba(180,200,255,.12)', price: 0, change: 0 },
  { symbol: 'dollar',   name: 'دلار آمریکا',     sym: 'USD',        icon: '💵', color: 'rgba(74,222,128,.1)',   price: 0, change: 0 },
])

let priceTimer = null

async function fetchLive() {
  try {
    const r = await axios.get(`${url}/prices/current`, { timeout: 10000 })
    if (!r.data.success) return
    const d = r.data.data
    const gold18 = d.gold.find(i => i.symbol === 'IR_GOLD_18K')
    const goldM  = d.gold.find(i => i.symbol === 'IR_GOLD_MELTED')
    const usd    = d.currency.find(i => i.symbol === 'USD')
    const silv   = d.silver.find(i => i.symbol === 'silver999')
    if (gold18) { liveItems.value[0].price = gold18.price; liveItems.value[0].change = gold18.change_percent || 0 }
    if (goldM)  { liveItems.value[1].price = goldM.price;  liveItems.value[1].change = goldM.change_percent  || 0 }
    if (silv)   { liveItems.value[2].price = silv.price;   liveItems.value[2].change = 0 }
    if (usd)    { liveItems.value[3].price = usd.price;    liveItems.value[3].change = usd.change_percent   || 0 }
    liveTime.value = new Date().toLocaleTimeString('fa-IR')
  } catch { /* silent */ }
}

function fmtNum(v) {
  if (!v) return '—'
  return Number(v).toLocaleString('fa-IR')
}
function fa(n) {
  return n.toLocaleString('fa-IR')
}

onMounted(() => {
  fetchLive()
  priceTimer = setInterval(fetchLive, 60000)

  rotTimer = setInterval(() => {
    rotWordIdx.value = (rotWordIdx.value + 1) % rotatingWords.length
    rotWord.value = rotatingWords[rotWordIdx.value]
  }, 2200)
})
onUnmounted(() => {
  clearInterval(priceTimer)
  clearInterval(rotTimer)
})

const heroStats = [
  { value: '۲۴/۷', label: 'معامله شبانه‌روزی' },
  { value: 'شفاف', label: 'بدون هزینه پنهان' },
  { value: 'امن', label: 'احراز هویت' },
]

const features = [
  { icon: '⚡', title: 'خرید و فروش لحظه‌ای',   text: 'ثبت سفارش در چند ثانیه با قیمت روز و نمایش جزئیات کامل قبل از تایید.',          bg: 'rgba(255,210,106,.1)',  },
  { icon: '🛡️', title: 'نگهداری امن دارایی',    text: 'ساختار امن برای مدیریت دارایی، همراه با گزارش شفاف تراکنش‌ها.',               bg: 'rgba(74,222,128,.1)',  },
  { icon: '📊', title: 'نمودار و تحلیل بازار',  text: 'مشاهده نمودار تاریخی قیمت طلا و آمار بازار برای تصمیم‌گیری بهتر.',           bg: 'rgba(96,165,250,.1)',  },
  { icon: '🤖', title: 'ربات معامله‌گر هوشمند', text: 'ربات خودکار با استراتژی‌های هوشمند، به‌صورت ۲۴ ساعته برای شما کار می‌کند.',    bg: 'rgba(168,85,247,.1)',  },
  { icon: '💰', title: 'ورود با سرمایه کم',     text: 'از مقادیر کم شروع کن و به مرور سرمایه‌ات را روی طلا افزایش بده.',            bg: 'rgba(255,179,50,.1)',  },
  { icon: '🔄', title: 'تسویه و نقدشوندگی',    text: 'هر زمان بخواهی امکان فروش و مدیریت موجودی با فرآیند ساده فراهم است.',          bg: 'rgba(248,113,113,.1)', },
]

const steps = [
  { icon: '📝', title: 'ثبت‌نام',          text: 'با شماره موبایل در چند ثانیه ثبت‌نام کن و حساب خود را فعال کن.' },
  { icon: '💳', title: 'شارژ کیف پول',     text: 'حساب خود را به هر مقداری شارژ کن و آماده معامله شو.' },
  { icon: '🥇', title: 'خرید طلا و نقره',  text: 'با قیمت لحظه‌ای بازار طلا و نقره بخر و دارایی‌ات رشد کنه.' },
]

const platformStats = [
  { value: '+۵۰۰۰', label: 'کاربر فعال' },
  { value: '+۱۰۰۰', label: 'معامله روزانه' },
  { value: '۲۴/۷', label: 'ساعت فعالیت' },
  { value: '۱۰۰٪', label: 'پشتیبانی' },
]

const faqs = [
  { question: 'طلای آب‌شده چیست؟',           answer: 'طلای آب‌شده طلای ذوب‌شده و استانداردی است که برای سرمایه‌گذاری و معامله استفاده می‌شود.' },
  { question: 'حداقل میزان خرید چقدر است؟',  answer: 'می‌توانید با سرمایه کم شروع کنید و به مرور میزان خرید خود را افزایش دهید.' },
  { question: 'قیمت‌ها چگونه محاسبه می‌شوند؟', answer: 'قیمت بر اساس نرخ لحظه‌ای بازار و کارمزد شفاف پلتفرم محاسبه می‌شود.' },
  { question: 'آیا فروش فوری امکان‌پذیر است؟', answer: 'بله، در هر زمان می‌توانید دارایی خود را بفروشید و سفارش ثبت کنید.' },
  { question: 'امنیت حساب کاربری چگونه تامین می‌شود؟', answer: 'ورود امن، کنترل حساب کاربری و فرآیندهای تایید هویت برای افزایش امنیت در نظر گرفته شده است.' },
]
</script>

<style scoped>
/* ─── tokens ───────────────────────────── */
.home {
  background: #080c10;
  color: #fff;
  font-family: inherit;
  overflow-x: hidden;
}

/* ─── HERO ─────────────────────────────── */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 80px 0 60px;
}

.hero-bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
}
.orb1 { width: 600px; height: 600px; background: rgba(255,196,76,.07);  top: -100px; right: -150px; animation: orbFloat 8s ease-in-out infinite; }
.orb2 { width: 400px; height: 400px; background: rgba(74,222,128,.05);  bottom: 0;   left: -100px; animation: orbFloat 10s ease-in-out infinite reverse; }
.orb3 { width: 300px; height: 300px; background: rgba(96,165,250,.04);  top: 40%;   left: 40%; animation: orbFloat 12s ease-in-out infinite; }

@keyframes orbFloat {
  0%,100% { transform: translateY(0) scale(1); }
  50%      { transform: translateY(-30px) scale(1.05); }
}

.hero-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 60px;
  align-items: center;
  width: 100%;
}
@media(max-width:960px) { .hero-inner { grid-template-columns: 1fr; gap: 40px; } }

.hero-text { display: flex; flex-direction: column; gap: 24px; }

.hero-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(255,196,76,.1);
  border: 1px solid rgba(255,196,76,.25);
  color: #ffd981;
  font-size: 13px;
  width: fit-content;
}
.chip-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #ffd26a;
  box-shadow: 0 0 6px #ffd26a;
  animation: blink 1.5s ease-in-out infinite;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }

.hero-h1 {
  font-size: clamp(2rem, 5vw, 3.4rem);
  font-weight: 900;
  line-height: 1.25;
  color: #fff;
}
.hero-highlight {
  background: linear-gradient(135deg, #ffd26a, #f97316);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ── rotating word ── */
.rotating-word-wrap {
  display: inline-block;
  position: relative;
  min-width: 90px;
}
.rotating-word {
  display: inline-block;
  background: linear-gradient(135deg, #ffd26a, #f97316);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: wordSlideIn 0.45s cubic-bezier(.22,.61,.36,1) both;
}
@keyframes wordSlideIn {
  from { opacity: 0; transform: translateY(20px) scale(0.92); }
  to   { opacity: 1; transform: translateY(0)   scale(1); }
}

/* ── highlight words pop-in ── */
.hero-highlight-anim {
  display: inline-flex;
  gap: 6px;
  flex-wrap: wrap;
}
.hw {
  display: inline-block;
  background: linear-gradient(135deg, #ffd26a, #f97316);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  opacity: 0;
  animation: hwPop 0.5s cubic-bezier(.22,.61,.36,1) forwards;
  animation-delay: var(--d, 0s);
}
@keyframes hwPop {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}

.hero-desc {
  font-size: 15px;
  color: rgba(255,255,255,.55);
  line-height: 1.9;
  max-width: 520px;
}

.hero-cta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.cta-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 28px;
  border-radius: 14px;
  background: linear-gradient(135deg, #ffd26a, #f97316);
  color: #1a1305;
  font-size: 15px;
  font-weight: 800;
  text-decoration: none;
  transition: all .25s;
  box-shadow: 0 8px 28px rgba(255,210,106,.3);
}
.cta-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(255,210,106,.4); }
.cta-primary svg { width: 18px; height: 18px; }
.cta-primary.large { padding: 15px 36px; font-size: 16px; }

.cta-ghost {
  padding: 13px 24px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.2);
  color: rgba(255,255,255,.7);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all .2s;
  background: rgba(255,255,255,.04);
}
.cta-ghost:hover { border-color: rgba(255,196,76,.4); color: #ffd47a; }

.hero-stats {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}
.hstat-val { font-size: 1.3rem; font-weight: 800; color: #ffd47a; }
.hstat-lbl { font-size: 11px; color: rgba(255,255,255,.4); margin-top: 2px; }

/* hero card */
.hero-card {
  background: linear-gradient(160deg, rgba(255,255,255,.05) 0%, rgba(255,255,255,.02) 100%);
  border: 1px solid rgba(255,196,76,.18);
  border-radius: 24px;
  padding: 24px;
  backdrop-filter: blur(20px);
  box-shadow: 0 24px 60px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.08);
  animation: cardFloat 6s ease-in-out infinite;
}
@keyframes cardFloat {
  0%,100% { transform: translateY(0); }
  50%      { transform: translateY(-8px); }
}

.hcard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.hcard-title {
  display: flex; align-items: center; gap: 7px;
  font-size: 13px; font-weight: 700; color: #fff;
}
.live-dot-anim {
  width: 8px; height: 8px; border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 8px #4ade80;
  animation: blink 1.3s ease-in-out infinite;
}
.hcard-time { font-size: 11px; color: rgba(255,255,255,.3); }

.hcard-prices { display: flex; flex-direction: column; gap: 4px; margin-bottom: 20px; }

.hprice-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255,255,255,.03);
  border: 1px solid rgba(255,255,255,.05);
  transition: background .2s;
}
.hprice-row:hover { background: rgba(255,255,255,.06); }

.hprice-left { display: flex; align-items: center; gap: 10px; }
.hprice-icon {
  width: 36px; height: 36px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem;
}
.hprice-name { font-size: 12px; font-weight: 700; color: #fff; }
.hprice-sym  { font-size: 10px; color: rgba(255,255,255,.3); margin-top: 1px; }

.hprice-right { text-align: left; }
.hprice-val {
  font-size: 13px; font-weight: 800; color: #e8f5e9;
  direction: ltr;
}
.hprice-val.loading-bar {
  width: 80px; height: 14px;
  background: linear-gradient(90deg, rgba(255,255,255,.05) 25%, rgba(255,255,255,.1) 50%, rgba(255,255,255,.05) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
.hprice-chg { font-size: 11px; font-weight: 700; margin-top: 2px; }
.hprice-chg.up   { color: #4ade80; }
.hprice-chg.down { color: #f87171; }

.hcard-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%;
  padding: 13px;
  border-radius: 13px;
  background: linear-gradient(135deg, #ffd26a, #f97316);
  color: #1a1305;
  font-size: 14px; font-weight: 800;
  text-decoration: none;
  transition: all .25s;
  box-shadow: 0 6px 20px rgba(255,210,106,.25);
}
.hcard-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(255,210,106,.35); }
.hcard-btn svg { width: 16px; height: 16px; }

/* ─── shared section styles ─────────────── */
.section-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.chart-section,
.features-section,
.how-section,
.shop-section,
.faq-section { padding: 80px 0; }

.section-header {
  text-align: center;
  margin-bottom: 50px;
}
.section-badge {
  display: inline-flex;
  padding: 5px 14px;
  border-radius: 999px;
  background: rgba(255,196,76,.1);
  border: 1px solid rgba(255,196,76,.2);
  color: #ffd47a;
  font-size: 12px;
  margin-bottom: 14px;
}
.section-title {
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  font-weight: 900;
  color: #fff;
  margin-bottom: 10px;
}
.section-desc {
  font-size: 14px;
  color: rgba(255,255,255,.45);
  max-width: 480px;
  margin: 0 auto;
  line-height: 1.8;
}

/* ─── features ──────────────────────────── */
.features-section {
  background: linear-gradient(180deg, transparent 0%, rgba(255,196,76,.02) 50%, transparent 100%);
}
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
@media(max-width:900px) { .features-grid { grid-template-columns: repeat(2,1fr); } }
@media(max-width:560px) { .features-grid { grid-template-columns: 1fr; } }

.feat-card {
  background: rgba(255,255,255,.03);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 20px;
  padding: 24px 20px;
  transition: all .25s;
  position: relative;
  overflow: hidden;
}
.feat-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,196,76,.04) 0%, transparent 60%);
  opacity: 0;
  transition: opacity .25s;
}
.feat-card:hover { border-color: rgba(255,196,76,.2); transform: translateY(-4px); }
.feat-card:hover::before { opacity: 1; }

.feat-icon-wrap {
  width: 48px; height: 48px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 16px;
}
.feat-icon { font-size: 1.5rem; }
.feat-title { font-size: 15px; font-weight: 800; color: #fff; margin-bottom: 8px; }
.feat-text  { font-size: 13px; color: rgba(255,255,255,.5); line-height: 1.8; }

/* ─── steps ─────────────────────────────── */
.how-section {
  background: linear-gradient(180deg, transparent, rgba(74,222,128,.02), transparent);
}
.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  position: relative;
}
@media(max-width:700px) { .steps-grid { grid-template-columns: 1fr; } }

.step-card {
  background: linear-gradient(160deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
  border: 1px solid rgba(255,196,76,.15);
  border-radius: 20px;
  padding: 30px 24px;
  text-align: center;
  position: relative;
}
.step-num {
  position: absolute; top: 16px; right: 16px;
  font-size: 2rem; font-weight: 900;
  color: rgba(255,196,76,.15);
  line-height: 1;
}
.step-icon { font-size: 2.5rem; margin-bottom: 14px; }
.step-title { font-size: 16px; font-weight: 800; color: #fff; margin-bottom: 8px; }
.step-text  { font-size: 13px; color: rgba(255,255,255,.5); line-height: 1.8; }

/* ─── shop ──────────────────────────────── */
.shop-section {
  background: linear-gradient(180deg, transparent, rgba(255,196,76,.02), transparent);
}

/* ─── platform stats ────────────────────── */
.platform-stats-section {
  padding: 60px 0;
  border-top: 1px solid rgba(255,255,255,.05);
  border-bottom: 1px solid rgba(255,255,255,.05);
  background: rgba(255,196,76,.02);
}
.pstats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  text-align: center;
}
@media(max-width:600px) { .pstats-grid { grid-template-columns: repeat(2,1fr); } }

.pstat-val { font-size: 2.2rem; font-weight: 900; color: #ffd47a; margin-bottom: 6px; }
.pstat-lbl { font-size: 13px; color: rgba(255,255,255,.45); }

/* ─── faq ───────────────────────────────── */
.faq-list { max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; gap: 10px; }

.faq-item {
  background: rgba(255,255,255,.03);
  border: 1px solid rgba(255,196,76,.1);
  border-radius: 14px;
  padding: 0;
  overflow: hidden;
  transition: border-color .2s;
}
.faq-item[open] { border-color: rgba(255,196,76,.25); }

.faq-q {
  list-style: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px;
  font-size: 14px;
  font-weight: 700;
  color: rgba(255,255,255,.9);
  user-select: none;
}
.faq-q::-webkit-details-marker { display: none; }

.faq-chevron {
  width: 28px; height: 28px; flex-shrink: 0;
  background: rgba(255,196,76,.1);
  border: 1px solid rgba(255,196,76,.2);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  color: #ffd47a;
  transition: transform .25s;
}
.faq-item[open] .faq-chevron { transform: rotate(180deg); }

.faq-a {
  padding: 0 18px 16px;
  font-size: 13px;
  color: rgba(255,255,255,.55);
  line-height: 1.9;
  border-top: 1px solid rgba(255,255,255,.05);
  padding-top: 12px;
}

/* ─── cta banner ────────────────────────── */
.cta-banner {
  padding: 100px 0;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.cta-banner-orb {
  position: absolute;
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(255,196,76,.08), transparent 70%);
  top: 50%; left: 50%; transform: translate(-50%,-50%);
  pointer-events: none;
}
.cta-inner { position: relative; z-index: 1; }
.cta-h2 { font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 900; color: #fff; margin-bottom: 12px; }
.cta-p  { font-size: 15px; color: rgba(255,255,255,.5); margin-bottom: 32px; }
</style>
