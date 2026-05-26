<template>
  <div dir="rtl">
    <header class="hidden lg:flex fixed top-0 w-full z-50 user-desktop-nav">
      <nav class="max-w-7xl mx-auto px-8 py-3 flex items-center justify-center">
        <div class="desktop-nav-shell flex gap-2">
          <router-link to="/user" class="desktop-link" :class="{ active: isActive('/user') }">خانه</router-link>
          <router-link to="/user/history" class="desktop-link" :class="{ active: isActive('/user/history') }">تاریخچه</router-link>
          <router-link to="/user/gold" class="desktop-link" :class="{ active: isActive('/user/gold') }">معاملات</router-link>
          <router-link to="/user/trading-bot" class="desktop-link" :class="{ active: isActive('/user/trading-bot') }">ربات معامله‌گر</router-link>
          <router-link to="/user/wallet" class="desktop-link" :class="{ active: isActive('/user/wallet') }">کیف پول</router-link>
          <router-link to="/user/profile" class="desktop-link" :class="{ active: isActive('/user/profile') }">پروفایل</router-link>
        </div>
      </nav>
    </header>

    <footer class="lg:hidden fixed bottom-0 left-0 w-full z-50 pointer-events-none">
      <nav class="mobile-fixed-nav pointer-events-auto w-full px-2 py-3 grid grid-cols-4 gap-1">
        <router-link to="/user" class="mobile-item" :class="{ active: isActive('/user') }">
          <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955a1.125 1.125 0 0 1 1.591 0L21.75 12M4.5 9.75V21h15V9.75"/></svg>
          <span>خانه</span>
        </router-link>

        <router-link to="/user/history" class="mobile-item" :class="{ active: isActive('/user/history') }">
          <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
          <span>تاریخچه</span>
        </router-link>

        <router-link to="/user/wallet" class="mobile-item" :class="{ active: isActive('/user/wallet') }">
          <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 0 1 9-9"/></svg>
          <span>کیف پول</span>
        </router-link>

        <router-link to="/user/profile" class="mobile-item" :class="{ active: isActive('/user/profile') }">
          <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/></svg>
          <span>پروفایل</span>
        </router-link>
      </nav>
    </footer>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const isActive = (path) => computed(() => route.path.startsWith(path)).value
</script>

<style scoped>
.user-desktop-nav {
  background: rgba(12, 16, 20, 0.58);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 208, 93, 0.12);
}

.desktop-nav-shell {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 208, 93, 0.18);
  border-radius: 16px;
  padding: 6px;
}

.desktop-link {
  color: rgba(255, 255, 255, 0.78);
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 13px;
  transition: all .25s ease;
}

.desktop-link:hover { color: #fff; background: rgba(255, 255, 255, 0.05); }
.desktop-link.active {
  color: #2a1b00;
  background: linear-gradient(140deg, #ffdb8a, #efb03a);
  box-shadow: 0 8px 20px rgba(239, 176, 58, 0.26);
}

.mobile-fixed-nav {
  background: rgba(18, 24, 29, 0.95);
  border-top: 1.5px solid rgba(255, 206, 86, 0.3);
  backdrop-filter: blur(20px);
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.5);
}

.mobile-item {
  color: rgba(255, 255, 255, 0.5);
  min-height: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.mobile-item.active {
  color: #ffce56;
}

.mobile-item.active svg {
  transform: translateY(-4px);
  filter: drop-shadow(0 0 8px rgba(255, 206, 86, 0.5));
}

.mobile-item.active::after {
  content: '';
  position: absolute;
  top: 0;
  width: 24px;
  height: 3px;
  background: #ffce56;
  border-radius: 0 0 4px 4px;
  box-shadow: 0 0 10px rgba(255, 206, 86, 0.8);
}
</style>
