<template>
  <div dir="rtl" class="min-h-screen overflow-auto">
    <div v-if="loaded" class="max-w-7xl mx-auto p-4">
      <div class="rounded-2xl bg-[#0f1417] text-white ring-1 ring-[#334D44]/60 p-6">
        <h2 class="text-center text-xl font-extrabold text-white">مشخصات فردی</h2>
        <form class="mt-6 space-y-4" @submit.prevent="edit">
          <div>
            <label class="mb-2 block text-sm text-white/80">نام</label>
            <input
              v-model.trim="form.fname"
              type="text"
              class="w-full rounded-xl bg-[#141a1e] text-white placeholder-white/30 px-3 py-2 ring-1 ring-[#334D44]/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="نام"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm text-white/80">نام خانوادگی</label>
            <input
              v-model.trim="form.lname"
              type="text"
              class="w-full rounded-xl bg-[#141a1e] text-white placeholder-white/30 px-3 py-2 ring-1 ring-[#334D44]/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="نام خانوادگی"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm text-white/80">کد ملی</label>
            <input
              v-model="form.codemeli"
              maxlength="10"
              disabled
              class="w-full rounded-xl bg-[#1e2623] text-white/70 px-3 py-2 ring-1 ring-[#334D44]/40 cursor-not-allowed"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm text-white/80">شماره تلفن</label>
            <input
              v-model="form.phone"
              maxlength="11"
              disabled
              class="w-full rounded-xl bg-[#1e2623] text-white/70 px-3 py-2 ring-1 ring-[#334D44]/40 cursor-not-allowed"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm text-white/80">ایمیل</label>
            <input
              v-model.trim="form.email"
              type="email"
              class="w-full rounded-xl bg-[#141a1e] text-white placeholder-white/30 px-3 py-2 ring-1 ring-[#334D44]/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="email@example.com"
            />
          </div>
          <button
            type="submit"
            :disabled="submitting || !canSubmit"
            class="w-full mt-2 rounded-2xl bg-[#b9f1cf] text-[#0a1f14] font-bold py-2.5 hover:brightness-95 active:brightness-90 disabled:opacity-60"
          >
            {{ submitting ? 'در حال ذخیره…' : 'ثبت' }}
          </button>
        </form>
      </div>
    </div>
    <div v-else class="flex justify-center items-center py-16">
      <svg class="animate-spin h-8 w-8 text-white/80" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'

const url = process.env.VUE_APP_API_URL
const token = localStorage.getItem('token')
const router = useRouter()

const loaded = ref(false)
const submitting = ref(false)

const form = reactive({
  fname: '',
  lname: '',
  codemeli: '',
  phone: '',
  email: ''
})

const canSubmit = computed(() => {
  const hasNames = String(form.fname || '').trim().length > 0 && String(form.lname || '').trim().length > 0
  const emailOk = !form.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
  return hasNames && emailOk
})

async function load() {
  try {
    const { data } = await axios.get(`${url}/user/profile`, { headers: { Authorization: `Bearer ${token}` } })
    Object.assign(form, data.user || {})
    loaded.value = true
  } catch (e) {
    router.push('/login')
  }
}

async function edit() {
  if (!canSubmit.value || submitting.value) return
  submitting.value = true
  try {
    const { data } = await axios.post(`${url}/user/profile`, form, { headers: { Authorization: `Bearer ${token}` } })
    Object.assign(form, data.user || {})
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'پروفایل با موفقیت به‌روزرسانی شد',
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true
    })
  } catch (e) {
    const msg = e.response?.data?.error || e.response?.data?.error_msg || 'خطا در ذخیره اطلاعات'
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: String(msg),
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    })
  } finally {
    submitting.value = false
  }
}

onMounted(load)
</script>

<style scoped>
</style>
