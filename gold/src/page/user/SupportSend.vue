<template>
  <div class="min-h-screen max-w-7xl overflow-auto px-3 sm:px-6 py-6">
    <div class=" mx-auto">
      <div class="rounded-2xl bg-gradient-to-b from-[#1a2220] to-[#12181b] ring-1 ring-[#334D44]/60 text-white p-5 sm:p-6">
        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-xl sm:text-2xl font-extrabold text-yellow-300">ارسال تیکت پشتیبانی</h1>
            <p class="mt-1 text-sm text-white/70">سوال یا مشکل خود را با جزئیات ارسال کنید تا سریع‌تر پیگیری شود.</p>
          </div>
          <div class="hidden sm:flex items-center gap-2 text-xs">
            <span class="px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30">میانگین پاسخ‌گویی ۲۴–۱ ساعت</span>
          </div>
        </div>

        <form @submit.prevent="send" class="mt-6 space-y-5">
          <div>
            <label class="block text-sm text-white/80 mb-2">دپارتمان</label>
            <div class="relative">
              <select
                v-model="form.category"
                required
                class="w-full appearance-none rounded-xl bg-white/5 ring-1 ring-white/10 focus:ring-2 focus:ring-yellow-400 px-3 py-3 text-sm"
              >
                <option value="" disabled>انتخاب کنید…</option>
                <option v-for="c in departments" :key="c.value" :value="c.value">{{ c.label }}</option>
              </select>
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6"/>
              </svg>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-sm text-white/80">عنوان تیکت</label>
              <div class="flex gap-2">
                <button type="button" class="chip" @click="applyTitle('مشکل در پرداخت درگاه')">مشکل پرداخت</button>
                <button type="button" class="chip" @click="applyTitle('سوال درباره احراز هویت')">سوال احراز</button>
              </div>
            </div>
            <input
              v-model.trim="form.title"
              type="text"
              required
              minlength="5"
              :class="['w-full rounded-xl bg-white/5 ring-1 px-3 py-3 text-sm focus:outline-none', titleInvalid ? 'ring-red-400/40 focus:ring-red-400' : 'ring-white/10 focus:ring-yellow-400']"
              placeholder="مثال: خطای پرداخت هنگام خرید"
            />
            <div class="mt-1 text-xs" :class="titleInvalid ? 'text-red-300' : 'text-white/50'">
              حداقل ۵ کاراکتر
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-sm text-white/80">متن تیکت</label>
              <span class="text-xs text-white/60">{{ form.text.length }}/{{ textMin }} کاراکتر</span>
            </div>
            <textarea
              v-model="form.text"
              rows="6"
              required
              :minlength="textMin"
              :class="['w-full resize-y rounded-xl bg-white/5 ring-1 px-3 py-3 text-sm focus:outline-none', textInvalid ? 'ring-red-400/40 focus:ring-red-400' : 'ring-white/10 focus:ring-yellow-400']"
              placeholder="جزئیات کامل مشکل، پیام خطا، زمان وقوع و هر تصویر یا شماره تراکنش مرتبط را بنویسید."
            ></textarea>
            <div class="h-1.5 w-full rounded-full bg-white/5 overflow-hidden mt-2">
              <div class="h-full rounded-full" :class="textInvalid ? 'bg-red-400/80' : 'bg-yellow-300'" :style="{ width: textProgress + '%' }"></div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="block text-sm text-white/80">ضمیمه (اختیاری)</span>
              <span v-if="fileName" class="text-xs text-white/70 truncate max-w-[60%]">{{ fileName }}</span>
            </div>
            <div class="flex items-center gap-2">
              <input ref="fileEl" type="file" class="hidden" @change="onPickFile" />
              <button type="button" class="btn-ghost" @click="fileEl?.click()">انتخاب فایل</button>
              <button v-if="fileName" type="button" class="btn-ghost" @click="clearFile">حذف فایل</button>
              <span class="text-xs text-white/50">jpg, png, pdf تا ۵ مگابایت</span>
            </div>
          </div>

          <div class="flex items-center gap-3 pt-2">
            <button
              type="submit"
              :disabled="loading || !isValid"
              class="btn-primary"
            >
              {{ loading ? 'در حال ارسال…' : 'ارسال تیکت' }}
            </button>
            <button type="button" class="btn-ghost" @click="reset">پاک‌سازی فرم</button>
            <div class="ml-auto text-xs text-white/60 flex items-center gap-1">
              <span class="inline-block h-2 w-2 rounded-full" :class="isValid ? 'bg-emerald-400' : 'bg-red-400'"></span>
              وضعیت فرم
            </div>
          </div>
        </form>

        <transition enter-active-class="transition duration-200" enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0">
          <div v-if="successMessage" class="mt-5 rounded-2xl bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/30 p-4 text-sm">
            {{ successMessage }}
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

const url = process.env.VUE_APP_API_URL || ''
const token = localStorage.getItem('token')
if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

const departments = [
  { value: 'support',   label: 'پشتیبانی' },
  { value: 'sales',     label: 'فروش' },
  { value: 'technical', label: 'فنی' },
  { value: 'billing',   label: 'مالی' },
  { value: 'orders',    label: 'سفارشات' }
]

const form = reactive({ title: '', text: '', category: '' })
const loading = ref(false)
const successMessage = ref('')

const textMin = 10
const isValid = computed(() => form.category && form.title.trim().length >= 5 && form.text.trim().length >= textMin)
const titleInvalid = computed(() => form.title.trim().length > 0 && form.title.trim().length < 5)
const textInvalid = computed(() => form.text.trim().length > 0 && form.text.trim().length < textMin)
const textProgress = computed(() => Math.min(100, Math.round((form.text.length / textMin) * 100)))

const fileEl = ref(null)
const fileObj = ref(null)
const fileName = ref('')

function onPickFile(e) {
  const f = e.target.files?.[0]
  if (!f) { clearFile(); return }
  if (f.size > 5 * 1024 * 1024) {
    Swal.fire({ icon: 'error', text: 'حداکثر حجم فایل ۵ مگابایت است.' })
    clearFile()
    return
  }
  fileObj.value = f
  fileName.value = f.name
}
function clearFile() {
  fileObj.value = null
  fileName.value = ''
  if (fileEl.value) fileEl.value.value = ''
}

function reset() {
  form.title = ''
  form.text = ''
  form.category = ''
  successMessage.value = ''
  clearFile()
}

function applyTitle(t) {
  form.title = t
}

async function send() {
  if (!isValid.value) {
    Swal.fire({ icon: 'error', text: 'لطفاً همه فیلدها را به‌درستی تکمیل کنید.' })
    return
  }
  loading.value = true
  try {
    const fd = new FormData()
    fd.append('title', form.title.trim())
    fd.append('text', form.text.trim())
    fd.append('category', form.category)
    if (fileObj.value) fd.append('file', fileObj.value)

    const { data } = await axios.post(`${url}/user/sendTicket`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    const msg = typeof data === 'string' ? data : (data?.data || 'تیکت شما ثبت شد.')
    successMessage.value = msg
    Swal.fire({ icon: 'success', text: msg, timer: 2200, toast: true, position: 'top-end', showConfirmButton: false })
    reset()
  } catch (err) {
    const msg = err?.response?.data?.error || err?.response?.data || err?.message || 'خطا در ارسال تیکت'
    Swal.fire({ icon: 'error', text: String(msg) })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.btn-primary{ @apply px-4 py-2 rounded-xl bg-[#b9f1cf] text-[#0a1f14] font-semibold hover:brightness-95 disabled:opacity-60 text-sm; }
.btn-ghost{ @apply px-4 py-2 rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/60 hover:bg-[#22302b] text-sm; }
.chip{ @apply px-3 py-1 rounded-full bg-[#1e2623] ring-1 ring-[#334D44]/60 hover:bg-[#22302b] text-xs; }
</style>
