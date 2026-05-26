<template>
  <div class="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#0f1417]/80 backdrop-blur-xl border-b border-[#334D44]/30 px-4 py-3 flex justify-between items-center transition-all duration-300">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#b9f1cf] to-[#1a2220] flex items-center justify-center shadow-[0_0_10px_rgba(185,241,207,0.4)]">
        <i class="fas fa-shield-alt text-[#0a1f14]"></i>
      </div>
      <h2 class="text-lg font-extrabold text-white tracking-tight">پنل مدیریت</h2>
    </div>
    <button @click="toggleSidebar" class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#b9f1cf] hover:bg-white/10 transition ring-1 ring-white/10">
      <i class="fas" :class="sidebarOpen ? 'fa-times' : 'fa-bars'"></i>
    </button>
  </div>

  <transition
    enter-active-class="transition-opacity duration-300 ease-linear"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-300 ease-linear"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="sidebarOpen" 
      @click="sidebarOpen = false"
      class="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
    ></div>
  </transition>

  <aside
    class="fixed md:static top-0 right-0 z-50 h-screen w-72 bg-[#0f1417] text-white flex flex-col border-l border-[#334D44]/30 shadow-2xl transition-transform duration-300 ease-in-out md:translate-x-0"
    :class="sidebarOpen ? 'translate-x-0' : 'translate-x-full'"
  >
    <div class="h-20 flex items-center px-6 border-b border-[#334D44]/30 bg-gradient-to-l from-[#1a2220] to-transparent">
      <div class="flex items-center gap-3">
        <div class="relative">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#b9f1cf] to-[#10b981] flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <i class="fas fa-gem text-[#0a1f14] text-lg"></i>
          </div>
          <span class="absolute -top-1 -right-1 flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </div>
        <div>
          <h1 class="text-xl font-black tracking-tight text-white">پنل مکسی گلد</h1>
        </div>
      </div>
    </div>

    <nav class="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
      <div v-for="(group, index) in groupedMenu" :key="index" class="mb-6 last:mb-0">
        <div v-if="group.title" class="px-4 mb-2 text-[10px] font-bold text-white/30 uppercase tracking-wider">
          {{ group.title }}
        </div>
        <ul>
          <li v-for="item in group.items" :key="item.id">
            <router-link
              :to="item.route"
              @click="sidebarOpen = false"
              v-slot="{ isActive }"
              class="block mb-1"
            >
              <div 
                class="relative flex items-center px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden"
                :class="isActive 
                  ? 'bg-gradient-to-r from-[#b9f1cf]/10 to-transparent text-[#b9f1cf] shadow-[inset_0_0_20px_rgba(185,241,207,0.05)]' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'"
              >
                <div 
                  class="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-l-full bg-[#b9f1cf] shadow-[0_0_10px_#b9f1cf] transition-all duration-300"
                  :class="isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'"
                ></div>

                <i 
                  :class="[item.icon, isActive ? 'text-[#b9f1cf] scale-110' : 'text-white/40 group-hover:text-white']" 
                  class="w-6 text-center text-lg transition-transform duration-300"
                ></i>
                <span class="mr-3 font-medium text-sm tracking-wide">{{ item.label }}</span>
                
                <i v-if="isActive" class="fas fa-chevron-left absolute left-4 text-[10px] opacity-50 animate-pulse"></i>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>

    <div class="p-4 border-t border-[#334D44]/30 bg-[#0b0e11]">
      <button @click="logout" class="flex items-center w-full p-3 rounded-xl bg-[#1a2220] hover:bg-[#232d2a] ring-1 ring-[#334D44]/50 transition-all group">
        <div class="w-10 h-10 rounded-full bg-[#b9f1cf]/20 flex items-center justify-center text-[#b9f1cf] font-bold text-sm ring-2 ring-[#334D44] group-hover:ring-[#b9f1cf] transition-all">
           {{ adminInitials }}
        </div>
        <div class="mr-3 text-right flex-1 min-w-0">
          <div class="text-sm font-bold text-white truncate group-hover:text-[#b9f1cf] transition">{{ adminName }}</div>
          <div class="text-[10px] text-white/40 truncate font-mono">{{ adminUsername }}</div>
        </div>
        <i class="fas fa-sign-out-alt text-white/30 group-hover:text-red-400 transition-colors text-lg" title="خروج"></i>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const url = process.env.VUE_APP_API_URL || ''
const router = useRouter()
const sidebarOpen = ref(false)

const adminName = ref('مدیر سیستم')
const adminUsername = ref('admin')

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

// محاسبه حروف اول نام برای آواتار
const adminInitials = computed(() => {
    const parts = adminName.value.split(' ')
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return (adminName.value[0] || 'A').toUpperCase()
})

async function fetchProfile() {
    try {
        const res = await axios.get(`${url}/user/profile`)
        const user = res.data.user
        if (user) {
            const fullName = `${user.fname || ''} ${user.lname || ''}`.trim()
            if (fullName) adminName.value = fullName
            if (user.username) adminUsername.value = '@' + user.username
        }
    } catch (e) {
        console.error('Profile fetch error', e)
    }
}

function logout() {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    router.push('/login')
}

onMounted(() => {
    fetchProfile()
})

const groupedMenu = [
  {
    title: 'اصلی',
    items: [
      { id: 1, label: 'داشبورد', route: '/admin', icon: 'fas fa-th-large' },
    ]
  },
  {
    title: 'مدیریت فروشگاه',
    items: [
      { id: 2, label: 'کاربران', route: '/admin/users', icon: 'fas fa-users' },
      { id: 3, label: 'سفارشات', route: '/admin/orders', icon: 'fas fa-shopping-bag' },
      { id: 5, label: 'محصولات', route: '/admin/products', icon: 'fas fa-box-open' },
    ]
  },
  {
    title: 'تسهیلات',
    items: [
      { id: 12, label: 'طرح‌های وام', route: '/admin/loan', icon: 'fas fa-hand-holding-usd' },
      { id: 13, label: 'مدیریت وثیقه‌ها', route: '/admin/pledge', icon: 'fas fa-file-contract' },
      { id: 122, label: ' درخواست وام', route: '/admin/loan/request', icon: 'fas fa-hand-holding-usd' },
    ]
  },
  {
    title: 'امور مالی',
    items: [
      { id: 4, label: 'تراکنش‌ها', route: '/admin/walletorder', icon: 'fas fa-wallet' },
      { id: 9, label: 'واریزی‌ها', route: '/admin/deposit', icon: 'fas fa-file-invoice-dollar' },
      { id: 10, label: 'برداشت‌ها', route: '/admin/withdrawal', icon: 'fas fa-money-check-alt' },
      { id: 11, label: 'کارت‌های بانکی', route: '/admin/cards', icon: 'fas fa-credit-card' },
      { id: 14, label: 'تنظیمات کارمزد', route: '/admin/priceSetting', icon: 'fas fa-percent' },
    ]
  },
  {
    title: 'سیستم',
    items: [
      { id: 8, label: 'اعلان‌ها', route: '/admin/notif', icon: 'fas fa-bell' },
      { id: 7, label: 'پشتیبانی', route: '/admin/support', icon: 'fas fa-headset' },
      { id: 72, label: 'خیریه', route: '/admin/charity', icon: 'fas fa-gift' },
      { id: 73, label: 'ربات معامله گر', route: '/admin/trading-bot', icon: 'fas fa-robot' },
      { id: 74, label: 'تنظیمات API', route: '/admin/api-settings', icon: 'fas fa-key' },
      { id: 75, label: 'تست API', route: '/admin/api-test', icon: 'fas fa-vial' },
      { id: 6, label: 'تنظیمات سایت', route: '/admin/settings', icon: 'fas fa-cog' },
      { id: 76, label: 'مدیریت محتوا', route: '/admin/content', icon: 'fas fa-edit' },
    ]
  }
]
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
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(185, 241, 207, 0.3);
}
</style>