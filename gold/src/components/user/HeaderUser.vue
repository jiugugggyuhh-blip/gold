<template>
  <header dir="rtl" class="bg-[#0f1417] text-white">
    <div class="max-w-7xl mx-auto px-4 py-4 mt-0 md:mt-15">
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="text-xl md:text-2xl font-extrabold tracking-tighter">maxigold</div>
          <span
            class="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#1e2623] px-3 py-1 text-xs ring-1 ring-[#334D44]/60"
          >
            <span
              class="h-2 w-2 rounded-full animate-pulse"
              :class="connected ? 'bg-emerald-400' : 'bg-yellow-300'"
            ></span>
            <span>{{ connected ? "اتصال زنده" : "در حال اتصال…" }}</span>
          </span>
        </div>

        <div class="flex items-center gap-2">
          <div class="relative" ref="notifRef">
            <button
              @click="toggleNotif"
              class="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/60 hover:bg-[#22302b] transition text-white/80 hover:text-white"
            >
              <i class="fa-solid fa-bell text-lg"></i>
              
              <span
                v-if="unreadCount > 0"
                class="absolute -top-1 -left-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#b9f1cf] text-[#0a1f14] text-[10px] font-bold flex items-center justify-center shadow-sm"
              >
                {{ unreadCount }}
              </span>
            </button>

            <transition name="fade">
              <div
                v-if="notifOpen"
                class="absolute left-0 mt-2 w-80 max-w-[90vw] z-50 rounded-2xl bg-[#1a2220] border border-[#334D44]/60 shadow-2xl p-3"
              >
                <div class="flex items-center justify-between px-1 mb-2 border-b border-white/5 pb-2">
                  <div class="text-sm font-bold flex items-center gap-2">
                    <i class="fa-solid fa-bell text-[#b9f1cf]"></i>
                    اعلان‌ها
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      class="text-[10px] px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition"
                      @click="markAllRead"
                    >
                      خواندم
                    </button>
                    <router-link
                      to="/user/notification"
                      @click="notifOpen = false"
                      class="text-[10px] text-[#b9f1cf] hover:underline"
                    >
                      آرشیو
                    </router-link>
                  </div>
                </div>
                <div class="space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  <div
                    v-for="n in notifications"
                    :key="n._id || n.id"
                    class="rounded-xl p-3 border transition-colors"
                    :class="[
                      n.read
                        ? 'bg-transparent border-white/5 opacity-70'
                        : 'bg-[#1e2623] border-[#334D44]/60',
                    ]"
                  >
                    <div class="flex items-center justify-between mb-1">
                      <div class="text-sm font-semibold line-clamp-1 text-[#b9f1cf]">
                        {{ n.title || "پیام سیستم" }}
                      </div>
                      <div class="text-[9px] text-white/40 font-mono">
                        {{ formatTime(n.createdAt) }}
                      </div>
                    </div>
                    <div
                      class="text-xs text-white/70 line-clamp-2 leading-relaxed"
                      v-html="(n.text || '').replace(/\n/g, '<br/>')"
                    ></div>
                  </div>
                  <div
                    v-if="notifications.length === 0"
                    class="text-center py-4 text-xs text-white/40 flex flex-col items-center gap-2"
                  >
                    <i class="fa-regular fa-folder-open text-2xl"></i>
                    <span>اعلانی موجود نیست</span>
                  </div>
                </div>
              </div>
            </transition>
          </div>

          <div class="relative">
            <button
              @click="menuOpen = true"
              class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/60 hover:bg-[#22302b] transition text-white/80 hover:text-white"
            >
              <i class="fa-solid fa-bars-staggered text-lg"></i>
            </button>
          </div>

          <transition name="fade">
            <div
              v-if="menuOpen"
              class="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[80]"
              @click="menuOpen = false"
            ></div>
          </transition>

          <transition name="slide-right">
            <div
              v-if="menuOpen"
              class="fixed right-0 top-0 h-full w-72 max-w-[85vw] bg-[#141a1e] border-l border-[#334D44]/60 z-[90] p-4 overflow-y-auto custom-scrollbar shadow-2xl"
            >
              <div class="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div class="text-lg font-bold flex items-center gap-2">
                  <i class="fa-solid fa-layer-group text-[#b9f1cf]"></i>
                  منوی کاربری
                </div>
                <button
                  @click="menuOpen = false"
                  class="h-8 w-8 grid place-items-center rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition"
                >
                  <i class="fa-solid fa-xmark text-lg"></i>
                </button>
              </div>

              <div class="space-y-1">
                <router-link
                  to="/user"
                  @click="menuOpen = false"
                  class="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition group"
                  active-class="bg-white/10 text-[#b9f1cf]"
                >
                  <i class="fa-solid fa-house w-5 text-center group-hover:scale-110 transition-transform"></i>
                  <span>خانه</span>
                </router-link>

                <div>
                  <button
                    @click="toggleDropdown('profile')"
                    class="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-white/5 transition group"
                    :class="activeDropdown === 'profile' ? 'bg-white/5 text-[#b9f1cf]' : ''"
                  >
                    <div class="flex items-center gap-3">
                      <i class="fa-solid fa-circle-user w-5 text-center group-hover:scale-110 transition-transform"></i>
                      <span>حساب کاربری</span>
                    </div>
                    <i 
                      class="fa-solid fa-chevron-down text-xs transition-transform duration-300"
                      :class="activeDropdown === 'profile' ? 'rotate-180' : ''"
                    ></i>
                  </button>
                  <transition name="dropdown">
                    <div v-if="activeDropdown === 'profile'" class="pr-9 overflow-hidden">
                      <div class="py-1 space-y-1 border-r border-white/10 mr-2 pr-2">
                        <router-link to="/user/profile" @click="menuOpen=false" class="block text-sm text-white/70 hover:text-white py-1.5 hover:translate-x-[-4px] transition-transform">پروفایل من</router-link>
                        <router-link to="/user/editprofile" @click="menuOpen=false" class="block text-sm text-white/70 hover:text-white py-1.5 hover:translate-x-[-4px] transition-transform">ویرایش اطلاعات</router-link>
                        <router-link to="/user/verify" @click="menuOpen=false" class="block text-sm text-white/70 hover:text-white py-1.5 hover:translate-x-[-4px] transition-transform">احراز هویت</router-link>
                        <router-link to="/user/notification" @click="menuOpen=false" class="block text-sm text-white/70 hover:text-white py-1.5 hover:translate-x-[-4px] transition-transform">پیام‌ها</router-link>
                      </div>
                    </div>
                  </transition>
                </div>

                <div>
                  <button
                    @click="toggleDropdown('wallet')"
                    class="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-white/5 transition group"
                    :class="activeDropdown === 'wallet' ? 'bg-white/5 text-[#b9f1cf]' : ''"
                  >
                    <div class="flex items-center gap-3">
                      <i class="fa-solid fa-wallet w-5 text-center group-hover:scale-110 transition-transform"></i>
                      <span>کیف پول و دارایی</span>
                    </div>
                    <i 
                      class="fa-solid fa-chevron-down text-xs transition-transform duration-300"
                      :class="activeDropdown === 'wallet' ? 'rotate-180' : ''"
                    ></i>
                  </button>
                  <transition name="dropdown">
                    <div v-if="activeDropdown === 'wallet'" class="pr-9 overflow-hidden">
                       <div class="py-1 space-y-1 border-r border-white/10 mr-2 pr-2">
                        <router-link to="/user/wallet" @click="menuOpen=false" class="block text-sm text-white/70 hover:text-white py-1.5 hover:translate-x-[-4px] transition-transform">کیف پول تومانی</router-link>
                        <router-link to="/user/wallet/crypto" @click="menuOpen=false" class="block text-sm text-white/70 hover:text-white py-1.5 hover:translate-x-[-4px] transition-transform">کیف پول ارزی</router-link>
                        <router-link to="/user/assets" @click="menuOpen=false" class="block text-sm text-white/70 hover:text-white py-1.5 hover:translate-x-[-4px] transition-transform">دارایی‌های فیزیکی</router-link>
                        <router-link to="/user/card" @click="menuOpen=false" class="block text-sm text-white/70 hover:text-white py-1.5 hover:translate-x-[-4px] transition-transform">کارت بانکی</router-link>
                        <router-link to="/user/withdrawal" @click="menuOpen=false" class="block text-sm text-white/70 hover:text-white py-1.5 hover:translate-x-[-4px] transition-transform">درخواست تسویه</router-link>
                      </div>
                    </div>
                  </transition>
                </div>

                <div>
                  <button
                    @click="toggleDropdown('trade')"
                    class="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-white/5 transition group"
                    :class="activeDropdown === 'trade' ? 'bg-white/5 text-[#b9f1cf]' : ''"
                  >
                    <div class="flex items-center gap-3">
                      <i class="fa-solid fa-chart-line w-5 text-center group-hover:scale-110 transition-transform"></i>
                      <span>بازار و خدمات</span>
                    </div>
                    <i 
                      class="fa-solid fa-chevron-down text-xs transition-transform duration-300"
                      :class="activeDropdown === 'trade' ? 'rotate-180' : ''"
                    ></i>
                  </button>
                  <transition name="dropdown">
                    <div v-if="activeDropdown === 'trade'" class="pr-9 overflow-hidden">
                       <div class="py-1 space-y-1 border-r border-white/10 mr-2 pr-2">
                        <router-link to="/user/gold" @click="menuOpen=false" class="block text-sm text-white/70 hover:text-white py-1.5 hover:translate-x-[-4px] transition-transform">معامله طلا</router-link>
                        <router-link to="/user/silver" @click="menuOpen=false" class="block text-sm text-white/70 hover:text-white py-1.5 hover:translate-x-[-4px] transition-transform">معامله نقره</router-link>
                        <router-link to="/user/trading-bot" @click="menuOpen=false" class="block text-sm text-yellow-400 hover:text-yellow-300 py-1.5 hover:translate-x-[-4px] transition-transform font-semibold">
                          <i class="fa-solid fa-robot ml-1"></i> ربات معامله گر
                        </router-link>
                        <router-link to="/user/loan" @click="menuOpen=false" class="block text-sm text-white/70 hover:text-white py-1.5 hover:translate-x-[-4px] transition-transform">درخواست وام</router-link>
                        <router-link to="/user/pledge" @click="menuOpen=false" class="block text-sm text-white/70 hover:text-white py-1.5 hover:translate-x-[-4px] transition-transform">ضمانت و رهن</router-link>
                      </div>
                    </div>
                  </transition>
                </div>

                <div>
                  <button
                    @click="toggleDropdown('support')"
                    class="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-white/5 transition group"
                    :class="activeDropdown === 'support' ? 'bg-white/5 text-[#b9f1cf]' : ''"
                  >
                    <div class="flex items-center gap-3">
                      <i class="fa-solid fa-headset w-5 text-center group-hover:scale-110 transition-transform"></i>
                      <span>پشتیبانی</span>
                    </div>
                    <i 
                      class="fa-solid fa-chevron-down text-xs transition-transform duration-300"
                      :class="activeDropdown === 'support' ? 'rotate-180' : ''"
                    ></i>
                  </button>
                  <transition name="dropdown">
                    <div v-if="activeDropdown === 'support'" class="pr-9 overflow-hidden">
                       <div class="py-1 space-y-1 border-r border-white/10 mr-2 pr-2">
                        <router-link to="/user/support" @click="menuOpen=false" class="block text-sm text-white/70 hover:text-white py-1.5 hover:translate-x-[-4px] transition-transform">مرکز پشتیبانی</router-link>
                        <router-link to="/user/sendsupport" @click="menuOpen=false" class="block text-sm text-white/70 hover:text-white py-1.5 hover:translate-x-[-4px] transition-transform">ارسال تیکت</router-link>
                        <router-link to="/user/supportmessages" @click="menuOpen=false" class="block text-sm text-white/70 hover:text-white py-1.5 hover:translate-x-[-4px] transition-transform">پیام‌های من</router-link>
                      </div>
                    </div>
                  </transition>
                </div>

                <router-link
                  to="/user/history"
                  @click="menuOpen = false"
                  class="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition group"
                  active-class="bg-white/10 text-[#b9f1cf]"
                >
                  <i class="fa-solid fa-clock-rotate-left w-5 text-center group-hover:scale-110 transition-transform"></i>
                  <span>تاریخچه سفارشات</span>
                </router-link>

                <router-link
                  to="/user/transfer"
                  @click="menuOpen = false"
                  class="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition group"
                  active-class="bg-white/10 text-[#b9f1cf]"
                >
                  <i class="fa-solid fa-money-bill-wave w-5 text-center group-hover:scale-110 transition-transform"></i>
                  <span>درخواست انتقال </span>
                </router-link>

                <router-link
                  to="/user/ref"
                  @click="menuOpen = false"
                  class="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition group"
                  active-class="bg-white/10 text-[#b9f1cf]"
                >
                  <i class="fa-solid fa-users w-5 text-center group-hover:scale-110 transition-transform"></i>
                  <span>دعوت از دوستان</span>
                </router-link>

                <router-link
                  to="/user/game"
                  @click="menuOpen = false"
                  class="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition group"
                  active-class="bg-white/10 text-[#b9f1cf]"
                >
                  <i class="fa-solid fa-gamepad w-5 text-center group-hover:scale-110 transition-transform"></i>
                  <span>بازی و جایزه</span>
                </router-link>
                <router-link
                  to="/user/charity"
                  @click="menuOpen = false"
                  class="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition group"
                  active-class="bg-white/10 text-[#b9f1cf]"
                >
                  <i class="fa-solid fa-gift w-5 text-center group-hover:scale-110 transition-transform"></i>
                  <span> خیریه</span>
                </router-link>

                <button
                  class="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-500/10 text-red-400 mt-6 transition group"
                >
                  <i class="fa-solid fa-right-from-bracket w-5 text-center group-hover:scale-110 transition-transform"></i>
                  <span>خروج از حساب</span>
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <div class="mt-4 grid grid-cols-12 gap-3">
        <div class="col-span-12 lg:col-span-8 grid grid-cols-12 gap-3">
          <div
            class="col-span-12 md:col-span-6 rounded-2xl p-4 bg-[#141a1e] ring-1 ring-[#334D44]/60 relative overflow-hidden flex flex-col justify-between"
          >
            <div class="flex items-center justify-between mb-4 z-10">
              <div class="text-sm font-bold text-white flex items-center gap-2">
                <i class="fa-solid fa-wallet text-[#b9f1cf]"></i>
                دارایی‌های من
              </div>
              <router-link
                to="/user/wallet"
                class="text-[10px] bg-white/5 px-2 py-1 rounded hover:bg-white/10 transition text-[#b9f1cf]"
              >
                مدیریت
              </router-link>
            </div>

            <div class="space-y-3 z-10">
              <div class="flex items-center justify-between p-2.5 rounded-xl bg-white/5 ring-1 ring-white/5 hover:bg-white/10 transition">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-400">
                     <i class="fa-solid fa-coins"></i>
                  </div>
                  <div class="text-xs text-white/70">موجودی طلا</div>
                </div>
                <div class="font-bold text-sm text-yellow-400 tracking-wider">
                  {{ balanceGramDisplay }} <span class="text-[10px] text-white/50">گرم</span>
                </div>
              </div>

              <div class="flex items-center justify-between p-2.5 rounded-xl bg-white/5 ring-1 ring-white/5 hover:bg-white/10 transition">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-slate-400/10 flex items-center justify-center text-slate-300">
                     <i class="fa-solid fa-layer-group"></i>
                  </div>
                  <div class="text-xs text-white/70">موجودی نقره</div>
                </div>
                <div class="font-bold text-sm text-slate-300 tracking-wider">
                  {{ balanceSilverDisplay }} <span class="text-[10px] text-white/50">گرم</span>
                </div>
              </div>

              <div class="flex items-center justify-between p-2.5 rounded-xl bg-white/5 ring-1 ring-white/5 hover:bg-white/10 transition">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                     <i class="fa-solid fa-wallet"></i>
                  </div>
                  <div class="text-xs text-white/70">کیف پول</div>
                </div>
                <div class="font-bold text-sm text-emerald-400 tracking-wider">
                  {{ balanceTomanWalletDisplay }} <span class="text-[10px] text-white/50">تومان</span>
                </div>
              </div>
            </div>

             <i class="fa-solid fa-sack-dollar absolute -left-6 -bottom-6 text-[100px] text-white/5 rotate-12 z-0"></i>
          </div>

          <div
            class="col-span-12 md:col-span-6 rounded-2xl p-5 bg-[#141a1e] ring-1 ring-[#334D44]/60 relative overflow-hidden flex flex-col justify-center"
          >
          
             
            <div class="relative z-10">
              <div class="flex items-center justify-between">
                <div class="text-sm text-white/70 flex items-center gap-2">
                   <i class="fa-solid fa-tag text-[#b9f1cf]"></i>
                   مظنه ۱۸ عیار
                </div>
                <span
                  class="inline-flex items-center gap-1.5 text-xs rounded-lg px-2.5 py-1 font-medium"
                  :class="
                    trend === 'up'
                      ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40'
                      : trend === 'down'
                      ? 'bg-red-500/20 text-red-300 ring-1 ring-red-500/40'
                      : 'bg-white/10 text-white/70 ring-1 ring-white/20'
                  "
                >
                  <i 
                    class="fa-solid"
                    :class="trend === 'up' ? 'fa-arrow-trend-up' : trend === 'down' ? 'fa-arrow-trend-down' : 'fa-minus'"
                  ></i>
                  <span>{{ trendLabel }}</span>
                </span>
              </div>
              <div class="mt-6">
                <div class="text-3xl font-extrabold tracking-tight">
                  <span v-if="goldPriceNumber > 0">{{ goldPriceDisplay }}</span>
                  <span
                    v-else
                    class="inline-flex h-9 w-40 animate-pulse rounded bg-white/10"
                  ></span>
                </div>
                <div class="text-xs text-white/60 mt-1 flex items-center gap-1">
                  <i class="fa-regular fa-clock"></i>
                  بروزرسانی: {{ lastUpdateLabel }}
                </div>
              </div>
              
              <div class="mt-5 grid grid-cols-2 gap-3">
                 <router-link
                  to="/user/gold"
                  class="flex items-center justify-center gap-2 rounded-xl bg-[#b9f1cf] px-3 py-2 text-[#0a1f14] font-bold hover:bg-[#8eeeb3] transition text-sm"
                >
                  <i class="fa-solid fa-plus"></i> خرید طلا
                </router-link>
                <router-link
                  to="/user/gold"
                  class="flex items-center justify-center gap-2 rounded-xl bg-[#1e2623] px-3 py-2 text-white ring-1 ring-[#334D44]/60 hover:bg-[#252f2b] transition text-sm"
                >
                  <i class="fa-solid fa-minus"></i> فروش طلا
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <div
          class="col-span-12 lg:col-span-4 rounded-2xl bg-[#141a1e] ring-1 ring-[#334D44]/60 p-5 flex flex-col justify-center"
        >
          <div class="grid grid-cols-4 gap-4 text-center">
            <router-link to="/user/wallet" class="flex flex-col items-center gap-2 group">
              <div
                class="w-12 h-12 rounded-2xl bg-white/5 ring-1 ring-white/10 grid place-items-center text-[#b9f1cf] group-hover:bg-[#b9f1cf] group-hover:text-[#0a1f14] transition-all duration-300 shadow-lg group-hover:shadow-[#b9f1cf]/20"
              >
                <i class="fa-solid fa-circle-plus text-xl"></i>
              </div>
              <span class="text-[11px] text-white/80 group-hover:text-white transition">واریز</span>
            </router-link>

            <router-link to="/user/withdrawal" class="flex flex-col items-center gap-2 group">
              <div
                class="w-12 h-12 rounded-2xl bg-white/5 ring-1 ring-white/10 grid place-items-center text-[#b9f1cf] group-hover:bg-[#b9f1cf] group-hover:text-[#0a1f14] transition-all duration-300"
              >
                <i class="fa-solid fa-money-bill text-xl"></i>
              </div>
              <span class="text-[11px] text-white/80 group-hover:text-white transition">برداشت</span>
            </router-link>

            <router-link to="/user/loan" class="flex flex-col items-center gap-2 group">
              <div
                class="w-12 h-12 rounded-2xl bg-white/5 ring-1 ring-white/10 grid place-items-center text-[#b9f1cf] group-hover:bg-[#b9f1cf] group-hover:text-[#0a1f14] transition-all duration-300"
              >
                <i class="fa-solid fa-hand-holding-dollar text-xl"></i>
              </div>
              <span class="text-[11px] text-white/80 group-hover:text-white transition">وام</span>
            </router-link>

            <router-link to="/user/transfer" class="flex flex-col items-center gap-2 group cursor-pointer">
              <div
                class="w-12 h-12 rounded-2xl bg-white/5 ring-1 ring-white/10 grid place-items-center text-[#b9f1cf] group-hover:bg-[#b9f1cf] group-hover:text-[#0a1f14] transition-all duration-300"
              >
                <i class="fa-solid fa-money-bill text-xl"></i>
              </div>
              <span class="text-[11px] text-white/80 group-hover:text-white transition">انتقال</span>
            </router-link>
          </div>
          
           <div class="grid grid-cols-4 gap-4 text-center mt-5 pt-5 border-t border-white/5">
             <router-link to="/user/pledge" class="flex flex-col items-center gap-2 group relative">
              <div
                class="w-12 h-12 rounded-2xl bg-white/5 ring-1 ring-white/10 grid place-items-center text-[#b9f1cf] group-hover:bg-[#b9f1cf] group-hover:text-[#0a1f14] transition-all duration-300"
              >
                <i class="fa-solid fa-file-contract text-xl"></i>
              </div>
               <span class="absolute -top-1 right-0 flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
              </span>
              <span class="text-[11px] text-white/80 group-hover:text-white transition">ضمانت</span>
            </router-link>

             <router-link to="/user/assets" class="flex flex-col items-center gap-2 group">
              <div
                class="w-12 h-12 rounded-2xl bg-white/5 ring-1 ring-white/10 grid place-items-center text-[#b9f1cf] group-hover:bg-[#b9f1cf] group-hover:text-[#0a1f14] transition-all duration-300"
              >
                <i class="fa-solid fa-box-open text-xl"></i>
              </div>
              <span class="text-[11px] text-white/80 group-hover:text-white transition">تحویل</span>
            </router-link>

             <router-link to="/user/support" class="flex flex-col items-center gap-2 group">
              <div
                class="w-12 h-12 rounded-2xl bg-white/5 ring-1 ring-white/10 grid place-items-center text-[#b9f1cf] group-hover:bg-[#b9f1cf] group-hover:text-[#0a1f14] transition-all duration-300"
              >
                <i class="fa-solid fa-headset text-xl"></i>
              </div>
              <span class="text-[11px] text-white/80 group-hover:text-white transition">پشتیبانی</span>
            </router-link>

             <router-link to="/user/game" class="flex flex-col items-center gap-2 group">
              <div
                class="w-12 h-12 rounded-2xl bg-white/5 ring-1 ring-white/10 grid place-items-center text-[#b9f1cf] group-hover:bg-[#b9f1cf] group-hover:text-[#0a1f14] transition-all duration-300"
              >
             <svg 
  xmlns="http://www.w3.org/2000/svg" 
  class="w-6 h-6 text-[#b9f1cf]"
  viewBox="0 0 24 24" 
  fill="none" 
  stroke="currentColor" 
  stroke-width="2" 
  stroke-linecap="round" 
  stroke-linejoin="round"
>
  <circle cx="12" cy="12" r="10"></circle>
  <path d="M12 2v20"></path>
  <path d="M2 12h20"></path>
  <path d="m4.93 4.93 14.14 14.14"></path>
  <path d="m19.07 4.93-14.14 14.14"></path>
  <circle cx="12" cy="12" r="2" fill="currentColor"></circle>
</svg>
              </div>
              <span class="text-[11px] text-white/80 group-hover:text-white transition">گردونه</span>
            </router-link>

           </div>
        </div>
      </div>

      <div
        class="mt-4 rounded-xl bg-[#141a1e] ring-1 ring-[#334D44]/60 overflow-hidden flex items-center"
      >
        <div
          class="flex items-center gap-2 px-3 py-2 text-xs text-white/70 bg-white/5 shrink-0 z-10 shadow-lg"
        >
          <i class="fa-solid fa-bullhorn text-[#b9f1cf] animate-pulse"></i>
        </div>
        <div class="relative overflow-hidden w-full h-8 flex items-center">
          <div class="flex">
            <div class="ticker-track text-xs">
              <span class="mx-6 flex items-center gap-1">
                 <i class="fa-regular fa-gem text-[#b9f1cf]"></i>
                 طلای ۱۸: <b class="text-white">{{ goldPriceNumber ? nfmt(goldPriceNumber) : "—" }}</b>
              </span>
              <span class="mx-6 flex items-center gap-1">
                 روند: <b :class="trend === 'up' ? 'text-emerald-400' : 'text-red-400'">{{ trendLabel }}</b>
              </span>
              <span class="mx-6 flex items-center gap-1">
                 <i class="fa-regular fa-clock"></i>
                 {{ lastUpdateLabel }}
              </span>
            </div>
             <div class="ticker-track text-xs" aria-hidden="true">
              <span class="mx-6 flex items-center gap-1">
                 <i class="fa-regular fa-gem text-[#b9f1cf]"></i>
                 طلای ۱۸: <b class="text-white">{{ goldPriceNumber ? nfmt(goldPriceNumber) : "—" }}</b>
              </span>
              <span class="mx-6 flex items-center gap-1">
                 روند: <b :class="trend === 'up' ? 'text-emerald-400' : 'text-red-400'">{{ trendLabel }}</b>
              </span>
              <span class="mx-6 flex items-center gap-1">
                 <i class="fa-regular fa-clock"></i>
                 {{ lastUpdateLabel }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import axios from "axios";
import { io } from "socket.io-client";

const WS_URL = process.env.VUE_APP_API_WS || "";
const API_URL = process.env.VUE_APP_API_URL || "";

/* ---------------------- منو و ناوبری ---------------------- */
const menuOpen = ref(false);
const activeDropdown = ref(null);

function toggleDropdown(name) {
  if (activeDropdown.value === name) {
    activeDropdown.value = null;
  } else {
    activeDropdown.value = name;
  }
}
/* ------------------------------------------------------- */

const connected = ref(false);
const goldPrice = ref(null);
const prevPrice = ref(null);
const lastUpdate = ref(null);

// موجودی‌ها
const balanceGram = ref(0);
const silverBalance = ref(0);
const tomanBalance = ref(0);

const notifications = ref([]);
const notifOpen = ref(false);
const notifRef = ref(null);
let notifTimer = null;

function toggleNotif() {
  notifOpen.value = !notifOpen.value;
}

function markAllRead() {
  notifications.value = notifications.value.map((n) => ({ ...n, read: true }));
}
const unreadCount = computed(
  () => notifications.value.filter((n) => !n.read).length
);
function onClickOutside(e) {
  if (notifOpen.value && notifRef.value && !notifRef.value.contains(e.target))
    notifOpen.value = false;
}
function onEscape(e) {
  if (e.key === "Escape") {
    notifOpen.value = false;
    menuOpen.value = false;
  }
}

// تابع دریافت اطلاعات پروفایل کاربر
async function fetchUserData() {
  try {
    // طبق درخواست شما به این مسیر ریکوئست میزنیم
    const response = await axios.get(`${API_URL}/user/profile`);
    const userData = response.data?.user;

    if (userData) {
      // مقداردهی از ریسپانس دیتابیس
      balanceGram.value = userData.gold || 0;
      silverBalance.value = userData.silver || 0;
      tomanBalance.value = userData.toman || 0;
    }
  } catch (error) {
    console.error("خطا در دریافت اطلاعات کاربر:", error);
  }
}

async function fetchNotifications() {
  try {
    const r = await axios.get(`${API_URL}/user/getnotif`);
    const arr = Array.isArray(r.data?.data)
      ? r.data.data
      : Array.isArray(r.data)
      ? r.data
      : [];
    notifications.value = arr.map((x) => ({
      _id: x._id || cryptoRandom(),
      title: x.title || "اعلان سیستم",
      text: x.text || "",
      createdAt: x.createdAt || x.date || new Date().toISOString(),
      read: !!x.read,
    }));
  } catch {
    notifications.value = [];
  }
}
function cryptoRandom() {
  return Math.random().toString(36).slice(2);
}

let socket;
function find18k(items) {
  return items.find(
    (i) =>
      (i?.name || "").includes("طلای 18 عیار") ||
      (i?.name || "").includes("گرم طلای 18 عیار")
  );
}
function parsePrice(v) {
  if (v == null) return null;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  let s = String(v).trim();
  const p = "۰۱۲۳۴۵۶۷۸۹",
    a = "٠١٢٣٤٥٦٧٨٩";
  s = s
    .replace(/[۰-۹]/g, (ch) => p.indexOf(ch))
    .replace(/[٠-٩]/g, (ch) => a.indexOf(ch))
    .replace(/\u066B/g, ".")
    .replace(/\u066C/g, "")
    .replace(/[,٬\s\u00A0\u200C\u200B\u200D]+/g, "")
    .replace(/تومان|تومانی/gi, "")
    .replace(/[^\d.-]/g, "");
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

onMounted(async () => {
  // دریافت اطلاعات کاربر هنگام لود شدن
  await fetchUserData();

  try {
    socket = io(WS_URL, { withCredentials: true, transports: ["websocket"] });
  } catch {
    socket = null;
  }
  if (socket) {
    socket.on("connect", () => {
      connected.value = true;
    });
    socket.on("disconnect", () => {
      connected.value = false;
    });
    socket.on("goldData", (data) => {
      try {
        const row = find18k((data && data.items) || []);
        if (row && row.price != null) {
          const parsed = parsePrice(row.price);
          if (parsed !== null) {
            prevPrice.value = goldPrice.value;
            goldPrice.value = parsed;
            lastUpdate.value = new Date();
          }
        }
      } catch {
        console.log("ERROR");
      }
    });
  }
  await fetchNotifications();
  notifTimer = setInterval(fetchNotifications, 60000);
  document.addEventListener("click", onClickOutside);
  document.addEventListener("keydown", onEscape);
});

onBeforeUnmount(() => {
  try {
    if (socket) socket.disconnect();
  } catch {
    console.log("ERROR");
  }
  if (notifTimer) clearInterval(notifTimer);
  document.removeEventListener("click", onClickOutside);
  document.removeEventListener("keydown", onEscape);
});

const goldPriceNumber = computed(() => Number(goldPrice.value) || 0);
const goldPriceDisplay = computed(() => nfmt(goldPriceNumber.value) + " تومان");
const lastUpdateLabel = computed(() =>
  lastUpdate.value
    ? lastUpdate.value.toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—"
);
const trend = computed(() => {
  if (!prevPrice.value || !goldPrice.value) return "flat";
  if (goldPrice.value > prevPrice.value) return "up";
  if (goldPrice.value < prevPrice.value) return "down";
  return "flat";
});
const trendLabel = computed(() =>
  trend.value === "up"
    ? "افزایشی"
    : trend.value === "down"
    ? "کاهشی"
    : "بدون تغییر"
);

// نمایش فرمت شده موجودی طلا
const balanceGramDisplay = computed(() =>
  new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 3 }).format(
    balanceGram.value
  )
);

// نمایش فرمت شده موجودی نقره
const balanceSilverDisplay = computed(() =>
  new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 3 }).format(
    silverBalance.value
  )
);

// نمایش فرمت شده موجودی کیف پول تومانی
const balanceTomanWalletDisplay = computed(() =>
  new Intl.NumberFormat("fa-IR").format(tomanBalance.value)
);

// // نمایش معادل تومانی طلا (اختیاری اگر لازم شد)
// const balanceTomanDisplay = computed(() => {
//   if (!goldPriceNumber.value || !balanceGram.value) return "—";
//   const base = goldPriceNumber.value * balanceGram.value;
//   return nfmt(base) + " تومان";
// });

function nfmt(n) {
  return new Intl.NumberFormat("fa-IR").format(Math.round(Number(n) || 0));
}
function formatTime(d) {
  if (!d) return "—";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "—";
  const now = new Date();
  const sameDay = dt.toDateString() === now.toDateString();
  return sameDay
    ? dt.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })
    : dt.toLocaleDateString("fa-IR");
}
</script>

<style scoped>
.ticker-track {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  animation: ticker 40s linear infinite;
}
.ticker-track + .ticker-track {
  margin-inline-start: 0;
}
@keyframes ticker {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease-in-out;
  max-height: 300px;
  opacity: 1;
}
.dropdown-enter-from,
.dropdown-leave-to {
  max-height: 0;
  opacity: 0;
}

/* Custom Scrollbar for Menu */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>