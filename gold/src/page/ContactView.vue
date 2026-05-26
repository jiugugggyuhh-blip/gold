<template>
  <div dir="rtl" class="min-h-screen bg-[#0f1417] text-white">
    <!-- Header (Mint-Glass) -->
    <header class="sticky top-0 z-10">
      <div
        class="mx-4 md:mx-8 mt-6 rounded-2xl bg-gradient-to-b from-[#1a2220]/90 to-[#12181b]/90
               ring-1 ring-[#334D44]/60 backdrop-blur-xl shadow-xl p-5"
      >
        <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-xl md:text-2xl font-extrabold">ارتباط با ما</h1>
            <p class="text-xs md:text-sm text-white/60 mt-1">
              هر زمان سؤالی داشتید، اینجاییم. پیام بگذارید یا از راه‌های ارتباطی استفاده کنید.
            </p>
          </div>
          <div class="hidden md:flex items-center gap-2 text-xs">
            <span class="inline-flex items-center gap-2 rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-1.5">
              <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
              پاسخ‌گویی: <b class="font-bold text-white">۹:۰۰ — ۱۸:۰۰</b>
            </span>
          </div>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="px-4 md:px-8 py-8">
      <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Form (Mint Glass Card) -->
        <div
          class="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-xl shadow-xl p-6"
        >
          <h2 class="text-lg md:text-2xl font-extrabold text-emerald-300 mb-2">فرم تماس</h2>
          <p class="text-white/70 text-sm mb-6">
            فرم زیر را تکمیل کنید؛ معمولاً در اولین فرصت پاسخ می‌دهیم.
          </p>

          <form @submit.prevent="submit" class="space-y-4">
            <!-- Name -->
            <div>
              <label class="block text-[13px] text-white/70 mb-1">نام و نام خانوادگی</label>
              <div
                class="rounded-xl bg-white/5 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-emerald-300 transition"
              >
                <input
                  v-model="form.name"
                  type="text"
                  class="w-full px-4 py-2.5 bg-transparent text-white placeholder:text-white/40 focus:outline-none"
                  placeholder="مثلاً: علی رضایی"
                />
              </div>
              <div v-if="errors.name" class="text-xs text-rose-300 mt-1">{{ errors.name }}</div>
            </div>

            <!-- Email / Phone -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[13px] text-white/70 mb-1">ایمیل</label>
                <div class="rounded-xl bg-white/5 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-emerald-300 transition">
                  <input
                    v-model="form.email"
                    type="email"
                    class="w-full px-4 py-2.5 bg-transparent text-white placeholder:text-white/40 focus:outline-none ltr"
                    placeholder="you@example.com"
                  />
                </div>
                <div v-if="errors.email" class="text-xs text-rose-300 mt-1">{{ errors.email }}</div>
              </div>

              <div>
                <label class="block text-[13px] text-white/70 mb-1">تلفن</label>
                <div class="rounded-xl bg-white/5 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-emerald-300 transition">
                  <input
                    v-model="form.phone"
                    type="tel"
                    class="w-full px-4 py-2.5 bg-transparent text-white placeholder:text-white/40 focus:outline-none"
                    placeholder="۰۹۱2xxxxxxx"
                  />
                </div>
                <div v-if="errors.phone" class="text-xs text-rose-300 mt-1">{{ errors.phone }}</div>
              </div>
            </div>

            <!-- Subject -->
            <div>
              <label class="block text-[13px] text-white/70 mb-1">موضوع</label>
              <div class="rounded-xl bg-white/5 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-emerald-300 transition">
                <input
                  v-model="form.subject"
                  type="text"
                  class="w-full px-4 py-2.5 bg-transparent text-white placeholder:text-white/40 focus:outline-none"
                  placeholder="موضوع پیام"
                />
              </div>
              <div v-if="errors.subject" class="text-xs text-rose-300 mt-1">{{ errors.subject }}</div>
            </div>

            <!-- Message -->
            <div>
              <label class="block text-[13px] text-white/70 mb-1">پیام شما</label>
              <div class="rounded-xl bg-white/5 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-emerald-300 transition">
                <textarea
                  v-model="form.message"
                  rows="5"
                  class="w-full px-4 py-3 bg-transparent text-white placeholder:text-white/40 focus:outline-none"
                  placeholder="پیام خود را اینجا بنویسید..."
                ></textarea>
              </div>
              <div v-if="errors.message" class="text-xs text-rose-300 mt-1">{{ errors.message }}</div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-3">
              <button
                :disabled="sending"
                type="submit"
                class="flex-1 px-4 py-2.5 rounded-xl bg-emerald-300 text-[#0a1f14] font-semibold
                       hover:brightness-95 disabled:opacity-60 transition"
              >
                {{ sending ? 'در حال ارسال...' : 'ارسال پیام' }}
              </button>

              <button
                type="button"
                @click="resetForm"
                class="px-4 py-2.5 rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition"
              >
                پاک‌سازی
              </button>
            </div>
          </form>
        </div>

        <!-- Contact Info (Mint Glass Cards) -->
        <div class="space-y-6">
          <!-- Ways -->
          <div class="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-xl shadow-xl p-6">
            <h3 class="text-lg font-semibold text-white mb-4">راه‌های ارتباطی</h3>
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <div class="shrink-0 grid place-items-center w-10 h-10 rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/60">
                  <svg class="w-5 h-5 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M3 8l7-5 7 5v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
                  </svg>
                </div>
                <div>
                  <div class="text-xs text-white/60">آدرس</div>
                  <div class="font-medium text-white">{{ contact.address }}</div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="shrink-0 grid place-items-center w-10 h-10 rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/60">
                  <svg class="w-5 h-5 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M3 5v4a2 2 0 002 2h3l3 3 4-4 3 3V5a2 2 0 00-2-2H5a2 2 0 00-2 2z"/>
                  </svg>
                </div>
                <div>
                  <div class="text-xs text-white/60">تلفن</div>
                  <div class="font-medium text-white ltr">{{ contact.phone }}</div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="shrink-0 grid place-items-center w-10 h-10 rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/60">
                  <svg class="w-5 h-5 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M16 12a4 4 0 01-8 0M12 2v4M12 18v4M4.22 4.22l2.83 2.83M17.95 17.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M17.95 6.05l2.83-2.83"/>
                  </svg>
                </div>
                <div>
                  <div class="text-xs text-white/60">ایمیل</div>
                  <div class="font-medium text-white ltr">{{ contact.email }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Hours + Map -->
          <div class="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-xl shadow-xl p-6">
            <h3 class="text-lg font-semibold text-white mb-3">ساعت پاسخگویی</h3>
            <div class="text-white/80 text-sm">{{ contact.hours }}</div>
            <div class="mt-4">
              <iframe
                v-if="contact.mapUrl"
                :src="contact.mapUrl"
                class="w-full h-44 rounded-xl border-0"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
              <div
                v-else
                class="w-full h-44 rounded-xl bg-white/5 ring-1 ring-white/10 grid place-items-center text-white/50"
              >
                نقشه موجود نیست
              </div>
            </div>
          </div>

          <!-- Socials -->
          <div class="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-xl shadow-xl p-6">
            <h3 class="text-lg font-semibold text-white mb-3">شبکه‌های اجتماعی</h3>
            <div class="flex flex-wrap gap-2">
              <a
                v-if="contact.instagram"
                :href="contact.instagram" target="_blank" rel="noopener"
                class="px-3 py-2 rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/60 hover:bg-[#22302b] transition"
              >Instagram</a>
              <a
                v-if="contact.telegram"
                :href="contact.telegram" target="_blank" rel="noopener"
                class="px-3 py-2 rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/60 hover:bg-[#22302b] transition"
              >Telegram</a>
              <a
                v-if="contact.linkedin"
                :href="contact.linkedin" target="_blank" rel="noopener"
                class="px-3 py-2 rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/60 hover:bg-[#22302b] transition"
              >LinkedIn</a>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

const url = process.env.VUE_APP_API_URL || ''

const form = ref({ name: '', email: '', phone: '', subject: '', message: '' })
const errors = ref({})
const sending = ref(false)
const contact = ref({
  address: 'تهران، خیابان نمونه، پلاک ۱۲۳',
  phone: '021-00000000',
  email: 'info@persiangold.example',
  hours: 'شنبه تا چهارشنبه ۹:۰۰ الی ۱۸:۰۰',
  mapUrl: '',
  instagram: '',
  telegram: '',
  linkedin: ''
})

function validate () {
  errors.value = {}
  if (!form.value.name || form.value.name.trim().length < 2) errors.value.name = 'نام را وارد کنید'
  if (!form.value.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) errors.value.email = 'ایمیل معتبر وارد کنید'
  if (!form.value.phone || form.value.phone.trim().length < 7) errors.value.phone = 'تلفن را وارد کنید'
  if (!form.value.subject || form.value.subject.trim().length < 2) errors.value.subject = 'موضوع را وارد کنید'
  if (!form.value.message || form.value.message.trim().length < 5) errors.value.message = 'پیام باید حداقل ۵ کاراکتر باشد'
  return Object.keys(errors.value).length === 0
}

function resetForm () {
  form.value = { name: '', email: '', phone: '', subject: '', message: '' }
  errors.value = {}
}

async function submit () {
  if (!validate()) return
  sending.value = true
  try {
    await axios.post(`${url}/contact`, { ...form.value })
    Swal.fire({
      icon: 'success',
      title: 'پیام ارسال شد',
      text: 'در اسرع وقت با شما تماس می‌گیریم',
      timer: 2200,
      showConfirmButton: false
    })
    resetForm()
  } catch (err) {
    const msg = err.response?.data?.message || err.response?.data?.error || 'مشکلی رخ داد. دوباره تلاش کنید'
    Swal.fire({ icon: 'error', title: 'خطا', text: String(msg) })
  } finally {
    sending.value = false
  }
}

async function loadContact () {
  try {
    if (!url) return
    const res = await axios.get(`${url}/admin/setting`)
    const d = res.data?.data || {}
    contact.value.address = d.address || contact.value.address
    contact.value.phone = d.phone || contact.value.phone
    contact.value.email = d.email || contact.value.email
    contact.value.hours = d.hours || contact.value.hours
    contact.value.mapUrl = d.mapUrl || contact.value.mapUrl
    contact.value.instagram = d.instagram || contact.value.instagram
    contact.value.telegram = d.telegram || contact.value.telegram
    contact.value.linkedin = d.linkedin || contact.value.linkedin
  } catch (e) {
    // silent
  }
}

onMounted(loadContact)
</script>

<style scoped>
.ltr { direction: ltr; }
::selection { background: rgba(185, 241, 207, 0.25); }
</style>
