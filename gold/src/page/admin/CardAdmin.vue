<template>
  <div dir="rtl" class="flex min-h-screen bg-[#0f1417] text-white">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main -->
    <div class="flex-1 flex flex-col mt-20 md:mt-0">
      <!-- Header / Filters -->
      <header class="sticky top-0 z-20">
        <div
          class="mx-4 md:mx-6 mt-4 rounded-2xl bg-gradient-to-b from-[#1a2220]/90 to-[#12181b]/90
                 ring-1 ring-[#334D44]/60 backdrop-blur-xl shadow-xl p-4"
        >
          <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 class="text-xl md:text-2xl font-extrabold">مدیریت کارت‌ها</h1>
              <p class="text-xs md:text-sm text-white/60 mt-1">
                مشاهده، جستجو و مدیریت کارت‌های بانکی کاربران — با فیلترهای سریع و عملیات گروهی.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-3 w-full md:w-auto">
              <!-- Search -->
              <div class="relative md:col-span-2">
                <input
                  v-model="search"
                  type="search"
                  placeholder="کارت، بانک، نام کاربر، ایمیل، تلفن…"
                  class="w-full md:w-80 rounded-xl bg-white/5 ring-1 ring-white/10 focus:ring-2 focus:ring-emerald-300
                         px-10 py-2.5 text-sm placeholder:text-white/40"
                  @input="onSearchInput"
                />
                <svg class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"/>
                </svg>
                <button
                  v-if="search"
                  @click="clearSearch"
                  class="absolute left-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                  aria-label="پاک کردن جستجو"
                >✕</button>
              </div>

              <!-- Status filter -->
              <select
                v-model="statusFilter"
                class="rounded-xl bg-white/5 ring-1 ring-white/10 focus:ring-2 focus:ring-emerald-300
                       px-3 py-2.5 text-sm"
              >
                <option value="">همه وضعیت‌ها</option>
                <option value="active">تأیید شده</option>
                <option value="pending">در انتظار</option>
              </select>

              <!-- Bank filter -->
              <select
                v-model="bankFilter"
                class="rounded-xl bg-white/5 ring-1 ring-white/10 focus:ring-2 focus:ring-emerald-300
                       px-3 py-2.5 text-sm"
              >
                <option value="">همه بانک‌ها</option>
                <option v-for="b in bankOptions" :key="b" :value="b">{{ b }}</option>
              </select>
            </div>
          </div>

          <!-- Quick actions -->
          <div class="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div class="flex items-center gap-2 text-xs">
              <span class="inline-flex items-center gap-2 rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-1.5">
                <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
                مجموع: <b class="font-bold text-white">{{ filteredTotal }}</b>
              </span>
              <span class="inline-flex items-center gap-2 rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-1.5">
                انتخاب‌شده: <b class="font-bold text-white">{{ selectedIds.length }}</b>
              </span>
            </div>

            <div class="flex items-center gap-2">
              <select
                v-model.number="itemsPerPage"
                class="rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-300"
              >
                <option :value="10">۱۰</option>
                <option :value="20">۲۰</option>
                <option :value="50">۵۰</option>
              </select>
              <button
                @click="fetchCards"
                class="px-3 py-2 rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/60 hover:bg-[#22302b] text-sm"
              >
                بروزرسانی
              </button>

              <button
                :disabled="!selectedIds.length || bulkLoading"
                @click="bulkToggle"
                class="px-4 py-2 rounded-xl bg-emerald-300 text-[#0a1f14] text-sm font-semibold hover:brightness-95
                       disabled:opacity-50"
              >
                {{ bulkLoading ? 'اجرای عملیات…' : 'تغییر وضعیت گروهی' }}
              </button>

              <button
                :disabled="!selectedIds.length"
                @click="clearSelection"
                class="px-3 py-2 rounded-xl bg-white/5 ring-1 ring-white/10 text-sm disabled:opacity-50"
              >
                پاک‌کردن انتخاب‌ها
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="p-4 md:p-6 flex-1 overflow-auto">
        <!-- Loading -->
        <div v-if="loading" class="space-y-2">
          <div v-for="i in 8" :key="i" class="h-16 rounded-xl bg-white/5 animate-pulse"></div>
        </div>

        <!-- Empty -->
        <div v-else-if="!paginated.length" class="py-16 text-center">
          <div class="mx-auto w-16 h-16 rounded-2xl bg-white/5 ring-1 ring-white/10 grid place-items-center">
            <svg class="w-8 h-8 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M3 7h18M5 7v8a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V7M8 7V5a4 4 0 1 1 8 0v2"/>
            </svg>
          </div>
          <p class="mt-3 text-sm text-white/70">کارتی مطابق فیلترهای فعلی پیدا نشد.</p>
          <button @click="resetFilters" class="mt-4 px-3 py-1.5 rounded-lg bg-emerald-300 text-[#0a1f14] text-sm font-semibold hover:brightness-95">
            پاک‌سازی فیلترها
          </button>
        </div>

        <!-- Table -->
        <div v-else class="rounded-2xl bg-white/5 ring-1 ring-white/10 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full text-right">
              <thead class="bg-white/5">
                <tr class="text-xs text-white/80">
                  <th class="px-3 py-3 w-10">
                    <input type="checkbox" :checked="allPageSelected" @change="toggleSelectPage" />
                  </th>
                  <th class="px-3 py-3">#</th>
                  <th class="px-3 py-3">شماره کارت</th>
                  <th class="px-3 py-3">بانک</th>
                  <th class="px-3 py-3">کاربر</th>
                  <th class="px-3 py-3">ایمیل / تلفن</th>
                  <th class="px-3 py-3">وضعیت</th>
                  <th class="px-3 py-3">تاریخ ثبت</th>
                  <th class="px-3 py-3">عملیات</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-white/10">
                <tr
                  v-for="(c, i) in paginated"
                  :key="c._id"
                  class="hover:bg-white/5 transition"
                >
                  <td class="px-3 py-3">
                    <input type="checkbox" :checked="selectedIds.includes(c._id)" @change="toggleSelected(c._id)" />
                  </td>

                  <td class="px-3 py-3 text-xs text-white/70 w-12">
                    {{ (currentPage - 1) * itemsPerPage + i + 1 }}
                  </td>

                  <td class="px-3 py-3 text-sm">
                    <div class="flex items-center gap-2">
                      <span class="font-mono">{{ safeCardMasked(c.card) }}</span>
                      <button
                        class="text-xs px-2 py-1 rounded-lg bg-[#1e2623] ring-1 ring-[#334D44]/60 hover:bg-[#22302b]"
                        @click="copyCard(c.card)"
                        title="کپی کارت"
                      >
                        کپی
                      </button>
                    </div>
                  </td>

                  <td class="px-3 py-3 text-xs">
                    <span class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 ring-1 ring-[#334D44]/60 bg-[#1e2623]">
                      <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                      {{ detectBankName(c.card) }}
                    </span>
                  </td>

                  <td class="px-3 py-3 text-sm">
                    <div class="font-medium">{{ userName(c.userid) }}</div>
                    <div class="text-[11px] text-white/50">ID: {{ c.userid?._id || '—' }}</div>
                  </td>

                  <td class="px-3 py-3 text-sm text-white/80">
                    <div class="text-sm">{{ c.userid?.email || '—' }}</div>
                    <div class="text-[11px] text-white/50">{{ c.userid?.phone || '—' }}</div>
                  </td>

                  <td class="px-3 py-3 text-xs">
                    <span
                      :class="[
                        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 ring-1',
                        isActive(c)
                          ? 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/30'
                          : 'bg-yellow-500/15 text-yellow-200 ring-yellow-300/30'
                      ]"
                    >
                      <span
                        class="h-1.5 w-1.5 rounded-full"
                        :class="isActive(c) ? 'bg-emerald-400' : 'bg-yellow-300'"
                      ></span>
                      {{ cardStatusText(c) }}
                    </span>
                  </td>

                  <td class="px-3 py-3 text-sm text-white/70 whitespace-nowrap">
                    {{ formatDate(c.createdAt) }}
                  </td>

                  <td class="px-3 py-3 text-sm">
                    <div class="flex items-center gap-2 justify-end">
                      <button
                        @click="toggleStatus(c._id)"
                        :disabled="toggling === c._id"
                        class="px-3 py-1.5 rounded-lg bg-emerald-300 text-[#0a1f14] font-semibold hover:brightness-95 disabled:opacity-50"
                      >
                        {{ toggling === c._id ? '...' : (isActive(c) ? 'غیرفعال' : 'تأیید') }}
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>

              <tfoot>
                <tr>
                  <td :colspan="9" class="px-3 py-4">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div class="text-xs text-white/70">
                        نمایش
                        <span class="text-white">{{ rangeStart }}</span>
                        –
                        <span class="text-white">{{ rangeEnd }}</span>
                        از
                        <span class="text-white">{{ filteredTotal }}</span>
                      </div>

                      <nav class="flex items-center justify-center gap-2" aria-label="صفحات">
                        <button @click="changePage(1)" :disabled="currentPage === 1" class="px-3 py-1.5 rounded-lg bg-white/5 ring-1 ring-white/10 disabled:opacity-40">«</button>
                        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="px-3 py-1.5 rounded-lg bg-white/5 ring-1 ring-white/10 disabled:opacity-40">‹</button>

                        <template v-for="p in pagesToShow" :key="`p-${p}`">
                          <button
                            v-if="p !== '...'"
                            @click="changePage(p)"
                            :class="[
                              'px-3 py-1.5 rounded-lg',
                              currentPage === p ? 'bg-emerald-300 text-[#0a1f14] font-semibold' : 'bg-white/5 ring-1 ring-white/10'
                            ]"
                          >{{ p }}</button>
                          <span v-else class="px-2 text-white/40">…</span>
                        </template>

                        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="px-3 py-1.5 rounded-lg bg-white/5 ring-1 ring-white/10 disabled:opacity-40">›</button>
                        <button @click="changePage(totalPages)" :disabled="currentPage === totalPages" class="px-3 py-1.5 rounded-lg bg-white/5 ring-1 ring-white/10 disabled:opacity-40">»</button>
                      </nav>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue'
import axios from 'axios'
import Sidebar from '@/components/admin/SidebarAdmin.vue'

const url = process.env.VUE_APP_API_URL || ''
const token = localStorage.getItem('token')
if (token) axios.defaults.headers.common.Authorization = `Bearer ${token}`

/* ------------------------------- State ------------------------------- */
const cards = ref([])
const loading = ref(true)
const toggling = ref(null)

const search = ref('')
const debounced = ref('')
let searchTimer = null
function onSearchInput () {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { debounced.value = search.value }, 250)
}
function clearSearch () {
  search.value = ''
  debounced.value = ''
}

const statusFilter = ref('') // '', 'active', 'pending'
const bankFilter = ref('')

const itemsPerPage = ref(10)
const currentPage = ref(1)

const selectedIds = ref([])
const bulkLoading = ref(false)

/* ------------------------------ Helpers ------------------------------ */
function onlyDigits (s) {
  return String(s || '').replace(/\D/g, '')
}
function safeCardMasked (storedCard) {
  const d = onlyDigits(storedCard)
  if (d.length !== 16) return d || '—'
  return d.replace(/^(\d{4})(\d{4})(\d{4})(\d{4})$/, '$1-$2-$3-$4')
}
async function copyCard (storedCard) {
  try {
    const d = onlyDigits(storedCard)
    await navigator.clipboard.writeText(d)
  } catch (err) {
    // noop: احتمالاً دسترسی کلیپ‌بورد بلاک شده
    console.warn('clipboard write failed', err)
  }
}
function formatDate (d) {
  if (!d) return '—'
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return '—'
  return dt.toLocaleString('fa-IR', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' })
}

const binMap = {
  '603799': 'بانک ملی ایران',
  '589463': 'بانک صادرات ایران',
  '627412': 'بانک ملت',
  '627381': 'بانک پارسیان',
  '502229': 'بانک سامان',
  '627353': 'بانک اقتصاد نوین',
  '627488': 'بانک کارآفرین',
  '627648': 'بانک توسعه صادرات',
  '627961': 'بانک صنعت و معدن',
  '627414': 'بانک رسالت',
  '627760': 'پست بانک',
  '621986': 'بانک کشاورزی',
  '639347': 'بانک پاسارگاد',
  '636214': 'بانک مشترک'
}
function detectBankName (storedCard) {
  const d = onlyDigits(storedCard)
  if (d.length < 6) return 'نامشخص'
  const name = binMap[d.slice(0, 6)]
  return name || 'نامشخص'
}
const bankOptions = computed(() => {
  const s = new Set()
  for (const c of cards.value) {
    const n = detectBankName(c.card)
    if (n && n !== 'نامشخص') s.add(n)
  }
  return Array.from(s)
})

function isActive (c) {
  return Boolean(c.status ?? c.stastatus)
}
function cardStatusText (c) {
  return isActive(c) ? 'تأیید شده' : 'در انتظار'
}

/* ------------------------------- API -------------------------------- */
async function fetchCards () {
  loading.value = true
  try {
    const res = await axios.get(`${url}/admin/cards`)
    cards.value = res.data?.data || []
  } catch (err) {
    console.error('fetchCards failed', err)
    cards.value = []
  } finally {
    loading.value = false
  }
}
async function toggleStatus (id) {
  if (!id) return
  toggling.value = id
  try {
    await axios.get(`${url}/admin/cardstatus/${id}`)
    await fetchCards()
    // sync selection after refresh
    selectedIds.value = selectedIds.value.filter(x => cards.value.some(c => c._id === x))
  } catch (err) {
    console.error('toggleStatus failed', err)
  } finally {
    toggling.value = null
  }
}

/* --------------------------- Filters/Sort/Pag ------------------------ */
const filteredAll = computed(() => {
  let arr = cards.value.slice()

  // status
  if (statusFilter.value) {
    arr = arr.filter(c => (statusFilter.value === 'active' ? isActive(c) : !isActive(c)))
  }

  // bank
  if (bankFilter.value) {
    arr = arr.filter(c => detectBankName(c.card) === bankFilter.value)
  }

  // search
  const q = (debounced.value || '').toLowerCase().trim()
  if (q) {
    arr = arr.filter(c => {
      const cardTxt = safeCardMasked(c.card).toLowerCase()
      const bank = detectBankName(c.card).toLowerCase()
      const userTxt = (
        (c.userid?.fname || '') + ' ' +
        (c.userid?.lname || '') + ' ' +
        (c.userid?.username || '') + ' ' +
        (c.userid?.email || '') + ' ' +
        (c.userid?.phone || '')
      ).toLowerCase()
      return cardTxt.includes(q) || bank.includes(q) || userTxt.includes(q)
    })
  }

  // sort (latest first)
  arr.sort((a, b) => {
    const va = new Date(a.createdAt || 0).getTime()
    const vb = new Date(b.createdAt || 0).getTime()
    return vb - va
  })
  return arr
})
const filteredTotal = computed(() => filteredAll.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(filteredTotal.value / itemsPerPage.value)))
const paginated = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredAll.value.slice(start, start + itemsPerPage.value)
})
const rangeStart = computed(() => filteredTotal.value ? (currentPage.value - 1) * itemsPerPage.value + 1 : 0)
const rangeEnd   = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredTotal.value))
const pagesToShow = computed(() => {
  const total = totalPages.value
  const cur = currentPage.value
  const delta = 2
  const pages = []
  const start = Math.max(1, cur - delta)
  const end = Math.min(total, cur + delta)
  for (let i = start; i <= end; i++) pages.push(i)
  if (pages[0] > 1) {
    if (pages[0] > 2) pages.unshift('...')
    pages.unshift(1)
  }
  if (pages[pages.length - 1] < total) {
    if (pages[pages.length - 1] < total - 1) pages.push('...')
    pages.push(total)
  }
  return pages
})
function changePage (p) {
  if (p === '...') return
  if (p < 1) p = 1
  if (p > totalPages.value) p = totalPages.value
  currentPage.value = p
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function resetFilters () {
  search.value = ''
  debounced.value = ''
  statusFilter.value = ''
  bankFilter.value = ''
  currentPage.value = 1
}

/* --------------------------- Selection (bulk) ------------------------ */
function toggleSelected (id) {
  const idx = selectedIds.value.indexOf(id)
  if (idx >= 0) selectedIds.value.splice(idx, 1)
  else selectedIds.value.push(id)
}
const allPageSelected = computed(() => {
  if (!paginated.value.length) return false
  return paginated.value.every(c => selectedIds.value.includes(c._id))
})
function toggleSelectPage () {
  const ids = paginated.value.map(c => c._id)
  if (allPageSelected.value) {
    selectedIds.value = selectedIds.value.filter(id => !ids.includes(id))
  } else {
    const set = new Set(selectedIds.value.concat(ids))
    selectedIds.value = Array.from(set)
  }
}
function clearSelection () {
  selectedIds.value = []
}
async function bulkToggle () {
  if (!selectedIds.value.length) return
  bulkLoading.value = true
  try {
    for (const id of selectedIds.value) {
      await axios.get(`${url}/admin/cardstatus/${id}`)
    }
    await fetchCards()
    clearSelection()
  } catch (err) {
    console.error('bulkToggle failed', err)
  } finally {
    bulkLoading.value = false
  }
}

function userName(u) {
  if (!u || typeof u !== 'object') return '—'
  const full = [u.fname, u.lname].filter(Boolean).join(' ').trim()
  return full || u.username || u.email || u.phone || '—'
}

/* ------------------------------ Effects ----------------------------- */
onMounted(fetchCards)

// reset page on filter change
watchEffect(() => {
  // reactive dependencies
  // eslint-disable-next-line no-unused-expressions
  [debounced.value, statusFilter.value, bankFilter.value, itemsPerPage.value]
  currentPage.value = 1
})
</script>

<style scoped>
::selection { background: rgba(185, 241, 207, 0.25); }
table { border-collapse: separate; border-spacing: 0; }
</style>
