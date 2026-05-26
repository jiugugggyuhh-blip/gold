<template>
  <div dir="rtl" class="min-h-screen bg-[#0f1417] text-white font-sans pb-24 relative overflow-hidden">
    <!-- Ambient Background Effects -->
    <div class="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div class="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#b9f1cf]/5 rounded-full blur-[120px]"></div>
        <div class="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px]"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 pt-6 relative z-10">
      
      <!-- Header -->
      <header class="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
        <div class="flex items-center gap-4 w-full md:w-auto">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#b9f1cf] to-[#10b981] flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
             <i class="fas fa-hand-holding-heart text-[#0a1f14] text-2xl"></i>
          </div>
          <div>
            <h1 class="text-2xl font-black text-white tracking-tight">خیریه و نذورات</h1>
            <p class="text-white/50 text-sm mt-1 font-medium">مشارکت در کار خیر با دارایی‌های دیجیتال</p>
          </div>
        </div>

        <div class="flex items-center gap-3 bg-[#1a2220]/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/5 w-full md:w-auto">
           <div class="px-4 py-2 rounded-xl bg-white/5 text-xs text-white/80 border border-white/5 flex-1 md:flex-none text-center">
              تعداد کمک‌ها: <span class="font-bold text-[#b9f1cf] text-base mx-1">{{ donations.length }}</span> مورد
           </div>
           <button @click="fetchData" class="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-95 shrink-0">
             <i class="fas fa-sync-alt"></i>
           </button>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Left Column: Donation Form -->
        <div class="lg:col-span-4 space-y-6">
          <div class="relative group">
            <div class="absolute -inset-0.5 bg-gradient-to-r from-[#b9f1cf] to-emerald-600 rounded-3xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
            <div class="relative rounded-3xl bg-[#141a1d] border border-white/10 p-6 shadow-2xl">
              
              <!-- Balances Mini -->
              <div class="bg-gradient-to-r from-[#1a2220] to-[#12181b] rounded-2xl p-4 border border-white/5 mb-6">
                <div class="flex justify-between items-center mb-3">
                    <span class="text-xs font-bold text-white/50 uppercase tracking-wider">موجودی قابل برداشت</span>
                    <i class="fas fa-wallet text-white/20"></i>
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex flex-col">
                        <span class="text-[10px] text-white/40 mb-0.5">طلا</span>
                        <div class="text-[#ffd700] font-bold text-lg flex items-end gap-1 leading-none">
                            {{ user?.gold || 0 }} <span class="text-[10px] font-normal opacity-70 mb-0.5">گرم</span>
                        </div>
                    </div>
                    <div class="w-px h-8 bg-white/10"></div>
                    <div class="flex flex-col items-end">
                        <span class="text-[10px] text-white/40 mb-0.5">تومان</span>
                        <div class="text-[#b9f1cf] font-bold text-lg flex items-end gap-1 leading-none">
                            {{ formatMoney(user?.toman) }} <span class="text-[10px] font-normal opacity-70 mb-0.5">ت</span>
                        </div>
                    </div>
                </div>
              </div>

              <!-- Form -->
              <div class="space-y-5">
                
                <!-- Currency Selector -->
                <div>
                  <label class="block text-xs font-bold text-white/70 mb-2">انتخاب دارایی</label>
                  <div class="grid grid-cols-2 gap-3">
                    <button 
                      @click="form.currencyType = 'GOLD'"
                      class="relative overflow-hidden rounded-2xl p-3 border-2 transition-all duration-300 flex flex-col items-center justify-center gap-1 group/btn"
                      :class="form.currencyType === 'GOLD' ? 'bg-[#ffd700]/10 border-[#ffd700] text-[#ffd700]' : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'"
                    >
                      <i class="fas fa-coins text-xl mb-1"></i>
                      <span class="text-sm font-bold">طلا</span>
                      <span class="text-[9px] opacity-70">گرم</span>
                      <div v-if="form.currencyType === 'GOLD'" class="absolute inset-0 bg-[#ffd700]/5 blur-md"></div>
                    </button>

                    <button 
                      @click="form.currencyType = 'TOMAN'"
                      class="relative overflow-hidden rounded-2xl p-3 border-2 transition-all duration-300 flex flex-col items-center justify-center gap-1 group/btn"
                      :class="form.currencyType === 'TOMAN' ? 'bg-[#b9f1cf]/10 border-[#b9f1cf] text-[#b9f1cf]' : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'"
                    >
                      <i class="fas fa-money-bill-wave text-xl mb-1"></i>
                      <span class="text-sm font-bold">تومان</span>
                      <span class="text-[9px] opacity-70">نقد</span>
                      <div v-if="form.currencyType === 'TOMAN'" class="absolute inset-0 bg-[#b9f1cf]/5 blur-md"></div>
                    </button>
                  </div>
                </div>

                <!-- Amount Input -->
                <div>
                  <label class="block text-xs font-bold text-white/70 mb-2">مقدار اهدا</label>
                  <div class="relative">
                    <input 
                      v-model.number="form.amount" 
                      type="number" 
                      class="w-full bg-[#0a0e10] border border-white/10 rounded-2xl px-4 py-4 text-white text-xl font-bold outline-none text-center placeholder-white/10 transition-all focus:border-white/30 focus:shadow-[0_0_20px_rgba(255,255,255,0.05)] font-mono"
                      placeholder="0"
                    />
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold" 
                          :class="form.currencyType === 'GOLD' ? 'text-[#ffd700]' : 'text-[#b9f1cf]'">
                      {{ form.currencyType === 'GOLD' ? 'گرم' : 'تومان' }}
                    </span>
                  </div>
                   <div class="text-right mt-2 h-4" >
                     <transition name="fade">
                       <span v-if="form.amount > 0 && form.currencyType === 'TOMAN'" class="text-[10px] text-white/40 block">
                         {{ formatMoney(form.amount) }} تومان
                       </span>
                     </transition>
                  </div>
                </div>

                <!-- Message Input -->
                <div>
                  <label class="block text-xs font-bold text-white/70 mb-2">پیام یا نیت (اختیاری)</label>
                  <textarea 
                    v-model="form.message" 
                    rows="3" 
                    class="w-full bg-[#0a0e10] border border-white/10 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-white/30 transition placeholder-white/20 resize-none"
                    placeholder="نیت خیر خود را بنویسید..."
                  ></textarea>
                </div>

                <!-- Submit Button -->
                <button 
                  @click="submitDonation"
                  :disabled="submitting || !form.amount || form.amount <= 0"
                  class="w-full py-4 rounded-2xl font-bold text-sm shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group/submit"
                  :class="form.currencyType === 'GOLD' 
                    ? 'bg-gradient-to-r from-[#ffd700] to-[#eab308] text-[#3f2e00] shadow-[#ffd700]/20 hover:shadow-[#ffd700]/40' 
                    : 'bg-gradient-to-r from-[#b9f1cf] to-[#10b981] text-[#0a1f14] shadow-[#10b981]/20 hover:shadow-[#10b981]/40'"
                >
                  <div class="absolute inset-0 bg-white/20 translate-y-full group-hover/submit:translate-y-0 transition-transform duration-300"></div>
                  <span v-if="submitting" class="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full"></span>
                  <span v-else class="relative z-10 flex items-center gap-2">
                    پرداخت نذورات
                    <i class="fas fa-heart"></i>
                  </span>
                </button>

              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: History -->
        <div class="lg:col-span-8">
           <div class="rounded-3xl bg-[#141a1d] border border-[#334D44]/40 p-6 min-h-[500px] flex flex-col">
              <div class="flex items-center justify-between mb-6">
                 <h2 class="text-lg font-bold text-white flex items-center gap-2">
                    <span class="w-1.5 h-6 bg-[#b9f1cf] rounded-full"></span>
                    تاریخچه نذورات
                 </h2>
                 <!-- Filter Tabs (Visual Only for now) -->
                 <div class="flex bg-white/5 rounded-xl p-1">
                    <button class="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#b9f1cf] text-[#0a1f14]">همه</button>
                    <button class="px-3 py-1.5 rounded-lg text-xs font-medium text-white/50 hover:text-white">طلا</button>
                    <button class="px-3 py-1.5 rounded-lg text-xs font-medium text-white/50 hover:text-white">نقدی</button>
                 </div>
              </div>

              <div v-if="loading" class="space-y-3 flex-1">
                 <div v-for="i in 4" :key="i" class="h-20 rounded-2xl bg-white/5 animate-pulse"></div>
              </div>

              <div v-else class="flex-1">
                <div v-if="donations.length === 0" class="h-full flex flex-col items-center justify-center text-center opacity-50 py-20">
                  <div class="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/5">
                    <i class="fas fa-hand-holding-heart text-3xl text-white/30"></i>
                  </div>
                  <p class="text-white/60 font-medium">هنوز هیچ کمکی ثبت نشده است.</p>
                  <p class="text-white/30 text-xs mt-1">اولین نیت خیر خود را ثبت کنید.</p>
                </div>

                <div v-else class="space-y-3 overflow-y-auto custom-scrollbar max-h-[600px] pr-2">
                  <div 
                    v-for="(item, index) in donations" 
                    :key="item._id"
                    class="group relative overflow-hidden rounded-2xl bg-white/5 hover:bg-white/[0.07] border border-white/5 transition-all duration-300 hover:border-white/10 hover:translate-x-1"
                    :style="{ animationDelay: `${index * 50}ms` }"
                  >
                    <!-- Type Indicator Bar -->
                    <div class="absolute right-0 top-0 bottom-0 w-1" :class="item.currencyType === 'GOLD' ? 'bg-[#ffd700]' : 'bg-[#b9f1cf]'"></div>

                    <div class="flex flex-col sm:flex-row sm:items-center justify-between p-4 pl-4 pr-5 gap-4">
                      
                      <!-- Icon & Info -->
                      <div class="flex items-center gap-4">
                        <div 
                          class="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner border border-white/10 transition-transform group-hover:scale-110 shrink-0"
                          :class="item.currencyType === 'GOLD' ? 'bg-[#ffd700]/10 text-[#ffd700]' : 'bg-[#b9f1cf]/10 text-[#b9f1cf]'"
                        >
                          <i class="fas" :class="item.currencyType === 'GOLD' ? 'fa-ring' : 'fa-hand-holding-usd'"></i>
                        </div>
                        <div>
                          <div class="text-sm font-bold text-white mb-1">
                            کمک {{ item.currencyType === 'GOLD' ? 'طلا' : 'نقدی' }}
                          </div>
                          <div class="flex items-center gap-3 text-[10px] text-white/40 font-mono">
                             <span class="flex items-center gap-1"><i class="far fa-calendar"></i> {{ new Date(item.createdAt).toLocaleDateString('fa-IR') }}</span>
                             <span class="flex items-center gap-1"><i class="far fa-clock"></i> {{ new Date(item.createdAt).toLocaleTimeString('fa-IR', {hour: '2-digit', minute:'2-digit'}) }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Amount & Message -->
                      <div class="flex flex-col sm:items-end gap-1">
                         <div class="text-[10px] text-white/40">مبلغ اهدا شده</div>
                         <div class="font-mono text-xl font-black tracking-tight flex items-baseline gap-1" :class="item.currencyType === 'GOLD' ? 'text-[#ffd700]' : 'text-[#b9f1cf]'">
                            {{ formatMoney(item.amount) }} 
                            <span class="text-xs font-bold opacity-70 font-sans">{{ item.currencyType === 'GOLD' ? 'گرم' : 'تومان' }}</span>
                         </div>
                      </div>

                    </div>

                    <!-- Message Section (if exists) -->
                    <div v-if="item.message" class="mx-4 mb-4 mt-1 pt-3 border-t border-white/5">
                        <p class="text-xs text-white/60 italic flex items-start gap-2">
                           <i class="fas fa-quote-right text-white/20 mt-1"></i>
                           {{ item.message }}
                        </p>
                    </div>
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
const donations = ref([])
const loading = ref(true)
const submitting = ref(false)

const form = ref({
  currencyType: 'TOMAN',
  amount: '',
  message: ''
})

onMounted(() => {
  fetchData()
})

async function fetchData() {
  loading.value = true
  try {
    const [profileRes, donationsRes] = await Promise.all([
      axios.get(`${url}/user/profile`),
      axios.get(`${url}/user/my-donations`)
    ])
    
    // دریافت اطلاعات کاربر (شامل طلا و تومان) مستقیماً از پروفایل
    if (profileRes.data && profileRes.data.user) {
        user.value = profileRes.data.user
    }
    
    donations.value = donationsRes.data.data || []

  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

async function submitDonation() {
  if (!form.value.amount || form.value.amount <= 0) {
    Swal.fire({ icon: 'warning', text: 'لطفاً مقدار معتبری وارد کنید.', background: '#1a2220', color: '#fff' })
    return
  }

  // Client-side balance check
  if (form.value.currencyType === 'GOLD' && (user.value?.gold || 0) < form.value.amount) {
     Swal.fire({ icon: 'error', title: 'موجودی ناکافی', text: 'موجودی طلای شما برای این اهدا کافی نیست.', background: '#1a2220', color: '#fff' })
     return
  }
  if (form.value.currencyType === 'TOMAN' && (user.value?.toman || 0) < form.value.amount) {
     Swal.fire({ icon: 'error', title: 'موجودی ناکافی', text: 'موجودی تومان شما برای این اهدا کافی نیست.', background: '#1a2220', color: '#fff' })
     return
  }

  const result = await Swal.fire({
    title: 'تایید اهدا',
    text: `آیا از اهدای ${formatMoney(form.value.amount)} ${form.value.currencyType === 'GOLD' ? 'گرم طلا' : 'تومان'} اطمینان دارید؟`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'بله، اهدا می‌کنم',
    cancelButtonText: 'انصراف',
    background: '#1a2220',
    color: '#fff',
    confirmButtonColor: form.value.currencyType === 'GOLD' ? '#ffd700' : '#10b981',
    cancelButtonColor: '#374151'
  })

  if (!result.isConfirmed) return

  submitting.value = true
  try {
    const res = await axios.post(`${url}/user/donate`, form.value)
    
    Swal.fire({
      icon: 'success',
      title: 'قبول باشد',
      text: res.data.message,
      background: '#1a2220', color: '#fff', confirmButtonColor: '#b9f1cf'
    })
    
    // Reset & Refresh
    form.value.amount = ''
    form.value.message = ''
    await fetchData() // موجودی‌ها آپدیت می‌شوند

  } catch (e) {
    Swal.fire({ icon: 'error', title: 'خطا', text: e.response?.data?.message || 'خطایی رخ داد', background: '#1a2220', color: '#fff' })
  } finally {
    submitting.value = false
  }
}

function formatMoney(n) {
  if (!n) return '0'
  return Number(n).toLocaleString('fa-IR')
}
</script>

<style scoped>
/* Custom Scrollbar for global page if needed */
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #334D44; border-radius: 10px; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>