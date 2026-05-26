<template>
  <div class="min-h-screen overflow-auto max-w-7xl  py-6">
    <div class="mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Sidebar / Meta -->
      <aside class="lg:col-span-4 rounded-2xl bg-gradient-to-b from-[#1a2220] to-[#12181b] ring-1 ring-[#334D44]/60 text-white p-4 sm:p-5">
        <div class="flex items-center gap-3">
          <div class="h-12 w-12 rounded-xl bg-[#0f1417] ring-1 ring-white/10 grid place-items-center">
            <svg class="h-6 w-6 text-yellow-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 12 2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0Z"/>
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <h1 class="text-base sm:text-lg font-extrabold truncate">{{ ticket.title || 'بدون عنوان' }}</h1>
            <div class="text-xs text-white/70 mt-0.5 truncate">
              شناسه: <span class="ltr">{{ ticket.uuid || '—' }}</span>
            </div>
          </div>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-3">
          <div class="rounded-xl bg-[#0e1412] ring-1 ring-white/10 p-3">
            <div class="text-[11px] text-white/60 mb-1">وضعیت</div>
            <div :class="statusPillClass" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs">
              <span class="h-1.5 w-1.5 rounded-full" :class="ticket.status==='open' ? 'bg-emerald-400' : 'bg-yellow-400'"></span>
              {{ statusLabel }}
            </div>
          </div>
          <div class="rounded-xl bg-[#0e1412] ring-1 ring-white/10 p-3">
            <div class="text-[11px] text-white/60 mb-1">دسته‌بندی</div>
            <div :class="categoryPillClass" class="inline-flex items-center px-2.5 py-1 rounded-full text-xs">
              {{ categoryLabel }}
            </div>
          </div>
          <div class="rounded-xl bg-[#0e1412] ring-1 ring-white/10 p-3 col-span-2">
            <div class="text-[11px] text-white/60 mb-1">ایجاد</div>
            <div class="text-sm">{{ formatDate(ticket.date) }}</div>
          </div>
        </div>

        <div class="mt-4 rounded-2xl bg-[#0e1412] ring-1 ring-white/10 p-3">
          <div class="text-[11px] text-white/60 mb-2">عملیات</div>
          <div class="flex flex-wrap gap-2">
            <button @click="reload" class="btn-ghost">بروزرسانی</button>
            <button @click="toggleAuto" :class="auto ? 'btn-primary' : 'btn-ghost'">
              {{ auto ? 'بروزرسانی خودکار' : 'فعال‌سازی خودکار' }}
            </button>
            <button v-if="ticket.status !== 'open'" @click="$router.push({ path:'/user/sendsupport' })" class="btn-primary">
              تیکت جدید
            </button>
          </div>
          <div class="mt-2 text-[11px] text-white/50">
            آخرین بروزرسانی: <span class="ltr">{{ lastRefreshed }}</span>
          </div>
        </div>

        <div v-if="suggestions.length" class="mt-4 rounded-2xl bg-[#0e1412] ring-1 ring-white/10 p-3">
          <div class="text-[11px] text-white/60 mb-2">پاسخ‌های سریع</div>
          <div class="flex flex-wrap gap-2">
            <button v-for="s in suggestions" :key="s" class="chip" @click="appendChip(s)">{{ s }}</button>
          </div>
        </div>
      </aside>

      <!-- Conversation -->
      <section class="lg:col-span-8 rounded-2xl bg-gradient-to-b from-[#1a2220] to-[#12181b] ring-1 ring-[#334D44]/60 text-white flex flex-col h-[72vh] sm:h-[78vh]">
        <!-- Header -->
        <div class="px-4 sm:px-5 py-3 border-b border-white/10 flex items-center justify-between">
          <div class="text-sm text-white/80 truncate">{{ ticket.title || 'تیکت' }}</div>
          <div class="text-xs text-white/60 truncate">{{ formatDate(ticket.lastdate || ticket.date) }}</div>
        </div>

        <!-- Messages -->
        <div class="flex-1 overflow-auto px-3 sm:px-5 py-4" ref="scrollArea">
          <div v-if="isLoading" class="h-full grid place-items-center text-white/70">
            <svg class="animate-spin h-8 w-8 text-white/80" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-80" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.37 0 0 5.37 0 12h4z"/>
            </svg>
          </div>

          <template v-else>
            <div v-if="grouped.length === 0" class="text-center text-white/60 mt-10">گفتگویی ثبت نشده است.</div>

            <div v-for="(g, gi) in grouped" :key="gi" class="space-y-2">
              <div class="my-2 flex items-center justify-center">
                <div class="text-[10px] text-white/45 px-3 py-0.5 rounded-full ring-1 ring-white/10">
                  {{ dayLabel(g.time) }}
                </div>
              </div>

              <div v-for="(m, mi) in g.items" :key="mi" class="flex items-end gap-2"
                   :class="m.sender === 'admin' ? 'justify-start' : 'justify-end'">
                <div v-if="shouldShowAvatar(g.items, mi)" class="h-7 w-7 rounded-full ring-1 ring-white/10 bg-[#0f1417] grid place-items-center">
                  <span class="text-[10px] font-bold" :class="m.sender==='admin' ? 'text-emerald-300' : 'text-[#0a1f14]'">
                    {{ initials(m.sender) }}
                  </span>
                </div>
                <div :class="bubbleClass(m.sender)" class="max-w-[86%] sm:max-w-[78%] px-3 sm:px-4 py-2 sm:py-3 rounded-2xl ring-1 shadow-md">
                  <div class="text-sm leading-relaxed whitespace-pre-wrap break-words">{{ m.text }}</div>
                  <div class="mt-1 text-[10px] sm:text-[11px] opacity-70 ltr text-left">{{ timeOnly(m.time) }}</div>
                </div>
              </div>
            </div>

            <div v-if="typing" class="mt-2 flex items-end gap-2 justify-start">
              <div class="h-7 w-7 rounded-full ring-1 ring-white/10 bg-[#0f1417] grid place-items-center">
                <div class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
              </div>
              <div class="px-4 py-2 rounded-2xl bg-[#1f2a27] ring-1 ring-[#334D44]/50 text-white/70 text-sm">در حال پاسخ...</div>
            </div>
          </template>
        </div>

        <!-- Composer -->
        <div v-if="ticket.status === 'open'" class="border-t border-white/10 px-3 sm:px-5 py-3">
          <div class="flex items-center gap-2 mb-2">
            <input ref="fileInput" type="file" class="hidden" @change="pickFile" />
            <button class="btn-ghost" @click="triggerFile">ضمیمه</button>
            <div v-if="attachmentName" class="text-[11px] text-white/70 truncate">فایل: {{ attachmentName }}</div>
          </div>
          <div class="flex gap-2">
            <textarea v-model="messageInput" rows="2" class="flex-1 resize-none rounded-xl bg-white/5 ring-1 ring-white/10 p-3 text-sm focus:outline-none"
                      placeholder="پیام خود را بنویسید…" @keydown.enter.exact.prevent="sendMessage"/>
            <button :disabled="sending || !messageInput.trim()" @click="sendMessage" class="btn-primary">
              {{ sending ? 'ارسال…' : 'ارسال' }}
            </button>
          </div>
        </div>

        <div v-else class="border-t border-white/10 px-3 sm:px-5 py-4">
          <div class="rounded-xl bg-[#1f2a27] ring-1 ring-[#334D44]/60 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div class="text-sm">
              <div class="font-semibold">این تیکت بسته شده است</div>
              <div class="text-white/70 text-xs mt-1">برای ادامه‌ی گفتگو، تیکت جدید ثبت کنید.</div>
            </div>
            <div class="sm:ml-auto">
              <button class="btn-primary" @click="$router.push({ path:'/user/sendsupport' })">تیکت جدید</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const url = process.env.VUE_APP_API_URL || ''
const route = useRoute()

const ticket = ref({})
const messages = ref([])
const isLoading = ref(true)
const typing = ref(false)

const messageInput = ref('')
const sending = ref(false)
const fileInput = ref(null)
const attachment = ref(null)
const attachmentName = ref('')

const scrollArea = ref(null)
const lastRefreshed = ref('—')
const auto = ref(false)
let timer = null

const token = localStorage.getItem('token')
if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

const categoryLabel = computed(() => {
  const map = { support: 'پشتیبانی', sales: 'فروش', technical: 'فنی', billing: 'مالی', orders: 'سفارشات' }
  return map[ticket.value?.category] || ticket.value?.category || '—'
})
const statusLabel = computed(() => ticket.value?.status === 'open' ? 'باز' : (ticket.value?.status === 'close' ? 'بسته' : (ticket.value?.status || '—')))
const categoryPillClass = computed(() => 'bg-[#13201c] text-emerald-300')
const statusPillClass = computed(() => ticket.value?.status === 'open' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-yellow-500/15 text-yellow-300')

const suggestions = ['سلام وقت بخیر 👋', 'لطفاً جزئیات بیشتری بفرستید.', 'اسکرین‌شات مشکل را ضمیمه کنید.', 'سپاس! در حال بررسی هستیم.']

function formatDate(d) {
  if (!d) return '—'
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return d
  return dt.toLocaleString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}
function timeOnly(d) {
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return '—'
  return dt.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
}
function dayLabel(d) {
  const dt = new Date(d)
  return dt.toLocaleDateString('fa-IR', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' })
}
function initials(sender) {
  return sender === 'admin' ? 'A' : 'U'
}
function bubbleClass(sender) {
  return sender === 'admin'
    ? 'bg-[#1f2a27] text-white ring-[#334D44]/50'
    : 'bg-[#b9f1cf] text-[#0a1f14] ring-white/10'
}
function shouldShowAvatar(list, idx) {
  if (idx === 0) return true
  return list[idx - 1].sender !== list[idx].sender
}

function buildMessages(t) {
  const userMsgs = (t.masssge || []).map(m => ({ text: m.text, time: m.time, sender: 'user' }))
  const adminMsgs = (t.masssgeadmin || []).map(m => ({ text: m.text, time: m.time, sender: 'admin' }))
  return [...userMsgs, ...adminMsgs].sort((a, b) => new Date(a.time) - new Date(b.time))
}
const grouped = computed(() => {
  const out = []
  let cur = null
  messages.value.forEach(m => {
    const k = new Date(m.time).toDateString()
    if (!cur || cur.key !== k) {
      cur = { key: k, time: m.time, items: [] }
      out.push(cur)
    }
    cur.items.push(m)
  })
  return out
})

async function load() {
  isLoading.value = true
  try {
    const id = route.query.id
    const { data } = await axios.get(`${url}/user/sendticket/${id}`)
    let payload = data?.data || data || {}
    if (Array.isArray(payload)) payload = payload[0] || {}
    ticket.value = payload
    messages.value = buildMessages(payload)
    lastRefreshed.value = new Date().toLocaleString('fa-IR')
    await nextTick()
    if (scrollArea.value) scrollArea.value.scrollTop = scrollArea.value.scrollHeight
    typing.value = false
  } catch {
    ticket.value = {}
    messages.value = []
  } finally {
    isLoading.value = false
  }
}
function reload() { load() }

function toggleAuto() {
  auto.value = !auto.value
  clearInterval(timer)
  if (auto.value) timer = setInterval(load, 7000)
}

function triggerFile() { fileInput.value?.click() }
function pickFile(e) {
  const f = e.target.files?.[0]
  attachment.value = f || null
  attachmentName.value = f ? f.name : ''
}
function appendChip(t) {
  messageInput.value = (messageInput.value ? messageInput.value + ' ' : '') + t
}

async function sendMessage() {
  if (!messageInput.value.trim() || sending.value) return
  const id = route.query.id
  if (!id) return
  sending.value = true
  try {
    const form = new FormData()
    form.append('ticketId', id)
    form.append('text', messageInput.value.trim())
    if (attachment.value) form.append('file', attachment.value)
    await axios.post(`${url}/user/sendmessage`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
    const now = new Date().toISOString()
    messages.value.push({ text: messageInput.value.trim(), time: now, sender: 'user' })
    ticket.value.lastdate = now
    messageInput.value = ''
    attachment.value = null
    attachmentName.value = ''
    await nextTick()
    if (scrollArea.value) scrollArea.value.scrollTop = scrollArea.value.scrollHeight
    typing.value = true
    setTimeout(() => (typing.value = false), 1600)
  } finally {
    sending.value = false
  }
}

onMounted(load)
onBeforeUnmount(() => clearInterval(timer))
</script>

<style scoped>
.ltr { direction: ltr; }

/* Buttons & Chips */
.btn-primary {
  @apply px-3 sm:px-4 py-2 rounded-xl bg-[#b9f1cf] text-[#0a1f14] font-semibold hover:brightness-95 disabled:opacity-60 text-sm;
}
.btn-ghost {
  @apply px-3 sm:px-4 py-2 rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/60 hover:bg-[#22302b] text-sm;
}
.chip {
  @apply px-3 py-1 rounded-full bg-[#1e2623] ring-1 ring-[#334D44]/60 hover:bg-[#22302b] text-xs;
}
</style>
