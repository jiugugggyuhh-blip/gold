<template>
  <div class="min-h-screen  text-white font-sans flex flex-col items-center pt-8 px-4" dir="rtl">
    
    <div class="w-full max-w-md grid grid-cols-2 gap-4 mb-6">
      <button
        @click="switchMetal('silver')"
        class="py-3 rounded-2xl font-bold transition-all duration-300 ring-1"
        :class="selectedMetal === 'silver' 
          ? 'bg-[#b9f1cf] text-[#0a1f14] ring-[#b9f1cf] shadow-[0_0_15px_rgba(185,241,207,0.3)]' 
          : 'bg-[#1a2220] text-white/60 ring-[#334D44]/60 hover:bg-[#1f2b28] hover:text-white'"
      >
        نقره
      </button>
      <button
        @click="switchMetal('gold')"
        class="py-3 rounded-2xl font-bold transition-all duration-300 ring-1"
        :class="selectedMetal === 'gold' 
          ? 'bg-[#b9f1cf] text-[#0a1f14] ring-[#b9f1cf] shadow-[0_0_15px_rgba(185,241,207,0.3)]' 
          : 'bg-[#1a2220] text-white/60 ring-[#334D44]/60 hover:bg-[#1f2b28] hover:text-white'"
      >
        طلا
      </button>
    </div>

    <div class="w-full max-w-md bg-[#1a2220] rounded-3xl ring-1 ring-[#334D44]/60 p-6 shadow-2xl relative overflow-hidden">
      <div class="absolute -top-24 -left-24 w-48 h-48 bg-[#b9f1cf]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div class="flex border-b border-white/10 mb-8 relative">
        <button
          @click="switchTab('buy')"
          class="flex-1 pb-3 text-center font-bold text-sm transition-colors relative"
          :class="activeTab === 'buy' ? 'text-[#b9f1cf]' : 'text-white/40 hover:text-white/70'"
        >
          خرید
          <span v-if="activeTab === 'buy'" class="absolute bottom-0 right-0 w-full h-0.5 bg-[#b9f1cf] rounded-t-full shadow-[0_-2px_8px_rgba(185,241,207,0.5)]"></span>
        </button>
        <button
          @click="switchTab('sell')"
          class="flex-1 pb-3 text-center font-bold text-sm transition-colors relative"
          :class="activeTab === 'sell' ? 'text-rose-400' : 'text-white/40 hover:text-white/70'"
        >
          فروش
          <span v-if="activeTab === 'sell'" class="absolute bottom-0 right-0 w-full h-0.5 bg-rose-400 rounded-t-full shadow-[0_-2px_8px_rgba(251,113,133,0.5)]"></span>
        </button>
      </div>

      <div class="space-y-2">
        
        <div class="relative group">
          <input
            v-model.number="amountInput"
            @input="calculateFromAmount"
            type="number"
            class="w-full h-14 px-4 rounded-xl bg-[#12181b] ring-1 ring-white/10 focus:ring-[#b9f1cf] focus:outline-none text-white placeholder-white/30 text-lg font-bold transition-all text-left dir-ltr"
            placeholder="مبلغ مورد نظر"
          />
          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/50 pointer-events-none">تومان</span>
        </div>

        <div class="flex justify-center py-1">
          <div class="bg-[#12181b] p-1.5 rounded-full ring-1 ring-white/10 text-[#b9f1cf]">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
             </svg>
          </div>
        </div>

        <div class="relative group">
          <input
            v-model.number="weightInput"
            @input="calculateFromWeight"
            type="number"
            class="w-full h-14 px-4 rounded-xl bg-[#12181b] ring-1 ring-white/10 focus:ring-[#b9f1cf] focus:outline-none text-white placeholder-white/30 text-lg font-bold transition-all text-left dir-ltr"
            placeholder="وزن"
          />
          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/50 pointer-events-none">
             وزن {{ selectedMetal === 'gold' ? 'طلا' : 'نقره' }} (گرم)
          </span>
        </div>

      </div>

      <div class="mt-8 bg-[#b9f1cf]/10 rounded-2xl p-4 flex items-center justify-between ring-1 ring-[#b9f1cf]/20">
        <button class="bg-[#1a4d3a] hover:bg-[#20634b] text-[#b9f1cf] px-4 py-2 rounded-xl text-sm font-bold transition-colors ring-1 ring-[#b9f1cf]/30">
          شارژ کیف پول
        </button>
        <div class="text-right">
          <div class="text-xs text-[#b9f1cf]/70 mb-1">موجودی تومان</div>
          <div class="font-bold text-white text-lg">{{ formatMoney(user.toman) }}</div>
        </div>
      </div>

      <div class="mt-4 flex justify-between items-center text-xs text-white/40 px-2">
        <span>قیمت واحد: {{ currentPrice ? formatMoney(currentPrice) : '---' }}</span>
        <span>کارمزد: {{ activeTab === 'buy' ? buyFeePercent : sellFeePercent }}%</span>
      </div>

      <button
        class="w-full mt-6 h-14 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2"
        :class="canSubmit 
          ? 'bg-[#b9f1cf] text-[#0a1f14] shadow-[0_0_20px_rgba(185,241,207,0.2)] hover:shadow-[0_0_30px_rgba(185,241,207,0.4)] cursor-pointer transform active:scale-[0.98]' 
          : 'bg-white/5 text-white/20 cursor-not-allowed'"
        :disabled="!canSubmit || submitting"
        @click="submit"
      >
        <span v-if="submitting" class="animate-pulse">در حال انجام...</span>
        <span v-else>تایید و ادامه</span>
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { usePrices } from '../../composables/usePrices';

// --- Config ---
const url = process.env.VUE_APP_API_URL || "";

// --- Price Composable ---
const {
  currentGoldPrice,
  currentSilverPrice,
  calculateFinalPrice,
  calculateWeightFromAmount,
  formatMoney,
  init: initPrices,
  cleanup: cleanupPrices
} = usePrices();

// --- State ---
const selectedMetal = ref("silver");
const activeTab = ref("buy");
const amountInput = ref(""); // String to allow empty state
const weightInput = ref("");
const submitting = ref(false);
const user = ref({ toman: 0, gold: 0, silver: 0 });

// Fees
const fees = ref({ gold: { buy: 1.5, sell: 0.9 }, silver: { buy: 1.5, sell: 0.9 } });
const istransactions = ref(true);

// --- Computed ---
const currentPrice = computed(() => selectedMetal.value === 'gold' ? currentGoldPrice.value : currentSilverPrice.value);
const buyFeePercent = computed(() => fees.value[selectedMetal.value].buy);
const sellFeePercent = computed(() => fees.value[selectedMetal.value].sell);

const canSubmit = computed(() => {
  return !submitting.value && 
         istransactions.value && 
         Number(amountInput.value) > 0 && 
         Number(weightInput.value) > 0 && 
         currentPrice.value > 0;
});

// --- Logic ---
function switchMetal(metal) {
  selectedMetal.value = metal;
  resetInputs();
}

function switchTab(tab) {
  activeTab.value = tab;
  resetInputs();
}

function resetInputs() {
  amountInput.value = "";
  weightInput.value = "";
}

// Bidirectional Calculation Logic
function calculateFromAmount() {
  const price = currentPrice.value;
  const val = Number(amountInput.value);
  if (!price || !val) {
    weightInput.value = "";
    return;
  }

  const feePct = activeTab.value === 'buy' ? buyFeePercent.value : sellFeePercent.value;
  const isBuy = activeTab.value === 'buy';
  
  weightInput.value = calculateWeightFromAmount(val, price, feePct, isBuy);
}

function calculateFromWeight() {
  const price = currentPrice.value;
  const val = Number(weightInput.value);
  if (!price || !val) {
    amountInput.value = "";
    return;
  }

  const feePct = activeTab.value === 'buy' ? buyFeePercent.value : sellFeePercent.value;
  const isBuy = activeTab.value === 'buy';
  
  amountInput.value = calculateFinalPrice(price, val, feePct, isBuy);
}

// --- Formatting ---
// formatMoney is now imported from usePrices composable

// --- Network ---
async function loadProfile() {
  try {
    const { data } = await axios.get(`${url}/user/profile`);
    user.value = data.user || user.value;
  } catch {
           console.log("error");
  }
}

async function fetchSetting() {
  try {
    const { data } = await axios.get(`${url}/admin/setting`);
    const it = data.data || {};
    if(it.transactions !== undefined) istransactions.value = !!it.transactions;
  } catch {
           console.log("error");
  }
}


async function submit() {
  submitting.value = true;
  try {
    const endpoint = selectedMetal.value === 'gold' ? `${url}/user/gold` : `${url}/user/silver`;
    const payload = {
       typeorder: activeTab.value,
       weight: Number(weightInput.value),
       price: Number(amountInput.value), 
       [selectedMetal.value === 'gold' ? 'goldprice' : 'silverprice']: currentPrice.value
    };
    
    // Validation
    if(activeTab.value === 'buy' && payload.price < 100000) throw new Error("حداقل خرید ۱۰۰,۰۰۰ تومان");
    if(activeTab.value === 'sell' && payload.weight < 0.1) throw new Error("حداقل فروش ۰.۱ گرم");

    const { data } = await axios.post(endpoint, payload);
    Swal.fire({ 
        icon: "success", 
        text: data.data || "انجام شد", 
        background: '#1a2220', 
        color: '#fff',
        confirmButtonColor: '#b9f1cf',
        confirmButtonText: '<span style="color:#0a1f14">باشه</span>'
    });
    resetInputs();
    loadProfile();
  } catch (e) {
    const msg = e.response?.data?.message || e.message || "خطا";
    Swal.fire({ icon: "error", text: msg, background: '#1a2220', color: '#fff' });
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  loadProfile();
  fetchSetting();
  initPrices();
});
onBeforeUnmount(() => {
  cleanupPrices();
});
</script>