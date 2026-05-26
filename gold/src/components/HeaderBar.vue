<template>
  <div>
    <header dir="rtl" class="text-white">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <!-- برند -->
          <div class="flex items-center gap-2">
            <div
              class="text-xl md:text-2xl font-extrabold text-white bg-clip-text text-transparent select-none">
              پرشین گلد
            </div>
          </div>

      
          <button
            @click="open = !open"
            class="md:hidden p-2 rounded-lg hover:bg-[#1b2227]/60 transition focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Toggle menu">
            <svg v-if="!open" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <!-- منوی دسکتاپ -->
          <nav class="hidden md:flex items-center gap-6">
            <router-link to="/" class="text-white/90 hover:text-white transition">صفحه اصلی</router-link>
            <router-link to="/about" class="text-white/90 hover:text-white transition">درباره ما</router-link>
            <router-link to="/contact" class="text-white/90 hover:text-white transition">تماس با ما</router-link>
            <router-link to="/blog" class="text-white/90 hover:text-white transition">وبلاگ</router-link>
            <router-link to="/privacy" class="text-white/90 hover:text-white transition">حریم خصوصی</router-link>
          </nav>

          <!-- دکمه‌ها -->
          <div class="hidden sm:flex items-center gap-2">
            <router-link
              v-if="!isLoggedIn"
              to="/login"
              class="px-3 py-2 rounded-xl bg-[#2B4039] border border-[#9CFACB]  text-[#9CFACB]  font-medium hover:bg-emerald-800 active:bg-emerald-900 transition focus:outline-none focus:ring-2 focus:ring-emerald-400/40">
              ورود
            </router-link>

            <router-link
              v-if="!isLoggedIn"
              to="/register"
              class="px-3 py-2 rounded-xl bg-[#b9f1cf] border  border-[#b9f1cf] text-[#084D41]  font-medium hover:brightness-95 active:brightness-90 transition shadow focus:outline-none focus:ring-2 focus:ring-white/30">
              ثبت‌نام
            </router-link>

            <router-link
              v-else
              to="/user"
              class="px-4 py-2 rounded-xl bg-emerald-600 text-white t font-semibold hover:bg-emerald-700 transition focus:outline-none focus:ring-2 focus:ring-emerald-400/40">
              پنل کاربری
            </router-link>
          </div>
        </div>

        <!-- منوی موبایل -->
        <transition name="slide-down">
          <nav
            v-if="open"
            class="md:hidden mt-3 rounded-xl bg-[#141a1e] ring-1 ring-white/5 p-3 space-y-2">
            <router-link @click="close" to="/" class="block px-2 py-2 rounded-lg hover:bg-white/5">صفحه اصلی</router-link>
            <router-link @click="close" to="/about" class="block px-2 py-2 rounded-lg hover:bg-white/5">درباره ما</router-link>
            <router-link @click="close" to="/contact" class="block px-2 py-2 rounded-lg hover:bg-white/5">تماس با ما</router-link>
            <router-link @click="close" to="/blog" class="block px-2 py-2 rounded-lg hover:bg-white/5">وبلاگ</router-link>
            <router-link @click="close" to="/privacy" class="block px-2 py-2 rounded-lg hover:bg-white/5">حریم خصوصی</router-link>

            <div class="pt-2 border-t border-white/10 mt-2 flex items-center gap-2">
              <router-link
                v-if="!isLoggedIn"
                @click="close"
                to="/register"
                class="flex-1 text-sm px-3 py-2 rounded-full bg-[#b9f1cf] text-[#0a1f14] font-medium text-center hover:brightness-95 transition">
                ثبت‌نام
              </router-link>
              <router-link
                v-if="!isLoggedIn"
                @click="close"
                to="/login"
                class="flex-1 text-sm px-3 py-2 rounded-full bg-emerald-700 text-white font-medium text-center hover:bg-emerald-800 transition">
                ورود
              </router-link>

              <router-link
                v-else
                @click="close"
                to="/user"
                class="w-full text-sm px-3 py-2 rounded-full bg-emerald-600 text-white font-semibold text-center hover:bg-emerald-700 transition">
                پنل کاربری
              </router-link>
            </div>
          </nav>
        </transition>
      </div>
    </header>
    
    <!-- Price Bar -->
    <PriceBar />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PriceBar from '@/components/PriceBar.vue'

const open = ref(false)
const isLoggedIn = ref(false)
const close = () => { open.value = false }

onMounted(() => {
  const token = localStorage.getItem('token')
  if (token) isLoggedIn.value = true
})
</script>

<style>
/* انیمیشن */
.slide-down-enter-active { transition: transform .25s ease-out, opacity .25s ease-out; }
.slide-down-leave-active { transition: transform .2s ease-in, opacity .2s ease-in; }
.slide-down-enter-from, .slide-down-leave-to { transform: translateY(-8px); opacity: 0; }
</style>
