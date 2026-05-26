<template>
  <div dir="rtl" class="min-h-screen  flex items-center justify-center py-12 px-4">
    <div class="w-full max-w-md">
      <h2 class="text-center text-3xl font-extrabold text-white mb-6">ثبت نام  </h2>
      <form class="rounded-2xl bg-[#303334]/40 p-8 shadow-xl ring-1 ring-[#334D44]/60" @submit.prevent="register">
        <div class="space-y-4">
          <div>
            <label for="fname" class="block text-sm font-medium text-white/80 mb-2">نام</label>
            <input id="fname" name="fname" type="text" v-model="form.fname" required
                   class="w-full rounded-xl bg-[#1e2623] text-white placeholder-white/40 px-3 py-2 ring-1 ring-[#334D44] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" placeholder="نام"/>
          </div>
          <div>
            <label for="lname" class="block text-sm font-medium text-white/80 mb-2">نام خانوادگی</label>
            <input id="lname" name="lname" type="text" v-model="form.lname" required
                   class="w-full rounded-xl bg-[#1e2623] text-white placeholder-white/40 px-3 py-2 ring-1 ring-[#334D44] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" placeholder="نام خانوادگی"/>
          </div>
          <div>
            <label for="phone" class="block text-sm font-medium text-white/80 mb-2">شماره موبایل</label>
            <input id="phone" name="phone" type="tel" v-model="form.phone" @input="onPhoneInput" inputmode="tel" maxlength="11" autocomplete="tel" placeholder="09xxxxxxxxx" required
                   class="w-full rounded-xl bg-[#1e2623] text-white placeholder-white/40 px-3 py-2 ring-1 ring-[#334D44] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"/>
            <p v-if="form.phone.length > 0 && !phoneValid" class="text-xs text-red-400 mt-2">شماره موبایل نامعتبر است. شماره باید ۱۱ رقم و با صفر شروع شود.</p>
          </div>
          <div>
            <label for="username" class="block text-sm font-medium text-white/80 mb-2">نام کاربری</label>
            <input id="username" name="username" type="text" v-model="form.username" required
                   class="w-full rounded-xl bg-[#1e2623] text-white placeholder-white/40 px-3 py-2 ring-1 ring-[#334D44] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" placeholder="نام کاربری"/>
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-white/80 mb-2">ایمیل</label>
            <input id="email" name="email" type="email" v-model="form.email" required
                   class="w-full rounded-xl bg-[#1e2623] text-white placeholder-white/40 px-3 py-2 ring-1 ring-[#334D44] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" placeholder="ایمیل"/>
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-white/80 mb-2">رمز عبور</label>
            <input id="password" name="password" type="password" v-model="form.password" required
                   class="w-full rounded-xl bg-[#1e2623] text-white placeholder-white/40 px-3 py-2 ring-1 ring-[#334D44] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" placeholder="رمز عبور"/>
          </div>
        </div>
        <button :disabled="loading || !phoneValid" type="submit"
                class="w-full mt-6 rounded-xl py-2.5 text-sm font-semibold bg-[#A3FFD1] shadow-md hover:shadow-lg hover:translate-y-[-1px] active:translate-y-0 transition disabled:opacity-60">
          {{ loading ? 'در حال ارسال...' : 'ثبت‌نام' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'

const url = process.env.VUE_APP_API_URL
const router = useRouter()
const route = useRoute()
const refcode = route.query.ref || ''

const form = reactive({
  phone: '',
  username: '',
  email: '',
  password: '',
  fname: '',
  lname: '',
  refcode,
})

const loading = ref(false)
const phoneValid = computed(() => /^0\d{10}$/.test(form.phone))

function onPhoneInput(e) {
  let v = String(e.target.value || '')
  v = v.replace(/\D/g, '')
  if (v.length > 11) v = v.slice(0, 11)
  form.phone = v
}

function register() {
  if (!phoneValid.value) {
    Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'شماره موبایل نامعتبر است. باید ۱۱ رقم و با صفر شروع شود', showConfirmButton: false, timer: 3000, timerProgressBar: true })
    return
  }
  loading.value = true
  axios.post(`${url}/auth/register`, form).then(res => {
    loading.value = false
    if (res.status === 200) {
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: res.data.data || 'عملیات با موفقیت انجام شد', showConfirmButton: false, timer: 3000, timerProgressBar: true, didOpen: (t) => { t.addEventListener('mouseenter', Swal.stopTimer); t.addEventListener('mouseleave', Swal.resumeTimer) } })
      setTimeout(() => {
        router.push({ name: 'OtpPage', query: { phone: form.phone } })
      }, 500)
    }
  }).catch(err => {
    loading.value = false
    const msg = err.response?.data?.error_msg || err.response?.data?.error || err.message || 'خطا رخ داده است'
    Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: String(msg), showConfirmButton: false, timer: 3000, timerProgressBar: true, didOpen: (t) => { t.addEventListener('mouseenter', Swal.stopTimer); t.addEventListener('mouseleave', Swal.resumeTimer) } })
  })
}
</script>

<style scoped>
</style>
