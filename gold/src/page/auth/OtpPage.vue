<template>
  <div dir="rtl" class="min-h-screen  flex items-center justify-center py-12 px-4">
    <div class="w-full max-w-md">
      <h2 class="text-center text-3xl font-extrabold text-white mb-6">کد ورود به پرشین گلد</h2>
      <form class="space-y-6 rounded-2xl bg-[#303334]/40 p-8 shadow-xl ring-1 ring-[#334D44]/60" @submit.prevent="login">
        <div>
          <label for="otp" class="block text-sm font-medium text-white/80 mb-2">کد پیامک‌شده</label>
          <input
            id="otp"
            name="otp"
            v-model="form.otp"
            inputmode="numeric"
            pattern="\\d*"
            maxlength="6"
            autocomplete="one-time-code"
            required
            placeholder="— — — — — —"
            class="w-full rounded-xl bg-[#1e2623] text-white placeholder-white/40 px-3 py-2 ring-1 ring-[#334D44] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition text-center tracking-widest"
          />
        </div>
        <button
          type="submit"
          class="w-full rounded-xl py-2.5 text-sm font-semibold bg-gradient-to-r from-[#b9f1cf] to-[#aef3c9] text-[#0a1f14] shadow-md hover:shadow-lg hover:translate-y-[-1px] active:translate-y-0 transition"
        >
          تایید کد
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'

const url = process.env.VUE_APP_API_URL
const route = useRoute()
const router = useRouter()

const form = reactive({ phone: '', otp: '' })

onMounted(() => {
  if (route.query.phone) form.phone = route.query.phone
  const token = localStorage.getItem('token')
  if (token) axios.defaults.headers.common.Authorization = `Bearer ${token}`
})

async function login() {
  try {
    const res = await axios.post(`${url}/auth/otp`, form)
    if (res.status === 200) {
      const token = res.data.data
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
