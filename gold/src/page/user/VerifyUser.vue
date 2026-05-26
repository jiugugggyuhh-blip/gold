<template>
  <div dir="rtl" class="min-h-screen max-w-7xl overflow-auto p-4">
    <div
      v-if="userLoaded && user?.isreject"
      class="rounded-2xl bg-[#2a1313] ring-1 ring-red-400/40 p-5 mb-6 text-red-100"
    >
      <div class="flex items-start gap-3">
        <svg class="h-6 w-6 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v4m0 4h.01M12 5a7 7 0 100 14 7 7 0 000-14z"/>
        </svg>
        <div class="flex-1 text-right">
          <h3 class="text-base font-bold text-red-200">احراز هویت رد شد</h3>
          <div class="mt-2 rounded-xl bg-red-900/30 ring-1 ring-red-400/30 p-3 text-sm whitespace-pre-wrap">
            {{ rejectReason }}
          </div>
          <div class="mt-4 flex gap-2 justify-end">
            <button
              @click="showForm = true"
              class="px-4 py-2 rounded-xl bg-[#b9f1cf] text-[#0a1f14] font-semibold hover:brightness-95"
            >
              ارسال مجدد مدارک
            </button>
            <button
              @click="dismissReject"
              class="px-4 py-2 rounded-xl bg-[#141a1e] text-white ring-1 ring-white/10 hover:bg-[#1b2428]"
            >
              بستن
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="userLoaded && (showForm || !user?.isflag)"
      class="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-2xl bg-[#0f1417] text-white ring-1 ring-[#334D44]/60 p-5 mb-6"
    >
      <div class="order-2 md:order-1 md:col-span-2">
        <h2 class="text-center text-xl font-extrabold">احراز هویت</h2>

        <div class="mt-4 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-400/30 p-4 text-emerald-200">
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="font-semibold">کاربر گرامی</div>
              <div class="text-sm mt-1">تصویر کارت ملی واضح باشد و با کد ملی وارد شده مطابقت داشته باشد.</div>
            </div>
            <svg class="h-5 w-5 opacity-80" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 18a8 8 0 118-8 8.024 8.024 0 01-8 8zm1-5H9v2h2zm0-8H9v6h2z"/>
            </svg>
          </div>
        </div>

        <form class="mt-6 space-y-4" @submit.prevent="verify">
          <div>
            <label class="mb-2 block text-sm text-white/80">کد ملی</label>
            <input
              v-model="codemeli"
              @input="onCodeInput"
              maxlength="10"
              inputmode="numeric"
              class="w-full rounded-xl bg-[#141a1e] text-white placeholder-white/30 px-3 py-2 ring-1 ring-[#334D44]/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="مثال: ۱۲۳۴۵۶۷۸۹۰"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm text-white/80">عکس کارت ملی</label>
            <input
              type="file"
              accept="image/*"
              @change="handleCardImage"
              class="w-full rounded-xl bg-[#141a1e] text-white px-3 py-2 ring-1 ring-[#334D44]/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div v-if="previewUrl" class="mt-3">
              <img :src="previewUrl" alt="preview" class="max-w-xs rounded-xl ring-1 ring-white/10">
            </div>
          </div>

          <div class="flex gap-2">
            <button
              type="submit"
              :disabled="submitting"
              class="flex-1 rounded-2xl bg-[#b9f1cf] text-[#0a1f14] font-bold py-2.5 hover:brightness-95 disabled:opacity-60"
            >
              {{ submitting ? 'در حال ارسال…' : 'ثبت' }}
            </button>
            <button
              type="button"
              @click="cancelForm"
              class="px-4 py-2 rounded-2xl bg-[#141a1e] text-white ring-1 ring-white/10 hover:bg-[#1b2428]"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>

      <div class="order-1 md:order-3 flex items-center justify-center">
        <img
          src="https://matiran.ir/wp-content/uploads/2019/05/1.png"
          alt="نمونه کارت ملی"
          class="max-w-full rounded-xl ring-1 ring-white/10"
        />
      </div>
    </div>

    <div
      v-else-if="userLoaded && user?.isflag && !user?.isAuthentication"
      class="mt-8 flex flex-row-reverse items-center justify-between rounded-2xl bg-yellow-500/10 ring-1 ring-yellow-400/30 p-5 text-yellow-100"
    >
      <svg class="h-6 w-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4l3 3m6 1a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <div class="text-right">
        <div class="text-base font-semibold text-yellow-200">در حال بررسی</div>
        <div class="mt-1 text-sm">مدارک شما دریافت شد و به‌زودی بررسی می‌شود.</div>
      </div>
    </div>

    <div
      v-else-if="userLoaded && user?.isAuthentication"
      class="mt-8 flex flex-row-reverse items-center justify-between rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-400/30 p-5 text-emerald-100"
    >
      <svg class="h-6 w-6 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
      </svg>
      <div class="text-right">
        <div class="text-base font-semibold text-emerald-200">تأیید شد</div>
        <div class="mt-1 text-sm">احراز هویت شما با موفقیت انجام شد.</div>
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
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

const url = process.env.VUE_APP_API_URL || ''
const token = localStorage.getItem('token')

const codemeli = ref('')
const cardImage = ref(null)
const previewUrl = ref(null)

const userLoaded = ref(false)
const user = ref(null)
const submitting = ref(false)
const showForm = ref(false)

const rejectReason = computed(() => user.value?.isRejected || user.value?.rejectReason || '—')

onMounted(async () => {
  await loadProfile()
  if (user.value && !user.value.isflag) showForm.value = true
  if (user.value && user.value.isreject) showForm.value = true
})

async function loadProfile() {
  try {
    const { data } = await axios.get(`${url}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    user.value = data.user || null
    if (user.value?.codemeli) codemeli.value = user.value.codemeli
  } catch (e) {
    user.value = null
  } finally {
    userLoaded.value = true
  }
}

function onCodeInput(e) {
  let v = String(e.target.value || '')
  v = v.replace(/[^\d۰-۹٠-٩]/g, '')
  const mapFa = '۰۱۲۳۴۵۶۷۸۹'
  const mapAr = '٠١٢٣٤٥٦٧٨٩'
  v = v.replace(/[۰-۹]/g, ch => mapFa.indexOf(ch)).replace(/[٠-٩]/g, ch => mapAr.indexOf(ch))
  if (v.length > 10) v = v.slice(0, 10)
  codemeli.value = v
}

function handleCardImage(e) {
  const f = e.target.files?.[0] || null
  if (!f) { cardImage.value = null; previewUrl.value = null; return }
  if (f.size > 6 * 1024 * 1024) {
    Swal.fire({ icon: 'warning', text: 'حجم تصویر بیشتر از ۶ مگابایت است.' })
    return
  }
  cardImage.value = f
  const reader = new FileReader()
  reader.onload = ev => { previewUrl.value = ev.target.result }
  reader.readAsDataURL(f)
}

function cancelForm() {
  showForm.value = false
  cardImage.value = null
  previewUrl.value = null
}

async function verify() {
  if (!codemeli.value || codemeli.value.length !== 10) {
    Swal.fire({ icon: 'warning', text: 'کد ملی ۱۰ رقمی وارد کنید.' })
    return
  }
  if (!cardImage.value) {
    Swal.fire({ icon: 'warning', text: 'تصویر کارت ملی را بارگذاری کنید.' })
    return
  }
  submitting.value = true
  try {
    const fd = new FormData()
    fd.append('codemeli', codemeli.value)
    fd.append('cardImage', cardImage.value)
    const { data } = await axios.post(`${url}/user/Authentication`, fd, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    })
    Swal.fire({
      toast: true, position: 'top-end', icon: 'success',
      title: data?.data || 'مدارک ارسال شد', showConfirmButton: false, timer: 2500
    })
    await loadProfile()
    showForm.value = false
  } catch (e) {
    const msg = e.response?.data?.error || e.response?.data?.error_msg || 'ارسال با مشکل مواجه شد'
    Swal.fire({ icon: 'error', text: String(msg) })
  } finally {
    submitting.value = false
  }
}

async function dismissReject() {
  await loadProfile()
  showForm.value = false
}
</script>

<style scoped>
@media (max-width: 640px) {
  .grid { grid-template-columns: repeat(1, minmax(0, 1fr)); }
}
</style>
