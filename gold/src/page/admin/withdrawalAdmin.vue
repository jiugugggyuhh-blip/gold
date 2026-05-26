<!-- src/page/admin/WithdrawalsAdmin.vue -->
<template>
  <div class="flex min-h-screen bg-[#0f1417] text-white">
    <!-- Sidebar (MintGlass) -->
    <Sidebar />

    <!-- Main -->
    <div class="flex-1 flex flex-col mt-20 md:mt-0">
      <!-- Header -->
      <header
        class="mx-4 md:mx-6 mt-4 rounded-2xl bg-gradient-to-b from-[#1a2220]/90 to-[#12181b]/90
                 ring-1 ring-[#334D44]/60 backdrop-blur-xl shadow-xl p-4"
      >
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div class="flex items-center gap-3">
            <h1 class="text-xl md:text-2xl font-extrabold">برداشت‌ها</h1>
            <span
              class="hidden sm:inline-flex items-center gap-2 rounded-xl bg-[#1e2623] px-3 py-1.5 text-xs ring-1 ring-[#334D44]/60"
            >
              <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span>به‌روز: {{ lastRefreshLabel }}</span>
            </span>
          </div>

          <!-- Search + actions -->
          <div class="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:gap-3">
            <div class="flex items-center gap-2">
              <select
                v-model.number="itemsPerPage"
                class="rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2 text-sm focus:ring-2 focus:ring-[#b9f1cf]"
                aria-label="تعداد در هر صفحه"
              >
                <option :value="10">۱۰</option>
                <option :value="20">۲۰</option>
                <option :value="50">۵۰</option>
              </select>

              <button
                @click="fetchWithdrawals"
                :disabled="loading"
                class="rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/60 px-3 py-2 text-sm hover:bg-[#22302b] disabled:opacity-60"
              >
                بروزرسانی
              </button>
              <button
                @click="exportCsv"
                :disabled="loading || !filtered.length"
                class="rounded-xl bg-[#b9f1cf] text-[#0a1f14] px-3 py-2 text-sm font-semibold hover:brightness-95 disabled:opacity-60"
              >
                خروجی CSV
              </button>
            </div>

            <div class="relative">
              <input
                v-model.trim="searchInput"
                @input="onSearchInput"
                type="search"
                placeholder="جستجو: نام، ایمیل یا مبلغ…"
                class="w-full sm:w-80 rounded-xl bg-white/5 ring-1 ring-white/10 focus:ring-2 focus:ring-[#b9f1cf] px-10 py-2 text-sm placeholder:text-white/40"
                autocomplete="off"
                aria-label="جستجو"
              />
              <svg
                class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"
                      d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"/>
              </svg>
              <button
                v-if="search"
                @click="clearSearch"
                class="absolute left-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                aria-label="پاک کردن جستجو"
              >✕</button>
            </div>
          </div>
        </div>

        <!-- Quick stats -->
        <div class="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          <StatChip label="تعداد کل" :value="formatNumber(filtered.length)" />
          <StatChip label="در انتظار" :value="formatNumber(pendingCount)" tone="amber" />
          <StatChip label="پرداخت شده" :value="formatNumber(paidCount)" tone="emerald" />
          <StatChip label="مجموع مبالغ" :value="money(sumAmount)" />
          <StatChip label="مجموع پرداخت‌شده" :value="money(sumPaid)" tone="emerald" />
          <StatChip label="مجموع در انتظار" :value="money(sumPending)" tone="amber" />
        </div>

        <!-- Bulk actions -->
        <div
          v-if="selectedIds.length"
          class="mt-3 flex flex-wrap items-center gap-2"
        >
          <span class="text-xs text-white/70">انتخاب‌شده: {{ selectedIds.length }}</span>
          <button
            @click="bulkToggle(true)"
            :disabled="bulkLoading"
            class="rounded-lg bg-emerald-400/90 text-gray-900 text-xs font-semibold px-3 py-1.5 hover:brightness-95 disabled:opacity-60"
          >
            تایید پرداخت (توده‌ای)
          </button>
          <button
            @click="bulkToggle(false)"
            :disabled="bulkLoading"
            class="rounded-lg bg-white/10 ring-1 ring-white/15 text-xs px-3 py-1.5 hover:bg-white/15 disabled:opacity-60"
          >
            برگرداندن به انتظار
          </button>
          <button
            @click="clearSelection"
            class="rounded-lg bg-[#1e2623] ring-1 ring-[#334D44]/60 text-xs px-3 py-1.5 hover:bg-[#22302b]"
          >
            لغو انتخاب
          </button>
        </div>
      </header>

      <!-- Content -->
      <main class="p-4 md:p-6 flex-1 overflow-auto">
        <div class="max-w-7xl mx-auto space-y-4">
          <!-- Table card -->
          <div class="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-md p-3 sm:p-4">
            <!-- Loading skeleton -->
            <div v-if="loading" class="space-y-2">
              <div v-for="i in 6" :key="'sk-'+i" class="h-12 rounded-lg bg-white/10 animate-pulse"></div>
            </div>

            <!-- Empty -->
            <div v-else-if="!filtered.length" class="py-16 text-center">
              <div class="mx-auto h-14 w-14 rounded-2xl bg-white/5 ring-1 ring-white/10 grid place-items-center">
                <svg class="h-7 w-7 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M4 7h16M6 7v10a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4V7M9 7V5a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v2"/>
                </svg>
              </div>
              <p class="mt-3 text-sm text-white/70">هیچ درخواستی ثبت نشده است.</p>
            </div>

            <!-- Table -->
            <div v-else class="overflow-x-auto">
              <table class="min-w-full text-right">
                <thead class="bg-white/5 text-white">
                  <tr>
                    <th class="px-3 py-3 text-xs font-semibold w-10">
                      <input
                        type="checkbox"
                        :checked="isAllPageSelected"
                        @change="toggleSelectAllOnPage"
                        class="h-4 w-4 rounded border-white/20 bg-transparent"
                        aria-label="انتخاب صفحه"
                      />
                    </th>
                    <th class="px-3 py-3 text-xs font-semibold">#</th>
                    <th class="px-3 py-3 text-xs font-semibold">مبلغ (تومان)</th>
                    <th class="px-3 py-3 text-xs font-semibold">کاربر</th>
                    <th class="px-3 py-3 text-xs font-semibold">ایمیل / تلفن</th>
                    <th class="px-3 py-3 text-xs font-semibold">شماره کارت</th>
                    <th class="px-3 py-3 text-xs font-semibold">وضعیت</th>
                    <th class="px-3 py-3 text-xs font-semibold">تاریخ</th>
                    <th class="px-3 py-3 text-xs font-semibold">عملیات</th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-white/10">
                  <tr
                    v-for="(w, i) in paginated"
                    :key="w._id"
                    class="hover:bg-white/5 transition"
                  >
                    <td class="px-3 py-3">
                      <input
                        type="checkbox"
                        :checked="selectedIdsSet.has(w._id)"
                        @change="toggleSelect(w._id)"
                        class="h-4 w-4 rounded border-white/20 bg-transparent"
                        :aria-label="`انتخاب سطر ${rowIndex(i)}`"
                      />
                    </td>
                    <td class="px-3 py-3 text-xs text-white/70 w-12">
                      {{ rowIndex(i) }}
                    </td>
                    <td class="px-3 py-3 text-sm font-semibold text-white/90">
                      {{ money(w.amount) }}
                    </td>

                    <td class="px-3 py-3 text-sm text-white/90">
                      <div class="font-medium">{{ userName(w.userid) }}</div>
                      <div class="text-[11px] text-white/50">ID: {{ w.userid?._id || '—' }}</div>
                    </td>

                    <td class="px-3 py-3 text-sm text-white/80">
                      <div class="truncate">{{ w.userid?.email || '—' }}</div>
                      <div class="text-[11px] text-white/50">{{ w.userid?.phone || '—' }}</div>
                    </td>

                    <td class="px-3 py-3 text-sm text-white/80">
                      <div>{{ w.cardId?.card || '—' }}</div>
                      <div class="text-[11px] text-white/50">{{ w.cardId?.bank || '' }}</div>
                    </td>

                    <td class="px-3 py-3">
                      <span
                        :class="[
                          'inline-flex items-center gap-1 rounded-full px-2 py-1 ring-1 text-xs',
                          w.status
                            ? 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/30'
                            : 'bg-amber-500/15 text-amber-200 ring-amber-400/30'
                        ]"
                      >
                        <span
                          class="h-1.5 w-1.5 rounded-full"
                          :class="w.status ? 'bg-emerald-400' : 'bg-amber-300'"
                        ></span>
                        {{ w.status ? 'پرداخت شد' : 'در انتظار' }}
                      </span>
                    </td>

                    <td class="px-3 py-3 text-xs text-white/60 whitespace-nowrap">
                      {{ formatDate(w.createdAt) }}
                    </td>

                    <td class="px-3 py-3">
                      <div class="flex items-center justify-end gap-2">
                        <button
                          @click="toggleStatus(w._id)"
                          :disabled="toggling === w._id"
                          class="px-3 py-1.5 rounded-lg bg-[#b9f1cf] text-[#0a1f14] text-xs font-semibold hover:brightness-95 disabled:opacity-60"
                        >
                          {{ toggling === w._id ? '...' : (findById(w._id)?.status ? 'برگرداندن' : 'تأیید') }}
                        </button>
                        <button
                          @click="openDetails(w)"
                          class="px-3 py-1.5 rounded-lg bg-white/5 ring-1 ring-white/10 text-xs hover:bg-white/10"
                        >
                          جزئیات
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>

                <tfoot>
                  <tr>
                    <td colspan="9" class="px-3 py-4">
                      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div class="text-xs text-white/70">
                          نمایش
                          <span class="text-white">{{ rangeStart }}</span>
                          –
                          <span class="text-white">{{ rangeEnd }}</span>
                          از
                          <span class="text-white">{{ filtered.length }}</span>
                        </div>

                        <div class="flex items-center gap-2">
                          <button
                            @click="changePage(currentPage - 1)"
                            :disabled="currentPage === 1"
                            class="px-3 py-1.5 rounded-lg bg-[#1e2623] ring-1 ring-[#334D44]/60 disabled:opacity-40"
                          >
                            قبلی
                          </button>

                          <button
                            v-for="p in pagesToShow"
                            :key="`p-${p}`"
                            @click="typeof p==='number' && changePage(p)"
                            :disabled="p==='...'"
                            :class="[
                              'px-3 py-1.5 rounded-lg',
                              currentPage === p
                                ? 'bg-[#b9f1cf] text-[#0a1f14] font-semibold'
                                : 'bg-[#1e2623] ring-1 ring-[#334D44]/60 text-white'
                            ]"
                          >
                            {{ p }}
                          </button>

                          <button
                            @click="changePage(currentPage + 1)"
                            :disabled="currentPage === totalPages"
                            class="px-3 py-1.5 rounded-lg bg-[#1e2623] ring-1 ring-[#334D44]/60 disabled:opacity-40"
                          >
                            بعدی
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Details Modal -->
    <transition name="modal-fade">
      <div v-if="detailOpen" class="fixed inset-0 z-50 grid place-items-center p-4">
        <div class="absolute inset-0 bg-black/60" @click="closeDetails"></div>
        <div class="relative w-full max-w-lg rounded-2xl bg-white p-6 text-right shadow-2xl">
          <h3 class="text-xl font-bold text-gray-900">جزئیات برداشت</h3>
          <div class="mt-3 space-y-2 text-sm text-gray-700">
            <div class="flex items-center justify-between">
              <span class="text-gray-500">مبلغ</span>
              <span class="font-semibold">{{ money(detail?.amount) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500">وضعیت</span>
              <span class="font-semibold">
                {{ detail?.status ? 'پرداخت شد' : 'در انتظار' }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500">کاربر</span>
              <span class="font-semibold">{{ userName(detail?.userid) }}</span>
            </div>
            <div>
              <div class="text-gray-500">ایمیل</div>
              <div class="font-medium">{{ detail?.userid?.email || '—' }}</div>
            </div>
            <div>
              <div class="text-gray-500">تلفن</div>
              <div class="font-medium">{{ detail?.userid?.phone || '—' }}</div>
            </div>
            <div>
              <div class="text-gray-500">کارت</div>
              <div class="font-medium">
                {{ detail?.cardId?.card || '—' }} <span class="text-gray-500">{{ detail?.cardId?.bank || '' }}</span>
              </div>
            </div>
            <div>
              <div class="text-gray-500">تاریخ ثبت</div>
              <div class="font-medium">{{ formatDate(detail?.createdAt) }}</div>
            </div>
          </div>

          <div class="mt-5 flex items-center justify-between">
            <button
              @click="toggleStatus(detail?._id)"
              :disabled="toggling === detail?._id"
              class="rounded-lg bg-[#0f1417] text-white px-4 py-2 hover:opacity-90 disabled:opacity-60"
            >
              {{ toggling === detail?._id ? '...' : (findById(detail?._id)?.status ? 'برگرداندن' : 'تأیید پرداخت') }}
            </button>
            <button @click="closeDetails" class="rounded-lg bg-gray-900 text-white px-4 py-2 hover:opacity-90">
              بستن
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import Sidebar from '@/components/admin/SidebarAdmin.vue'

/* ------------------ Config ------------------ */
const url = process.env.VUE_APP_API_URL || ''

/* ------------------ State ------------------- */
const withdrawals = ref([])
const loading = ref(true)
const toggling = ref(null)

const search = ref('')
const searchInput = ref('')
let searchTimer = null

const currentPage = ref(1)
const itemsPerPage = ref(10)

const lastRefresh = ref(null)

/* ------------- Selection (bulk) ------------- */
const selectedIds = ref([])
const selectedIdsSet = computed(() => new Set(selectedIds.value))
const bulkLoading = ref(false)

/* -------------- Detail modal ---------------- */
const detailOpen = ref(false)
const detail = ref(null)

/* ----------------- Fetching ----------------- */
async function fetchWithdrawals () {
  loading.value = true
  try {
    const res = await axios.get(`${url}/admin/withdrawal`)
    withdrawals.value = res.data?.data || []
    lastRefresh.value = new Date()
  } catch {
    withdrawals.value = []
  } finally {
    loading.value = false
  }
}

/* ----------------- Helpers ------------------ */
function money (n) {
  const v = Number(n)
  if (!Number.isFinite(v)) return '—'
  return new Intl.NumberFormat('fa-IR').format(Math.round(v))
}
function formatDate (d) {
  if (!d) return '—'
  const dt = new Date(d)
  if (Number.isNaN(dt.getTime())) return '—'
  return dt.toLocaleString('fa-IR', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' })
}
function formatNumber (n) {
  return new Intl.NumberFormat('fa-IR').format(Number(n) || 0)
}
const lastRefreshLabel = computed(() =>
  lastRefresh.value ? lastRefresh.value.toLocaleTimeString('fa-IR', { hour:'2-digit', minute:'2-digit' }) : '—'
)
function userName (u) {
  if (!u) return '—'
  const name = [u.fname, u.lname].filter(Boolean).join(' ')
  return name || u.username || '—'
}
function findById (id) {
  return withdrawals.value.find(w => w._id === id)
}

/* ----------------- Search ------------------- */
function onSearchInput () {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    search.value = searchInput.value
    currentPage.value = 1
  }, 250)
}
function clearSearch () {
  searchInput.value = ''
  search.value = ''
  currentPage.value = 1
}

/* --------------- Filtering ------------------ */
const filtered = computed(() => {
  const s = (search.value || '').trim().toLowerCase()
  if (!s) return withdrawals.value
  return withdrawals.value.filter(w => {
    const amt = String(w.amount || '')
    const userTxt = [
      w.userid?.fname || '',
      w.userid?.lname || '',
      w.userid?.username || '',
      w.userid?.email || '',
      w.userid?.phone || '',
      w.cardId?.card || ''
    ].join(' ').toLowerCase()
    return amt.includes(s) || userTxt.includes(s)
  })
})

/* ----------------- Stats -------------------- */
const pendingCount = computed(() => filtered.value.filter(w => !w.status).length)
const paidCount = computed(() => filtered.value.filter(w => w.status).length)
const sumAmount = computed(() => filtered.value.reduce((a, b) => a + (Number(b.amount) || 0), 0))
const sumPaid = computed(() => filtered.value.filter(w => w.status).reduce((a, b) => a + (Number(b.amount) || 0), 0))
const sumPending = computed(() => filtered.value.filter(w => !w.status).reduce((a, b) => a + (Number(b.amount) || 0), 0))

/* --------------- Pagination ----------------- */
const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / itemsPerPage.value)))
const paginated = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filtered.value.slice(start, start + itemsPerPage.value)
})
const rangeStart = computed(() => filtered.value.length ? (currentPage.value - 1) * itemsPerPage.value + 1 : 0)
const rangeEnd   = computed(() => Math.min(currentPage.value * itemsPerPage.value, filtered.value.length))
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
function changePage (p) {
  if (typeof p !== 'number') return
  if (p < 1) p = 1
  if (p > totalPages.value) p = totalPages.value
  currentPage.value = p
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function rowIndex (i) { return (currentPage.value - 1) * itemsPerPage.value + i + 1 }

/* --------------- Selection ------------------ */
const isAllPageSelected = computed(() => paginated.value.every(w => selectedIdsSet.value.has(w._id)))
function toggleSelect (id) {
  const set = new Set(selectedIds.value)
  if (set.has(id)) set.delete(id)
  else set.add(id)
  selectedIds.value = Array.from(set)
}
function toggleSelectAllOnPage () {
  const set = new Set(selectedIds.value)
  if (isAllPageSelected.value) {
    // unselect all on page
    paginated.value.forEach(w => set.delete(w._id))
  } else {
    paginated.value.forEach(w => set.add(w._id))
  }
  selectedIds.value = Array.from(set)
}
function clearSelection () {
  selectedIds.value = []
}

/* ------------- Actions (single) ------------- */
async function toggleStatus (id) {
  if (!id) return
  const ok = await Swal.fire({
    title: 'تغییر وضعیت برداشت',
    text: 'آیا از تغییر وضعیت این مورد مطمئن هستید؟',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'تایید',
    cancelButtonText: 'انصراف'
  })
  if (!ok.isConfirmed) return
  toggling.value = id
  try {
    await axios.get(`${url}/admin/withdrawal/${id}`)
    await fetchWithdrawals()
  } catch (err) {
    Swal.fire({ icon: 'error', text: 'خطایی رخ داد.' })
  } finally {
    toggling.value = null
  }
}

/* ------------- Actions (bulk) --------------- */
async function bulkToggle (toPaid) {
  if (!selectedIds.value.length) return
  const ok = await Swal.fire({
    title: toPaid ? 'تایید پرداخت (توده‌ای)' : 'برگرداندن به انتظار',
    text: `برای ${selectedIds.value.length} مورد اعمال شود؟`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'بله',
    cancelButtonText: 'انصراف'
  })
  if (!ok.isConfirmed) return

  bulkLoading.value = true
  try {
    // چون API bulk ندارید، یک‌به‌یک صدا می‌زنیم
    for (const id of selectedIds.value) {
      await axios.get(`${url}/admin/withdrawal/${id}`)
    }
    await fetchWithdrawals()
    clearSelection()
    Swal.fire({ icon: 'success', text: 'انجام شد.' })
  } catch {
    Swal.fire({ icon: 'error', text: 'برخی موارد انجام نشد.' })
  } finally {
    bulkLoading.value = false
  }
}

/* ---------------- Details ------------------- */
function openDetails (w) {
  detail.value = w
  detailOpen.value = true
  document.body.style.overflow = 'hidden'
}
function closeDetails () {
  detailOpen.value = false
  detail.value = null
  document.body.style.overflow = ''
}

/* ---------------- Export CSV ---------------- */
function exportCsv () {
  if (!filtered.value.length) return
  const headers = ['amount','status','user_fullname','username','email','phone','card','bank','createdAt','id']
  const rows = filtered.value.map(w => ([
    Number(w.amount) || 0,
    w.status ? 'paid' : 'pending',
    userName(w.userid),
    w.userid?.username || '',
    w.userid?.email || '',
    w.userid?.phone || '',
    w.cardId?.card || '',
    w.cardId?.bank || '',
    formatDate(w.createdAt),
    w._id || ''
  ]))
  const csv = [headers, ...rows].map(r => r.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `withdrawals_${new Date().toISOString().slice(0,10)}.csv`
  a.click()
  URL.revokeObjectURL(a.href)
}

/* ----------------- Mount -------------------- */
onMounted(fetchWithdrawals)
</script>

<script>
/* Inline tiny component for stat chips to avoid extra files */
export default {
  components: {
    StatChip: {
      props: {
        label: { type: String, required: true },
        value: { type: String, required: true },
        tone: { type: String, default: '' } // '', 'emerald', 'amber'
      },
      template: `
        <div
          :class="[
            'rounded-xl px-3 py-2 ring-1 text-xs flex items-center justify-between gap-2',
            tone==='emerald'
              ? 'bg-emerald-500/10 ring-emerald-400/30 text-emerald-200'
              : tone==='amber'
                ? 'bg-amber-500/10 ring-amber-400/30 text-amber-200'
                : 'bg-[#1e2623] ring-[#334D44]/60 text-white/80'
          ]"
        >
          <span class="truncate">{{ label }}</span>
          <span class="font-semibold text-white/90">{{ value }}</span>
        </div>
      `
    }
  }
}
</script>

<style scoped>
/* Modal transition */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity .2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>
