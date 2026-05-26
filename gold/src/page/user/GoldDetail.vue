<template>
  <div dir="rtl" class="min-h-screen pb-28 text-white">
    <!-- Header -->
    <header class="p-4 flex items-center justify-between bg-[#0d1117]/80 backdrop-blur-xl sticky top-0 z-40 lg:hidden">
      <button @click="$router.back()" class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <h1 class="text-sm font-bold">جزئیات دارایی طلا</h1>
      <div class="w-10"></div>
    </header>

    <div class="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <!-- Gold Price Card -->
      <div class="relative group">
        <div class="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-[32px] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
        <div class="relative bg-[#161b22] rounded-[30px] p-8 border border-white/5 overflow-hidden text-center">
           <div class="flex justify-center mb-4">
              <div class="w-20 h-20 bg-yellow-400/10 rounded-3xl flex items-center justify-center border border-yellow-400/20">
                <span class="text-yellow-500 font-black text-3xl">Au</span>
              </div>
           </div>
           <h2 class="text-white/60 text-sm font-medium">موجودی طلای شما (۱۸ عیار)</h2>
           <div class="flex items-baseline justify-center gap-2 mt-2">
              <h1 class="text-4xl font-black tracking-tighter">{{ formatWeight(user.gold) }}</h1>
              <span class="text-yellow-500 text-lg font-bold">گرم</span>
           </div>
           <div class="mt-4 inline-flex items-center gap-2 bg-emerald-400/10 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-400 border border-emerald-400/20">
              ارزش تقریبی: {{ formatMoney(goldValue) }} تومان
           </div>
        </div>
      </div>

      <!-- Market Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-[#161b22] rounded-[28px] p-6 border border-white/5">
          <span class="text-white/40 text-xs block mb-1">قیمت لحظه‌ای بازار</span>
          <div class="flex items-center justify-between">
            <h3 class="text-2xl font-black text-yellow-500">{{ currentGoldPriceFormatted }} <small class="text-xs text-white/50">تومان</small></h3>
            <div class="text-left">
              <span class="text-emerald-400 font-bold text-xs block">+۱.۲٪ ↑</span>
              <span class="text-white/30 text-[10px] block">در ۲۴ ساعت اخیر</span>
            </div>
          </div>
        </div>
        <div class="bg-[#161b22] rounded-[28px] p-6 border border-white/5 flex items-center justify-between">
          <div>
            <span class="text-white/40 text-xs block mb-1">کارمزد معامله</span>
            <h3 class="text-xl font-bold">{{ buyFeePercent }}٪ <small class="text-xs text-white/50">خرید</small> / {{ sellFeePercent }}٪ <small class="text-xs text-white/50">فروش</small></h3>
          </div>
          <button @click="$router.push('/user/gold')" class="bg-yellow-500 text-black font-bold px-4 py-2 rounded-xl text-sm transition-all active:scale-95">معامله</button>
        </div>
      </div>

      <!-- Weekly Chart -->
      <div class="bg-[#161b22] rounded-[30px] p-6 border border-white/5">
        <div class="flex items-center justify-between mb-8">
           <h3 class="text-sm font-bold flex items-center gap-2">
            <span class="w-1 h-4 bg-yellow-500 rounded-full"></span>
            نمودار تغییرات ۷ روزه
          </h3>
          <div class="text-[10px] text-white/40 font-medium">بروزرسانی: {{ lastUpdateLabel }}</div>
        </div>
        <div id="gold-detail-chart" class="h-64"></div>
      </div>

      <!-- Action Buttons -->
      <div class="grid grid-cols-2 gap-4">
        <button @click="$router.push('/user/gold')" class="bg-[#161b22] border border-white/5 hover:bg-white/5 transition-all p-5 rounded-[24px] flex flex-col items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-yellow-400/10 flex items-center justify-center text-yellow-500">
             <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
             </svg>
          </div>
          <span class="text-sm font-bold">خرید طلا</span>
        </button>
        <button @click="$router.push('/user/gold')" class="bg-[#161b22] border border-white/5 hover:bg-white/5 transition-all p-5 rounded-[24px] flex flex-col items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-rose-400/10 flex items-center justify-center text-rose-400">
             <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
             </svg>
          </div>
          <span class="text-sm font-bold">فروش طلا</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, onBeforeUnmount } from 'vue';
import axios from 'axios';
import ApexCharts from 'apexcharts';
import { usePrices } from '../../composables/usePrices';

const url = process.env.VUE_APP_API_URL || '';

// --- Price Composable ---
const {
  currentGoldPrice,
  currentGoldPriceFormatted,
  fetchPrices,
  formatMoney,
  init: initPrices,
  cleanup: cleanupPrices
} = usePrices();

const user = ref({ gold: 0 });
const buyFeePercent = ref(1.5);
const sellFeePercent = ref(0.9);
const lastUpdate = ref(new Date());
const historyData = ref([]);

const formatWeight = (v) => Number(v || 0).toLocaleString('fa-IR', { minimumFractionDigits: 3 });
const lastUpdateLabel = computed(() => lastUpdate.value.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }));
const goldValue = computed(() => user.value.gold * currentGoldPrice.value);

const fetchGoldDetails = async () => {
  try {
    const profileRes = await axios.get(`${url}/user/profile`);
    user.value = profileRes.data.user;

    const settingRes = await axios.get(`${url}/admin/setting`);
    if (settingRes.data.data) {
      buyFeePercent.value = settingRes.data.data.feebuy;
      sellFeePercent.value = settingRes.data.data.feesell;
    }

    // Update prices using composable
    await fetchPrices();
    lastUpdate.value = new Date();

    const walletDetailsRes = await axios.get(`${url}/user/wallet/details`);
    historyData.value = walletDetailsRes.data.history?.gold || [];
    
    nextTick(() => renderChart());
  } catch (err) {
    console.error('Gold details fetch error:', err);
  }
};

const renderChart = () => {
  const chartElement = document.querySelector('#gold-detail-chart');
  if (!chartElement || historyData.value.length === 0) return;

  const seriesData = historyData.value.map(h => ({
    x: new Date(h.date).getTime(),
    y: h.price
  }));

  const options = {
    series: [{ name: 'قیمت طلا', data: seriesData }],
    chart: {
      type: 'area',
      height: 256,
      toolbar: { show: false },
      background: 'transparent',
      foreColor: '#ffffff40'
    },
    colors: ['#fbbf24'],
    stroke: { curve: 'smooth', width: 3 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.05,
        stops: [0, 90, 100]
      }
    },
    dataLabels: { enabled: false },
    grid: { borderColor: '#ffffff05', strokeDashArray: 4 },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeFormatter: { year: 'yyyy', month: 'MMM', day: 'dd', hour: 'HH:mm' }
      }
    },
    yaxis: {
      labels: {
        formatter: (v) => formatMoney(v)
      }
    },
    tooltip: {
      theme: 'dark',
      x: { format: 'dd MMM HH:mm' }
    }
  };

  chartElement.innerHTML = '';
  const chart = new ApexCharts(chartElement, options);
  chart.render();
};

onMounted(() => {
  fetchGoldDetails();
  initPrices();
});

onBeforeUnmount(() => {
  cleanupPrices();
});
</script>
