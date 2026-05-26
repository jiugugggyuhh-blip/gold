<template>
  <div class="flex h-screen bg-[#0f1417] text-white font-sans overflow-hidden">
    <Sidebar />

    <div class="flex-1 flex flex-col pt-16 md:pt-0 h-full overflow-hidden">
      <header class="mx-4 md:mx-6 mt-4 rounded-2xl bg-gradient-to-b from-[#1a2220]/90 to-[#12181b]/90
                     ring-1 ring-[#334D44]/60 backdrop-blur-xl shadow-xl p-4 flex items-center justify-between shrink-0 z-20">
        <div class="flex items-center gap-3">
          <h1 class="text-lg sm:text-xl font-extrabold text-white">داشبورد مدیریت</h1>
          <span class="hidden sm:inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs ring-1 ring-emerald-500/20 text-emerald-400 font-medium">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            سیستم آنلاین
          </span>
        </div>
        <div class="flex items-center gap-3">
          <div class="hidden md:flex flex-col items-end mr-2">
            <span class="text-sm font-bold text-white">{{ adminName }}</span>
            <span class="text-[10px] text-white/50">مدیر کل سیستم</span>
          </div>
          <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-[#1e2623] to-[#141a1e] ring-1 ring-[#334D44]/60 flex items-center justify-center text-[#b9f1cf]">
            <i class="fas fa-user-shield text-lg"></i>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
        
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <h2 class="text-white/80 font-bold text-sm">آمار کلی سامانه</h2>
            <div class="h-px w-8 bg-white/10"></div>
            <span class="text-xs text-white/40">بروزرسانی: {{ lastUpdate }}</span>
          </div>
          
          <button @click="fetchDashboardData" :disabled="loading" 
            class="inline-flex items-center gap-2 rounded-xl bg-[#b9f1cf] text-[#0a1f14] px-4 py-2 text-sm font-bold hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_-5px_rgba(185,241,207,0.4)]">
            <i class="fas fa-sync-alt" :class="{'fa-spin': loading}"></i>
            <span>بروزرسانی آمار</span>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a2220] to-[#12181b] p-5 ring-1 ring-[#334D44]/40 hover:ring-[#b9f1cf]/30 transition-all duration-300">
            <div class="absolute right-0 top-0 h-16 w-16 bg-[#b9f1cf]/5 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110"></div>
            <div class="flex justify-between items-start mb-4">
              <div class="h-10 w-10 rounded-lg bg-[#b9f1cf]/10 flex items-center justify-center text-[#b9f1cf]">
                <i class="fas fa-users text-lg"></i>
              </div>
              <span class="text-[10px] px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20 flex items-center gap-1">
                <i class="fas fa-arrow-up"></i> فعال
              </span>
            </div>
            <div class="text-3xl font-black text-white mb-1">{{ formatNumber(stats.totalUsers) }}</div>
            <div class="text-xs text-white/50">کل کاربران ثبت نام شده</div>
          </div>

          <div class="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a2220] to-[#12181b] p-5 ring-1 ring-[#334D44]/40 hover:ring-[#ffd700]/30 transition-all duration-300">
            <div class="absolute right-0 top-0 h-16 w-16 bg-[#ffd700]/5 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110"></div>
            <div class="flex justify-between items-start mb-4">
              <div class="h-10 w-10 rounded-lg bg-[#ffd700]/10 flex items-center justify-center text-[#ffd700]">
                <i class="fas fa-cubes text-lg"></i>
              </div>
            </div>
            <div class="text-3xl font-black text-white mb-1">{{ formatWeight(stats.totalGold) }} <span class="text-sm font-medium text-white/40">گرم</span></div>
            <div class="text-xs text-white/50">مجموع طلای کاربران</div>
          </div>

          <div class="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a2220] to-[#12181b] p-5 ring-1 ring-[#334D44]/40 hover:ring-[#b9f1cf]/30 transition-all duration-300">
            <div class="absolute right-0 top-0 h-16 w-16 bg-blue-400/5 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110"></div>
            <div class="flex justify-between items-start mb-4">
              <div class="h-10 w-10 rounded-lg bg-blue-400/10 flex items-center justify-center text-blue-400">
                <i class="fas fa-wallet text-lg"></i>
              </div>
            </div>
            <div class="text-2xl font-black text-white mb-1 truncate" dir="ltr">{{ formatMoneyShort(stats.totalToman) }}</div>
            <div class="text-xs text-white/50">مجموع موجودی ریالی</div>
          </div>

          <div class="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a2220] to-[#12181b] p-5 ring-1 ring-[#334D44]/40 hover:ring-rose-400/30 transition-all duration-300">
            <div class="absolute right-0 top-0 h-16 w-16 bg-rose-400/5 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110"></div>
            <div class="flex justify-between items-start mb-4">
              <div class="h-10 w-10 rounded-lg bg-rose-400/10 flex items-center justify-center text-rose-400">
                <i class="fas fa-box-open text-lg"></i>
              </div>
              <span class="text-[10px] px-2 py-1 rounded bg-white/5 text-white/60 ring-1 ring-white/10">فروشگاه</span>
            </div>
            <div class="text-3xl font-black text-white mb-1">{{ formatNumber(stats.totalProducts) }}</div>
            <div class="text-xs text-white/50">محصولات موجود در سایت</div>
          </div>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          <div class="xl:col-span-2 rounded-2xl bg-[#151b19] ring-1 ring-[#334D44]/40 p-5 relative overflow-hidden">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="font-bold text-white text-lg">روند ثبت‌نام کاربران</h3>
                <p class="text-xs text-white/40 mt-1">نمودار تعداد کاربران جدید در ۷ روز گذشته</p>
              </div>
              <div class="flex gap-2">
                 <span class="px-3 py-1 rounded-lg bg-[#b9f1cf]/10 text-[#b9f1cf] text-xs font-bold ring-1 ring-[#b9f1cf]/20">هفتگی</span>
              </div>
            </div>
            
            <div v-if="loadingChart" class="h-[300px] flex items-center justify-center">
               <div class="animate-spin h-8 w-8 border-2 border-[#b9f1cf] rounded-full border-t-transparent"></div>
            </div>
            <div v-else id="usersChart" class="h-[300px] w-full" dir="ltr"></div>
          </div>

          <div class="rounded-2xl bg-[#151b19] ring-1 ring-[#334D44]/40 p-5 flex flex-col h-full">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-bold text-white">آخرین کاربران</h3>
              <router-link to="/admin/users" class="text-xs text-[#b9f1cf] hover:underline">مشاهده همه</router-link>
            </div>
            
            <div class="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-3">
              <div v-for="user in latestUsers" :key="user._id" class="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition border border-transparent hover:border-white/5">
                <div class="h-10 w-10 rounded-full bg-gradient-to-br from-[#1e2623] to-black flex items-center justify-center text-white/40 text-xs font-bold ring-1 ring-white/10">
                  {{ (user.fname?.[0] || 'U') }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-bold text-white truncate">{{ user.fname }} {{ user.lname }}</div>
                  <div class="text-[10px] text-white/40 font-mono truncate">{{ user.phone }}</div>
                </div>
                <div class="text-[10px] text-white/30 whitespace-nowrap">{{ user.timeAgo }}</div>
              </div>
              
              <div v-if="latestUsers.length === 0" class="text-center py-8 text-white/30 text-xs">
                هنوز کاربری ثبت نام نکرده است.
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/admin/SidebarAdmin.vue'
import { onMounted, ref } from 'vue'
import axios from 'axios'
import ApexCharts from 'apexcharts'

const url = process.env.VUE_APP_API_URL || ''
const loading = ref(false)
const loadingChart = ref(true)
const lastUpdate = ref('---')
const adminName = ref('مدیر محترم')

const stats = ref({
  totalUsers: 0,
  totalGold: 0,
  totalToman: 0,
  totalProducts: 0
})

const latestUsers = ref([])
let chartInstance = null

async function fetchAdminInfo() {
  try {
    const res = await axios.get(`${url}/user/profile`)
    const u = res.data.user
    if(u) adminName.value = `${u.fname || ''} ${u.lname || ''}`.trim() || 'مدیر سیستم'
  } catch (error) {
    console.error(error)
  }
}

async function fetchDashboardData() {
  loading.value = true
  try {
    const usersRes = await axios.get(`${url}/admin/userlist`)
    const users = usersRes.data.users || []
    
    stats.value.totalUsers = users.length
    stats.value.totalGold = users.reduce((sum, u) => sum + (Number(u.gold) || 0), 0)
    stats.value.totalToman = users.reduce((sum, u) => sum + (Number(u.toman) || 0), 0)

    const sortedUsers = [...users].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    
    latestUsers.value = sortedUsers.slice(0, 6).map(u => ({
      ...u,
      timeAgo: getTimeAgo(u.createdAt)
    }))

    const productsRes = await axios.get(`${url}/products`)
    const productsData = productsRes.data.data?.products || productsRes.data || []
    stats.value.totalProducts = Array.isArray(productsData) ? productsData.length : 0

    renderRegistrationChart(sortedUsers)

    lastUpdate.value = new Date().toLocaleTimeString('fa-IR', {hour: '2-digit', minute: '2-digit'})

  } catch (e) {
    console.error('Dashboard Error:', e)
  } finally {
    loading.value = false
    loadingChart.value = false
  }
}

function renderRegistrationChart(users) {
  const days = 7
  const categories = []
  const data = []
  
  const now = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(now.getDate() - i)
    
    const label = new Intl.DateTimeFormat('fa-IR', { weekday: 'long' }).format(d)
    categories.push(label)
    
    const count = users.filter(u => {
      const uDate = new Date(u.createdAt)
      return uDate.getDate() === d.getDate() && 
             uDate.getMonth() === d.getMonth() && 
             uDate.getFullYear() === d.getFullYear()
    }).length
    
    data.push(count)
  }

  const options = {
    series: [{
      name: 'کاربران جدید',
      data: data
    }],
    chart: {
      type: 'area',
      height: 300,
      fontFamily: 'inherit',
      foreColor: '#9ca3af',
      toolbar: { show: false },
      zoom: { enabled: false },
      background: 'transparent'
    },
    colors: ['#b9f1cf'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 100]
      }
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    grid: {
      borderColor: 'rgba(255,255,255,0.05)',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } } 
    },
    xaxis: {
      categories: categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { fontSize: '11px', fontFamily: 'inherit' }
      }
    },
    yaxis: {
      labels: {
        formatter: (val) => Math.round(val),
        style: { fontFamily: 'inherit' }
      }
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val) => val + ' نفر'
      },
      style: { fontFamily: 'inherit' }
    }
  }

  const el = document.querySelector('#usersChart')
  if (el) {
    if (chartInstance) chartInstance.destroy()
    chartInstance = new ApexCharts(el, options)
    chartInstance.render()
  }
}

function formatNumber(n) {
  return new Intl.NumberFormat('fa-IR').format(n)
}

function formatWeight(n) {
  if (!n) return '۰'
  return Number(n).toLocaleString('fa-IR', { maximumFractionDigits: 3 })
}

function formatMoneyShort(n) {
  if (!n) return '۰'
  if (n >= 1000000000) return (n / 1000000000).toFixed(1) + ' میلیارد'
  if (n >= 1000000) return (n / 1000000).toFixed(0) + ' میلیون'
  return new Intl.NumberFormat('fa-IR').format(n)
}

function getTimeAgo(date) {
  if (!date) return ''
  const now = new Date()
  const d = new Date(date)
  const diffInMinutes = Math.floor((now - d) / 60000)
  
  if (diffInMinutes < 1) return 'همین الان'
  if (diffInMinutes < 60) return `${formatNumber(diffInMinutes)} دقیقه پیش`
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${formatNumber(diffInHours)} ساعت پیش`
  return new Intl.DateTimeFormat('fa-IR').format(d)
}

onMounted(() => {
  fetchAdminInfo()
  fetchDashboardData()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>