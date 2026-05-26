<template>
  <div class="flex min-h-screen bg-base text-white font-sans">
    <Sidebar />

    <div class="flex-1 flex flex-col mt-20 md:-mt-0 transition-all duration-300">
      
      <!-- Header -->
      <header class="mx-4 md:mx-6 mt-4 rounded-2xl bg-gradient-to-b from-[#1a2220]/90 to-[#12181b]/90 ring-1 ring-[#334D44]/60 backdrop-blur-xl shadow-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3 w-full md:w-auto">
          <div class="p-2.5 rounded-xl bg-[#b9f1cf]/10 text-[#b9f1cf] shadow-[0_0_15px_rgba(185,241,207,0.15)]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div>
            <h1 class="text-lg md:text-2xl font-extrabold text-white">مدیریت خیریه</h1>
            <span class="text-[10px] text-white/40 md:hidden">تعداد کل: {{ filteredList.length }}</span>
          </div>
        </div>
        
        <div class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <!-- Filters -->
          <div class="flex bg-[#141a1d] p-1 rounded-xl ring-1 ring-white/10 w-full sm:w-auto">
            <button @click="filterType = 'all'; currentPage = 1" :class="['flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all', filterType === 'all' ? 'bg-[#b9f1cf] text-[#0a1f14]' : 'text-white/60']">همه</button>
            <button @click="filterType = 'GOLD'; currentPage = 1" :class="['flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all', filterType === 'GOLD' ? 'bg-[#ffd700] text-[#0a1f14]' : 'text-white/60']">طلا</button>
            <button @click="filterType = 'TOMAN'; currentPage = 1" :class="['flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all', filterType === 'TOMAN' ? 'bg-emerald-500 text-white' : 'text-white/60']">نقدی</button>
          </div>

          <!-- Search -->
          <div class="relative w-full sm:w-56">
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
               <svg class="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="جستجو (نام کاربر)..." 
              class="block w-full p-2.5 pr-9 text-xs rounded-xl bg-white/5 border border-white/10 placeholder-white/40 text-white focus:ring-1 focus:ring-[#b9f1cf] focus:border-[#b9f1cf] outline-none transition" 
            />
          </div>
        </div>
      </header>

      <main class="p-4 md:p-6 flex-1 overflow-auto flex flex-col">
        
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6" v-if="!loading">
            <div class="rounded-2xl bg-[#141a1d] border border-white/5 p-4 flex items-center justify-between relative overflow-hidden group">
                <div class="absolute top-0 right-0 w-1 h-full bg-[#ffd700]"></div>
                <div>
                    <div class="text-xs text-white/50 mb-1">مجموع طلای اهدا شده</div>
                    <div class="text-xl font-bold text-[#ffd700]">{{ formatWeight(stats.totalGold) }} <span class="text-xs text-white/40 font-normal">گرم</span></div>
                </div>
                <div class="w-10 h-10 rounded-xl bg-[#ffd700]/10 flex items-center justify-center text-[#ffd700] ring-1 ring-[#ffd700]/20">
                    <i class="fas fa-coins"></i>
                </div>
            </div>
            <div class="rounded-2xl bg-[#141a1d] border border-white/5 p-4 flex items-center justify-between relative overflow-hidden group">
                <div class="absolute top-0 right-0 w-1 h-full bg-emerald-500"></div>
                <div>
                    <div class="text-xs text-white/50 mb-1">مجموع کمک‌های نقدی</div>
                    <div class="text-xl font-bold text-emerald-400">{{ formatMoney(stats.totalToman) }} <span class="text-xs text-white/40 font-normal">تومان</span></div>
                </div>
                <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 ring-1 ring-emerald-500/20">
                    <i class="fas fa-hand-holding-usd"></i>
                </div>
            </div>
        </div>

        <div v-if="loading" class="grid gap-4">
           <div v-for="i in 5" :key="i" class="h-16 rounded-2xl bg-[#141a1d] animate-pulse ring-1 ring-white/5"></div>
        </div>
        
        <div v-else class="flex-1 flex flex-col">
          <div v-if="filteredList.length === 0" class="flex flex-col items-center justify-center py-20 bg-[#141a1d]/50 rounded-3xl border border-dashed border-white/10">
             <div class="text-4xl mb-2 opacity-50">👐</div>
             <p class="text-white/40 text-sm">موردی یافت نشد.</p>
          </div>
          
          <div v-else class="flex-1">
            <!-- DESKTOP TABLE -->
            <div class="hidden md:block rounded-2xl bg-[#141a1d]/90 backdrop-blur-xl ring-1 ring-[#334D44]/40 shadow-xl overflow-hidden mb-4">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-white/5">
                  <thead class="bg-white/5">
                    <tr>
                      <th class="px-6 py-4 text-right text-xs font-bold text-[#b9f1cf]">کاربر نیکوکار</th>
                      <th class="px-6 py-4 text-center text-xs font-bold text-white/50">نوع اهدا</th>
                      <th class="px-6 py-4 text-center text-xs font-bold text-white/50">مقدار</th>
                      <th class="px-6 py-4 text-center text-xs font-bold text-white/50">تاریخ</th>
                      <th class="px-6 py-4 text-center text-xs font-bold text-white/50">پیام کاربر</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/5">
                    <tr v-for="item in paginatedList" :key="item._id" class="group hover:bg-white/[0.02] transition-colors">
                      
                      <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                          <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-white/70 border border-white/10">
                            {{ (item.user?.fname?.[0] || 'U').toUpperCase() }}
                          </div>
                          <div>
                            <div class="text-sm font-bold text-white">{{ item.user?.fname }} {{ item.user?.lname }}</div>
                            <div class="text-[10px] text-white/40 font-mono">{{ item.user?.phone }}</div>
                          </div>
                        </div>
                      </td>

                      <td class="px-6 py-4 text-center">
                        <span 
                          class="px-2.5 py-1 rounded-lg text-[10px] font-bold border flex items-center justify-center gap-1 w-fit mx-auto"
                          :class="item.currencyType === 'GOLD' ? 'bg-[#ffd700]/10 text-[#ffd700] border-[#ffd700]/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'"
                        >
                          <i class="fas" :class="item.currencyType === 'GOLD' ? 'fa-ring' : 'fa-money-bill'"></i>
                          {{ item.currencyType === 'GOLD' ? 'طلا' : 'نقدی' }}
                        </span>
                      </td>

                      <td class="px-6 py-4 text-center">
                        <span class="font-bold text-lg font-mono" :class="item.currencyType === 'GOLD' ? 'text-[#ffd700]' : 'text-[#b9f1cf]'">
                            {{ formatMoney(item.amount) }}
                        </span>
                        <span class="text-[10px] text-white/40 mr-1">{{ item.currencyType === 'GOLD' ? 'گرم' : 'تومان' }}</span>
                      </td>

                      <td class="px-6 py-4 text-center">
                        <div class="flex flex-col items-center">
                          <span class="text-xs text-white/80 font-mono">{{ new Date(item.createdAt).toLocaleDateString('fa-IR') }}</span>
                          <span class="text-[10px] text-white/30 font-mono">{{ new Date(item.createdAt).toLocaleTimeString('fa-IR', {hour: '2-digit', minute:'2-digit'}) }}</span>
                        </div>
                      </td>

                      <td class="px-6 py-4 text-center max-w-xs truncate text-xs text-white/60">
                        {{ item.message || '---' }}
                      </td>

                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- MOBILE LIST -->
            <div class="md:hidden space-y-3 mb-4">
               <div v-for="item in paginatedList" :key="'mob-'+item._id" class="rounded-2xl bg-[#141a1d] border border-white/5 p-4 relative overflow-hidden shadow-md">
                  <div class="absolute top-0 right-0 w-1.5 h-full" :class="item.currencyType === 'GOLD' ? 'bg-[#ffd700]' : 'bg-emerald-500'"></div>
                  
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
                     <span class="text-[10px] font-mono text-white/30 bg-white/5 px-2 py-1 rounded-lg">{{ new Date(item.createdAt).toLocaleDateString('fa-IR') }}</span>
                  </div>

                  <div class="flex items-center justify-between gap-2 mb-2 bg-white/5 p-3 rounded-xl">
                     <div class="flex items-center gap-2">
                        <i class="fas" :class="item.currencyType === 'GOLD' ? 'fa-ring text-[#ffd700]' : 'fa-money-bill text-emerald-400'"></i>
                        <span class="text-xs text-white/70">{{ item.currencyType === 'GOLD' ? 'طلا' : 'نقدی' }}</span>
                     </div>
                     <div class="font-bold font-mono text-lg" :class="item.currencyType === 'GOLD' ? 'text-[#ffd700]' : 'text-emerald-400'">
                        {{ formatMoney(item.amount) }} <span class="text-[10px] text-white/40 font-sans">{{ item.currencyType === 'GOLD' ? 'گرم' : 'تومان' }}</span>
                     </div>
                  </div>

                  <div v-if="item.message" class="text-[11px] text-white/50 bg-white/[0.02] p-2 rounded-lg italic">
                     "{{ item.message }}"
                  </div>
               </div>
            </div>

          </div>

          <!-- Pagination -->
          <div class="mt-auto pt-4 flex items-center justify-center gap-2 border-t border-white/5" v-if="totalPages > 1">
             <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="w-9 h-9 rounded-xl bg-[#141a1d] border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/5 disabled:opacity-50 transition">
               <i class="fas fa-chevron-right text-xs"></i>
             </button>
             
             <div class="flex items-center gap-1 bg-[#141a1d] px-1 py-1 rounded-xl border border-white/10">
               <button 
                  v-for="page in paginationButtons" 
                  :key="page" 
                  @click="changePage(page)"
                  :class="['w-8 h-8 rounded-lg text-xs font-bold transition-all', currentPage === page ? 'bg-[#b9f1cf] text-[#0a1f14] shadow-md' : 'text-white/60 hover:bg-white/5']"
               >
                  {{ page }}
               </button>
             </div>

             <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="w-9 h-9 rounded-xl bg-[#141a1d] border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/5 disabled:opacity-50 transition">
               <i class="fas fa-chevron-left text-xs"></i>
             </button>
          </div>

        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import Sidebar from '@/components/admin/SidebarAdmin.vue'

const url = process.env.VUE_APP_API_URL || ''
const list = ref([])
const loading = ref(true)
const filterType = ref('all') // all, GOLD, TOMAN
const searchQuery = ref('')
const stats = ref({ totalGold: 0, totalToman: 0 })

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10 

onMounted(fetchData)

async function fetchData() {
  loading.value = true
  try {
    const res = await axios.get(`${url}/admin/charity/all`)
    list.value = res.data.data || []
    if(res.data.stats) stats.value = res.data.stats
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// فیلتر کردن لیست
const filteredList = computed(() => {
  let data = list.value

  if (filterType.value !== 'all') {
    data = data.filter(i => i.currencyType === filterType.value)
  }

  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    data = data.filter(i => 
      (i.user?.fname + ' ' + i.user?.lname).toLowerCase().includes(q) ||
      (i.user?.phone || '').includes(q)
    )
  }

  return data
})

// صفحه‌بندی
const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredList.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredList.value.length / itemsPerPage))

const paginationButtons = computed(() => {
    const total = totalPages.value
    const current = currentPage.value
    const delta = 2
    const range = []
    for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
        range.push(i)
    }
    return range
})

function changePage(page) {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

watch([filterType, searchQuery], () => {
    currentPage.value = 1
})

// Helpers
function formatMoney(n) { return Number(n || 0).toLocaleString('fa-IR') }
function formatWeight(n) { return Number(n || 0).toLocaleString('fa-IR', { maximumFractionDigits: 3 }) }
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #334D44; border-radius: 4px; }
</style>