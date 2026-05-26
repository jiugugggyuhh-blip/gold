<template>
  <section class="gold-home py-8 md:py-14">
    <div class="hero-shell rounded-3xl p-5 md:p-10">
      <div class="grid grid-cols-12 gap-6 items-center">
        <div class="col-span-12 lg:col-span-7 space-y-6 text-white">
          <span class="gold-chip">پلتفرم خرید و فروش آنلاین طلا</span>
          <h1 class="text-3xl md:text-5xl font-black leading-tight">
            سرمایه گذاری روی طلا،
            <span class="gold-text">ساده، امن و همیشه در دسترس</span>
          </h1>
          <p class="text-white/75 leading-8 max-w-2xl">
            خرید و فروش طلای آب شده با قیمت لحظه ای، کارمزد شفاف و تسویه سریع. یک تجربه حرفه ای برای
            مدیریت دارایی طلا از موبایل یا دسکتاپ.
          </p>

          <div class="flex flex-wrap items-center gap-3">
            <router-link to="/login" class="btn-gold">شروع سرمایه گذاری</router-link>
            <router-link to="/fees" class="btn-ghost">مشاهده کارمزدها</router-link>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="metric-card">
              <div class="metric-value">24/7</div>
              <div class="metric-label">معامله شبانه روزی</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">شفاف</div>
              <div class="metric-label">بدون هزینه پنهان</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">امن</div>
              <div class="metric-label">پشتیبانی و احراز هویت</div>
            </div>
          </div>
        </div>

        <GoldCalculator />
      </div>
    </div>

    <section class="mt-10 md:mt-14">
      <header class="text-center mb-8 md:mb-10 text-white">
        <span class="gold-chip">چرا ما</span>
        <h2 class="text-2xl md:text-4xl font-black mt-3">مزایای خرید طلا از مکسـی گلد</h2>
      </header>

      <div class="grid grid-cols-12 gap-5">
        <article class="col-span-12 md:col-span-6 xl:col-span-3 feature-card">
          <h3 class="feature-title">خرید و فروش سریع</h3>
          <p class="feature-text">ثبت سفارش در چند ثانیه با قیمت روز و نمایش جزئیات کامل قبل از تایید.</p>
        </article>
        <article class="col-span-12 md:col-span-6 xl:col-span-3 feature-card">
          <h3 class="feature-title">نگهداری امن دارایی</h3>
          <p class="feature-text">ساختار امن برای مدیریت دارایی، همراه با گزارش شفاف تراکنش ها.</p>
        </article>
        <article class="col-span-12 md:col-span-6 xl:col-span-3 feature-card">
          <h3 class="feature-title">ورود با سرمایه کم</h3>
          <p class="feature-text">از مقادیر کم شروع کن و به مرور سرمایه ات را روی طلا افزایش بده.</p>
        </article>
        <article class="col-span-12 md:col-span-6 xl:col-span-3 feature-card">
          <h3 class="feature-title">تسویه و نقدشوندگی</h3>
          <p class="feature-text">هر زمان بخواهی امکان فروش و مدیریت موجودی با فرآیند ساده فراهم است.</p>
        </article>
      </div>
    </section>

    <div id="shop" class="max-w-7xl mx-auto mt-14 scroll-mt-24">
      <div class="text-center mb-6 text-white">
        <h2 class="text-2xl md:text-4xl font-black">فروشگاه طلا</h2>
        <p class="text-white/70 mt-2">انتخاب محصول، مشاهده قیمت تقریبی و ثبت سفارش سریع</p>
      </div>
      <GoldShop />
    </div>

    <div id="faq" class="mt-14 max-w-7xl mx-auto scroll-mt-24 text-white">
      <h3 class="text-2xl md:text-4xl font-black text-center">سوالات پرتکرار</h3>
      <div class="mt-6 space-y-4">
        <template v-for="(item, i) in faqs" :key="i">
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
import { reactive } from 'vue'
import GoldShop from '@/components/GoldShop.vue'
import GoldCalculator from '@/components/GoldCalculator.vue'

const faqs = reactive([
  { question: 'طلای آب شده چیست؟', answer: 'طلای آب شده طلای ذوب شده و استانداردی است که برای سرمایه گذاری و معامله استفاده می شود.' },
  { question: 'حداقل میزان خرید چقدر است؟', answer: 'می توانید با سرمایه کم شروع کنید و به مرور میزان خرید خود را افزایش دهید.' },
  { question: 'قیمت ها چگونه محاسبه می شوند؟', answer: 'قیمت بر اساس نرخ لحظه ای بازار و کارمزد شفاف پلتفرم محاسبه می شود.' },
  { question: 'آیا فروش فوری امکان پذیر است؟', answer: 'بله، در هر زمان می توانید دارایی خود را بفروشید و سفارش ثبت کنید.' },
  { question: 'امنیت حساب کاربری چگونه تامین می شود؟', answer: 'ورود امن، کنترل حساب کاربری و فرآیندهای تایید هویت برای افزایش امنیت در نظر گرفته شده است.' }
])
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
