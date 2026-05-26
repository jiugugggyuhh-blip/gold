<template>
  <div class="flex min-h-screen bg-base text-white font-sans">
    <Sidebar />

    <div class="flex-1 flex flex-col mt-20 md:-mt-0 transition-all duration-300">
      
      <header class="mx-4 md:mx-6 mt-4 rounded-2xl bg-gradient-to-b from-[#1a2220]/90 to-[#12181b]/90 ring-1 ring-[#334D44]/60 backdrop-blur-xl shadow-xl p-4 flex flex-col xl:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3 w-full xl:w-auto">
          <div class="p-2.5 rounded-xl bg-[#b9f1cf]/10 text-[#b9f1cf] shadow-[0_0_15px_rgba(185,241,207,0.1)]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
          <div>
            <h1 class="text-lg md:text-2xl font-extrabold text-white">مدیریت وثیقه‌ها</h1>
            <span class="text-[10px] text-white/40">تعداد نمایش: {{ filteredList.length }}</span>
          </div>
        </div>
        
        <div class="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
           <div class="flex bg-[#141a1d] p-1 rounded-xl ring-1 ring-white/10 w-full sm:w-auto overflow-x-auto">
            <button @click="setFilter('all')" :class="['flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all', filter === 'all' ? 'bg-[#b9f1cf] text-[#0a1f14]' : 'text-white/60 hover:text-white']">همه</button>
            <button @click="setFilter('pending')" :class="['flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all', filter === 'pending' ? 'bg-amber-400 text-[#0a1f14]' : 'text-white/60 hover:text-white']">در انتظار</button>
            <button @click="setFilter('active')" :class="['flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all', filter === 'active' ? 'bg-emerald-400 text-[#0a1f14]' : 'text-white/60 hover:text-white']">فعال (تایید شده)</button>
            <button @click="setFilter('released')" :class="['flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all', filter === 'released' ? 'bg-blue-400 text-[#0a1f14]' : 'text-white/60 hover:text-white']">آزاد شده</button>
          </div>

          <div class="relative w-full sm:w-56">
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
               <svg class="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="جستجو..." 
              class="block w-full p-2.5 pr-9 text-xs rounded-xl bg-white/5 border border-white/10 placeholder-white/40 text-white focus:ring-1 focus:ring-[#b9f1cf] focus:border-[#b9f1cf] outline-none transition" 
            />
          </div>
        </div>
      </header>

      <main class="p-4 md:p-6 flex-1 overflow-auto flex flex-col">
        <div v-if="loading" class="grid gap-4">
           <div v-for="i in 5" :key="i" class="h-16 rounded-2xl bg-[#141a1d] animate-pulse ring-1 ring-white/5"></div>
        </div>
        
        <div v-else class="flex-1 flex flex-col">
          <div v-if="filteredList.length === 0" class="flex flex-col items-center justify-center py-20 bg-[#141a1d]/50 rounded-3xl border border-dashed border-white/10">
             <div class="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-2xl mb-3">📭</div>
             <p class="text-white/40 text-sm">موردی یافت نشد.</p>
          </div>
          
          <div v-else class="flex-1">
            
            <div class="hidden md:block rounded-2xl bg-[#141a1d]/90 backdrop-blur-xl ring-1 ring-[#334D44]/40 shadow-xl overflow-hidden mb-4">
              <div class="overflow-x-auto custom-scrollbar">
                <table class="min-w-full divide-y divide-white/5">
                  <thead class="bg-white/5">
                    <tr>
                      <th class="px-6 py-4 text-right text-xs font-bold text-[#b9f1cf]">کاربر</th>
                      <th class="px-6 py-4 text-center text-xs font-bold text-white/50">وثیقه (بلوکه شده)</th>
                      <th class="px-6 py-4 text-center text-xs font-bold text-white/50">نوع وام</th>
                      <th class="px-6 py-4 text-center text-xs font-bold text-white/50">تاریخ</th>
                      <th class="px-6 py-4 text-center text-xs font-bold text-white/50">وضعیت</th>
                      <th class="px-6 py-4 text-center text-xs font-bold text-white/50">عملیات</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/5">
                    <tr v-for="item in paginatedList" :key="item._id" class="group hover:bg-white/[0.02] transition-colors">
                      
                      <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                          <div class="w-9 h-9 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-xs font-bold text-white/70 border border-white/10">
                            {{ (item.user?.fname?.[0] || 'U').toUpperCase() }}
                          </div>
                          <div>
                            <div class="text-sm font-bold text-white">{{ item.user?.fname }} {{ item.user?.lname }}</div>
                            <div class="text-[10px] text-white/40 font-mono tracking-wider">{{ item.user?.phone }}</div>
                          </div>
                        </div>
                      </td>

                      <td class="px-6 py-4 text-center">
                        <div class="flex flex-col items-center">
                           <span class="font-bold text-white text-sm">{{ formatNumber(item.collateralAmount) }}</span>
                           <span class="text-[10px] text-white/50">{{ item.collateralType === 'GOLD' ? 'گرم طلا' : 'تومان' }}</span>
                        </div>
                      </td>

                      <td class="px-6 py-4 text-center">
                         <div class="inline-flex items-center px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">
                            <span class="text-xs font-bold" :class="item.loanType === 'GOLD' ? 'text-[#ffd700]' : 'text-[#b9f1cf]'">
                                {{ item.loanType === 'GOLD' ? 'دریافت طلا' : 'دریافت تومان' }}
                            </span>
                         </div>
                      </td>

                      <td class="px-6 py-4 text-center">
                        <div class="flex flex-col items-center">
                          <span class="text-xs text-white/80">{{ item.durationMonths }} ماهه</span>
                          <span class="text-[10px] text-white/30 font-mono">{{ new Date(item.createdAt).toLocaleDateString('fa-IR') }}</span>
                        </div>
                      </td>

                      <td class="px-6 py-4 text-center">
                        <span class="px-2.5 py-1 rounded-lg text-[10px] font-bold border" :class="getStatusClass(item.status)">
                          {{ getStatusLabel(item.status) }}
                        </span>
                      </td>

                      <td class="px-6 py-4 text-center">
                        
                        <button 
                          v-if="item.status === 'pending'"
                          @click="openDecisionModal(item)"
                          class="px-4 py-1.5 rounded-lg bg-[#b9f1cf] text-[#0a1f14] font-bold text-xs hover:bg-[#9aeec0] shadow-lg shadow-[#b9f1cf]/10 transition flex items-center justify-center gap-1 mx-auto"
                        >
                          <i class="fas fa-edit"></i> تعیین وضعیت
                        </button>

                        <div v-else-if="item.status === 'active'" class="flex flex-col items-center gap-1">
                           <div class="text-[10px] text-emerald-400 font-mono font-bold mb-1">
                             {{ formatNumber(item.loanAmountGiven) }} مبلغ مصوب
                           </div>
                           <button 
                             @click="openReleaseModal(item)"
                             class="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold text-[10px] hover:bg-blue-500 hover:text-white transition flex items-center gap-1"
                           >
                             <i class="fas fa-unlock-alt"></i> آزادسازی وثیقه
                           </button>
                        </div>
                        
                        <div v-else-if="item.status === 'rejected'" class="text-[10px] text-rose-400">
                           رد شده
                        </div>
                         <div v-else-if="item.status === 'released'" class="text-[10px] text-blue-400 flex items-center justify-center gap-1">
                           <i class="fas fa-check-circle"></i> وثیقه آزاد شد
                        </div>
                      </td>

                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="md:hidden space-y-3 mb-4">
               <div v-for="item in paginatedList" :key="'mob-'+item._id" class="rounded-2xl bg-[#141a1d] border border-white/5 p-4 relative overflow-hidden shadow-lg">
                  <div class="absolute top-0 right-0 w-1.5 h-full" :class="getStatusColor(item.status)"></div>
                  
                  <div class="flex justify-between items-start mb-3 pl-2">
                     <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 text-xs font-bold border border-white/10">
                           {{ (item.user?.fname?.[0] || 'U').toUpperCase() }}
                        </div>
                        <div>
                           <div class="font-bold text-white text-sm">{{ item.user?.fname }} {{ item.user?.lname }}</div>
                           <div class="text-[10px] text-white/40 font-mono">{{ item.user?.phone }}</div>
                        </div>
                     </div>
                     <span class="text-[9px] font-mono text-white/30 bg-white/5 px-2 py-1 rounded-lg">{{ new Date(item.createdAt).toLocaleDateString('fa-IR') }}</span>
                  </div>

                  <div class="flex items-center gap-2 mb-3">
                     <div class="flex-1 bg-white/5 rounded-xl p-2 text-center border border-white/5">
                        <div class="text-[9px] text-white/50 mb-0.5">وثیقه</div>
                        <div class="text-sm font-bold text-white">{{ formatNumber(item.collateralAmount) }} <span class="text-[9px] font-normal">{{ item.collateralType === 'GOLD' ? 'g' : 'T' }}</span></div>
                     </div>
                     <div class="text-white/20"><i class="fas fa-arrow-left text-xs"></i></div>
                     <div class="flex-1 bg-[#b9f1cf]/5 rounded-xl p-2 text-center border border-[#b9f1cf]/10">
                        <div class="text-[9px] text-[#b9f1cf]/70 mb-0.5">وام درخواستی</div>
                        <div class="text-sm font-bold text-[#b9f1cf]">{{ item.loanType === 'GOLD' ? 'طلا' : 'تومان' }}</div>
                     </div>
                  </div>

                  <div class="flex items-center justify-between gap-3 pt-3 border-t border-white/5">
                     <span class="text-[10px] font-bold px-2 py-1 rounded border" :class="getStatusClass(item.status)">{{ getStatusLabel(item.status) }}</span>
                     
                     <button 
                       v-if="item.status === 'pending'"
                       @click="openDecisionModal(item)"
                       class="flex-1 py-2 rounded-lg bg-[#b9f1cf] text-[#0a1f14] text-xs font-bold hover:bg-[#9aeec0] shadow-lg shadow-[#b9f1cf]/10"
                     >
                       تعیین وضعیت
                     </button>

                     <button 
                       v-else-if="item.status === 'active'"
                       @click="openReleaseModal(item)"
                       class="flex-1 py-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold hover:bg-blue-500 hover:text-white transition"
                     >
                       آزادسازی وثیقه
                     </button>
                  </div>
               </div>
            </div>

          </div>

          <div class="mt-auto pt-4 flex items-center justify-center gap-2 border-t border-white/5" v-if="totalPages > 1">
             <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="w-9 h-9 rounded-xl bg-[#141a1d] border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/5 disabled:opacity-50 transition">
               <i class="fas fa-chevron-right text-xs"></i>
             </button>
             
             <div class="flex items-center gap-1 bg-[#141a1d] px-1 py-1 rounded-xl border border-white/10">
               <button v-for="page in paginationButtons" :key="page" @click="changePage(page)" :class="['w-8 h-8 rounded-lg text-xs font-bold transition-all', currentPage === page ? 'bg-[#b9f1cf] text-[#0a1f14] shadow-md' : 'text-white/60 hover:bg-white/5']">{{ page }}</button>
             </div>

             <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="w-9 h-9 rounded-xl bg-[#141a1d] border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/5 disabled:opacity-50 transition">
               <i class="fas fa-chevron-left text-xs"></i>
             </button>
          </div>

        </div>
      </main>

      <div v-if="showDecisionModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div class="w-full max-w-md rounded-3xl bg-[#0f1417] border border-white/10 shadow-2xl overflow-hidden animate-scaleIn">
          <div class="px-6 py-5 border-b border-white/5 bg-[#141a1e]">
            <h3 class="text-lg font-bold text-white">تعیین وضعیت درخواست</h3>
          </div>
          
          <div class="p-6 space-y-5">
            <div class="flex justify-between items-center text-sm p-3 rounded-xl bg-white/5 border border-white/5">
              <span class="text-white/60">وثیقه بلوکه شده:</span>
              <span class="font-bold text-white">{{ formatNumber(selectedItem.collateralAmount) }} {{ selectedItem.collateralType === 'GOLD' ? 'گرم' : 'تومان' }}</span>
            </div>
            
            <div class="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-[10px] text-emerald-200/80 leading-relaxed">
                <i class="fas fa-info-circle ml-1"></i>
                با تایید درخواست، وضعیت وام به "فعال" تغییر می‌کند. <br>
                <span class="font-bold">توجه:</span> هیچ مبلغی به صورت خودکار به کیف پول کاربر اضافه نخواهد شد.
            </div>

            <div>
              <label class="block text-xs font-bold text-[#b9f1cf] mb-2">مبلغ وام مصوب (جهت ثبت در سیستم)</label>
              <div class="relative">
                <input v-model.number="loanAmount" type="number" class="w-full bg-[#1a2220] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#b9f1cf] focus:ring-1 focus:ring-[#b9f1cf] outline-none transition font-mono text-lg text-center font-bold" placeholder="0" />
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-white/30 font-bold">{{ selectedItem.loanType === 'GOLD' ? 'گرم طلا' : 'تومان' }}</span>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-white/70 mb-2">یادداشت برای کاربر</label>
              <textarea v-model="adminNote" rows="2" class="w-full bg-[#1a2220] border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none transition focus:border-white/20" placeholder="توضیحات..."></textarea>
            </div>
          </div>

          <div class="px-6 py-5 bg-[#141a1e] border-t border-white/5 flex gap-3">
            <button @click="closeModal" class="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-bold text-sm transition">انصراف</button>
            <button @click="submitDecision('rejected')" class="flex-1 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white font-bold text-sm transition border border-rose-500/20">رد و عودت وثیقه</button>
            <button @click="submitDecision('active')" class="flex-[2] py-3 rounded-xl bg-[#b9f1cf] hover:bg-[#9aeec0] text-[#0a1f14] font-bold text-sm shadow-lg shadow-[#b9f1cf]/10 transition">تایید و فعال‌سازی</button>
          </div>
        </div>
      </div>

      <div v-if="showReleaseModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div class="w-full max-w-sm rounded-3xl bg-[#0f1417] border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)] overflow-hidden animate-scaleIn">
          <div class="px-6 py-5 border-b border-white/5 bg-[#141a1e]">
            <h3 class="text-lg font-bold text-blue-400 flex items-center gap-2">
                <i class="fas fa-unlock-alt"></i> آزادسازی وثیقه
            </h3>
          </div>
          
          <div class="p-6 space-y-4">
            <p class="text-sm text-white/80 leading-relaxed text-center">
                آیا از تسویه وام اطمینان دارید؟ <br>
                وثیقه به مبلغ <span class="font-bold text-white">{{ formatNumber(selectedItem.collateralAmount) }} {{ selectedItem.collateralType === 'GOLD' ? 'گرم' : 'تومان' }}</span> به موجودی کاربر بازگردانده می‌شود.
            </p>
            <textarea v-model="adminNote" rows="2" class="w-full bg-[#1a2220] border border-white/10 rounded-xl px-4 py-2 text-white text-xs outline-none transition mt-2" placeholder="یادداشت تسویه (اختیاری)..."></textarea>
          </div>

          <div class="px-6 py-5 bg-[#141a1e] border-t border-white/5 flex gap-3">
            <button @click="closeModal" class="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-bold text-sm transition">انصراف</button>
            <button @click="submitRelease" class="flex-[2] py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2">
                <span v-if="submitting" class="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>
                تایید و آزادسازی
            </button>
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
const list = ref([])
const loading = ref(true)
const submitting = ref(false)
const filter = ref('all')
const searchQuery = ref('')

// Pagination Settings
const currentPage = ref(1)
const itemsPerPage = 10

// Modals State
const showDecisionModal = ref(false)
const showReleaseModal = ref(false)
const selectedItem = ref(null)

// Form Data
const loanAmount = ref('')
const adminNote = ref('')

onMounted(fetchData)

async function fetchData() {
  loading.value = true
  try {
    const res = await axios.get(`${url}/admin/pledges/all`)
    list.value = res.data.data || []
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// --- Filtering & Pagination Logic ---
function setFilter(val) {
    filter.value = val;
    currentPage.value = 1;
}

const filteredList = computed(() => {
  let data = list.value
  if (filter.value !== 'all') {
    data = data.filter(i => i.status === filter.value)
  }
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    data = data.filter(i => 
      (i.user?.fname + ' ' + i.user?.lname).toLowerCase().includes(q) ||
      (i.user?.phone || '').includes(q) ||
      String(i.collateralAmount).includes(q)
    )
  }
  return data
})

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredList.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredList.value.length / itemsPerPage))

const paginationButtons = computed(() => {
    const total = totalPages.value
    const current = currentPage.value
    const delta = 1
    const range = []
    for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
        range.push(i)
    }
    return range
})

function changePage(page) {
    if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

// --- Modals Logic ---
function openDecisionModal(item) {
  selectedItem.value = item
  loanAmount.value = ''
  adminNote.value = ''
  showDecisionModal.value = true
}

function openReleaseModal(item) {
  selectedItem.value = item
  adminNote.value = ''
  showReleaseModal.value = true
}

function closeModal() {
  showDecisionModal.value = false
  showReleaseModal.value = false
  selectedItem.value = null
}

// --- API ACTIONS ---

// 1. Decide (Approve/Reject)
async function submitDecision(status) {
  if (status === 'active' && (!loanAmount.value || loanAmount.value <= 0)) {
    Swal.fire({ icon: 'warning', text: 'لطفاً مبلغ وام مصوب را وارد کنید.', background: '#1a2220', color: '#fff' })
    return
  }

  submitting.value = true
  try {
    await axios.post(`${url}/admin/pledge/decide/${selectedItem.value._id}`, {
      status,
      loanAmount: status === 'active' ? loanAmount.value : 0,
      adminNote: adminNote.value
    })

    Swal.fire({ 
        icon: 'success', 
        title: status === 'active' ? 'تایید شد' : 'رد شد',
        text: status === 'active' ? 'وضعیت وام به فعال تغییر کرد.' : 'درخواست رد شد و وثیقه آزاد گردید.',
        toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, 
        background: '#1a2220', color: '#fff' 
    })
    
    closeModal()
    fetchData()
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'خطا', text: err.response?.data?.message, background: '#1a2220', color: '#fff' })
  } finally {
    submitting.value = false
  }
}

// 2. Release Collateral
async function submitRelease() {
    submitting.value = true
    try {
        await axios.post(`${url}/admin/pledge/release/${selectedItem.value._id}`, {
            adminNote: adminNote.value
        })

        Swal.fire({ 
            icon: 'success', 
            title: 'وثیقه آزاد شد',
            text: 'مبلغ وثیقه با موفقیت به حساب کاربر بازگشت.',
            toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, 
            background: '#1a2220', color: '#fff' 
        })
        
        closeModal()
        fetchData()
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'خطا', text: err.response?.data?.message, background: '#1a2220', color: '#fff' })
    } finally {
        submitting.value = false
    }
}

// --- Formatting & Helpers ---
function formatNumber(n) { return Number(n || 0).toLocaleString('fa-IR') }
function getStatusLabel(s) { const m={pending:'در انتظار', active:'فعال (وام داده شده)', rejected:'رد شده', released:'آزاد شده'}; return m[s]||s }
function getStatusClass(s) { 
    if(s==='active') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    if(s==='rejected') return 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    if(s==='released') return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
}
function getStatusColor(s) { if(s==='active') return 'bg-emerald-500'; if(s==='rejected') return 'bg-rose-500'; if(s==='released') return 'bg-blue-500'; return 'bg-amber-500' }
</script>

<style scoped>
@keyframes scaleIn { from {opacity:0; transform:scale(0.95)} to {opacity:1; transform:scale(1)} }
.animate-scaleIn { animation: scaleIn 0.2s ease-out; }
.custom-scrollbar::-webkit-scrollbar { height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #334D44; border-radius: 4px; }
</style>