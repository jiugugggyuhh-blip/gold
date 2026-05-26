<template>
  <div dir="rtl" class="min-h-screen bg-[#0d1117] pb-32 text-white">
    <!-- Mobile Header (Hidden on Desktop) -->
    <header class="p-4 flex items-center justify-between sticky top-0 z-40 bg-[#0d1117]/80 backdrop-blur-xl border-b border-white/5 lg:hidden">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-600 p-0.5">
          <div class="w-full h-full rounded-full bg-[#0d1117] flex items-center justify-center overflow-hidden">
             <img :src="user.avatar || placeholder" class="w-full h-full object-cover" />
          </div>
        </div>
        <div>
          <h2 class="text-xs text-white/50">خوش آمدید،</h2>
          <p class="text-sm font-bold">{{ user.fname || 'کاربر' }} {{ user.lname || 'گرامی' }}</p>
        </div>
      </div>
      <div class="flex gap-2">
        <button @click="$router.push('/user/notification')" class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 relative">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#0d1117]"></span>
        </button>
      </div>
    </header>

    <div class="max-w-5xl mx-auto px-4 py-6">
      <!-- Desktop Header & Greeting (Hidden on Mobile) -->
      <div class="hidden lg:flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-yellow-400 to-yellow-600 p-0.5">
            <div class="w-full h-full rounded-2xl bg-[#0d1117] flex items-center justify-center overflow-hidden">
               <img :src="user.avatar || placeholder" class="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <h1 class="text-2xl font-black">سلام، {{ user.fname || 'کاربر' }} عزیز</h1>
            <p class="text-white/50 text-sm mt-1">به پنل مدیریت مکسـی گلد خوش آمدید</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
           <div class="text-left me-4">
              <span class="text-[10px] text-white/40 block">آخرین نرخ طلا</span>
              <span class="text-lg font-black text-yellow-500">{{ formatMoney(goldPrice) }}</span>
           </div>
           <button @click="$router.push('/user/notification')" class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 relative hover:bg-white/10 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Main Content (Balance & Prices) -->
        <div class="lg:col-span-7 space-y-6">
          <!-- Main Wallet Card -->
          <div class="relative group">
            <div class="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-[32px] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div class="relative bg-[#161b22] rounded-[30px] p-6 lg:p-8 border border-white/5 overflow-hidden">
              <div class="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0 0 L100 100 M100 0 L0 100" stroke="white" stroke-width="0.5" />
                </svg>
              </div>
              
              <div class="flex justify-between items-start relative z-10">
                <div>
                  <span class="text-xs font-medium text-white/50 tracking-wider">موجودی کل (تومان)</span>
                  <div class="flex items-baseline gap-2 mt-1">
                    <h1 class="text-3xl lg:text-4xl font-black tracking-tighter">{{ formatMoney(user.toman) }}</h1>
                    <span class="text-yellow-500 text-sm font-bold">تومان</span>
                  </div>
                </div>
                <div class="bg-yellow-400/10 p-3 rounded-2xl border border-yellow-400/20">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              <div class="mt-8 lg:mt-10 flex gap-3 lg:gap-4 relative z-10">
                <button @click="$router.push('/user/card')" class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 lg:py-4 rounded-2xl transition-all shadow-lg shadow-yellow-500/20 active:scale-95">شارژ حساب</button>
                <button @click="$router.push('/user/withdrawal')" class="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 lg:py-4 rounded-2xl border border-white/10 transition-all active:scale-95">برداشت وجه</button>
              </div>
            </div>
          </div>

          <!-- Live Prices Section -->
          <section class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-bold flex items-center gap-2">
                <span class="w-1 h-4 bg-yellow-500 rounded-full"></span>
                قیمت‌های لحظه‌ای بازار
              </h3>
              <span class="text-[10px] text-white/40 font-medium">آخرین بروزرسانی: {{ lastUpdateLabel }}</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 lg:gap-4">
              <!-- Gold Price Row -->
              <div @click="$router.push('/user/wallet/gold')" class="price-row group">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-yellow-400/10 flex items-center justify-center border border-yellow-400/20 group-hover:bg-yellow-400/20 transition-colors">
                    <span class="text-yellow-500 font-black text-lg">Au</span>
                  </div>
                  <div>
                    <span class="text-sm lg:text-base font-bold block">طلای ۱۸ عیار</span>
                    <span class="text-[10px] lg:text-xs text-white/40">خرید و فروش آنی</span>
                  </div>
                </div>
                <div class="text-left">
                  <span class="text-base lg:text-lg font-black block">{{ formatMoney(goldPrice) }}</span>
                  <span class="text-[10px] lg:text-xs text-emerald-400 font-bold">+۱.۲٪ ↑</span>
                </div>
              </div>

              <!-- Silver Price Row -->
              <div @click="$router.push('/user/wallet/silver')" class="price-row group">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-gray-400/10 flex items-center justify-center border border-gray-400/20 group-hover:bg-gray-400/20 transition-colors">
                    <span class="text-gray-400 font-black text-lg">Ag</span>
                  </div>
                  <div>
                    <span class="text-sm lg:text-base font-bold block">نقره ۹۹۹</span>
                    <span class="text-[10px] lg:text-xs text-white/40">سرمایه گذاری نقره</span>
                  </div>
                </div>
                <div class="text-left">
                  <span class="text-base lg:text-lg font-black block">{{ formatMoney(silverPrice) }}</span>
                  <span class="text-[10px] lg:text-xs text-rose-400 font-bold">-۰.۵٪ ↓</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Secondary Column (Quick Actions & Referral) -->
        <div class="lg:col-span-5 space-y-6">
          <!-- Quick Actions Grid -->
          <section class="bg-[#161b22] rounded-[30px] p-6 border border-white/5">
            <h3 class="text-sm font-bold flex items-center gap-2 mb-6">
              <span class="w-1 h-4 bg-yellow-500 rounded-full"></span>
              دسترسی سریع
            </h3>
            <div class="grid grid-cols-4 lg:grid-cols-3 gap-4 lg:gap-6">
              <div v-for="action in quickActions" :key="action.label" @click="$router.push(action.route)" class="flex flex-col items-center gap-2 lg:gap-3 group cursor-pointer">
                <div class="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl lg:rounded-[20px] bg-[#0d1117] border border-white/5 flex items-center justify-center group-hover:border-yellow-500/50 group-active:scale-95 transition-all shadow-xl">
                  <component :is="action.icon" class="w-5 h-5 lg:w-7 lg:h-7 text-white/50 group-hover:text-yellow-500 transition-colors" />
                </div>
                <span class="text-[10px] lg:text-[11px] font-bold text-white/60 group-hover:text-white transition-colors text-center">{{ action.label }}</span>
              </div>
            </div>
          </section>

          <!-- Referral Banner -->
          <div @click="$router.push('/user/ref')" class="bg-gradient-to-br from-[#1a2220] to-[#0d1117] rounded-[30px] p-6 border border-yellow-500/20 flex items-center justify-between relative overflow-hidden group active:scale-[0.98] transition-all cursor-pointer">
            <div class="absolute -top-10 -right-10 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl"></div>
            <div class="relative z-10">
              <h4 class="text-base lg:text-lg font-black text-yellow-400">دعوت از دوستان</h4>
              <p class="text-[10px] lg:text-xs text-white/50 mt-1">با معرفی ما به دوستانتان پاداش بگیرید</p>
              <div class="mt-4 inline-flex items-center gap-3 text-xs lg:text-sm font-black text-white bg-white/5 px-3 lg:px-4 py-2 rounded-2xl border border-white/10">
                <span class="text-white/40 font-medium">کد شما:</span>
                {{ user.refcode }}
              </div>
            </div>
            <div class="w-16 h-16 lg:w-24 lg:h-24 bg-yellow-400/10 rounded-2xl lg:rounded-[24px] flex items-center justify-center border border-yellow-400/20 group-hover:rotate-12 transition-transform shadow-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 lg:w-12 lg:h-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import axios from 'axios';
import {
  CreditCardIcon,
  ChatBubbleBottomCenterTextIcon,
  ArrowsRightLeftIcon,
  TrophyIcon,
  GiftIcon,
  QuestionMarkCircleIcon,
  CpuChipIcon,
  CircleStackIcon,
  BanknotesIcon,
  ArrowsUpDownIcon,
  CubeIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline';

const url = process.env.VUE_APP_API_URL || '';
const placeholder = '/img/default-avatar.png';
const user = ref({ toman: 0, gold: 0, silver: 0 });
const goldPrice = ref(0);
const silverPrice = ref(0);
const lastUpdate = ref(new Date());

const formatMoney = (v) => new Intl.NumberFormat('fa-IR').format(Math.round(v));
const lastUpdateLabel = computed(() => lastUpdate.value.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }));

const quickActions = [
  { label: 'ربات معامله‌گر', icon: CpuChipIcon, route: '/user/trading-bot' },
  { label: 'معامله طلا', icon: ArrowsRightLeftIcon, route: '/user/gold' },
  { label: 'معامله نقره', icon: CircleStackIcon, route: '/user/silver' },
  { label: 'دریافت وام', icon: BanknotesIcon, route: '/user/loan' },
  { label: 'گردونه شانس', icon: TrophyIcon, route: '/user/game' },
  { label: 'کارت‌های من', icon: CreditCardIcon, route: '/user/card' },
  { label: 'انتقال طلا', icon: ArrowsUpDownIcon, route: '/user/transfer' },
  { label: 'دارایی‌ها', icon: CubeIcon, route: '/user/assets' },
  { label: 'خیریه', icon: GiftIcon, route: '/user/charity' },
  { label: 'ضمانت و رهن', icon: ShieldCheckIcon, route: '/user/pledge' },
  { label: 'پشتیبانی', icon: ChatBubbleBottomCenterTextIcon, route: '/user/support' },
  { label: 'سوالات متداول', icon: QuestionMarkCircleIcon, route: '/about' },
];

const fetchPrices = async () => {
  try {
    const res = await axios.get(`${url}/prices/current`);
    if (res.data.success) {
      const g = res.data.data.gold.find(i => i.name.includes('18'));
      if (g) goldPrice.value = parsePrice(g.price);
      
      const s = res.data.data.silver;
      if (s) silverPrice.value = parsePrice(s.price);
      
      lastUpdate.value = new Date();
    }
  } catch (err) {
    console.error('Price sync error:', err);
  }
};

const parsePrice = (v) => {
  if (typeof v === 'number') return v;
  if (!v || typeof v !== 'string') return 0;
  return parseFloat(v.replace(/,/g, '')) || 0;
};

const loadProfile = async () => {
  try {
    const res = await axios.get(`${url}/user/profile`);
    user.value = res.data.user;
  } catch (err) {
    console.error('Profile load error:', err);
  }
};

let priceTimer = null;
onMounted(() => {
  loadProfile();
  fetchPrices();
  priceTimer = setInterval(fetchPrices, 30000);
});

onBeforeUnmount(() => {
  if (priceTimer) clearInterval(priceTimer);
});
</script>

<style scoped>
.price-row {
  @apply bg-[#161b22] rounded-[24px] p-4 flex items-center justify-between border border-white/5 active:scale-[0.98] transition-all cursor-pointer;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

header, section, .group {
  animation: fadeIn 0.5s ease-out forwards;
}

section:nth-child(2) { animation-delay: 0.1s; }
section:nth-child(3) { animation-delay: 0.2s; }
</style>
