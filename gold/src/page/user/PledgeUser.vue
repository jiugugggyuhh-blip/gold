<template>
  <div dir="rtl" class="min-h-screen bg-base text-white font-sans pb-24">
    <div class="max-w-7xl mx-auto px-0 md:px-4 pt-6">
      
      <header class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-extrabold text-white flex items-center gap-2">
            <span class="p-2 rounded-xl bg-[#b9f1cf]/10 text-[#b9f1cf] shadow-[0_0_15px_rgba(185,241,207,0.15)]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </span>
            درخواست وام با وثیقه
          </h1>
          <p class="text-white/50 text-sm mt-1">دارایی خود را وثیقه بگذارید و آنی وام دریافت کنید</p>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div class="lg:col-span-4 space-y-6">
          <div class="rounded-3xl bg-[#141a1d] border border-[#334D44]/40 p-6 relative overflow-hidden shadow-2xl">
            
            <div class="flex justify-between items-center mb-6 p-4 rounded-2xl bg-gradient-to-r from-white/5 to-transparent border border-white/5">
              <span class="text-xs text-white/60">موجودی فعلی شما</span>
              <div class="flex flex-col items-end gap-1">
                <div class="flex items-center gap-1.5 text-sm font-bold">
                  <span class="text-[#ffd700]">{{ user?.gold || 0 }}</span>
                  <span class="text-[10px] text-white/40 font-normal">گرم طلا</span>
                </div>
                <div class="flex items-center gap-1.5 text-sm font-bold">
                  <span class="text-[#b9f1cf]">{{ formatMoney(user?.toman) }}</span>
                  <span class="text-[10px] text-white/40 font-normal">تومان</span>
                </div>
              </div>
            </div>

            <div class="space-y-6">
              <div>
                <label class="block text-xs font-bold text-white/70 mb-2">قصد وثیقه گذاشتن کدام دارایی را دارید؟</label>
                <div class="grid grid-cols-2 gap-3">
                  <button 
                    @click="setCollateralType('GOLD')"
                    class="py-3.5 rounded-xl text-sm font-bold transition-all border flex flex-col items-center gap-1 relative overflow-hidden group"
                    :class="form.collateralType === 'GOLD' ? 'bg-[#ffd700] text-[#0a1f14] border-[#ffd700]' : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'"
                  >
                    <span class="relative z-10">طلا</span>
                    <span class="text-[9px] font-normal opacity-70 relative z-10">دریافت وام تومانی</span>
                  </button>
                  <button 
                    @click="setCollateralType('TOMAN')"
                    class="py-3.5 rounded-xl text-sm font-bold transition-all border flex flex-col items-center gap-1 relative overflow-hidden group"
                    :class="form.collateralType === 'TOMAN' ? 'bg-[#b9f1cf] text-[#0a1f14] border-[#b9f1cf]' : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'"
                  >
                    <span class="relative z-10">تومان</span>
                    <span class="text-[9px] font-normal opacity-70 relative z-10">دریافت وام طلا</span>
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-white/70 mb-2">
                    مقدار وثیقه ({{ form.collateralType === 'GOLD' ? 'گرم' : 'تومان' }})
                </label>
                <div class="relative group">
                  <input 
                    v-model.number="form.collateralAmount" 
                    type="number" 
                    class="w-full bg-[#0a0e10] border border-white/10 rounded-xl px-4 py-4 text-white text-xl font-bold outline-none focus:border-[#b9f1cf] focus:ring-1 focus:ring-[#b9f1cf] transition text-center placeholder-white/10"
                    placeholder="0"
                  />
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-white/30 font-medium pointer-events-none">
                    {{ form.collateralType === 'GOLD' ? 'گرم' : 'تومان' }}
                  </span>
                </div>
                <div class="flex justify-between items-center mt-2 px-1">
                   <span class="text-[10px] text-white/40">موجودی در دسترس: {{ form.collateralType === 'GOLD' ? user?.gold : formatMoney(user?.toman) }}</span>
                   <button @click="maxAmount" class="text-[10px] text-[#b9f1cf] font-bold hover:underline">کل موجودی</button>
                </div>
              </div>

              <div>
                <div class="flex justify-between mb-2">
                    <label class="text-xs font-bold text-white/70">مدت زمان بازپرداخت</label>
                    <span class="text-[#b9f1cf] font-mono font-bold text-sm">{{ form.durationMonths }} ماه</span>
                </div>
                <div class="bg-[#0a0e10] border border-white/10 rounded-xl p-4">
                  <input 
                    v-model.number="form.durationMonths" 
                    type="range" min="1" max="12" step="1"
                    class="w-full accent-[#b9f1cf] h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <div class="flex justify-between mt-2 text-[10px] text-white/30">
                    <span>1 ماه</span>
                    <span>12 ماه</span>
                  </div>
                </div>
              </div>

              <div class="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-[11px] text-amber-200/80 leading-relaxed flex gap-3">
                <i class="fas fa-exclamation-triangle mt-0.5"></i>
                <div>
                  با ثبت این درخواست، مبلغ 
                  <span class="font-bold text-white">{{ formatNumber(form.collateralAmount || 0) }} {{ form.collateralType === 'GOLD' ? 'گرم' : 'تومان' }}</span>
                  از حساب شما <span class="text-rose-400">بلوکه</span> می‌شود و پس از تایید مدیر، مبلغ وام به کیف پول شما واریز می‌گردد.
                </div>
              </div>

              <button 
                @click="submitRequest"
                :disabled="submitting || !form.collateralAmount || form.collateralAmount <= 0"
                class="w-full py-4 rounded-xl bg-[#b9f1cf] text-[#0a1f14] font-bold text-sm shadow-[0_5px_20px_-5px_rgba(185,241,207,0.3)] hover:bg-[#9aeec0] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span v-if="submitting" class="animate-spin h-4 w-4 border-2 border-[#0a1f14] border-t-transparent rounded-full"></span>
                <span>ثبت درخواست و بلوکه کردن وثیقه</span>
              </button>
            </div>
          </div>
        </div>

        <div class="lg:col-span-8 space-y-4">
          <div class="flex items-center justify-between px-2 border-b border-white/5 pb-4 mb-2">
            <h2 class="text-lg font-bold text-white">تاریخچه وثیقه‌ها</h2>
            <button @click="fetchData" class="text-xs flex items-center gap-2 text-white/40 hover:text-[#b9f1cf] transition">
                <i class="fas fa-sync-alt" :class="{'animate-spin': loading}"></i> بروزرسانی
            </button>
          </div>
          
          <div v-if="loading" class="space-y-3">
             <div v-for="i in 3" :key="i" class="h-28 rounded-2xl bg-[#141a1d] animate-pulse ring-1 ring-white/5"></div>
          </div>

          <div v-else>
            <div v-if="pledges.length === 0" class="flex flex-col items-center justify-center py-20 bg-[#141a1d] rounded-3xl border border-dashed border-white/10">
              <div class="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 text-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <p class="text-white/50 font-bold">هیچ درخواستی یافت نشد</p>
              <p class="text-white/30 text-xs mt-1">اولین درخواست خود را از منوی سمت راست ثبت کنید.</p>
            </div>

            <div v-else class="grid gap-4">
              <div 
                v-for="item in pledges" 
                :key="item._id"
                class="rounded-2xl bg-[#141a1d] border border-white/5 p-5 hover:border-white/10 transition relative overflow-hidden flex flex-col md:flex-row gap-5"
              >
                <div class="absolute top-0 right-0 md:left-0 md:right-auto w-1.5 md:w-1 h-full" :class="getStatusColor(item.status)"></div>

                <div class="flex-1">
                    <div class="flex items-center justify-between mb-3 pl-2">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg" 
                                :class="item.collateralType === 'GOLD' ? 'bg-[#ffd700]/10 text-[#ffd700]' : 'bg-[#b9f1cf]/10 text-[#b9f1cf]'">
                                <i class="fas" :class="item.collateralType === 'GOLD' ? 'fa-coins' : 'fa-money-bill-wave'"></i>
                            </div>
                            <div>
                                <div class="text-xs text-white/50">وثیقه گذاشته شده</div>
                                <div class="font-bold text-white text-lg">
                                    {{ formatNumber(item.collateralAmount) }} 
                                    <span class="text-xs font-normal opacity-70">{{ item.collateralType === 'GOLD' ? 'گرم طلا' : 'تومان' }}</span>
                                </div>
                            </div>
                        </div>
                        <span class="px-3 py-1.5 rounded-lg text-[10px] font-bold border" :class="getStatusClass(item.status)">
                            {{ getStatusLabel(item.status) }}
                        </span>
                    </div>

                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white/5 rounded-xl p-3 border border-white/5">
                        <div>
                            <div class="text-[10px] text-white/40">نوع وام</div>
                            <div class="text-xs font-bold text-white">{{ item.loanType === 'GOLD' ? 'دریافت طلا' : 'دریافت تومان' }}</div>
                        </div>
                        <div>
                            <div class="text-[10px] text-white/40">مدت زمان</div>
                            <div class="text-xs font-bold text-white">{{ item.durationMonths }} ماهه</div>
                        </div>
                        <div>
                            <div class="text-[10px] text-white/40">تاریخ درخواست</div>
                            <div class="text-xs font-bold text-white font-mono">{{ new Date(item.createdAt).toLocaleDateString('fa-IR') }}</div>
                        </div>
                         <div v-if="item.loanAmountGiven">
                            <div class="text-[10px] text-emerald-400/70">وام دریافتی</div>
                            <div class="text-xs font-bold text-emerald-400">{{ formatNumber(item.loanAmountGiven) }} {{ item.loanType === 'GOLD' ? 'گرم' : 'تومان' }}</div>
                        </div>
                        <div v-else>
                            <div class="text-[10px] text-white/40">مبلغ وام</div>
                            <div class="text-xs text-white/30">محاسبه توسط مدیریت</div>
                        </div>
                    </div>
                </div>

                <div v-if="item.adminNote" class="md:w-64 bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col justify-center">
                    <span class="text-[10px] text-white/40 mb-1 flex items-center gap-1">
                        <i class="fas fa-comment-alt"></i> یادداشت مدیریت:
                    </span>
                    <p class="text-xs leading-relaxed" :class="item.status === 'rejected' ? 'text-rose-300' : 'text-white/80'">
                        {{ item.adminNote }}
                    </p>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

const url = process.env.VUE_APP_API_URL || ''
const user = ref(null)
const pledges = ref([])
const loading = ref(true)
const submitting = ref(false)

const form = ref({
  collateralType: 'GOLD',
  loanType: 'TOMAN',
  collateralAmount: '',
  durationMonths: 6
})

onMounted(() => {
  fetchData()
})

async function fetchData() {
  loading.value = true
  try {
    const [profileRes, pledgesRes] = await Promise.all([
      axios.get(`${url}/user/profile`),
      axios.get(`${url}/user/pledge/my`)
    ])
    user.value = profileRes.data.user
    pledges.value = pledgesRes.data.data || []
    
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

function setCollateralType(type) {
    form.value.collateralType = type;
    // منطق معکوس: اگر وثیقه طلا باشد، وام تومان است و برعکس
    form.value.loanType = type === 'GOLD' ? 'TOMAN' : 'GOLD';
    form.value.collateralAmount = ''; // ریست کردن مقدار
}

function maxAmount() {
    if(form.value.collateralType === 'GOLD') {
        form.value.collateralAmount = user.value?.gold || 0;
    } else {
        form.value.collateralAmount = user.value?.toman || 0;
    }
}

async function submitRequest() {
  if (!form.value.collateralAmount || form.value.collateralAmount <= 0) {
    Swal.fire({ icon: 'warning', text: 'مقدار وثیقه معتبر نیست.', background: '#1a2220', color: '#fff' })
    return
  }

  // چک کردن موجودی سمت کلاینت برای تجربه کاربری بهتر
  if (form.value.collateralType === 'GOLD' && (user.value?.gold || 0) < form.value.collateralAmount) {
    Swal.fire({ icon: 'error', title: 'موجودی ناکافی', text: 'طلای کافی در کیف پول خود ندارید.', background: '#1a2220', color: '#fff' })
    return
  }
  if (form.value.collateralType === 'TOMAN' && (user.value?.toman || 0) < form.value.collateralAmount) {
    Swal.fire({ icon: 'error', title: 'موجودی ناکافی', text: 'تومان کافی در کیف پول خود ندارید.', background: '#1a2220', color: '#fff' })
    return
  }

  submitting.value = true
  try {
    await axios.post(`${url}/user/pledge/request`, form.value)
    
    Swal.fire({
      icon: 'success',
      title: 'درخواست ثبت شد',
      text: 'مبلغ وثیقه بلوکه شد و درخواست شما جهت بررسی ارسال گردید.',
      background: '#1a2220',
      color: '#fff',
      confirmButtonColor: '#b9f1cf',
      confirmButtonText: 'بسیار عالی'
    })
    
    form.value.collateralAmount = ''
    await fetchData() // رفرش کردن دیتا برای دیدن تغییر موجودی و لیست جدید

  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'خطا',
      text: err.response?.data?.message || 'خطایی رخ داد.',
      background: '#1a2220',
      color: '#fff'
    })
  } finally {
    submitting.value = false
  }
}

function formatMoney(n) {
  if (!n) return '0'
  return Number(n).toLocaleString('fa-IR')
}

function formatNumber(n) {
  return Number(n || 0).toLocaleString('fa-IR')
}

// مدیریت لیبل وضعیت‌ها
function getStatusLabel(status) {
  const map = { 
      'pending': 'در انتظار بررسی', 
      'active': 'فعال (وام پرداخت شده)', 
      'rejected': 'رد شده', 
      'released': 'وثیقه آزاد شد' // وضعیت جدید
  }
  return map[status] || status
}

// مدیریت استایل وضعیت‌ها
function getStatusClass(status) {
  if (status === 'active') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  if (status === 'rejected') return 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  if (status === 'released') return 'bg-blue-500/10 text-blue-400 border-blue-500/20' // رنگ آبی برای آزاد شده
  return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
}

function getStatusColor(status) {
  if (status === 'active') return 'bg-emerald-500'
  if (status === 'rejected') return 'bg-rose-500'
  if (status === 'released') return 'bg-blue-500' // نوار رنگی آبی
  return 'bg-amber-500'
}
</script>

<style scoped>
/* اسکرول بار زیبا اگر لیست طولانی شد */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>