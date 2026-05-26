<template>
  <div class="min-h-screen overflow-auto max-w-7xl py-6">
    <div class="max-w-7xl mx-auto">
      <div class="rounded-2xl bg-gradient-to-b from-[#1a2220] to-[#12181b] ring-1 ring-[#334D44]/60 text-white p-4 sm:p-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-xl sm:text-2xl font-extrabold">لیست تیکت‌ها</h2>
            <p class="mt-1 text-sm text-white/60">همه‌ی گفتگوهای پشتیبانی شما در یک نگاه — جستجو، فیلتر و مدیریت سریع.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 w-full sm:w-auto">
            <div class="relative">
              <input
                v-model.trim="search"
                type="search"
                placeholder="جستجو در عنوان، متن، شناسه…"
                class="w-full sm:w-64 rounded-xl bg-white/5 ring-1 ring-white/10 focus:ring-2 focus:ring-yellow-400 px-10 py-2.5 text-sm placeholder:text-white/40"
                @input="onSearchInput"
              />
              <svg class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"/>
              </svg>
            </div>

            <select v-model="statusFilter" class="rounded-xl bg-white/5 ring-1 ring-white/10 focus:ring-2 focus:ring-yellow-400 px-3 py-2.5 text-sm">
              <option value="">همه وضعیت‌ها</option>
              <option value="open">باز</option>
              <option value="closed">بسته</option>
            </select>

            <select v-model.number="itemsPerPage" class="rounded-xl bg-white/5 ring-1 ring-white/10 focus:ring-2 focus:ring-yellow-400 px-3 py-2.5 text-sm">
              <option :value="5">۵ ردیف</option>
              <option :value="10">۱۰ ردیف</option>
              <option :value="20">۲۰ ردیف</option>
              <option :value="50">۵۰ ردیف</option>
            </select>
          </div>
        </div>

        <div class="mt-4 flex flex-wrap items-center gap-2">
          <button
            v-for="c in quickCats"
            :key="c.value"
            type="button"
            @click="toggleCategory(c.value)"
            :class="[
              'px-3 py-1.5 rounded-full text-xs ring-1 transition',
              categoryFilter.includes(c.value)
                ? 'bg-yellow-300 text-gray-900 ring-yellow-300'
                : 'bg-[#1e2623] text-white/80 ring-[#334D44]/60 hover:bg-[#22302b]'
            ]"
          >
            {{ c.label }}
          </button>

          <span class="ms-auto text-xs text-white/60">
            تعداد کل: <span class="font-semibold text-white">{{ filteredTickets.length }}</span>
          </span>

          <button type="button" @click="goSend" class="px-4 py-2 rounded-xl bg-[#b9f1cf] text-[#0a1f14] font-semibold hover:brightness-95">
            ارسال تیکت جدید
          </button>
        </div>

        <div v-if="isLoading" class="mt-6 space-y-2">
          <div v-for="i in 6" :key="i" class="h-12 rounded-lg bg-white/5 animate-pulse"></div>
        </div>

        <div v-else-if="!paginatedTickets.length" class="mt-10 text-center">
          <div class="mx-auto h-14 w-14 rounded-2xl bg-white/5 ring-1 ring-white/10 grid place-items-center">
            <svg class="h-7 w-7 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M7 8h10M7 12h6M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9Z"/>
            </svg>
          </div>
          <p class="mt-3 text-sm text-white/70">هیچ تیکتی مطابق فیلترهای فعلی پیدا نشد.</p>
          <div class="mt-4 flex items-center justify-center gap-2">
            <button @click="resetFilters" class="px-3 py-1.5 rounded-lg bg-[#1e2623] ring-1 ring-[#334D44]/60 hover:bg-[#22302b] text-sm">
              پاک‌سازی فیلترها
            </button>
            <button @click="goSend" class="px-3 py-1.5 rounded-lg bg-yellow-300 text-gray-900 text-sm">
              ایجاد تیکت
            </button>
          </div>
        </div>

        <div v-else class="mt-6 overflow-hidden">
          <!-- Desktop table -->
          <div class="hidden md:block overflow-x-auto rounded-xl ring-1 ring-white/10">
            <table class="min-w-full text-right">
              <thead class="bg-white/5 text-white">
                <tr>
                  <th class="px-3 py-3 text-xs font-semibold">#</th>
                  <th class="px-3 py-3 text-xs font-semibold">
                    <button class="inline-flex items-center gap-1" @click="toggleSort('title')">
                      عنوان
                      <SortIcon :dir="sort.dir" :active="sort.key==='title'"/>
                    </button>
                  </th>
                  <th class="px-3 py-3 text-xs font-semibold">دپارتمان</th>
                  <th class="px-3 py-3 text-xs font-semibold">
                    <button class="inline-flex items-center gap-1" @click="toggleSort('status')">
                      وضعیت
                      <SortIcon :dir="sort.dir" :active="sort.key==='status'"/>
                    </button>
                  </th>
                  <th class="px-3 py-3 text-xs font-semibold">
                    <button class="inline-flex items-center gap-1" @click="toggleSort('date')">
                      تاریخ
                      <SortIcon :dir="sort.dir" :active="sort.key==='date'"/>
                    </button>
                  </th>
                  <th class="px-3 py-3 text-xs font-semibold">آخرین پیام</th>
                  <th class="px-3 py-3 text-xs font-semibold">شناسه</th>
                  <th class="px-3 py-3 text-xs font-semibold">عملیات</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/10 text-white/90">
                <tr v-for="(t, i) in paginatedTickets" :key="t._id" class="hover:bg-white/5 transition">
                  <td class="px-3 py-3 text-xs text-white/70 w-12">{{ (currentPage - 1) * itemsPerPage + i + 1 }}</td>
                  <td class="px-3 py-3 text-sm font-medium max-w-[22rem] truncate">{{ t.title || '—' }}</td>
                  <td class="px-3 py-3 text-xs">
                    <span class="inline-flex items-center gap-1 rounded-full px-2 py-1 ring-1 ring-[#334D44]/60 bg-[#1e2623]">
                      <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                      {{ mapCategory(t.category) }}
                    </span>
                  </td>
                  <td class="px-3 py-3 text-xs">
                    <span
                      :class="[
                        'inline-flex items-center gap-1 rounded-full px-2 py-1 ring-1',
                        t.status === 'open'
                          ? 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/30'
                          : 'bg-white/5 text-white/70 ring-white/10'
                      ]"
                    >
                      <span class="h-1.5 w-1.5 rounded-full" :class="t.status === 'open' ? 'bg-emerald-400' : 'bg-white/40'"></span>
                      {{ statusFa(t.status) }}
                    </span>
                  </td>
                  <td class="px-3 py-3 text-xs text-white/70 whitespace-nowrap">{{ formatDate(t.date) }}</td>
                  <td class="px-3 py-3 text-xs max-w-[20rem] truncate text-white/80">{{ lastMessageText(t) }}</td>
                  <td class="px-3 py-3 text-[11px] text-white/50">{{ t.uuid || '—' }}</td>
                  <td class="px-3 py-3">
                    <button class="px-3 py-1.5 rounded-lg bg-yellow-300 text-gray-900 text-xs font-semibold hover:brightness-95" @click="openTicket(t._id)">
                      مشاهده پیام‌ها
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile cards -->
          <div class="md:hidden grid gap-3">
            <div v-for="t in paginatedTickets" :key="t._id" class="rounded-xl ring-1 ring-white/10 bg-white/5 p-3">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="font-semibold truncate">{{ t.title || '—' }}</div>
                  <div class="mt-1 text-xs text-white/60 flex items-center gap-2">
                    <span class="truncate">{{ mapCategory(t.category) }}</span>
                    <span class="text-white/30">•</span>
                    <span class="truncate">{{ formatDate(t.date) }}</span>
                  </div>
                </div>
                <span
                  :class="[
                    'shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-1 ring-1 text-[11px]',
                    t.status === 'open'
                      ? 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/30'
                      : 'bg-white/5 text-white/70 ring-white/10'
                  ]"
                >
                  {{ statusFa(t.status) }}
                </span>
              </div>
              <div class="mt-2 text-xs text-white/70 line-clamp-2">
                {{ lastMessageText(t) }}
              </div>
              <div class="mt-3 flex items-center justify-between">
                <span class="text-[11px] text-white/40 truncate">شناسه: {{ t.uuid || '—' }}</span>
                <button class="px-3 py-1.5 rounded-lg bg-yellow-300 text-gray-900 text-xs font-semibold hover:brightness-95" @click="openTicket(t._id)">
                  مشاهده
                </button>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div class="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="text-xs text-white/60">
              نمایش <span class="text-white">{{ rangeStart }}</span> – <span class="text-white">{{ rangeEnd }}</span> از
              <span class="text-white">{{ filteredTickets.length }}</span>
            </div>

            <div class="flex items-center gap-2">
              <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="px-3 py-1.5 rounded-lg bg-[#1e2623] ring-1 ring-[#334D44]/60 disabled:opacity-40">قبلی</button>

              <button
                v-for="p in pagesToShow"
                :key="p"
                @click="changePage(p)"
                :class="[
                  'px-3 py-1.5 rounded-lg',
                  currentPage === p ? 'bg-[#b9f1cf] text-[#0a1f14] font-semibold' : 'bg-[#1e2623] ring-1 ring-[#334D44]/60 text-white'
                ]"
              >
                {{ p }}
              </button>

              <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="px-3 py-1.5 rounded-lg bg-[#1e2623] ring-1 ring-[#334D44]/60 disabled:opacity-40">
                بعدی
              </button>
            </div>
          </div>
        </div>
      </div> <!-- /card -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

/* ---------- Inline component (kept inside the same <script setup>) ---------- */
const SortIcon = {
  props: { dir: String, active: Boolean },
  template: `
    <svg v-if="active" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path v-if="dir==='asc'"  stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 14 5-5 5 5"/>
      <path v-else              stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 10 5 5 5-5"/>
    </svg>
    <svg v-else class="h-3.5 w-3.5 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 10 5 5 5-5"/>
    </svg>
  `
}

/* ------------------------------ State & utils ------------------------------ */
const url = process.env.VUE_APP_API_URL || ''
const router = useRouter()

const tickets = ref([])
const isLoading = ref(true)

const search = ref('')
const debounced = ref('')
let searchTimer = null
function onSearchInput () {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { debounced.value = search.value }, 250)
}

const itemsPerPage = ref(10)
const currentPage = ref(1)
const statusFilter = ref('')
const categoryFilter = ref([])

const quickCats = [
  { value: 'support',   label: 'پشتیبانی' },
  { value: 'sales',     label: 'فروش' },
  { value: 'technical', label: 'فنی' },
  { value: 'billing',   label: 'مالی' },
  { value: 'orders',    label: 'سفارشات' }
]

function mapCategory (c) {
  const m = { support:'پشتیبانی', sales:'فروش', technical:'فنی', billing:'مالی', orders:'سفارشات' }
  return m[c] || c || '-'
}
function statusFa (s) {
  if (s === 'open') return 'باز'
  if (s === 'closed') return 'بسته'
  return s || '—'
}
function formatDate (d) {
  if (!d) return '—'
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return d
  return dt.toLocaleString('fa-IR', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' })
}
function lastMessageText (t) {
  const arr = t.message || t.masssge || []
  if (!arr.length) return '—'
  return String(arr[arr.length - 1]?.text || '—')
}
function toggleCategory (val) {
  if (categoryFilter.value.includes(val)) {
    categoryFilter.value = categoryFilter.value.filter(v => v !== val)
  } else {
    categoryFilter.value = [...categoryFilter.value, val]
  }
}

/* Sorting */
const sort = ref({ key: 'date', dir: 'desc' })
function toggleSort (key) {
  if (sort.value.key === key) {
    sort.value.dir = sort.value.dir === 'asc' ? 'desc' : 'asc'
  } else {
    sort.value.key = key
    sort.value.dir = 'asc'
  }
}

/* Filters + sort + search */
const filteredTickets = computed(() => {
  const s = (debounced.value || '').toLowerCase()
  const cats = categoryFilter.value
  const st = statusFilter.value

  let arr = tickets.value.slice()

  if (st) arr = arr.filter(t => (t.status || '').toLowerCase() === st)
  if (cats.length) arr = arr.filter(t => cats.includes(t.category))

  if (s) {
    arr = arr.filter(t => {
      const last = (t.message || t.masssge || []).map(m => m.text).join(' ')
      const combined = `${t.title || ''} ${t.category || ''} ${t.status || ''} ${t.uuid || ''} ${formatDate(t.date)} ${last}`.toLowerCase()
      return combined.includes(s)
    })
  }

  const key = sort.value.key
  const dir = sort.value.dir === 'asc' ? 1 : -1
  arr.sort((a, b) => {
    const va = key === 'date' ? new Date(a.date || 0).getTime() : (a[key] || '').toString()
    const vb = key === 'date' ? new Date(b.date || 0).getTime() : (b[key] || '').toString()
    if (va < vb) return -1 * dir
    if (va > vb) return  1 * dir
    return 0
  })

  return arr
})

/* Pagination */
const totalPages = computed(() => Math.max(1, Math.ceil(filteredTickets.value.length / itemsPerPage.value)))
const paginatedTickets = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredTickets.value.slice(start, start + itemsPerPage.value)
})
const pagesToShow = computed(() => {
  const total = totalPages.value
  const cur = currentPage.value
  const delta = 2
  const pages = []
  const start = Math.max(1, cur - delta)
  const end = Math.min(total, cur + delta)
  for (let i = start; i <= end; i++) pages.push(i)
  if (pages[0] !== 1) pages.unshift(1)
  if (pages[pages.length - 1] !== total) pages.push(total)
  return pages
})
const rangeStart = computed(() => filteredTickets.value.length ? (currentPage.value - 1) * itemsPerPage.value + 1 : 0)
const rangeEnd   = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredTickets.value.length))

function changePage (p) {
  if (p < 1) p = 1
  if (p > totalPages.value) p = totalPages.value
  currentPage.value = p
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function resetFilters () {
  search.value = ''
  debounced.value = ''
  statusFilter.value = ''
  categoryFilter.value = []
  sort.value = { key: 'date', dir: 'desc' }
  currentPage.value = 1
}

function openTicket (id) {
  if (!id) return
  router.push({ path: '/user/supportmessages', query: { id } })
}
function goSend () {
  router.push({ path: '/user/sendsupport' })
}

/* Data */
async function load () {
  isLoading.value = true
  try {
    const res = await axios.get(`${url}/user/ticket`)
    tickets.value = res.data?.data || []
  } catch {
    tickets.value = []
  } finally {
    isLoading.value = false
  }
}

watch([itemsPerPage, statusFilter, categoryFilter], () => { currentPage.value = 1 })
onMounted(load)
</script>

<style scoped>
.line-clamp-2{ display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
</style>
