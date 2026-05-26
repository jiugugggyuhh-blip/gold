<template>
  <div class="flex min-h-screen bg-base text-white font-sans">
    <Sidebar />

    <div class="flex-1 flex flex-col mt-20 md:-mt-0 transition-all duration-300">
      
      <header class="mx-4 md:mx-6 mt-4 rounded-2xl bg-gradient-to-b from-[#1a2220]/90 to-[#12181b]/90 ring-1 ring-[#334D44]/60 backdrop-blur-xl shadow-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-xl bg-[#b9f1cf]/10 text-[#b9f1cf]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <h1 class="text-lg md:text-2xl font-extrabold text-white">مدیریت وام‌ها</h1>
            <span class="text-[10px] text-white/40 md:hidden">تعداد کل: {{ filteredLoans.length }}</span>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div class="flex bg-[#141a1d] p-1 rounded-xl ring-1 ring-white/10 w-full sm:w-auto">
            <button @click="filter = 'all'" :class="['flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all', filter === 'all' ? 'bg-[#b9f1cf] text-[#0a1f14]' : 'text-white/60']">همه</button>
            <button @click="filter = 'pending'" :class="['flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all', filter === 'pending' ? 'bg-amber-400 text-[#0a1f14]' : 'text-white/60']">در انتظار</button>
            <button @click="filter = 'active'" :class="['flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all', filter === 'active' ? 'bg-emerald-400 text-[#0a1f14]' : 'text-white/60']">فعال</button>
          </div>
          <div class="relative w-full sm:w-48">
             <input v-model="searchQuery" type="text" placeholder="جستجو کاربر..." class="block w-full p-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#b9f1cf] outline-none transition" />
          </div>
        </div>
      </header>

      <main class="p-4 md:p-6 flex-1 overflow-auto flex flex-col">
        <div v-if="loading" class="grid gap-4">
           <div v-for="i in 5" :key="i" class="h-20 rounded-2xl bg-[#141a1d] animate-pulse ring-1 ring-white/5"></div>
        </div>

        <div v-else class="flex-1">
          <div v-if="filteredLoans.length === 0" class="text-center py-20 text-white/40">موردی یافت نشد.</div>
          
          <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div v-for="loan in filteredLoans" :key="loan._id" class="rounded-2xl bg-[#141a1d] border border-white/5 p-5 relative overflow-hidden group hover:border-[#b9f1cf]/30 transition-all shadow-lg flex flex-col">
              <div class="absolute top-0 right-0 w-1.5 h-full" :class="getStatusColor(loan.status)"></div>
              
              <div class="flex justify-between items-start mb-4 pl-2">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-white/70 border border-white/10">
                    {{ (loan.user?.fname?.[0] || 'U').toUpperCase() }}
                  </div>
                  <div>
                    <div class="font-bold text-white text-sm">{{ loan.user?.fname }} {{ loan.user?.lname }}</div>
                    <div class="text-[10px] text-white/40 font-mono">{{ loan.user?.phone }}</div>
                  </div>
                </div>
                <span class="px-2 py-1 rounded text-[10px] font-bold border" :class="getStatusClass(loan.status)">{{ getStatusLabel(loan.status) }}</span>
              </div>

              <div class="bg-white/5 rounded-xl p-3 mb-3 border border-white/5 grid grid-cols-2 gap-y-3">
                 <div>
                    <div class="text-[10px] text-white/50 mb-1">مبلغ اصل وام</div>
                    <div class="text-sm font-bold text-white">{{ formatNumber(loan.amount) }} <span class="text-[9px] opacity-60">ت</span></div>
                 </div>
                 <div class="text-right">
                    <div class="text-[10px] text-white/50 mb-1">بازپرداخت کل</div>
                    <div class="text-sm font-bold text-[#b9f1cf]">{{ formatNumber(loan.totalRepayment) }} <span class="text-[9px] opacity-60">ت</span></div>
                 </div>
                 <div v-if="loan.status === 'active' || loan.status === 'completed'" class="col-span-2 pt-2 border-t border-white/5">
                    <div class="flex justify-between items-end">
                        <div class="text-[10px] text-white/50">پرداخت شده تا کنون</div>
                        <div class="text-xs font-bold text-emerald-400">{{ formatNumber(loan.totalPaid || 0) }} <span class="text-[9px] opacity-60">تومان</span></div>
                    </div>
                    <div class="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                        <div class="h-full bg-emerald-500 rounded-full" :style="{ width: calculateProgress(loan) + '%' }"></div>
                    </div>
                 </div>
              </div>

              <div class="grid grid-cols-2 gap-2 text-xs text-white/40 mb-4 px-1">
                <span>مدت: {{ loan.durationMonths }} ماه</span>
                <span class="text-left">سود: {{ loan.interestRate }}%</span>
                <span class="font-mono">ثبت: {{ new Date(loan.createdAt).toLocaleDateString('fa-IR') }}</span>
                <span v-if="loan.startDate" class="text-left font-mono text-emerald-400/60">شروع: {{ new Date(loan.startDate).toLocaleDateString('fa-IR') }}</span>
              </div>

              <div class="mt-auto space-y-2">
                  <button 
                    v-if="loan.status === 'pending'"
                    @click="openConfirmModal(loan)"
                    class="w-full py-2.5 rounded-xl bg-[#b9f1cf] text-[#0a1f14] font-bold text-sm hover:bg-[#9aeec0] shadow-lg shadow-[#b9f1cf]/10 transition flex items-center justify-center gap-2"
                  >
                    <i class="fas fa-check-circle"></i> بررسی و تایید
                  </button>
                  
                  <button 
                    @click="openDetailsModal(loan)"
                    class="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 font-bold text-xs border border-white/5 transition flex items-center justify-center gap-2"
                  >
                    <i class="fas fa-list-ul"></i> مشاهده اقساط و جزئیات
                  </button>
              </div>

            </div>
          </div>
        </div>
      </main>

      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div class="w-full max-w-sm rounded-3xl bg-[#0f1417] border border-white/10 shadow-2xl overflow-hidden animate-scaleIn">
          <div class="px-6 py-5 border-b border-white/5 bg-[#141a1e]">
            <h3 class="text-lg font-bold text-white">تایید نهایی وام</h3>
          </div>
          
          <div class="p-6 space-y-4 text-sm">
            <div class="text-white/80 leading-relaxed">
              آیا از تایید وام کاربر <span class="font-bold text-[#b9f1cf]">{{ selectedLoan?.user?.fname }}</span> اطمینان دارید؟
            </div>
            <div class="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex items-center gap-3">
              <i class="fas fa-coins text-emerald-400 text-xl"></i>
              <div>
                 <div class="text-[10px] text-emerald-300/70">مبلغ واریزی به کیف پول</div>
                 <div class="font-bold text-white text-lg">{{ formatNumber(selectedLoan?.amount) }} تومان</div>
              </div>
            </div>
            
            <textarea v-model="adminNote" rows="2" class="w-full bg-[#1a2220] border border-white/10 rounded-xl px-4 py-2 text-white text-xs outline-none transition mt-2" placeholder="یادداشت مدیر (اختیاری)..."></textarea>
          </div>

          <div class="px-6 py-5 bg-[#141a1e] border-t border-white/5 flex gap-3">
            <button @click="closeModal" class="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-bold text-xs transition">انصراف</button>
            <button @click="submitDecision('rejected')" class="flex-1 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white font-bold text-xs transition border border-rose-500/20">رد کردن</button>
            <button @click="submitDecision('active')" class="flex-[2] py-3 rounded-xl bg-[#b9f1cf] hover:bg-[#9aeec0] text-[#0a1f14] font-bold text-xs shadow-lg shadow-[#b9f1cf]/10 transition flex items-center justify-center gap-2">
              <span v-if="submitting" class="animate-spin h-3 w-3 border-2 border-[#0a1f14] border-t-transparent rounded-full"></span>
              تایید و واریز وجه
            </button>
          </div>
        </div>
      </div>

      <div v-if="showDetails" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div class="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0f1417] border border-white/10 shadow-2xl animate-scaleIn">
            <div class="px-6 py-4 border-b border-white/5 bg-[#141a1e] flex justify-between items-center">
                <h3 class="text-lg font-bold text-white">جزئیات اقساط</h3>
                <button @click="closeDetailsModal" class="text-white/40 hover:text-white transition"><i class="fas fa-times"></i></button>
            </div>
            
            <div class="p-6 overflow-y-auto custom-scrollbar">
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div>
                        <div class="text-[10px] text-white/50">متقاضی</div>
                        <div class="text-xs font-bold">{{ selectedLoan?.user?.fname }} {{ selectedLoan?.user?.lname }}</div>
                    </div>
                    <div>
                        <div class="text-[10px] text-white/50">مبلغ قسط</div>
                        <div class="text-xs font-bold text-[#b9f1cf]">{{ formatNumber(selectedLoan?.installments?.[0]?.amount) }}</div>
                    </div>
                    <div>
                        <div class="text-[10px] text-white/50">پرداخت شده</div>
                        <div class="text-xs font-bold text-emerald-400">{{ formatNumber(selectedLoan?.totalPaid) }}</div>
                    </div>
                    <div>
                        <div class="text-[10px] text-white/50">مانده وام</div>
                        <div class="text-xs font-bold text-rose-400">{{ formatNumber((selectedLoan?.totalRepayment || 0) - (selectedLoan?.totalPaid || 0)) }}</div>
                    </div>
                </div>

                <h4 class="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-[#b9f1cf]"></span>
                    لیست اقساط ({{ selectedLoan?.installments?.length || 0 }})
                </h4>
                
                <div class="space-y-2">
                    <div class="grid grid-cols-5 text-[10px] text-white/40 px-3 pb-2 border-b border-white/5">
                        <div class="col-span-1">شماره</div>
                        <div class="col-span-1">سررسید</div>
                        <div class="col-span-1 text-center">مبلغ</div>
                        <div class="col-span-1 text-center">وضعیت</div>
                        <div class="col-span-1 text-left">تاریخ پرداخت</div>
                    </div>

                    <div v-for="inst in selectedLoan?.installments" :key="inst._id" 
                         class="grid grid-cols-5 items-center p-3 rounded-xl border border-white/5 transition hover:bg-white/5 text-xs"
                         :class="inst.status === 'paid' ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-[#141a1d]'">
                        
                        <div class="font-bold text-white/80">قسط {{ inst.number }}</div>
                        <div class="font-mono text-white/60">{{ new Date(inst.dueDate).toLocaleDateString('fa-IR') }}</div>
                        <div class="text-center font-bold text-white">{{ formatNumber(inst.amount) }}</div>
                        
                        <div class="flex justify-center">
                            <span class="px-2 py-0.5 rounded text-[10px]" 
                                :class="inst.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 text-amber-400'">
                                {{ inst.status === 'paid' ? 'پرداخت شد' : 'منتظر پرداخت' }}
                            </span>
                        </div>
                        
                        <div class="text-left font-mono text-[10px] text-emerald-400/80">
                            {{ inst.paidAt ? new Date(inst.paidAt).toLocaleDateString('fa-IR') : '-' }}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="p-4 border-t border-white/5 bg-[#141a1e]">
                <button @click="closeDetailsModal" class="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs transition">بستن</button>
            </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import Sidebar from '@/components/admin/SidebarAdmin.vue'

const url = process.env.VUE_APP_API_URL || ''
const loans = ref([])
const loading = ref(true)
const filter = ref('all')
const searchQuery = ref('')

// Modals State
const showModal = ref(false)   // Approval Modal
const showDetails = ref(false) // Details Modal
const selectedLoan = ref(null)
const adminNote = ref('')
const submitting = ref(false)

onMounted(fetchLoans)

async function fetchLoans() {
  loading.value = true
  try {
    const res = await axios.get(`${url}/admin/loan/all`)
    loans.value = res.data.data || []
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const filteredLoans = computed(() => {
  let data = loans.value
  if (filter.value !== 'all') data = data.filter(l => l.status === filter.value)
  
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    data = data.filter(l => 
      (l.user?.fname + ' ' + l.user?.lname).toLowerCase().includes(q) ||
      (l.user?.phone || '').includes(q) ||
      String(l.amount).includes(q)
    )
  }
  return data
})

// Approval Logic
function openConfirmModal(loan) {
  selectedLoan.value = loan
  adminNote.value = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  if(!showDetails.value) selectedLoan.value = null // Only clear if not in details view
}

// Details Logic
function openDetailsModal(loan) {
    selectedLoan.value = loan
    showDetails.value = true
}

function closeDetailsModal() {
    showDetails.value = false
    selectedLoan.value = null
}

function calculateProgress(loan) {
    if (!loan.totalRepayment || !loan.totalPaid) return 0
    const p = (loan.totalPaid / loan.totalRepayment) * 100
    return Math.min(p, 100).toFixed(1)
}

async function submitDecision(status) {
  submitting.value = true
  try {
    await axios.post(`${url}/admin/loan/decide/${selectedLoan.value._id}`, {
      status,
      adminMessage: adminNote.value
    })

    Swal.fire({ 
        icon: 'success', 
        title: status === 'active' ? 'تایید شد' : 'رد شد',
        text: status === 'active' ? 'مبلغ وام به حساب کاربر واریز شد.' : 'درخواست رد شد.',
        toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, 
        background: '#1a2220', color: '#fff' 
    })
    
    closeModal()
    fetchLoans()
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'خطا', text: err.response?.data?.message, background: '#1a2220', color: '#fff' })
  } finally {
    submitting.value = false
  }
}

function formatNumber(n) { return Number(n || 0).toLocaleString('fa-IR') }
function getStatusLabel(s) { const m={pending:'در انتظار', active:'فعال', rejected:'رد شده', completed:'تسویه', overdue:'معوق'}; return m[s]||s }
function getStatusClass(s) { 
  if(s==='active') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  if(s==='rejected') return 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  if(s==='completed') return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
}
function getStatusColor(s) { if(s==='active') return 'bg-emerald-500'; if(s==='rejected') return 'bg-rose-500'; if(s==='completed') return 'bg-blue-500'; return 'bg-amber-500' }
</script>

<style scoped>
@keyframes scaleIn { from {opacity:0; transform:scale(0.95)} to {opacity:1; transform:scale(1)} }
.animate-scaleIn { animation: scaleIn 0.2s ease-out; }
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #334D44; border-radius: 4px; }
</style>