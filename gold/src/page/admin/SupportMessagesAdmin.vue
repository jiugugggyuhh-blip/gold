<template>
  <div dir="rtl" class="flex min-h-screen bg-gradient-to-b from-[#0c1113] to-[#0f1417] text-white">
    <!-- Sidebar (your existing component) -->
    <Sidebar />

    <!-- Main -->
    <div class="flex-1 flex flex-col mt-20 md:mt-0">
      <!-- Header -->
      <header class="sticky top-0 z-20 bg-white/5 backdrop-blur-md ring-1 ring-white/10">
        <div class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div class="min-w-0">
            <div class="flex items-center gap-3">
              <h1 class="truncate text-lg md:text-2xl font-extrabold">
                {{ ticket.title || 'تیکت' }}
              </h1>

              <!-- status chip -->
              <span
                class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ring-1"
                :class="ticket.status==='open'
                  ? 'bg-emerald-500/15 text-emerald-200 ring-emerald-300/40'
                  : 'bg-white/5 text-white/70 ring-white/10'"
              >
                <span class="h-1.5 w-1.5 rounded-full"
                      :class="ticket.status==='open' ? 'bg-emerald-400' : 'bg-white/40'"></span>
                {{ statusFa(ticket.status) }}
              </span>
            </div>

            <div class="mt-1 text-xs md:text-sm text-white/60 truncate">
              {{ mapCategory(ticket.category) }} • شناسه: {{ ticket.uuid || '—' }}
            </div>
          </div>

          <div class="flex items-center gap-2 md:gap-3 shrink-0">
            <button
              @click="toggleStatus"
              :disabled="statusLoading || !ticket._id"
              class="px-3 py-2 rounded-xl text-sm font-semibold transition
                     bg-[#b9f1cf] text-[#0a1f14] hover:brightness-95 disabled:opacity-50"
            >
              {{ statusLoading ? 'در حال اعمال…' : (ticket.status==='open' ? 'بستن تیکت' : 'باز کردن تیکت') }}
            </button>
            <div class="hidden sm:block text-xs text-white/60">
              {{ formatDate(ticket.date) }}
            </div>
          </div>
        </div>

        <!-- tools row -->
        <div class="max-w-5xl mx-auto px-4 pb-4">
          <div class="grid grid-cols-2 gap-2">
            <div class="rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2 text-xs text-white/70">
              دپارتمان:
              <span class="font-semibold text-white/90">{{ mapCategory(ticket.category) }}</span>
            </div>
            <div class="rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2 text-xs text-white/70 text-left">
              آخرین بروزرسانی:
              <span class="font-semibold text-white/90">{{ lastUpdateLabel }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Conversation -->
      <main class="flex-1 overflow-auto">
        <div class="max-w-5xl mx-auto h-full px-3 md:px-4 py-4 flex flex-col">
          <!-- top actions -->
          <div class="mb-3 flex items-center justify-between">
            <div class="text-xs text-white/60">
              مجموع پیام‌ها:
              <span class="text-white font-semibold">{{ messages.length }}</span>
            </div>
            <div class="flex items-center gap-2">
              <button @click="reload" :disabled="loading"
                      class="px-2.5 py-1.5 rounded-lg bg-white/5 ring-1 ring-white/10 text-xs hover:bg-white/10 disabled:opacity-50">
                بروزرسانی
              </button>
              <button @click="copyTicketLink"
                      class="px-2.5 py-1.5 rounded-lg bg-white/5 ring-1 ring-white/10 text-xs hover:bg-white/10">
                کپی لینک
              </button>
            </div>
          </div>

          <!-- thread -->
          <div ref="scrollArea"
               class="flex-1 overflow-auto rounded-2xl bg-gradient-to-b from-[#11171a] to-[#0f1417] ring-1 ring-[#334D44]/60 p-3 md:p-4 space-y-3">
            <div v-if="loading" class="space-y-3">
              <div v-for="i in 6" :key="'skl-'+i" class="flex"
                   :class="i%2 ? 'justify-end' : 'justify-start'">
                <div class="h-16 w-52 md:w-64 rounded-2xl bg-white/10 animate-pulse"></div>
              </div>
            </div>

            <div v-else-if="messages.length===0" class="text-center text-white/60 py-10">
              پیامی ثبت نشده است.
            </div>

            <template v-else>
              <div v-for="(m, idx) in messages" :key="idx" class="flex"
                   :class="m.sender==='admin' ? 'justify-start' : 'justify-end'">
                <div
                  :class="m.sender==='admin'
                    ? 'bg-white/5 ring-1 ring-white/10'
                    : 'bg-[#b9f1cf] text-[#0a1f14]'"
                  class="max-w-[78%] md:max-w-[70%] px-4 py-3 rounded-2xl shadow-sm"
                >
                  <div class="text-[13px] whitespace-pre-wrap leading-6 break-words"
                       :class="m.sender==='admin' ? 'text-white/90' : 'text-[#0a1f14]'">
                    {{ m.text }}
                  </div>
                  <div class="mt-1.5 flex items-center gap-2">
                    <span class="text-[10px]"
                          :class="m.sender==='admin' ? 'text-white/40' : 'text-black/50'">
                      {{ formatDate(m.time) }}
                    </span>
                    <span v-if="m.pending" class="text-[10px] text-yellow-300">در حال ارسال…</span>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- composer -->
          <div class="mt-4 grid grid-cols-12 gap-2">
            <div class="col-span-12 md:col-span-9">
              <div class="rounded-2xl bg-white/5 ring-1 ring-white/10 p-2">
                <textarea
                  v-model="replyText"
                  rows="3"
                  class="w-full bg-transparent outline-none resize-y text-sm md:text-[15px] leading-7 placeholder:text-white/40"
                  placeholder="پاسخ خود را بنویسید… (Ctrl/Cmd + Enter برای ارسال)"
                  @keydown.enter.exact.prevent="sendReply"
                  @keydown.meta.enter.prevent="sendReply"
                  @keydown.ctrl.enter.prevent="sendReply"
                />
                <div class="mt-2 flex items-center justify-between">
                  <div class="text-[11px] text-white/50">
                    حداکثر ۱۰۰۰ کاراکتر
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      @click="clearDraft"
                      class="px-2 py-1 rounded-lg bg-white/5 ring-1 ring-white/10 text-[11px] hover:bg-white/10"
                      :disabled="!replyText"
                    >
                      پاک کردن
                    </button>
                    <button
                      @click="sendReply"
                      :disabled="replyLoading || !replyText.trim() || !ticket._id"
                      class="px-4 py-2 rounded-xl text-sm font-semibold transition
                             bg-[#b9f1cf] text-[#0a1f14] hover:brightness-95 disabled:opacity-50"
                    >
                      {{ replyLoading ? 'در حال ارسال…' : 'ارسال پاسخ' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- quick actions -->
            <div class="col-span-12 md:col-span-3">
              <div class="rounded-2xl bg-white/5 ring-1 ring-white/10 p-2 grid gap-2">
                <button
                  class="w-full px-3 py-2 rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/60 text-xs hover:bg-[#22302b]"
                  @click="insertCanned('کاربر گرامی، پیام شما دریافت شد و به‌زودی بررسی می‌شود.')"
                >پاسخ آماده: دریافت شد</button>
                <button
                  class="w-full px-3 py-2 rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/60 text-xs hover:bg-[#22302b]"
                  @click="insertCanned('لطفاً تصویر/رسید مربوطه را ارسال کنید تا بررسی سریع‌تر انجام شود.')"
                >پاسخ آماده: نیاز به مدرک</button>
                <button
                  class="w-full px-3 py-2 rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/60 text-xs hover:bg-[#22302b]"
                  @click="insertCanned('مشکل برطرف شد. در صورت تداوم، همین تیکت را پاسخ دهید.')"
                >پاسخ آماده: رفع مشکل</button>
              </div>
            </div>
          </div>

          <!-- toast -->
          <transition name="fade">
            <div v-if="toast"
                 class="fixed bottom-4 left-4 z-30 px-3 py-2 rounded-xl bg-white/10 ring-1 ring-white/10 text-xs">
              {{ toast }}
            </div>
          </transition>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/admin/SidebarAdmin.vue'
import axios from 'axios'
import { ref, onMounted, nextTick, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const url = process.env.VUE_APP_API_URL || ''
const route = useRoute()

const ticket = ref({})
const messages = ref([])
const loading = ref(true)

const replyText = ref(localStorage.getItem('admin_reply_draft') || '')
const replyLoading = ref(false)
const statusLoading = ref(false)
const toast = ref('')
const scrollArea = ref(null)

const token = localStorage.getItem('token')
if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

function formatDate(d) {
  if (!d) return '—'
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return d
  return dt.toLocaleString('fa-IR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  })
}
function statusFa(s) {
  if (s === 'open') return 'باز'
  if (s === 'closed') return 'بسته'
  return s || '—'
}
function mapCategory(c) {
  const map = { support: 'پشتیبانی', sales: 'فروش', technical: 'فنی', billing: 'مالی', orders: 'سفارشات' }
  return map[c] || c || '-'
}
const lastUpdateLabel = computed(() => {
  const last = messages.value.length ? messages.value[messages.value.length-1].time : ticket.value?.date
  return formatDate(last)
})

function mergeMessages(t) {
  const userMsgs = (t.masssge || []).map(m => ({ text: m.text, time: m.time || m.createdAt, sender: 'user' }))
  const adminMsgs = (t.masssgeadmin || []).map(m => ({ text: m.text, time: m.time || m.createdAt, sender: 'admin' }))
  const arr = [...userMsgs, ...adminMsgs].map(m => ({ ...m, ts: new Date(m.time || 0).getTime() || 0 }))
  arr.sort((a,b)=>a.ts-b.ts)
  return arr
}

async function load() {
  loading.value = true
  try {
    const id = route.params.id
    const res = await axios.get(`${url}/admin/ticketuser/${id}`)
    const data = res.data?.data || {}
    ticket.value = data
    messages.value = mergeMessages(data)
    await nextTick()
    scrollToBottom()
  } catch {
    ticket.value = {}
    messages.value = []
  } finally {
    loading.value = false
  }
}

function scrollToBottom() {
  const el = scrollArea.value
  if (!el) return
  el.scrollTop = el.scrollHeight
}

async function sendReply() {
  const text = (replyText.value || '').trim()
  if (!text || replyLoading.value || !ticket.value?._id) return
  replyLoading.value = true

  // optimistic UI
  const temp = { text, time: new Date().toISOString(), sender: 'admin', pending: true }
  messages.value = [...messages.value, temp]
  await nextTick(); scrollToBottom()

  try {
    await axios.post(`${url}/admin/adminReply`, { ticketId: ticket.value._id, text })
    replyText.value = ''
    localStorage.removeItem('admin_reply_draft')
    showToast('پاسخ ارسال شد')
    await reload()
  } catch {
    showToast('خطا در ارسال پاسخ')
    // rollback pending state
    messages.value = messages.value.filter(m => m !== temp)
  } finally {
    replyLoading.value = false
  }
}

async function toggleStatus() {
  const id = ticket.value._id
  if (!id) return
  statusLoading.value = true
  try {
    await axios.get(`${url}/admin/statustick/${id}`)
    await reload()
    showToast('وضعیت تیکت بروزرسانی شد')
  } catch {
    showToast('خطا در تغییر وضعیت')
  } finally {
    statusLoading.value = false
  }
}

function showToast(msg) {
  toast.value = msg
  setTimeout(()=> (toast.value=''), 2200)
}

async function reload() {
  await load()
}

function insertCanned(t) {
  replyText.value = (replyText.value ? replyText.value + '\n' : '') + t
}

function copyTicketLink() {
  try {
    const link = window.location.href
    navigator.clipboard.writeText(link)
    showToast('لینک کپی شد')
  } catch {
    showToast('امکان کپی وجود ندارد')
  }
}

function clearDraft() {
  replyText.value = ''
  localStorage.removeItem('admin_reply_draft')
}

watch(replyText, (v) => {
  localStorage.setItem('admin_reply_draft', v || '')
})

onMounted(load)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
