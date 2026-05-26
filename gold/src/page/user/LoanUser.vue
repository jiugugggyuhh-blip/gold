<template>
  <div dir="rtl" class="min-h-screen bg-base text-white font-sans pb-24">
    <div class="max-w-7xl mx-auto px-4 pt-6">
      
      <!-- Header & Tabs -->
      <header class="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-extrabold text-white flex items-center gap-2">
            <span class="p-2 rounded-xl bg-[#b9f1cf]/10 text-[#b9f1cf] shadow-[0_0_15px_rgba(185,241,207,0.15)]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            تسهیلات و وام‌ها
          </h1>
          <p class="text-white/50 text-sm mt-1">مدیریت وام‌ها و پرداخت آنلاین اقساط</p>
        </div>

        <div class="flex bg-[#141a1d] p-1 rounded-xl ring-1 ring-white/10">
          <button 
            @click="activeTab = 'plans'"
            :class="['px-5 py-2 rounded-lg text-sm font-bold transition-all', activeTab === 'plans' ? 'bg-[#b9f1cf] text-[#0a1f14] shadow-lg shadow-[#b9f1cf]/20' : 'text-white/60 hover:text-white']"
          >
            طرح‌های جدید
          </button>
          <button 
            @click="activeTab = 'my_loans'"
            :class="['px-5 py-2 rounded-lg text-sm font-bold transition-all', activeTab === 'my_loans' ? 'bg-[#b9f1cf] text-[#0a1f14] shadow-lg shadow-[#b9f1cf]/20' : 'text-white/60 hover:text-white']"
          >
            وام‌های من
          </button>
        </div>
      </header>

      <div v-if="loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#b9f1cf]"></div>
      </div>

      <div v-else>
        
        <!-- TAB 1: Available Plans -->
        <div v-if="activeTab === 'plans'">
          <div v-if="plans.length === 0" class="text-center py-16 bg-[#141a1d]/50 rounded-3xl border border-dashed border-white/10">
            <div class="text-4xl mb-2 opacity-50">📭</div>
            <p class="text-white/40">در حال حاضر طرح فعالی وجود ندارد.</p>
          </div>
          
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="plan in plans" 
              :key="plan._id"
              class="group relative overflow-hidden rounded-3xl bg-[#141a1d] border border-white/5 p-6 hover:border-[#b9f1cf]/30 transition-all duration-300 hover:-translate-y-1 shadow-xl"
            >
              <div class="absolute top-0 right-0 w-24 h-24 bg-[#b9f1cf]/5 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-[#b9f1cf]/10"></div>

              <div class="relative z-10">
                <div class="flex justify-between items-start mb-4">
                  <h3 class="text-xl font-bold text-white">{{ plan.title }}</h3>
                  <span class="px-3 py-1 rounded-full text-xs font-bold bg-[#b9f1cf]/10 text-[#b9f1cf] border border-[#b9f1cf]/20">
                    {{ plan.interestRate }}% سود
                  </span>
                </div>

                <div class="space-y-4 my-6">
                  <div class="flex justify-between items-center p-3 rounded-xl bg-white/5">
                    <span class="text-white/60 text-sm">مبلغ وام</span>
                    <span class="text-[#b9f1cf] font-mono font-bold text-lg">{{ formatMoney(plan.amount) }} <span class="text-xs text-white/50">تومان</span></span>
                  </div>
                  <div class="flex justify-between items-center px-2 text-sm">
                    <span class="text-white/60">بازپرداخت</span>
                    <span class="text-white font-bold">{{ plan.durationMonths }} ماهه</span>
                  </div>
                  <div class="flex justify-between items-center px-2 text-sm">
                     <span class="text-white/60">قسط ماهیانه (تقریبی)</span>
                     <span class="text-white font-mono">{{ calculateMonthly(plan) }}</span>
                  </div>
                </div>

                <button 
                  @click="requestLoan(plan)"
                  class="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#b9f1cf] to-[#9aeec0] text-[#0a1f14] font-bold shadow-lg shadow-[#b9f1cf]/20 hover:shadow-[#b9f1cf]/40 transition-all flex items-center justify-center gap-2"
                >
                  درخواست وام
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 2: My Loans -->
        <div v-if="activeTab === 'my_loans'">
          <div v-if="myLoans.length === 0" class="text-center py-16 bg-[#141a1d]/50 rounded-3xl border border-dashed border-white/10">
            <p class="text-white/40">شما هنوز وامی دریافت نکرده‌اید.</p>
          </div>

          <div v-else class="space-y-4">
            <div 
              v-for="loan in myLoans" 
              :key="loan._id"
              class="rounded-3xl bg-[#141a1d] border border-white/5 p-5 hover:border-white/10 transition"
            >
              <div class="flex flex-col md:flex-row items-center justify-between gap-6">
                
                <div class="flex items-center gap-4 w-full md:w-auto">
                  <div 
                    class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-white/5 shrink-0"
                    :class="getLoanStatusColor(loan.status).bg"
                  >
                    <i class="fas" :class="getLoanStatusIcon(loan.status)"></i>
                  </div>
                  <div>
                    <h4 class="font-bold text-white text-lg">{{ loan.title }}</h4>
                    <div class="text-xs text-white/50 mt-1 flex gap-3">
                      <span>{{ new Date(loan.createdAt).toLocaleDateString('fa-IR') }}</span>
                      <span v-if="loan.startDate">• شروع: {{ new Date(loan.startDate).toLocaleDateString('fa-IR') }}</span>
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap items-center gap-6 w-full md:w-auto justify-center md:justify-end">
                   <div class="text-center md:text-right">
                      <div class="text-[10px] text-white/40 mb-1">مبلغ کل بازپرداخت</div>
                      <div class="font-mono text-white font-bold">{{ formatMoney(loan.totalRepayment) }}</div>
                   </div>
                   <div class="text-center md:text-right">
                      <div class="text-[10px] text-white/40 mb-1">وضعیت</div>
                      <div class="font-bold text-sm" :class="{
                        'text-yellow-400': loan.status === 'pending',
                        'text-emerald-400': loan.status === 'active',
                        'text-rose-400': loan.status === 'rejected',
                        'text-blue-400': loan.status === 'paid' || loan.status === 'completed'
                      }">
                        {{ getStatusText(loan.status) }}
                      </div>
                   </div>
                   
                   <!-- Action Button -->
                   <button 
                     @click="openDetails(loan)"
                     class="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold transition flex items-center gap-2"
                   >
                     <span>جزئیات و اقساط</span>
                     <i class="fas fa-chevron-left text-xs"></i>
                   </button>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="mt-4 w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                 <div 
                   class="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                   :style="{ width: getProgress(loan) + '%' }"
                 ></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Loan Details & Installments Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
       <div class="relative w-full max-w-2xl rounded-3xl bg-[#141a1d] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scaleIn">
          
          <!-- Modal Header -->
          <div class="px-6 py-5 border-b border-white/5 bg-[#1a2220] flex justify-between items-center">
             <div>
                <h3 class="text-lg font-bold text-white">{{ selectedLoan?.title }}</h3>
                <p class="text-xs text-white/40 mt-0.5 font-mono">{{ selectedLoan?._id }}</p>
             </div>
             <button @click="closeModal" class="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition text-white/60 hover:text-white">✕</button>
          </div>

          <!-- Installments List -->
          <div class="flex-1 overflow-y-auto p-4 custom-scrollbar">
             <div v-if="!selectedLoan?.installments?.length" class="text-center py-10 text-white/40">
                لیست اقساط هنوز صادر نشده است (در انتظار تایید)
             </div>

             <div v-else class="space-y-3">
                <div 
                   v-for="inst in selectedLoan.installments" 
                   :key="inst._id"
                   class="flex items-center justify-between p-3 rounded-xl border transition-all"
                   :class="getInstallmentStyle(inst)"
                >
                   <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold bg-black/20">
                         {{ inst.number }}
                      </div>
                      <div>
                         <div class="text-sm font-bold text-white">{{ formatMoney(inst.amount) }} <span class="text-[10px] font-normal opacity-60">تومان</span></div>
                         <div class="text-[10px] opacity-70 font-mono mt-0.5">
                            سررسید: {{ new Date(inst.dueDate).toLocaleDateString('fa-IR') }}
                         </div>
                      </div>
                   </div>

                   <div>
                      <span v-if="inst.status === 'paid'" class="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 flex items-center gap-1">
                         <i class="fas fa-check"></i> پرداخت شد
                      </span>
                      
                      <button 
                         v-else
                         @click="payInstallment(inst)"
                         :disabled="!canPay(inst) || paying"
                         class="px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2"
                         :class="canPay(inst) 
                            ? 'bg-[#b9f1cf] text-[#0a1f14] hover:bg-[#9aeec0] shadow-lg shadow-[#b9f1cf]/10' 
                            : 'bg-white/5 text-white/30 cursor-not-allowed'"
                      >
                         <span v-if="paying && payingId === inst._id" class="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full"></span>
                         <span v-else>پرداخت</span>
                      </button>
                   </div>
                </div>
             </div>
          </div>

          <!-- Footer Info -->
          <div class="p-4 bg-[#1a2220] border-t border-white/5 text-center text-xs text-white/40">
             برای پرداخت، باید موجودی کیف پول تومانی شما کافی باشد.
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
const activeTab = ref('plans')
const loading = ref(true)
const plans = ref([])
const myLoans = ref([])
const showModal = ref(false)
const selectedLoan = ref(null)
const requesting = ref(false)
const paying = ref(false)
const payingId = ref(null)

onMounted(() => {
  fetchData()
})

async function fetchData() {
  loading.value = true
  try {
    const [plansRes, myLoansRes] = await Promise.all([
      axios.get(`${url}/user/loan/plans`),
      axios.get(`${url}/user/loan/my-loans`)
    ])
    
    plans.value = plansRes.data.data || []
    myLoans.value = myLoansRes.data.data || []
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// محاسبات پیش‌نمایش در مودال (برای درخواست)
function calculateMonthly(plan) {
  const amount = Number(plan.amount)
  // const rate = Number(plan.interestRate) // استفاده نشده
  const months = Number(plan.durationMonths)
  
  const profit = amount * (Number(plan.interestRate) / 100)
  const total = amount + profit
  const monthly = Math.ceil(total / months)

  return formatMoney(monthly) + ' تومان'
}

async function requestLoan(plan) {
    const result = await Swal.fire({
        title: 'تایید درخواست',
        text: `آیا از دریافت وام "${plan.title}" با سود ${plan.interestRate}٪ اطمینان دارید؟`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'بله، ثبت کن',
        cancelButtonText: 'انصراف',
        background: '#1a2220',
        color: '#fff',
        confirmButtonColor: '#b9f1cf',
        cancelButtonColor: '#374151'
    })

    if (!result.isConfirmed) return

    requesting.value = true
    try {
        await axios.post(`${url}/user/loan/request`, { planId: plan._id })
        
        Swal.fire({
            icon: 'success',
            title: 'موفق',
            text: 'درخواست شما ثبت شد. پس از تایید مدیریت، اقساط فعال می‌شوند.',
            background: '#1a2220', color: '#fff', confirmButtonColor: '#b9f1cf'
        })
        
        // رفرش
        const res = await axios.get(`${url}/user/loan/my-loans`)
        myLoans.value = res.data.data || []
        activeTab.value = 'my_loans'

    } catch (e) {
        Swal.fire({ icon: 'error', title: 'خطا', text: e.response?.data?.message, background: '#1a2220', color: '#fff' })
    } finally {
        requesting.value = false
    }
}

async function openDetails(loan) {
    try {
        const res = await axios.get(`${url}/user/loan/${loan._id}`)
        selectedLoan.value = res.data.data
        showModal.value = true
    } catch (e) {
        console.error(e)
    }
}

function closeModal() {
    showModal.value = false
    selectedLoan.value = null
}

async function payInstallment(inst) {
    paying.value = true
    payingId.value = inst._id
    
    try {
        const res = await axios.post(`${url}/user/loan/pay`, {
            loanId: selectedLoan.value._id,
            installmentNumber: inst.number
        })
        
        Swal.fire({
            toast: true, icon: 'success', title: 'قسط با موفقیت پرداخت شد', 
            position: 'top-end', showConfirmButton: false, timer: 3000,
            background: '#1a2220', color: '#fff'
        })
        
        // آپدیت وضعیت در UI
        inst.status = 'paid'
        inst.paidAt = new Date()
        
        // آپدیت موجودی کل در لیست
        const loanIdx = myLoans.value.findIndex(l => l._id === selectedLoan.value._id)
        if (loanIdx !== -1) {
             myLoans.value[loanIdx].totalPaid += inst.amount
             if (res.data.loanStatus === 'completed') {
                 myLoans.value[loanIdx].status = 'completed'
                 selectedLoan.value.status = 'completed'
             }
        }
        
    } catch (e) {
        Swal.fire({ icon: 'error', title: 'خطا', text: e.response?.data?.message, background: '#1a2220', color: '#fff' })
    } finally {
        paying.value = false
        payingId.value = null
    }
}

// Helpers
function canPay(inst) {
    if (selectedLoan.value.status !== 'active') return false
    const firstPending = selectedLoan.value.installments.find(i => i.status === 'pending')
    return firstPending && firstPending.number === inst.number
}

function isPastDue(dateStr) {
    return new Date(dateStr) < new Date()
}

function formatMoney(n) { return Number(n || 0).toLocaleString('fa-IR') }

function getStatusText(status) {
  const map = {
    'pending': 'در انتظار تایید',
    'approved': 'تایید شده',
    'active': 'فعال (واریز شده)',
    'rejected': 'رد شده',
    'paid': 'تسویه شده',
    'completed': 'تسویه کامل',
    'overdue': 'دارای تاخیر'
  }
  return map[status] || status
}

function getProgress(loan) {
    if (!loan.totalRepayment || loan.totalRepayment === 0) return 0
    return Math.min(100, Math.round((loan.totalPaid / loan.totalRepayment) * 100))
}

function getLoanStatusIcon(s) {
    const m = { pending: 'fa-clock', active: 'fa-chart-line', rejected: 'fa-times-circle', completed: 'fa-check-circle', overdue: 'fa-exclamation-triangle' }
    return m[s] || 'fa-info-circle'
}

function getLoanStatusColor(s) {
    const m = { 
        pending: { bg: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', bar: 'bg-yellow-500' }, 
        active: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', bar: 'bg-emerald-500' },
        completed: { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20', bar: 'bg-blue-500' },
        rejected: { bg: 'bg-rose-500/10 text-rose-500 border-rose-500/20', bar: 'bg-rose-500' },
        overdue: { bg: 'bg-orange-500/10 text-orange-500 border-orange-500/20', bar: 'bg-orange-500' }
    }
    return m[s] || { bg: 'bg-white/5', bar: 'bg-white/20' }
}

function getInstallmentStyle(inst) {
    if (inst.status === 'paid') return 'bg-emerald-500/5 border-emerald-500/20 opacity-60'
    if (inst.status === 'pending' && isPastDue(inst.dueDate)) return 'bg-rose-500/5 border-rose-500/30'
    if (canPay(inst)) return 'bg-[#b9f1cf]/5 border-[#b9f1cf]/40 ring-1 ring-[#b9f1cf]/20'
    return 'bg-white/5 border-white/5 opacity-50'
}
</script>

<style scoped>
@keyframes modalUp {
  from { opacity: 0; transform: scale(0.95) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-modal-up {
  animation: modalUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #334D44; border-radius: 10px; }
</style>