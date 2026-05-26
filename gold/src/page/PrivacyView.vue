<template>
  <div dir="rtl" class="min-h-screen bg-[#0f1417] text-white">
    <!-- Header / Mint-Glass -->
    <header class="sticky top-0 z-20">
      <div
        class="mx-4 md:mx-8 mt-6 rounded-2xl bg-gradient-to-b from-[#1a2220]/90 to-[#12181b]/90
               ring-1 ring-[#334D44]/60 backdrop-blur-xl shadow-xl p-5"
      >
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-xl md:text-3xl font-extrabold">سیاست حفظ حریم خصوصی — پرشین گلد</h1>
            <p class="text-xs md:text-sm text-white/60 mt-1">
              شفافیت در جمع‌آوری، استفاده و نگهداری داده‌های شما؛ با تمرکز بر امنیت و حقوق کاربر.
            </p>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <span
              class="inline-flex items-center gap-2 rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-1.5 text-xs"
              aria-label="آخرین بروزرسانی"
            >
              <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
              آخرین به‌روزرسانی:
              <b class="font-bold text-white">{{ lastUpdated }}</b>
            </span>
            <button
              @click="printPage"
              class="px-3 py-2 rounded-xl bg-emerald-300 text-[#0a1f14] text-sm font-semibold hover:brightness-95"
            >
              چاپ / ذخیره PDF
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="px-4 md:px-8 py-8">
      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <!-- Article -->
        <article
          class="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-xl shadow-xl p-6 md:p-8 leading-relaxed"
        >
          <p class="text-white/80 mb-6">
            حفظ حریم خصوصی شما برای ما اهمیت دارد. این سند توضیح می‌دهد که چه اطلاعاتی جمع‌آوری می‌کنیم، چگونه استفاده می‌کنیم و حقوق شما در رابطه با داده‌ها چیست.
          </p>

          <!-- Sections -->
          <section :id="sec.id" v-for="sec in sections" :key="sec.id" class="mb-8 scroll-mt-28">
            <h2 class="text-lg md:text-xl font-bold text-white mb-3">{{ sec.title }}</h2>

            <!-- body content per id -->
            <template v-if="sec.id === 'collect'">
              <ul class="list-disc list-inside text-white/80 space-y-1">
                <li>اطلاعات حساب کاربری: نام، ایمیل، شماره تلفن، اطلاعات بانکی/کارت (در صورت ثبت توسط کاربر).</li>
                <li>اطلاعات تراکنش: سفارش‌ها، پرداخت‌ها، درخواست‌های برداشت و سابقه خرید/فروش.</li>
                <li>اطلاعات فنی: آدرس آی‌پی، نوع مرورگر، داده‌های خطا و اطلاعات اتصال وب‌ساکت برای نمایش قیمت‌ها.</li>
                <li>اطلاعات ارسالی توسط شما: پیام‌ها در فرم تماس و پشتیبانی، بازخوردها و اسناد آپلود شده.</li>
              </ul>
            </template>

            <template v-else-if="sec.id === 'purpose'">
              <ul class="list-disc list-inside text-white/80 space-y-1">
                <li>پردازش سفارش‌ها، انجام پرداخت‌ها و تسویه‌ها.</li>
                <li>ارسال اعلان‌های مهم و پاسخ به درخواست‌های پشتیبانی.</li>
                <li>نمایش قیمت‌های زنده طلا و به‌روزرسانی نمودارها.</li>
                <li>افزایش امنیت سرویس، جلوگیری از تقلب و تحلیل عملکرد سرویس برای بهبود تجربه کاربری.</li>
              </ul>
            </template>

            <template v-else-if="sec.id === 'law-share'">
              <p class="text-white/80">
                پردازش برخی اطلاعات برای اجرای قرارداد بین شما و پرشین گلد (مانند پرداخت‌ها و تحویل کالا) ضروری است.
                ما اطلاعات شما را بدون اجازه شما به اشخاص ثالث تجاری نمی‌فروشیم. ممکن است اطلاعات با سرویس‌دهندگان پرداخت،
                بانک‌ها یا شرکت‌های حمل‌ونقل به‌منظور اجرای سفارش‌ها به اشتراک گذاشته شود که این شرکت‌ها موظف به رعایت حریم خصوصی هستند.
              </p>
            </template>

            <template v-else-if="sec.id === 'cookies'">
              <p class="text-white/80">
                وب‌سایت از کوکی‌ها و فناوری‌های مشابه برای بهبود تجربه کاربری، ذخیره تنظیمات و تحلیل استفاده می‌کند.
                شما می‌توانید از طریق تنظیمات مرورگر خود کوکی‌ها را مدیریت یا غیرفعال کنید، اما غیرفعال‌سازی ممکن است برخی قابلیت‌ها را محدود کند.
              </p>
            </template>

            <template v-else-if="sec.id === 'retention-security'">
              <p class="text-white/80">
                ما تلاش می‌کنیم تا اطلاعات شما را به مدت لازم برای ارائه خدمات یا تا زمانی که توسط قانون ملزم هستیم نگهداری کنیم.
                برای محافظت از داده‌ها از پروتکل‌های امنیتی استاندارد، رمزنگاری (TLS)، دسترسی محدود و کنترل‌های داخلی استفاده می‌کنیم.
              </p>
            </template>

            <template v-else-if="sec.id === 'your-rights'">
              <ul class="list-disc list-inside text-white/80 space-y-1">
                <li>دسترسی به اطلاعات شخصی خود و درخواست نسخه از داده‌ها.</li>
                <li>درخواست اصلاح یا تکمیل اطلاعات نادرست.</li>
                <li>درخواست حذف اطلاعات در مواردی که قانونی باشد.</li>
                <li>محدود کردن یا اعتراض به پردازش در شرایط مشخص.</li>
              </ul>
            </template>

            <template v-else-if="sec.id === 'intl-transfer'">
              <p class="text-white/80">
                در صورت استفاده از سرویس‌های خارجی ممکن است داده‌ها به سرورهایی در خارج از کشور منتقل شوند.
                در چنین مواردی تدابیر لازم برای حفاظت از داده‌ها اتخاذ می‌شود.
              </p>
            </template>

            <template v-else-if="sec.id === 'changes'">
              <p class="text-white/80">
                این سند ممکن است از زمان به زمان به‌روزرسانی شود. در صورت تغییرات اساسی، اطلاع‌رسانی مناسب از طریق وب‌سایت یا ایمیل انجام خواهد شد.
              </p>
            </template>

            <template v-else-if="sec.id === 'contact'">
              <p class="text-white/80">
                اگر سوال یا درخواست مرتبط با حریم خصوصی دارید، لطفاً از طریق صفحه تماس با ما یا ایمیل‌های زیر اقدام نمایید:
              </p>
              <div class="mt-3 text-white/90">
                <div>ایمیل: <span class="font-medium text-white">privacy@persiangold.example</span></div>
                <div class="mt-1">تلفن: <span class="font-medium text-white">021-00000000</span></div>
              </div>
            </template>

            <!-- Section divider -->
            <div class="mt-6 h-px bg-white/10"></div>
          </section>

          <!-- Footer note -->
          <div class="text-xs text-white/60 flex items-center justify-between flex-wrap gap-3">
            <span>© کلیه حقوق برای «پرشین گلد» محفوظ است.</span>
            <button
              @click="scrollTop"
              class="px-3 py-1.5 rounded-lg bg-white/5 ring-1 ring-white/10 hover:bg-white/10"
              aria-label="بازگشت به بالا"
            >
              بازگشت به بالا ↑
            </button>
          </div>
        </article>

        <!-- Sidebar TOC -->
        <aside class="space-y-4">
          <div class="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-xl shadow-xl p-5 sticky top-28">
            <h3 class="text-sm font-bold text-white/80 mb-3">فهرست مطالب</h3>
            <nav class="space-y-1.5">
              <a
                v-for="sec in sections"
                :key="sec.id"
                :href="`#${sec.id}`"
                class="block text-sm rounded-lg px-3 py-2 hover:bg-white/5 ring-1 ring-transparent hover:ring-white/10 text-white/80"
              >
                {{ sec.title }}
              </a>
            </nav>
          </div>

          <div class="rounded-2xl bg-[#1e2623] ring-1 ring-[#334D44]/60 backdrop-blur-xl shadow-xl p-5">
            <h3 class="text-sm font-bold text-white/80 mb-2">سوالات پرتکرار</h3>
            <ul class="text-sm text-white/80 space-y-2">
              <li>چگونه داده‌هایم را حذف کنم؟ — از بخش «تماس با ما» درخواست دهید.</li>
              <li>کوکی‌ها را کجا مدیریت کنم؟ — تنظیمات مرورگر شما.</li>
              <li>اطلاعات با چه کسانی به‌اشتراک گذاشته می‌شود؟ — فقط ارائه‌دهندگان ضروری.</li>
            </ul>
          </div>
        </aside>
      </div>
    </main>

    <!-- Floating Back-to-top -->
    <button
      v-show="showJump"
      @click="scrollTop"
      class="fixed bottom-6 left-6 px-3 py-2 rounded-xl bg-emerald-300 text-[#0a1f14] font-semibold shadow-xl ring-1 ring-emerald-200/60 hover:brightness-95 transition"
      aria-label="بازگشت سریع به بالا"
    >
      ↑
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const lastUpdated = '1404/05/22'

const sections = [
  { id: 'collect', title: '۱) چه اطلاعاتی جمع‌آوری می‌کنیم' },
  { id: 'purpose', title: '۲) هدف استفاده از اطلاعات' },
  { id: 'law-share', title: '۳) مبنای قانونی و اشتراک‌گذاری' },
  { id: 'cookies', title: '۴) کوکی‌ها و فناوری‌های مشابه' },
  { id: 'retention-security', title: '۵) نگهداری و امن‌سازی داده‌ها' },
  { id: 'your-rights', title: '۶) حقوق شما' },
  { id: 'intl-transfer', title: '۷) انتقال بین‌المللی داده' },
  { id: 'changes', title: '۸) تغییرات در این سیاست' },
  { id: 'contact', title: '۹) تماس' }
]

const showJump = ref(false)

function onScroll () {
  showJump.value = window.scrollY > 400
}
function scrollTop () {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function printPage () {
  window.print()
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
::selection { background: rgba(185, 241, 207, 0.25); }
html { scroll-behavior: smooth; }
@media print {
  header, aside, .fixed { display: none !important; }
  main { padding: 0 !important; }
  article { box-shadow: none !important; background: transparent !important; ring: 0 !important; }
}
</style>
