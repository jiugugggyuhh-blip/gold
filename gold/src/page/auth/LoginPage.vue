<template>
  <div dir="rtl" class="min-h-screen  flex items-center justify-center py-12 px-4">
    <div class="w-full max-w-md">
      <h1 class="text-center text-3xl font-extrabold text-white mb-6">ورود به پرشین گلد</h1>
      <form class="space-y-6 rounded-2xl bg-[#2B4039]/40 p-8 shadow-xl ring-1 ring-[#334D44]/60" @submit.prevent="login">
        <div>
          <label for="phone" class="block text-sm font-medium text-white/80 mb-2">شماره موبایل</label>
          <input id="phone" name="phone" type="tel" inputmode="tel" v-model="form.phone" required placeholder="شماره با 09 شروع می‌شود" class="w-full rounded-xl bg-[#1e2623] text-white placeholder-white/40 px-3 py-2 ring-1 ring-[#334D44] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-white/80 mb-2">رمز عبور</label>
          <div class="relative">
            <input :type="showPass ? 'text' : 'password'" id="password" name="password" v-model="form.password" required placeholder="••••••••" class="w-full rounded-xl bg-[#1e2623] text-white placeholder-white/40 px-3 py-2 ring-1 ring-[#334D44] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition pr-10" />
            <button type="button" @click="showPass = !showPass" class="absolute inset-y-0 left-2 my-auto px-2 text-white/70 hover:text-white focus:outline-none" aria-label="نمایش/مخفی کردن رمز">
              <svg v-if="!showPass" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a10.05 10.05 0 012.57-4.364M6.223 6.223A9.96 9.96 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.05 10.05 0 01-3.108 4.31M3 3l18 18" />
              </svg>
            </button>
          </div>
          <div class="mt-2 text-left">
            <router-link to="/forgot-password" class="text-sm font-medium text-emerald-300 hover:text-emerald-200">فراموش کرده‌اید؟</router-link>
          </div>
        </div>
        <div class="space-y-4">
          <button type="submit" class="w-full rounded-xl py-2.5 text-sm font-semibold bg-[#A3FFD1] text-[#0a1f14] shadow-md hover:shadow-lg hover:translate-y-[-1px] active:translate-y-0 transition">ورود</button>
          <p class="text-center text-sm text-white/70">حساب کاربری ندارید؟ <router-link to="/register" class="font-semibold text-emerald-300 hover:text-emerald-200">ثبت‌نام</router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
const router = useRouter()
const form = reactive({ phone: '', password: '' })
const showPass = ref(false)
const url = process.env.VUE_APP_API_URL
async function login() {
  try {
    const { data, status } = await axios.post(`${url}/auth/login`, form)
    if (status === 200) {
      const token = data.data
      localStorage.setItem('token', token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'به سایت خوش اومدی رفیق', showConfirmButton: false, timer: 3000, timerProgressBar: true })
      router.push('/user')
    }
  } catch (err) {
    const msg = err?.response?.data?.error_msg || 'خطا رخ داده است'
    Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: msg, showConfirmButton: false, timer: 3000, timerProgressBar: true })
  }
}
</script>

<style scoped>
</style>
