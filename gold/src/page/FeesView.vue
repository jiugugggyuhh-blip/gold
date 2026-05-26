<template>
  <main dir="rtl" class="fees-page">
    <section class="fees-hero">
      <div class="fees-copy">
        <span class="fees-kicker">کارمزدها</span>
        <h1>ساختار شفاف کارمزد خرید و فروش طلا</h1>
        <p>
          نرخ‌های این صفحه از تنظیمات سایت در بک‌اند خوانده می‌شوند و همان اعدادی هستند
          که در محاسبه‌گر خرید و فروش استفاده می‌شوند.
        </p>
      </div>

      <div class="fees-panel">
        <div class="fee-row">
          <span>کارمزد خرید</span>
          <strong>{{ displayFee(setting.feebuy, 1.5) }}</strong>
        </div>
        <div class="fee-row">
          <span>کارمزد فروش</span>
          <strong>{{ displayFee(setting.feesell, 0.9) }}</strong>
        </div>
        <div class="fee-row muted">
          <span>وضعیت دریافت اطلاعات</span>
          <strong>{{ statusText }}</strong>
        </div>
      </div>
    </section>

    <section class="fees-grid">
      <article>
        <span class="step">01</span>
        <h2>قیمت پایه</h2>
        <p>قیمت لحظه‌ای طلا از سرویس قیمت خوانده می‌شود و مبنای محاسبه سفارش است.</p>
      </article>
      <article>
        <span class="step">02</span>
        <h2>اعمال کارمزد</h2>
        <p>در خرید، کارمزد به مبلغ اضافه می‌شود و در فروش، از مبلغ قابل تسویه کسر می‌شود.</p>
      </article>
      <article>
        <span class="step">03</span>
        <h2>ثبت سفارش</h2>
        <p>مبلغ نهایی قبل از ثبت سفارش به کاربر نمایش داده می‌شود تا تصمیم شفاف باشد.</p>
      </article>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import axios from 'axios'

const url = process.env.VUE_APP_API_URL || ''
const loading = ref(true)
const failed = ref(false)
const setting = reactive({
  feebuy: null,
  feesell: null,
})

const statusText = computed(() => {
  if (loading.value) return 'در حال دریافت'
  return failed.value ? 'نمایش مقدار پیش‌فرض' : 'به‌روز'
})

function displayFee(value, fallback) {
  const numeric = Number(value ?? fallback)
  return `${new Intl.NumberFormat('fa-IR').format(numeric)}٪`
}

onMounted(async () => {
  try {
    const { data } = await axios.get(`${url}/admin/setting`, { timeout: 10000 })
    setting.feebuy = data?.data?.feebuy
    setting.feesell = data?.data?.feesell
  } catch (error) {
    failed.value = true
    console.warn('fees setting request failed:', error?.message || error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.fees-page {
  color: #fff;
  padding-block: 42px 72px;
}

.fees-hero {
  min-height: 420px;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
  align-items: center;
  gap: 32px;
  border-radius: 8px;
  padding: clamp(24px, 4vw, 56px);
  background:
    linear-gradient(120deg, rgba(15, 20, 23, 0.45), rgba(15, 20, 23, 0.92)),
    url('../../public/img/gold-bar.svg') left center / min(44vw, 560px) no-repeat,
    #141a1e;
  border: 1px solid rgba(185, 241, 207, 0.22);
}

.fees-copy {
  max-width: 680px;
}

.fees-kicker {
  display: inline-flex;
  color: #b9f1cf;
  background: rgba(185, 241, 207, 0.1);
  border: 1px solid rgba(185, 241, 207, 0.24);
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 13px;
}

.fees-copy h1 {
  margin-top: 18px;
  font-size: clamp(32px, 5vw, 58px);
  line-height: 1.22;
}

.fees-copy p {
  margin-top: 18px !important;
  color: rgba(255, 255, 255, 0.72);
  font-size: 16px;
  line-height: 2;
  max-width: 610px;
}

.fees-panel {
  background: rgba(15, 20, 23, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  padding: 18px;
  backdrop-filter: blur(18px);
}

.fee-row {
  min-height: 84px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.fee-row:last-child {
  border-bottom: 0;
}

.fee-row span {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.fee-row strong {
  color: #b9f1cf;
  font-size: clamp(26px, 4vw, 42px);
}

.fee-row.muted strong {
  color: #fff;
  font-size: 18px;
}

.fees-grid {
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.fees-grid article {
  min-height: 210px;
  border-radius: 8px;
  padding: 24px;
  background: #141a1e;
  border: 1px solid rgba(185, 241, 207, 0.18);
}

.step {
  color: #b9f1cf;
  font-size: 13px;
  letter-spacing: 0;
}

.fees-grid h2 {
  margin-top: 18px;
  font-size: 20px;
}

.fees-grid p {
  margin-top: 10px !important;
  color: rgba(255, 255, 255, 0.68);
  line-height: 1.9;
  font-size: 14px;
}

@media (max-width: 900px) {
  .fees-hero,
  .fees-grid {
    grid-template-columns: 1fr;
  }

  .fees-hero {
    background:
      linear-gradient(180deg, rgba(15, 20, 23, 0.3), rgba(15, 20, 23, 0.94)),
      url('../../public/img/gold-bar.svg') center bottom 28px / 78vw no-repeat,
      #141a1e;
    padding-bottom: 180px;
  }
}
</style>
