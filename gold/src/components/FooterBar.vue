<template>
  <footer dir="rtl" class="bg-[#0f1417] text-white pt-12">
    <!-- CTA Bar -->
    <div class="max-w-7xl mx-auto px-6">
      <div class="rounded-2xl bg-gradient-to-r from-[#1e2623] to-[#141a1e] ring-1 ring-[#334D44]/60 p-5 sm:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-6">
        <div class="flex-1 text-center md:text-right">
          <h4 class="text-lg sm:text-xl font-extrabold">همراه خبرنامه پرشین‌گلد شوید</h4>
          <p class="text-sm text-white/70 mt-1">به‌روزترین قیمت‌ها، تحلیل‌ها و پیشنهادهای ویژه را دریافت کنید.</p>
        </div>
        <form class="w-full md:w-auto flex gap-2">
          <input
            type="email"
            inputmode="email"
            placeholder="ایمیل شما"
            class="flex-1 md:w-72 rounded-xl bg-[#1e2623] placeholder-white/40 text-white px-3 py-2 ring-1 ring-[#334D44] focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
          <button
            type="submit"
            class="whitespace-nowrap rounded-xl px-4 py-2 font-semibold bg-[#b9f1cf] text-[#0a1f14] hover:brightness-95 transition"
          >
            عضویت
          </button>
        </form>
      </div>
    </div>

    <!-- Main -->
    <div class="max-w-7xl mx-auto px-6 mt-10 grid grid-cols-1 md:grid-cols-12 gap-8">
      <!-- Brand -->
      <div class="md:col-span-5 lg:col-span-4 space-y-4">
        <div class="text-2xl font-extrabold">پرشین‌گلد</div>
        <p class="text-sm text-white/75 leading-7">
          پلتفرم تخصصی خرید و فروش طلای آب‌شده با تکیه بر شفافیت قیمت، کارمزد منصفانه و پشتوانه بانکی.
          تجربه‌ای ساده، امن و سریع برای سرمایه‌گذاری شما.
        </p>

        <!-- Social -->
        <div class="flex flex-wrap items-center gap-2 pt-1">
          <a href="#" class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#1e2623] ring-1 ring-[#334D44]/60 hover:bg-[#22302b] transition" aria-label="Instagram">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </a>
          <a href="#" class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#1e2623] ring-1 ring-[#334D44]/60 hover:bg-[#22302b] transition" aria-label="X">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.3 2H21l-6.5 7.43L22 22h-6.8l-4.44-5.78L5.6 22H3l7.1-8.12L2 2h6.9l4 5.33L18.3 2Zm-1.2 18h1.9L7.1 4H5.2Z"/></svg>
          </a>
          <a href="#" class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#1e2623] ring-1 ring-[#334D44]/60 hover:bg-[#22302b] transition" aria-label="Telegram">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M9.03 15.45 8.9 18.6a1 1 0 0 0 1.58.84l2.28-1.65 3.8 2.8a1 1 0 0 0 1.57-.62L20.97 4.6a1 1 0 0 0-1.34-1.12L3.33 9.77a1 1 0 0 0 .06 1.87l4.86 1.83 8.55-7.53-7.77 9.51Z"/></svg>
          </a>
        </div>

        <!-- App badges -->
        <div class="flex flex-wrap gap-2 pt-2">
          <a href="#" class="rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/60 px-3 py-2 text-xs text-white/90 hover:bg-[#22302b]">دانلود اندروید</a>
          <a href="#" class="rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/60 px-3 py-2 text-xs text-white/90 hover:bg-[#22302b]">نسخه iOS (به‌زودی)</a>
          <a href="#" class="rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/60 px-3 py-2 text-xs text-white/90 hover:bg-[#22302b]">وب‌اپ</a>
        </div>
      </div>

      <!-- Columns -->
      <div class="md:col-span-7 lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
        <!-- Links -->
        <div>
          <h6 class="font-extrabold mb-4">لینک‌های پرکاربرد</h6>
          <ul class="space-y-3 text-sm">
            <li><router-link to="/" class="hover:text-[#b9f1cf]">صفحه اصلی</router-link></li>
            <li><router-link to="/shop" class="hover:text-[#b9f1cf]">محصولات</router-link></li>
            <li><router-link to="/blog" class="hover:text-[#b9f1cf]">مجله پرشین‌گلد</router-link></li>
            <li><router-link to="/faq" class="hover:text-[#b9f1cf]">سوالات متداول</router-link></li>
          </ul>
        </div>

        <!-- Services -->
        <div>
          <h6 class="font-extrabold mb-4">خدمات</h6>
          <ul class="space-y-3 text-sm">
            <li><router-link to="/buy" class="hover:text-[#b9f1cf]">خرید طلای آب‌شده</router-link></li>
            <li><router-link to="/sell" class="hover:text-[#b9f1cf]">فروش طلای شما</router-link></li>
            <li><router-link to="/vault" class="hover:text-[#b9f1cf]">خزانه و نگهداری</router-link></li>
            <li><router-link to="/fees" class="hover:text-[#b9f1cf]">کارمزدها</router-link></li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h6 class="font-extrabold mb-4">تماس با ما</h6>
          <ul class="space-y-3 text-sm text-white/85">
            <li class="flex items-start gap-2"><span class="mt-0.5 inline-block h-2 w-2 rounded-full bg-emerald-400"></span>تهران، خیابان مثال، پلاک ۱۲۳</li>
            <li>۰۲۱-۱۲۳۴۵۶۷۸</li>
            <li>info@persiangold.com</li>
            <li>شنبه تا چهارشنبه ۹–۱۸</li>
          </ul>
        </div>

        <!-- Licenses / Trust -->
        <div>
          <h6 class="font-extrabold mb-4">مجوزها و نمادها</h6>
          <div class="grid grid-cols-2 gap-3">
           <a referrerpolicy='origin' target='_blank' href='https://trustseal.enamad.ir/?id=693241&Code=KcAOX40IbcBqzcrdEdce94xL17BkYVqo'><img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=693241&Code=KcAOX40IbcBqzcrdEdce94xL17BkYVqo' alt='' style='cursor:pointer' code='KcAOX40IbcBqzcrdEdce94xL17BkYVqo'></a>
          
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom -->
    <div class="mt-10 border-t border-[#334D44]/40">
      <div class="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center gap-4 justify-between">
        <ul class="flex flex-wrap gap-4 text-xs text-white/70">
          <li><router-link to="/privacy" class="hover:text-[#b9f1cf]">حریم خصوصی</router-link></li>
          <li><router-link to="/terms" class="hover:text-[#b9f1cf]">قوانین استفاده</router-link></li>
          <li><router-link to="/support" class="hover:text-[#b9f1cf]">پشتیبانی</router-link></li>
          <li><router-link to="/about" class="hover:text-[#b9f1cf]">درباره ما</router-link></li>
        </ul>
        <div class="text-xs text-white/60">© 2025 پرشین‌گلد — تمامی حقوق محفوظ است.</div>
      </div>
    </div>
  </footer>
</template>

<style scoped></style>
