<template>
  <div class="min-h-screen  text-white font-sans flex flex-col items-center pt-6 px-4 pb-10" dir="rtl">
    
    <div class="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#b9f1cf]/5 to-transparent pointer-events-none"></div>

    <div class="w-full max-w-md relative z-10 flex flex-col gap-5">
      
      <div class="bg-[#1a2220]/80 backdrop-blur-xl border border-[#b9f1cf]/20 rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-[#b9f1cf]/5">
        <button @click="$router.go(-1)" class="p-2 rounded-xl hover:bg-white/5 transition-colors text-white/70">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <div class="text-center">
          <div class="text-xs text-[#b9f1cf]/70 mb-1">شناسه انتقالی من</div>
          <div class="text-xl font-bold tracking-widest font-mono text-white">
            {{ user._id || '---' }}
          </div>
        </div>
        <div class="w-10"></div> </div>

      <div class="bg-[#1a2220]/60 backdrop-blur-xl border border-white/10 rounded-[24px] p-5 shadow-2xl">
        
        <div class="grid grid-cols-2 gap-3 mb-6 bg-[#12181b]/50 p-1.5 rounded-2xl border border-white/5">
          <button
            v-for="metal in ['gold', 'silver']"
            :key="metal"
            @click="selectedMetal = metal"
            class="py-2.5 rounded-xl font-bold text-sm transition-all duration-300 relative overflow-hidden"
            :class="selectedMetal === metal 
              ? 'bg-[#b9f1cf] text-[#0a1f14] shadow-md' 
              : 'text-white/50 hover:text-white'"
          >
            {{ metal === 'gold' ? 'طلا' : 'نقره' }}
          </button>
        </div>

        <div class="space-y-5">
          <div class="space-y-1.5">
            <label class="text-xs text-white/40 mr-1">مقصد</label>
            <div class="relative group">
              <input
                v-model="targetInput"
                type="text"
                inputmode="numeric"
                class="w-full h-14 px-4 rounded-2xl bg-[#12181b] border border-white/10 focus:border-[#b9f1cf]/50 focus:ring-1 focus:ring-[#b9f1cf]/50 focus:outline-none text-white placeholder-white/20 text-lg transition-all text-left dir-ltr font-mono"
                placeholder="شناسه انتقالی   "
              />
              <div class="absolute right-4 top-1/2 -translate-y-1/2 text-white/30">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="space-y-1.5">
            <div class="flex justify-between items-center px-1">
              <label class="text-xs text-white/40">مقدار (وزن)</label>
              <span class="text-[10px] text-[#b9f1cf]/80 cursor-pointer" @click="setMaxAmount">
                موجود: {{ formatWeight(user[selectedMetal]) }} گرم
              </span>
            </div>
            
            <div class="relative group">
              <input
                v-model.number="amountInput"
                type="number"
                step="0.001"
                class="w-full h-14 px-4 rounded-2xl bg-[#12181b] border border-white/10 focus:border-[#b9f1cf]/50 focus:ring-1 focus:ring-[#b9f1cf]/50 focus:outline-none text-white placeholder-white/20 text-lg font-bold transition-all text-left dir-ltr"
                placeholder="0.000"
              />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/50 pointer-events-none">گرم</span>
            </div>

            <div class="flex justify-end px-2" v-if="amountInput > 0">
               <div class="text-[11px] text-white/50 flex items-center gap-1">
                  <span>ارزش تقریبی:</span>
                  <span class="text-[#b9f1cf] font-bold">{{ estimatedValue }}</span>
                  <span class="text-[9px]">تومان</span>
               </div>
            </div>
          </div>
        </div>

        <button
          class="w-full mt-6 h-12 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden"
          :class="canSubmit 
            ? 'bg-[#b9f1cf] text-[#0a1f14] shadow-[0_0_15px_rgba(185,241,207,0.2)] hover:shadow-[0_0_25px_rgba(185,241,207,0.3)] active:scale-[0.98]' 
            : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'"
          :disabled="!canSubmit || submitting"
          @click="submitTransfer"
        >
          <span v-if="submitting" class="animate-pulse">در حال ارسال...</span>
          <span v-else>درخواست انتقال</span>
        </button>
      </div>

      <div class="bg-[#1a2220]/60 backdrop-blur-xl border border-white/10 rounded-[24px] p-5 min-h-[300px]">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-white/80 text-sm">تاریخچه انتقال</h3>
          <button @click="fetchHistory" class="text-white/40 hover:text-[#b9f1cf] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        <div class="flex border-b border-white/10 mb-4">
          <button 
            @click="activeHistoryTab = 'received'"
            class="flex-1 pb-3 text-xs font-bold transition-all relative"
            :class="activeHistoryTab === 'received' ? 'text-white' : 'text-white/40 hover:text-white/60'"
          >
            دریافتی
            <span v-if="activeHistoryTab === 'received'" class="absolute bottom-0 left-0 w-full h-0.5 bg-[#b9f1cf] rounded-t-full shadow-[0_-2px_6px_rgba(185,241,207,0.4)]"></span>
          </button>
          <button 
            @click="activeHistoryTab = 'sent'"
            class="flex-1 pb-3 text-xs font-bold transition-all relative"
            :class="activeHistoryTab === 'sent' ? 'text-white' : 'text-white/40 hover:text-white/60'"
          >
            ارسالی
            <span v-if="activeHistoryTab === 'sent'" class="absolute bottom-0 left-0 w-full h-0.5 bg-rose-400 rounded-t-full shadow-[0_-2px_6px_rgba(251,113,133,0.4)]"></span>
          </button>
        </div>

        <div v-if="loadingHistory" class="flex justify-center py-10">
          <div class="w-6 h-6 border-2 border-[#b9f1cf] border-t-transparent rounded-full animate-spin"></div>
        </div>

        <div v-else-if="filteredHistory.length === 0" class="flex flex-col items-center justify-center py-10 opacity-40">
           <div class="bg-white/5 p-4 rounded-full mb-3">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
             </svg>
           </div>
           <span class="text-xs">تراکنشی یافت نشد</span>
        </div>

        <div v-else class="space-y-3">
          <div 
            v-for="item in filteredHistory" 
            :key="item._id"
            class="bg-[#12181b]/60 border border-white/5 rounded-xl p-3 flex items-center justify-between hover:border-white/10 transition-colors"
          >
             <div class="flex items-center gap-3">
               <div 
                 class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                 :class="activeHistoryTab === 'received' ? 'bg-[#b9f1cf]/10 text-[#b9f1cf]' : 'bg-rose-400/10 text-rose-400'"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 rotate-45" :class="activeHistoryTab === 'received' ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                 </svg>
               </div>
               <div>
                 <div class="text-sm font-bold text-white">
                    {{ formatWeight(item.amount) }} <span class="text-[10px] font-normal opacity-60">{{ item.type === 'gold' ? 'طلا' : 'نقره' }}</span>
                 </div>
                 <div class="text-[10px] text-white/40 mt-0.5">
                   {{ activeHistoryTab === 'received' ? 'از طرف:' : 'به:' }}
                   <span class="font-mono text-white/60">
                     {{ activeHistoryTab === 'received' ? getSenderName(item) : getReceiverName(item) }}
                   </span>
                 </div>
               </div>
             </div>
             
             <div class="text-left">
                <div class="text-[10px] text-white/30 dir-ltr font-mono">ID: {{ item._id.slice(-4) }}</div>
             </div>
          </div>
        </div>

      </div>

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
  formatMoney,
  init: initPrices,
  cleanup: cleanupPrices
} = usePrices();

// --- State ---
const user = ref({ refcode: '', gold: 0, silver: 0 }); // User profile
const history = ref([]); // Raw history list
const selectedMetal = ref("gold");
const targetInput = ref(""); // Refcode or Phone
const amountInput = ref("");
const activeHistoryTab = ref("received");
const submitting = ref(false);
const loadingHistory = ref(false);

// --- Computed ---
const canSubmit = computed(() => {
  return !submitting.value && 
         targetInput.value.length >= 4 && 
         Number(amountInput.value) > 0 && 
         Number(amountInput.value) <= user.value[selectedMetal.value];
});

const estimatedValue = computed(() => {
    const w = Number(amountInput.value) || 0;
    const p = selectedMetal.value === 'gold' ? currentGoldPrice.value : currentSilverPrice.value;
    if (p > 0) {
        return formatMoney(w * p);
    }
    return '---';
});

const filteredHistory = computed(() => {
  if (!user.value._id) return [];
  
  return history.value.filter(item => {
    if (activeHistoryTab.value === 'received') {
      return item.userref && item.userref._id === user.value._id;
    } else {
      return item.userid && item.userid._id === user.value._id;
    }
  });
});

// --- Methods ---
async function fetchProfile() {
  try {
    const { data } = await axios.get(`${url}/user/profile`);
    if(data.user) user.value = data.user;
  } catch (e) {
    console.error("Profile Error", e);
  }
}

async function fetchHistory() {
  loadingHistory.value = true;
  try {
    const { data } = await axios.get(`${url}/user/transfer/all`);
    history.value = Array.isArray(data) ? data : (data.data || []);
  } catch (e) {
    console.error("History Error", e);
  } finally {
    loadingHistory.value = false;
  }
}


async function submitTransfer() {
  submitting.value = true;
  try {
    const payload = {
      type: selectedMetal.value, // 'gold' or 'silver'
      amount: Number(amountInput.value),
      target: targetInput.value // refcode or phone
    };

    await axios.post(`${url}/user/transfer/create`, payload);

    Swal.fire({ 
      icon: "success", 
      title: "انتقال موفق",
      text: "عملیات با موفقیت انجام شد", 
      background: '#1a2220', 
      color: '#fff',
      confirmButtonColor: '#b9f1cf',
      confirmButtonText: '<span style="color:#0a1f14">باشه</span>'
    });

    amountInput.value = "";
    targetInput.value = "";
    await fetchProfile();
    await fetchHistory();

  } catch (e) {
    const msg = e.response?.data?.message || "خطا در انجام عملیات";
    Swal.fire({ icon: "error", text: msg, background: '#1a2220', color: '#fff' });
  } finally {
    submitting.value = false;
  }
}

function setMaxAmount() {
  amountInput.value = user.value[selectedMetal.value] || 0;
}

// Helpers
function getSenderName(item) {
  if (!item.userid) return 'ناشناس';
  return item.userid.fname ? `${item.userid.fname} ${item.userid.lname}` : (item.userid.phone || 'کاربر');
}

function getReceiverName(item) {
  if (!item.userref) return 'ناشناس';
  return item.userref.fname ? `${item.userref.fname} ${item.userref.lname}` : (item.userref.phone || 'کاربر');
}

function formatWeight(n) {
  if (!isFinite(n)) return "۰";
  return Number(n).toLocaleString("fa-IR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

// --- Lifecycle ---
onMounted(() => {
  fetchProfile();
  fetchHistory();
  initPrices();
});

onBeforeUnmount(() => {
  cleanupPrices();
});
</script>

<style scoped>
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: transparent; 
}
::-webkit-scrollbar-thumb {
  background: #334D44; 
  border-radius: 2px;
}
</style>