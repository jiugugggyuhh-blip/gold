<template>
  <div dir="rtl" class="min-h-screen bg-base text-white font-sans pb-24">
    <div v-if="user" class="max-w-7xl mx-auto px-0 md:px-4 pt-6">
      
      <!-- User Info Card -->
      <div class="relative overflow-hidden rounded-3xl bg-[#141a1d]/90 backdrop-blur-xl border border-[#334D44]/60 p-6 shadow-2xl">
        <!-- Background Glow -->
        <div class="absolute top-0 right-0 w-32 h-32 bg-[#b9f1cf]/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        
        <div class="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-right">
          <!-- Avatar -->
          <div class="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#1e2623] to-[#0f1416] ring-1 ring-[#334D44] flex items-center justify-center text-2xl font-black text-[#b9f1cf] shadow-inner">
            {{ initials }}
          </div>
          
          <div class="flex-1 space-y-2">
            <div>
              <h2 class="text-xl font-extrabold text-white tracking-tight">{{ fullName }}</h2>
              <div class="text-sm text-white/50 font-mono mt-0.5 tracking-wider">{{ user.phone }}</div>
            </div>
            
            <div class="flex flex-wrap justify-center sm:justify-start gap-2">
              <span
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors"
                :class="user.isAuthentication 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'"
              >
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" :class="user.isAuthentication ? 'bg-emerald-400' : 'bg-rose-400'"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2" :class="user.isAuthentication ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                </span>
                {{ user.isAuthentication ? 'احراز هویت شده' : 'احراز هویت نشده' }}
              </span>
              
              <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-white/60 border border-white/5">
                {{ userRoleLabel }}
              </span>
            </div>
          </div>

          <router-link to="/user/editprofile" class="p-2 rounded-xl bg-white/5 hover:bg-[#b9f1cf] hover:text-[#0a1f14] text-white/60 transition group">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </router-link>
        </div>
      </div>

      <!-- Balance Stats -->
      <div class="mt-4 grid grid-cols-2 gap-3">
        <!-- Gold -->
        <div class="rounded-2xl bg-gradient-to-br from-[#1a2220] to-[#12181b] p-4 border border-[#334D44]/40 relative overflow-hidden group">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-transparent opacity-50"></div>
          <div class="flex justify-between items-start mb-2">
            <span class="text-xs font-medium text-amber-400/80">موجودی طلا</span>
            <div class="p-1.5 rounded-lg bg-amber-400/10 text-amber-400">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
            </div>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-xl md:text-2xl font-black text-white tracking-tight">{{ balanceGram }}</span>
            <span class="text-xs text-white/40">گرم</span>
          </div>
        </div>

        <!-- Toman -->
        <div class="rounded-2xl bg-gradient-to-br from-[#1a2220] to-[#12181b] p-4 border border-[#334D44]/40 relative overflow-hidden group">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-transparent opacity-50"></div>
          <div class="flex justify-between items-start mb-2">
            <span class="text-xs font-medium text-emerald-400/80">موجودی کیف پول</span>
            <div class="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
            </div>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-xl md:text-2xl font-black text-white tracking-tight">{{ formatMoney(user.toman) }}</span>
            <span class="text-xs text-white/40">تومان</span>
          </div>
        </div>
      </div>

      <!-- Menu Links -->
      <div class="mt-6 space-y-4">
        
        <!-- Financial Section -->
        <div class="rounded-3xl bg-[#141a1e] border border-[#334D44]/40 overflow-hidden">
          <div class="px-5 py-3 bg-white/5 border-b border-white/5 text-xs font-bold text-white/50 tracking-wider">امور مالی</div>
          <div class="divide-y divide-white/5">
            <router-link to="/user/wallet" class="flex items-center justify-between p-4 hover:bg-white/5 transition group">
              <div class="flex items-center gap-3">
                <div class="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                </div>
                <span class="text-sm font-medium text-white/90">کیف پول و تراکنش‌ها</span>
              </div>
              <svg class="w-4 h-4 text-white/20 -scale-x-100 group-hover:text-[#b9f1cf] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </router-link>

            <router-link to="/user/deposit" class="flex items-center justify-between p-4 hover:bg-white/5 transition group">
              <div class="flex items-center gap-3">
                <div class="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                </div>
                <span class="text-sm font-medium text-white/90">افزایش موجودی</span>
              </div>
              <svg class="w-4 h-4 text-white/20 -scale-x-100 group-hover:text-[#b9f1cf] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </router-link>

            <router-link to="/user/withdrawal" class="flex items-center justify-between p-4 hover:bg-white/5 transition group">
              <div class="flex items-center gap-3">
                <div class="h-9 w-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                </div>
                <span class="text-sm font-medium text-white/90">برداشت وجه</span>
              </div>
              <svg class="w-4 h-4 text-white/20 -scale-x-100 group-hover:text-[#b9f1cf] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </router-link>

            <router-link to="/user/card" class="flex items-center justify-between p-4 hover:bg-white/5 transition group">
              <div class="flex items-center gap-3">
                <div class="h-9 w-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                </div>
                <span class="text-sm font-medium text-white/90">مدیریت کارت‌های بانکی</span>
              </div>
              <svg class="w-4 h-4 text-white/20 -scale-x-100 group-hover:text-[#b9f1cf] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </router-link>
          </div>
        </div>

        <!-- Account Section -->
        <div class="rounded-3xl bg-[#141a1e] border border-[#334D44]/40 overflow-hidden">
          <div class="px-5 py-3 bg-white/5 border-b border-white/5 text-xs font-bold text-white/50 tracking-wider">حساب کاربری</div>
          <div class="divide-y divide-white/5">
            <router-link to="/user/verify" class="flex items-center justify-between p-4 hover:bg-white/5 transition group">
              <div class="flex items-center gap-3">
                <div class="h-9 w-9 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <span class="text-sm font-medium text-white/90">احراز هویت</span>
              </div>
              <div class="flex items-center gap-2">
                <span v-if="!user.isAuthentication" class="text-[10px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">انجام نشده</span>
                <svg class="w-4 h-4 text-white/20 -scale-x-100 group-hover:text-[#b9f1cf] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </div>
            </router-link>

            <router-link to="/user/ref" class="flex items-center justify-between p-4 hover:bg-white/5 transition group">
              <div class="flex items-center gap-3">
                <div class="h-9 w-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                </div>
                <span class="text-sm font-medium text-white/90">معرفی به دوستان</span>
              </div>
              <svg class="w-4 h-4 text-white/20 -scale-x-100 group-hover:text-[#b9f1cf] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </router-link>
          </div>
        </div>

        <!-- Support Section -->
        <div class="rounded-3xl bg-[#141a1e] border border-[#334D44]/40 overflow-hidden">
          <div class="px-5 py-3 bg-white/5 border-b border-white/5 text-xs font-bold text-white/50 tracking-wider">پشتیبانی</div>
          <div class="divide-y divide-white/5">
            <router-link to="/user/support" class="flex items-center justify-between p-4 hover:bg-white/5 transition group">
              <div class="flex items-center gap-3">
                <div class="h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                </div>
                <span class="text-sm font-medium text-white/90">تیکت پشتیبانی</span>
              </div>
              <svg class="w-4 h-4 text-white/20 -scale-x-100 group-hover:text-[#b9f1cf] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </router-link>

            <router-link to="/user/notification" class="flex items-center justify-between p-4 hover:bg-white/5 transition group">
              <div class="flex items-center gap-3">
                <div class="h-9 w-9 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                </div>
                <span class="text-sm font-medium text-white/90">اعلان‌ها و پیام‌ها</span>
              </div>
              <svg class="w-4 h-4 text-white/20 -scale-x-100 group-hover:text-[#b9f1cf] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </router-link>
          </div>
        </div>

      </div>

      <!-- Logout Button -->
      <button
        @click="remove"
        class="mt-8 w-full rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white py-4 text-sm font-bold transition-all shadow-[0_0_20px_-5px_rgba(244,63,94,0.1)] flex items-center justify-center gap-2 group"
      >
        <svg class="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
        خروج از حساب کاربری
      </button>

    </div>

    <!-- Loading Spinner -->
    <div v-else class="flex justify-center items-center py-32">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#b9f1cf]"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const url = process.env.VUE_APP_API_URL
const user = ref(null)
const balanceGram = ref(0) // موجودی گرم طلا (محاسبه شده)

const fullName = computed(() => `${user.value?.fname || ''} ${user.value?.lname || ''}`.trim() || 'کاربر گرامی')
const initials = computed(() => {
  const f = (user.value?.fname || '').trim().charAt(0)
  const l = (user.value?.lname || '').trim().charAt(0)
  return (f + l || 'U').toUpperCase()
})

const userRoleLabel = computed(() => {
  const map = { 'USER': 'کاربر عادی', 'COWORKER': 'همکار تجاری', 'ADMIN': 'مدیریت' }
  return map[user.value?.role] || 'کاربر'
})

function formatMoney(n) {
  if (!n) return '0'
  return Number(n).toLocaleString('fa-IR')
}

// 1. دریافت پروفایل (شامل موجودی تومان)
async function loadProfile() {
  try {
    const token = localStorage.getItem('token')
    const { data } = await axios.get(`${url}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    user.value = data.user
  } catch (e) {
    user.value = null
    if (e.response?.status === 401) remove()
  }
}

// 2. دریافت موجودی طلا از دارایی‌ها
async function loadWalletAssets() {
  try {
    const token = localStorage.getItem('token')
    const { data } = await axios.get(`${url}/user/assets`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const assets = data.data || data || []
    
    // پیدا کردن موجودی طلای آبشده/18 عیار
    const goldAsset = Array.isArray(assets) 
      ? assets.find(a => a.name === 'YekGram18' || a.name === 'gold18')
      : null
      
    balanceGram.value = goldAsset ? Number(goldAsset.balance) : 0
  } catch (e) {
    console.error('Error loading wallet:', e)
  }
}

function remove() {
  localStorage.removeItem('token')
  router.push('/user')
}

onMounted(() => {
  loadProfile()
  loadWalletAssets()
})
</script>

<style scoped>
/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #334D44;
  border-radius: 10px;
}
</style>