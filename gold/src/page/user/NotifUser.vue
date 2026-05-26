<template>
  <div class="min-h-screen">
    <div class="max-w-7xl mx-auto">
      <div class="sticky top-4 z-10">
        <div class="rounded-2xl bg-gradient-to-b from-[#1a2220] to-[#12181b] ring-1 ring-[#334D44]/60 p-4 sm:p-5 text-white backdrop-blur-md shadow-xl/30">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 class="text-xl sm:text-2xl font-extrabold text-[#b9f1cf]">اعلان‌های شما</h2>
              <p class="text-xs sm:text-sm text-white/60 mt-1">مدیریت اعلان‌ها با جستجو، فیلتر و صفحه‌بندی سریع</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-2 rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/60 px-3 py-1.5 text-xs">
                <span class="h-2 w-2 rounded-full bg-[#b9f1cf]"></span> همه: {{ items.length }}
              </span>
              <span class="inline-flex items-center gap-2 rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/60 px-3 py-1.5 text-xs">
                <span class="h-2 w-2 rounded-full bg-emerald-400"></span> خوانده‌نشده: {{ unreadCount }}
              </span>
              <button
                @click="markAllRead"
                class="hidden sm:inline-flex items-center gap-2 rounded-xl bg-[#b9f1cf] text-[#0a1f14] px-3 py-1.5 text-xs font-semibold hover:brightness-95">
                علامت همه به‌عنوان خوانده‌شده
              </button>
            </div>
          </div>

          <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="flex items-center gap-1 bg-[#1e2623] ring-1 ring-[#334D44]/60 rounded-xl p-1">
              <button
                v-for="tab in tabs"
                :key="tab.value"
                type="button"
                @click="activeTab = tab.value"
                :class="[
                  'flex-1 rounded-lg px-3 py-2 text-xs sm:text-sm transition',
                  activeTab === tab.value
                    ? 'bg-[#b9f1cf] text-[#0a1f14] font-semibold'
                    : 'text-white/85 hover:bg-white/5'
                ]"
              >{{ tab.label }}</button>
            </div>

            <div class="relative">
              <input
                id="notif-search"
                v-model.trim="search"
                @keyup.enter="goFirstPage"
                type="search"
                placeholder="جستجو در عنوان، متن یا تاریخ…"
                class="w-full rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/60 focus:ring-2 focus:ring-[#b9f1cf] px-10 py-2.5 text-sm placeholder:text-white/40 text-white"
                autocomplete="off"
                aria-label="جستجو اعلان‌ها"
              />
              <svg class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"/>
              </svg>
              <button
                v-if="search"
                @click="search=''"
                class="absolute left-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                aria-label="پاک کردن جستجو"
              >✕</button>
            </div>

            <div class="flex items-center justify-between sm:justify-end gap-3">
              <label class="text-xs text-white/70">نمایش</label>
              <select
                v-model.number="itemsPerPage"
                class="rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/60 px-3 py-2 text-sm focus:ring-2 focus:ring-[#b9f1cf] text-white"
                aria-label="تعداد در هر صفحه"
              >
                <option :value="5">۵</option>
                <option :value="10">۱۰</option>
                <option :value="20">۲۰</option>
                <option :value="50">۵۰</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4 rounded-2xl bg-[#141a1e] ring-1 ring-[#334D44]/60 p-4 sm:p-5 text-white backdrop-blur-md">
        <div v-if="loading" class="space-y-4">
          <div v-for="n in 5" :key="n" class="flex gap-4 items-center">
            <div class="w-12 h-12 rounded-full bg-white/10 animate-pulse"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-white/10 rounded w-2/3 animate-pulse"></div>
              <div class="h-3 bg-white/10 rounded w-5/6 animate-pulse"></div>
            </div>
            <div class="w-24 h-3 bg-white/10 rounded animate-pulse"></div>
          </div>
        </div>

        <div v-else-if="!paginated.length" class="py-16 text-center">
          <div class="mx-auto w-16 h-16 rounded-2xl bg-white/5 ring-1 ring-white/10 grid place-items-center">
            <svg class="w-8 h-8 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M3 7h18M5 7v8a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V7M8 7V5a4 4 0 1 1 8 0v2"/>
            </svg>
          </div>
          <p class="mt-3 text-sm text-white/70">اعلانی مطابق شرایط فعلی پیدا نشد.</p>
          <button @click="resetFilters" class="mt-4 px-3 py-1.5 rounded-lg bg-[#b9f1cf] text-[#0a1f14] text-sm font-semibold hover:brightness-95">
            پاک‌سازی فیلترها
          </button>
        </div>

        <div v-else class="grid gap-3">
          <transition-group name="fade" tag="div">
            <article
              v-for="n in paginated"
              :key="n._id"
              tabindex="0"
              class="group rounded-2xl bg-gradient-to-b from-[#182026] to-[#141a1f] ring-1 ring-[#334D44]/60 hover:ring-[#b9f1cf]/40 px-4 py-3 sm:px-5 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition"
              role="article"
              :aria-labelledby="'title-' + n._id"
            >
              <div class="relative">
                <div class="flex-shrink-0 w-12 h-12 rounded-full bg-[#b9f1cf] text-[#0a1f14] font-bold grid place-items-center text-lg select-none">
                  {{ (n.title || '?').toString().trim().charAt(0).toUpperCase() || '?' }}
                </div>
                <span
                  v-if="!isSeen(n)"
                  class="absolute -top-1 -left-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-[#141a1f]"
                ></span>
              </div>

              <div class="flex-1 min-w-0 text-right">
                <div class="flex items-center gap-2 justify-between">
                  <h3 :id="'title-' + n._id" class="text-sm sm:text-base font-bold text-white truncate">
                    {{ n.title || '—' }}
                  </h3>
                  <time class="text-[11px] sm:text-xs text-white/50 whitespace-nowrap">{{ formatDate(n.createdAt) }}</time>
                </div>

                <p class="mt-1 text-xs sm:text-sm text-white/80 leading-relaxed line-clamp-2" v-html="nl2br(n.text)"></p>

                <div class="mt-3 flex items-center gap-2 justify-end">
                  <button
                    @click="toggleSeen(n)"
                    class="px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs ring-1"
                    :class="isSeen(n) ? 'bg-white/5 ring-white/10 hover:bg-white/10' : 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/30 hover:bg-emerald-500/25'">
                    {{ isSeen(n) ? 'علامتِ خوانده‌نشده' : 'علامتِ خوانده شد' }}
                  </button>
                  <button
                    @click="openDetail(n)"
                    class="px-3 py-1.5 rounded-lg bg-[#b9f1cf] text-[#0a1f14] text-[11px] sm:text-xs font-semibold hover:brightness-95">
                    مشاهده
                  </button>
                </div>
              </div>
            </article>
          </transition-group>

          <div class="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div class="text-xs text-white/70">
              نمایش
              <span class="text-white">{{ rangeStart }}</span>
              –
              <span class="text-white">{{ rangeEnd }}</span>
              از
              <span class="text-white">{{ filtered.length }}</span>
            </div>

            <nav class="flex items-center justify-center gap-2" aria-label="صفحات">
              <button @click="changePage(1)" :disabled="currentPage === 1" class="px-3 py-1.5 rounded-lg bg-[#1e2623] ring-1 ring-[#334D44]/60 disabled:opacity-40">«</button>
              <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="px-3 py-1.5 rounded-lg bg-[#1e2623] ring-1 ring-[#334D44]/60 disabled:opacity-40">‹</button>

              <template v-for="p in pagesToShow" :key="p">
                <button
                  v-if="p !== '...'"
                  @click="changePage(p)"
                  :class="[
                    'px-3 py-1.5 rounded-lg',
                    currentPage === p
                      ? 'bg-[#b9f1cf] text-[#0a1f14] font-semibold'
                      : 'bg-[#1e2623] ring-1 ring-[#334D44]/60 text-white'
                  ]"
                >{{ p }}</button>
                <span v-else class="px-2 text-white/40">…</span>
              </template>

              <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="px-3 py-1.5 rounded-lg bg-[#1e2623] ring-1 ring-[#334D44]/60 disabled:opacity-40">›</button>
              <button @click="changePage(totalPages)" :disabled="currentPage === totalPages" class="px-3 py-1.5 rounded-lg bg-[#1e2623] ring-1 ring-[#334D44]/60 disabled:opacity-40">»</button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <transition name="modal">
      <div v-if="detailOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60" @click="closeDetail" aria-hidden="true"></div>
        <div class="relative max-w-lg w-full bg-white rounded-2xl p-6 text-right overflow-auto shadow-2xl">
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ detail.title || '—' }}</h3>
          <p class="text-gray-700 whitespace-pre-wrap mb-4">{{ detail.text || '' }}</p>
          <div class="flex justify-between items-center gap-3">
            <time class="text-sm text-gray-500">{{ formatDate(detail.createdAt) }}</time>
            <button @click="closeDetail" class="px-4 py-2 bg-gray-900 text-white rounded-lg hover:opacity-90">بستن</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'

const url = process.env.VUE_APP_API_URL || ''

const STORAGE_KEY = 'mintglass_notif_seen_v1'

const items = ref([])
const loading = ref(true)
const search = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const activeTab = ref('all')

const tabs = [
  { value: 'all', label: 'همه' },
  { value: 'unread', label: 'خوانده‌نشده' },
  { value: 'read', label: 'خوانده‌شده' }
]

const seenSet = ref(new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')))

const detailOpen = ref(false)
const detail = ref({})

async function loadNotifs () {
  loading.value = true
  try {
    const res = await axios.get(`${url}/user/getnotif`)
    const data = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : []
    items.value = data.map(n => ({
      _id: n._id || n.id || String(Math.random()).slice(2),
      title: n.title || 'اعلان',
      text: n.text || '',
      createdAt: n.createdAt || n.date || new Date().toISOString(),
      read: n.read === true || n.status === true
    }))
  } catch {
    items.value = []
  } finally {
    loading.value = false
  }
}

function persistSeen () {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(seenSet.value)))
  } catch {
      console.log("ERROR");
  }
}

function formatDate (d) {
  if (!d) return '—'
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return d
  return dt.toLocaleString('fa-IR', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' })
}
function nl2br (s = '') {
  return String(s).replace(/\n/g, '<br/>')
}

function isSeen (n) {
  return n.read === true || n.status === true || seenSet.value.has(n._id)
}
function toggleSeen (n) {
  if (isSeen(n)) {
    seenSet.value.delete(n._id)
  } else {
    seenSet.value.add(n._id)
  }
  persistSeen()
}
function markAllRead () {
  const allIds = items.value.map(n => n._id)
  seenSet.value = new Set(allIds)
  persistSeen()
}

const filtered = computed(() => {
  let list = items.value.slice()
  if (activeTab.value === 'unread') list = list.filter(n => !isSeen(n))
  if (activeTab.value === 'read') list = list.filter(n => isSeen(n))
  const q = search.value.trim().toLowerCase()
  if (q) {
    list = list.filter(n => {
      const combined = `${n.title || ''} ${n.text || ''} ${formatDate(n.createdAt)}`
      return combined.toLowerCase().includes(q)
    })
  }
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / itemsPerPage.value)))
const paginated = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filtered.value.slice(start, start + itemsPerPage.value)
})
const unreadCount = computed(() => items.value.filter(n => !isSeen(n)).length)

const pagesToShow = computed(() => {
  const total = totalPages.value
  const cur = currentPage.value
  const delta = 1
  const pages = []
  const start = Math.max(1, cur - delta)
  const end = Math.min(total, cur + delta)
  if (start > 1) {
    pages.push(1)
    if (start > 2) pages.push('...')
  }
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total) {
    if (end < total - 1) pages.push('...')
    pages.push(total)
  }
  return pages
})

const rangeStart = computed(() => filtered.value.length ? (currentPage.value - 1) * itemsPerPage.value + 1 : 0)
const rangeEnd   = computed(() => Math.min(currentPage.value * itemsPerPage.value, filtered.value.length))

function changePage (p) {
  if (typeof p !== 'number') return
  if (p < 1 || p > totalPages.value) return
  currentPage.value = p
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function goFirstPage () { currentPage.value = 1 }
function resetFilters () {
  search.value = ''
  activeTab.value = 'all'
  currentPage.value = 1
}

function openDetail (n) {
  detail.value = n
  detailOpen.value = true
  document.body.style.overflow = 'hidden'
  if (!isSeen(n)) {
    seenSet.value.add(n._id)
    persistSeen()
  }
}
function closeDetail () {
  detailOpen.value = false
  detail.value = {}
  document.body.style.overflow = ''
}

watch([search, itemsPerPage, activeTab], () => { currentPage.value = 1 })

onMounted(loadNotifs)
</script>

<style scoped>
.line-clamp-2{ display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.line-clamp-3{ display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
.fade-enter-active, .fade-leave-active { transition: all .25s ease; }
.fade-enter-from { opacity: 0; transform: translateY(-8px); }
.fade-leave-to   { opacity: 0; transform: translateY(8px); }
.modal-enter-active, .modal-leave-active { transition: opacity .2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
