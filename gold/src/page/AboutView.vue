<template>
  <section dir="rtl" class="min-h-screen py-10 px-4 md:px-8  text-white">
    <div class="max-w-7xl mx-auto">
      <!-- hero -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div class="space-y-6">
          <h1 class="text-3xl md:text-4xl font-extrabold leading-tight">
            درباره <span class="text-[#b9f1cf]">پرشین‌گلد</span>
          </h1>
          <p class="text-white/80 leading-relaxed">
            پرشین‌گلد بستری امن و شفاف برای خرید، فروش و نگهداری طلای آب‌شده و سکه‌های استاندارد است.
            با تکیه بر فرایندهای شفاف، زیرساخت امن و قیمت‌های لحظه‌ای، سرمایه‌گذاری روی طلا را برای همه ساده و مطمئن می‌کنیم.
          </p>

          <div class="flex flex-wrap gap-3">
            <button @click="goToShop" class="px-5 py-3 rounded-xl bg-[#b9f1cf] text-[#0a1f14] font-semibold hover:brightness-95 transition">
              شروع خرید
            </button>
            <button @click="goToSupport" class="px-5 py-3 rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition">
              تماس با پشتیبانی
            </button>
          </div>

          <!-- quick stats -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
              <div class="text-xs text-white/60">کاربران</div>
              <div class="mt-1 text-xl font-extrabold">+{{ fmt(42000) }}</div>
            </div>
            <div class="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
              <div class="text-xs text-white/60">معاملات موفق</div>
              <div class="mt-1 text-xl font-extrabold">+{{ fmt(310000) }}</div>
            </div>
            <div class="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
              <div class="text-xs text-white/60">پشتیبانی</div>
              <div class="mt-1 text-xl font-extrabold">24/7</div>
            </div>
            <div class="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
              <div class="text-xs text-white/60">تحویل</div>
              <div class="mt-1 text-xl font-extrabold">فیزیکی/خزانه</div>
            </div>
          </div>
        </div>

        <!-- feature grid -->
        <div class="rounded-2xl bg-gradient-to-b from-[#11171a] to-[#0f1417] ring-1 ring-[#334D44]/60 p-6">
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 bg-white/5 ring-1 ring-white/10 rounded-xl flex gap-3">
              <div class="h-12 w-12 grid place-items-center rounded-lg bg-[#b9f1cf] text-[#0a1f14]">
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M3 4h18M3 10h12M3 16h18M3 22h12"/>
                </svg>
              </div>
              <div class="text-sm">
                <div class="text-white/70">قیمت لحظه‌ای</div>
                <div class="mt-1 font-semibold">به‌روزرسانی خودکار بازار</div>
              </div>
            </div>

            <div class="p-4 bg-white/5 ring-1 ring-white/10 rounded-xl flex gap-3">
              <div class="h-12 w-12 grid place-items-center rounded-lg bg-emerald-300 text-[#0a1f14]">
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M12 22s8-4 8-10V7l-8-4-8 4v5c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div class="text-sm">
                <div class="text-white/70">نگهداری امن</div>
                <div class="mt-1 font-semibold">خزانه بانکی و بیمه</div>
              </div>
            </div>

            <div class="p-4 bg-white/5 ring-1 ring-white/10 rounded-xl flex gap-3">
              <div class="h-12 w-12 grid place-items-center rounded-lg bg-cyan-300 text-[#0a1f14]">
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M4 7h16M7 7V5a5 5 0 0 1 10 0v2M6 11h12M8 15h8"/>
                </svg>
              </div>
              <div class="text-sm">
                <div class="text-white/70">شفافیت هزینه</div>
                <div class="mt-1 font-semibold">نمایش جزئیات قبل از خرید</div>
              </div>
            </div>

            <div class="p-4 bg-white/5 ring-1 ring-white/10 rounded-xl flex gap-3">
              <div class="h-12 w-12 grid place-items-center rounded-lg bg-pink-300 text-[#0a1f14]">
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M12 12v.01M4 7h16l-2 11a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4L4 7z"/>
                </svg>
              </div>
              <div class="text-sm">
                <div class="text-white/70">تحویل فیزیکی</div>
                <div class="mt-1 font-semibold">با فاکتور رسمی</div>
              </div>
            </div>
          </div>

          <!-- trust row -->
          <div class="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/60 px-3 py-2 text-center text-xs">
              گواهی اصالت
            </div>
            <div class="rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/60 px-3 py-2 text-center text-xs">
              بیمه سرمایه
            </div>
            <div class="rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/60 px-3 py-2 text-center text-xs">
              گزارش شفاف
            </div>
            <div class="rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/60 px-3 py-2 text-center text-xs">
              پشتیبانی لحظه‌ای
            </div>
          </div>
        </div>
      </div>

      <!-- mission / reasons -->
      <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2 rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
          <h3 class="text-xl font-bold">ماموریت ما</h3>
          <p class="mt-3 text-white/80 leading-relaxed">
            فراهم کردن دسترسی سریع و امن به بازار طلا برای همه. ما به شفافیت، امنیت و تجربه کاربری روان پایبندیم تا
            خرید و فروش طلا بدون پیچیدگی انجام شود.
          </p>

          <h4 class="mt-6 text-lg font-semibold">چرا پرشین‌گلد؟</h4>
          <ul class="mt-3 space-y-2 text-white/80">
            <li class="flex items-start gap-3">
              <span class="mt-1 h-2 w-2 rounded-full bg-[#b9f1cf]"></span>
              قیمت‌های به‌روز و منصفانه
            </li>
            <li class="flex items-start gap-3">
              <span class="mt-1 h-2 w-2 rounded-full bg-[#b9f1cf]"></span>
              پشتیبانی ۲۴/۷ و پیگیری سفارشات
            </li>
            <li class="flex items-start gap-3">
              <span class="mt-1 h-2 w-2 rounded-full bg-[#b9f1cf]"></span>
              انتخاب تحویل فیزیکی یا نگهداری امن در خزانه
            </li>
          </ul>
        </div>

        <div class="rounded-2xl bg-gradient-to-b from-[#11171a] to-[#0f1417] ring-1 ring-[#334D44]/60 p-6">
          <h3 class="text-lg font-bold">اعتماد و مجوزها</h3>
          <div class="mt-3 space-y-3">
            <div class="flex items-center justify-between rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
              <div class="text-sm text-white/70">گواهی اصالت</div>
              <div class="text-sm font-semibold">فاکتور رسمی</div>
            </div>
            <div class="flex items-center justify-between rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
              <div class="text-sm text-white/70">بیمه و خزانه</div>
              <div class="text-sm font-semibold">پوشش کامل</div>
            </div>
            <div class="flex items-center justify-between rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
              <div class="text-sm text-white/70">مطابقت مقررات</div>
              <div class="text-sm font-semibold">KYC/AML</div>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ -->
      <div class="mt-10 rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
        <h3 class="text-xl font-bold">پرسش‌های متداول</h3>
        <div class="mt-4 space-y-3">
          <details class="group rounded-xl bg-white/5 ring-1 ring-white/10 p-4 transition">
            <summary class="flex items-center justify-between cursor-pointer select-none">
              <span class="font-semibold">قیمت‌ها هر چند وقت یک‌بار به‌روز می‌شوند؟</span>
              <svg class="h-5 w-5 text-white/60 transition group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="m7 10 5 5 5-5"/>
              </svg>
            </summary>
            <p class="mt-2 text-white/80">قیمت‌ها به‌صورت لحظه‌ای از منابع معتبر دریافت و در صفحات خرید و نمودارها نمایش داده می‌شوند.</p>
          </details>

          <details class="group rounded-xl bg-white/5 ring-1 ring-white/10 p-4 transition">
            <summary class="flex items-center justify-between cursor-pointer select-none">
              <span class="font-semibold">آیا امکان تحویل فیزیکی وجود دارد؟</span>
              <svg class="h-5 w-5 text-white/60 transition group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="m7 10 5 5 5-5"/>
              </svg>
            </summary>
            <p class="mt-2 text-white/80">بله. پس از ثبت سفارش می‌توانید گزینه تحویل فیزیکی با فاکتور رسمی را انتخاب کنید.</p>
          </details>

          <details class="group rounded-xl bg-white/5 ring-1 ring-white/10 p-4 transition">
            <summary class="flex items-center justify-between cursor-pointer select-none">
              <span class="font-semibold">روش‌های پرداخت چگونه است؟</span>
              <svg class="h-5 w-5 text-white/60 transition group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="m7 10 5 5 5-5"/>
              </svg>
            </summary>
            <p class="mt-2 text-white/80">پرداخت آنلاین از طریق درگاه‌های بانکی و انتقال بانکی پشتیبانی می‌شود.</p>
          </details>
        </div>
      </div>

      <!-- CTA -->
      <div class="mt-10 flex justify-center">
        <button @click="goToShop" class="px-6 py-3 rounded-xl bg-[#b9f1cf] text-[#0a1f14] font-semibold hover:brightness-95 transition">
          ثبت نام
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function goToShop(){ router.push({ path: '/register' }) }
function goToSupport(){ router.push({ path: '/contact' }) }
function fmt(n){ return new Intl.NumberFormat('fa-IR').format(n) }
</script>

<style scoped>
details[open] summary svg { transform: rotate(180deg); }
summary { list-style: none; }
summary::-webkit-details-marker { display: none; }
</style>
