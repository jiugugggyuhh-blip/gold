<template>
  <div dir="rtl" class="min-h-screen pb-28 text-white">
    <div class="max-w-md mx-auto px-4 py-6">
      <!-- Total Assets Card -->
      <div class="wallet-gradient rounded-[28px] p-6 shadow-2xl shadow-yellow-500/10 mb-8 border border-white/10 relative overflow-hidden">
        <div class="absolute top-0 right-0 p-4 opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-24 h-24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 18V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.89 6 10 6.89 10 8V16C10 17.11 10.89 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z"/>
          </svg>
        </div>
        <div class="relative z-10">
          <span class="text-white/70 text-sm font-medium">دارایی کل</span>
          <div class="flex items-baseline gap-2 mt-2">
            <h1 class="text-3xl font-bold tracking-tight">{{ formatMoney(walletData.totalAssets) }}</h1>
            <span class="text-white/60 text-sm">تومان</span>
          </div>
          <div class="flex items-center gap-2 mt-4">
             <div class="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full text-[11px] backdrop-blur-md border border-white/10">
                <span :class="walletData.assets.gold.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'">
                  {{ walletData.assets.gold.changePercent >= 0 ? '+' : '' }}{{ walletData.assets.gold.changePercent }}%
                </span>
                <span class="text-white/50 text-[10px]">تغییر هفتگی</span>
             </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="grid grid-cols-2 gap-3 mt-8 relative z-10">
          <button @click="$router.push('/user/withdrawal')" class="bg-white/10 hover:bg-white/20 transition-all py-3 rounded-2xl flex items-center justify-center gap-2 border border-white/10 backdrop-blur-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span class="text-sm font-semibold">برداشت وجه</span>
          </button>
          <button @click="$router.push('/user/card')" class="bg-yellow-400 hover:bg-yellow-500 transition-all py-3 rounded-2xl flex items-center justify-center gap-2 border border-yellow-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span class="text-sm font-semibold text-black">افزایش موجودی</span>
          </button>
        </div>
      </div>

      <!-- Assets Distribution -->
      <h2 class="text-lg font-bold mb-4 flex items-center gap-2">
        <span class="w-1.5 h-6 bg-yellow-400 rounded-full"></span>
        توزیع دارایی‌ها
      </h2>
      
      <div class="grid grid-cols-1 gap-4 mb-8">
        <!-- Gold Asset -->
        <div @click="$router.push('/user/wallet/gold')" class="asset-card group">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-yellow-400/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border border-yellow-400/20">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-yellow-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"/></svg>
              </div>
              <div>
                <span class="text-sm font-bold block">طلا (18 عیار)</span>
                <span class="text-xs text-white/50">{{ walletData.assets.gold.amount }} گرم</span>
              </div>
            </div>
            <div class="text-left">
              <span class="text-sm font-bold block">{{ formatMoney(walletData.assets.gold.value) }}</span>
              <span class="text-[11px] text-emerald-400">{{ formatMoney(walletData.assets.gold.price) }} / گرم</span>
            </div>
          </div>
          <!-- Weekly Chart Mini -->
          <div v-if="showDetail === 'gold'" class="mt-4 pt-4 border-t border-white/5">
             <div id="gold-mini-chart" class="h-32"></div>
             <div class="flex justify-between items-center mt-3 text-[11px] text-white/40">
                <span>روند تغییرات ۷ روزه طلا</span>
                <span class="text-emerald-400">{{ walletData.assets.gold.changePercent }}%</span>
             </div>
          </div>
        </div>

        <!-- Silver Asset -->
        <div @click="$router.push('/user/wallet/silver')" class="asset-card group">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-gray-400/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border border-gray-400/20">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-300" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"/></svg>
              </div>
              <div>
                <span class="text-sm font-bold block">نقره (999)</span>
                <span class="text-xs text-white/50">{{ walletData.assets.silver.amount }} گرم</span>
              </div>
            </div>
            <div class="text-left">
              <span class="text-sm font-bold block">{{ formatMoney(walletData.assets.silver.value) }}</span>
              <span class="text-[11px] text-white/40">{{ formatMoney(walletData.assets.silver.price) }} / گرم</span>
            </div>
          </div>
          <div v-if="showDetail === 'silver'" class="mt-4 pt-4 border-t border-white/5 h-32">
             <div id="silver-mini-chart"></div>
          </div>
        </div>

        <!-- Crypto Asset -->
        <div @click="toggleDetail('crypto')" class="asset-card group opacity-80">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-blue-400/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border border-blue-400/20">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v2h2v-2h-2zm0-4v2h2V7h-2zm0 8v2h2v-2h-2z"/></svg>
              </div>
              <div>
                <span class="text-sm font-bold block">ارز دیجیتال</span>
                <span class="text-xs text-white/50">به‌زودی</span>
              </div>
            </div>
            <div class="text-left">
              <span class="text-sm font-bold block">0</span>
              <span class="text-[11px] text-white/40">تتر</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent History -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold flex items-center gap-2">
          <span class="w-1.5 h-6 bg-yellow-400 rounded-full"></span>
          تاریخچه تراکنش‌ها
        </h2>
        <router-link to="/user/history" class="text-yellow-400 text-xs font-medium">مشاهده همه</router-link>
      </div>

      <div class="space-y-3">
        <div v-for="tx in transactions" :key="tx._id" class="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:bg-white/[0.08] transition-colors">
          <div class="flex items-center gap-3">
            <div :class="tx.typeorder === 'buy' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-rose-400/10 text-rose-400'" class="w-10 h-10 rounded-xl flex items-center justify-center">
              <svg v-if="tx.typeorder === 'buy'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <span class="text-sm font-bold block">{{ tx.typeorder === 'buy' ? 'خرید طلا' : 'فروش طلا' }}</span>
              <span class="text-[10px] text-white/40">{{ formatDate(tx.createdAt) }}</span>
            </div>
          </div>
          <div class="text-left">
            <span :class="tx.typeorder === 'buy' ? 'text-rose-400' : 'text-emerald-400'" class="text-sm font-bold block">
              {{ tx.typeorder === 'buy' ? '-' : '+' }}{{ formatMoney(tx.price) }}
            </span>
            <span class="text-[10px] text-white/40">{{ tx.weight }} گرم</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue';
import axios from 'axios';
import ApexCharts from 'apexcharts';
import { usePrices } from '../../composables/usePrices';

const url = process.env.VUE_APP_API_URL || '';

// --- Price Composable ---
const {
  currentGoldPrice,
  currentSilverPrice,
  fetchPrices,
  formatMoney,
  init: initPrices,
  cleanup: cleanupPrices
} = usePrices();

const walletData = ref({
  totalAssets: 0,
  assets: {
    gold: { amount: 0, value: 0, price: 0, changePercent: 0 },
    silver: { amount: 0, value: 0, price: 0 },
    toman: { amount: 0, value: 0 },
    crypto: { amount: 0, value: 0 }
  },
  history: {
    gold: [],
    silver: []
  }
});

const transactions = ref([]);
const showDetail = ref(null);

const formatDate = (d) => new Date(d).toLocaleDateString('fa-IR');

const fetchWalletData = async () => {
  try {
    // Update prices first
    await fetchPrices();
    
    const res = await axios.get(`${url}/user/wallet/details`);
    const data = res.data;
    
    // Update wallet data with current prices
    if (data.assets) {
      data.assets.gold.price = currentGoldPrice.value;
      data.assets.gold.value = data.assets.gold.amount * currentGoldPrice.value;
      
      data.assets.silver.price = currentSilverPrice.value;
      data.assets.silver.value = data.assets.silver.amount * currentSilverPrice.value;
    }
    
    walletData.value = data;
    
    const txRes = await axios.get(`${url}/user/order`);
    transactions.value = txRes.data.data.slice(0, 5);
  } catch (err) {
    console.error('Error fetching wallet data:', err);
  }
};

const toggleDetail = (type) => {
  if (showDetail.value === type) {
    showDetail.value = null;
  } else {
    showDetail.value = type;
    if (type === 'gold' || type === 'silver') {
      nextTick(() => renderMiniChart(type));
    }
  }
};

const renderMiniChart = (type) => {
  const history = walletData.value.history[type] || [];
  if (history.length === 0) return;

  const chartData = history.map(h => ({ x: new Date(h.date).getTime(), y: h.price }));
  
  const options = {
    series: [{
      name: 'قیمت',
      data: chartData
    }],
    chart: {
      type: 'area',
      height: 128,
      sparkline: { enabled: true },
      animations: { enabled: true }
    },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100]
      }
    },
    colors: [type === 'gold' ? '#fbbf24' : '#9ca3af'],
    tooltip: { enabled: false }
  };

  const chartElement = document.querySelector(`#${type}-mini-chart`);
  if (chartElement) {
    chartElement.innerHTML = '';
    const chart = new ApexCharts(chartElement, options);
    chart.render();
  }
};

onMounted(() => {
  fetchWalletData();
  initPrices();
});

onBeforeUnmount(() => {
  cleanupPrices();
});
</script>

<style scoped>
.wallet-gradient {
  background: linear-gradient(135deg, #1c2529 0%, #0f171a 100%);
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);
}

.asset-card {
  @apply bg-white/5 border border-white/10 rounded-3xl p-4 transition-all duration-300 cursor-pointer hover:bg-white/[0.08] hover:border-white/20;
}

#gold-mini-chart, #silver-mini-chart {
  @apply w-full;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.asset-card {
  animation: slideUp 0.4s ease-out forwards;
}

.asset-card:nth-child(2) { animation-delay: 0.1s; }
.asset-card:nth-child(3) { animation-delay: 0.2s; }
</style>
