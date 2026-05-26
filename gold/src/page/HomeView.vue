<template>
  <section class="gold-home py-8 md:py-14">
    <div class="hero-shell rounded-3xl p-5 md:p-10">
      <div class="grid grid-cols-12 gap-6 items-center">
        <div class="col-span-12 lg:col-span-7 space-y-6 text-white">
          <span class="gold-chip">{{ c.hero_chip }}</span>
          <h1 class="text-3xl md:text-5xl font-black leading-tight">
            {{ c.hero_title }}
            <span class="gold-text">{{ c.hero_title_highlight }}</span>
          </h1>
          <p class="text-white/75 leading-8 max-w-2xl">{{ c.hero_desc }}</p>

          <div class="flex flex-wrap items-center gap-3">
            <router-link to="/login" class="btn-gold">{{ c.hero_btn_primary }}</router-link>
            <router-link to="/fees" class="btn-ghost">{{ c.hero_btn_secondary }}</router-link>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div v-for="(m, i) in c.metrics" :key="i" class="metric-card">
              <div class="metric-value">{{ m.value }}</div>
              <div class="metric-label">{{ m.label }}</div>
            </div>
          </div>
        </div>

        <GoldCalculator />
      </div>
    </div>

    <section class="mt-10 md:mt-14">
      <header class="text-center mb-8 md:mb-10 text-white">
        <span class="gold-chip">{{ c.features_chip }}</span>
        <h2 class="text-2xl md:text-4xl font-black mt-3">{{ c.features_title }}</h2>
      </header>

      <div class="grid grid-cols-12 gap-5">
        <article v-for="(f, i) in c.features" :key="i" class="col-span-12 md:col-span-6 xl:col-span-3 feature-card">
          <h3 class="feature-title">{{ f.title }}</h3>
          <p class="feature-text">{{ f.text }}</p>
        </article>
      </div>
    </section>

    <div id="shop" class="max-w-7xl mx-auto mt-14 scroll-mt-24">
      <div class="text-center mb-6 text-white">
        <h2 class="text-2xl md:text-4xl font-black">{{ c.shop_title }}</h2>
        <p class="text-white/70 mt-2">{{ c.shop_desc }}</p>
      </div>
      <GoldShop />
    </div>

    <div id="faq" class="mt-14 max-w-7xl mx-auto scroll-mt-24 text-white">
      <h3 class="text-2xl md:text-4xl font-black text-center">{{ c.faq_title }}</h3>
      <div class="mt-6 space-y-4">
        <template v-for="(item, i) in c.faqs" :key="i">
          <details class="faq-item group">
            <summary class="list-none cursor-pointer flex items-center justify-between gap-4">
              <span class="text-sm sm:text-base font-semibold text-white/95">{{ item.question }}</span>
              <span class="faq-icon">
                <svg class="h-4 w-4 text-amber-300 group-open:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <svg class="h-4 w-4 text-amber-300 hidden group-open:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14" />
                </svg>
              </span>
            </summary>
            <div class="mt-3 text-sm text-white/70 leading-7">{{ item.answer }}</div>
          </details>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import axios from 'axios'
import GoldShop from '@/components/GoldShop.vue'
import GoldCalculator from '@/components/GoldCalculator.vue'

const url = process.env.VUE_APP_API_URL || ''

const c = reactive({
  hero_chip: 'پلتفرم خرید و فروش آنلاین طلا',
  hero_title: 'سرمایه گذاری روی طلا،',
  hero_title_highlight: 'ساده، امن و همیشه در دسترس',
  hero_desc: 'خرید و فروش طلای آب شده با قیمت لحظه ای، کارمزد شفاف و تسویه سریع. یک تجربه حرفه ای برای مدیریت دارایی طلا از موبایل یا دسکتاپ.',
  hero_btn_primary: 'شروع سرمایه گذاری',
  hero_btn_secondary: 'مشاهده کارمزدها',
  metrics: [
    { value: '24/7', label: 'معامله شبانه روزی' },
    { value: 'شفاف', label: 'بدون هزینه پنهان' },
    { value: 'امن', label: 'پشتیبانی و احراز هویت' }
  ],
  features_chip: 'چرا ما',
  features_title: 'مزایای خرید طلا از مکسـی گلد',
  features: [
    { title: 'خرید و فروش سریع', text: 'ثبت سفارش در چند ثانیه با قیمت روز و نمایش جزئیات کامل قبل از تایید.' },
    { title: 'نگهداری امن دارایی', text: 'ساختار امن برای مدیریت دارایی، همراه با گزارش شفاف تراکنش ها.' },
    { title: 'ورود با سرمایه کم', text: 'از مقادیر کم شروع کن و به مرور سرمایه ات را روی طلا افزایش بده.' },
    { title: 'تسویه و نقدشوندگی', text: 'هر زمان بخواهی امکان فروش و مدیریت موجودی با فرآیند ساده فراهم است.' }
  ],
  shop_title: 'فروشگاه طلا',
  shop_desc: 'انتخاب محصول، مشاهده قیمت تقریبی و ثبت سفارش سریع',
  faq_title: 'سوالات پرتکرار',
  faqs: [
    { question: 'طلای آب شده چیست؟', answer: 'طلای آب شده طلای ذوب شده و استانداردی است که برای سرمایه گذاری و معامله استفاده می شود.' },
    { question: 'حداقل میزان خرید چقدر است؟', answer: 'می توانید با سرمایه کم شروع کنید و به مرور میزان خرید خود را افزایش دهید.' },
    { question: 'قیمت ها چگونه محاسبه می شوند؟', answer: 'قیمت بر اساس نرخ لحظه ای بازار و کارمزد شفاف پلتفرم محاسبه می شود.' },
    { question: 'آیا فروش فوری امکان پذیر است؟', answer: 'بله، در هر زمان می توانید دارایی خود را بفروشید و سفارش ثبت کنید.' },
    { question: 'امنیت حساب کاربری چگونه تامین می شود؟', answer: 'ورود امن، کنترل حساب کاربری و فرآیندهای تایید هویت برای افزایش امنیت در نظر گرفته شده است.' }
  ]
})

onMounted(async () => {
  try {
    const res = await axios.get(`${url}/admin/site-content`)
    if (res.data.success && res.data.data) {
      const d = res.data.data
      if (d.hero_chip) c.hero_chip = d.hero_chip
      if (d.hero_title) c.hero_title = d.hero_title
      if (d.hero_title_highlight) c.hero_title_highlight = d.hero_title_highlight
      if (d.hero_desc) c.hero_desc = d.hero_desc
      if (d.hero_btn_primary) c.hero_btn_primary = d.hero_btn_primary
      if (d.hero_btn_secondary) c.hero_btn_secondary = d.hero_btn_secondary
      if (d.metrics?.length) c.metrics = d.metrics
      if (d.features_chip) c.features_chip = d.features_chip
      if (d.features_title) c.features_title = d.features_title
      if (d.features?.length) c.features = d.features
      if (d.shop_title) c.shop_title = d.shop_title
      if (d.shop_desc) c.shop_desc = d.shop_desc
      if (d.faq_title) c.faq_title = d.faq_title
      if (d.faqs?.length) c.faqs = d.faqs
    }
  } catch {
    // اگر API در دسترس نبود از مقادیر پیش‌فرض استفاده می‌شه
  }
})
</script>

<style scoped>
.gold-home {
  position: relative;
}

.hero-shell {
  background:
    radial-gradient(900px 300px at 85% -10%, rgba(255, 189, 46, 0.18), transparent 60%),
    radial-gradient(500px 240px at -5% 100%, rgba(216, 143, 36, 0.2), transparent 55%),
    linear-gradient(145deg, #11151a, #0b0e12 55%, #151a21);
  border: 1px solid rgba(255, 196, 76, 0.18);
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.38);
}

.gold-chip {
  display: inline-flex;
  padding: 0.45rem 0.9rem;
  border-radius: 9999px;
  background: rgba(255, 196, 76, 0.15);
  border: 1px solid rgba(255, 196, 76, 0.35);
  color: #ffd981;
  font-size: 0.78rem;
}

.gold-text {
  color: #ffce6a;
  text-shadow: 0 0 24px rgba(255, 188, 54, 0.2);
}

.btn-gold {
  background: linear-gradient(135deg, #ffd26a, #efaa2e);
  color: #1a1305;
  padding: 0.72rem 1.25rem;
  border-radius: 9999px;
  font-weight: 800;
}

.btn-ghost {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.24);
  color: #fff;
  padding: 0.72rem 1.25rem;
  border-radius: 9999px;
}

.metric-card {
  border-radius: 1rem;
  padding: 0.9rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.metric-value {
  color: #ffd47a;
  font-size: 1.05rem;
  font-weight: 800;
}

.metric-label {
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.82rem;
  margin-top: 0.2rem;
}

.feature-card {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 196, 76, 0.18);
  border-radius: 1rem;
  padding: 1.2rem;
}

.feature-title {
  font-size: 1.05rem;
  color: #ffd47a;
}

.feature-text {
  margin-top: 0.5rem;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.88rem;
  line-height: 1.9;
}

.faq-item {
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 196, 76, 0.16);
  padding: 0.95rem 1.1rem;
}

.faq-icon {
  height: 2rem;
  width: 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.7rem;
  background: #11151a;
  border: 1px solid rgba(255, 196, 76, 0.22);
}
</style>
