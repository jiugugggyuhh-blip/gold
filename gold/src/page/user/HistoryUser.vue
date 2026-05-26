<template>
  <div class="min-h-screen overflow-auto p-4">
    <div class="max-w-7xl mx-auto">
      <div class="rounded-2xl bg-gradient-to-b from-[#1a2220] to-[#12181b] ring-1 ring-[#334D44]/60 text-white p-4 sm:p-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-xl sm:text-2xl font-extrabold">سفارشات شما</h2>
            <p class="mt-1 text-sm text-white/60">مرور، جستجو و صفحه‌بندی سفارش‌های خرید و فروش</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 w-full sm:w-auto">
            <div class="relative">
              <input
                v-model.trim="search"
                type="search"
                placeholder="جستجو در نوع سفارش، قیمت یا تاریخ…"
                class="w-full sm:w-72 rounded-xl bg-white/5 ring-1 ring-white/10 focus:ring-2 focus:ring-[#b9f1cf] px-10 py-2.5 text-sm placeholder:text-white/40"
                @keyup.enter="goFirstPage"
              />
              <svg class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"/>
              </svg>
              <button v-if="search" @click="search=''" class="absolute left-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white">✕</button>
            </div>
            <div class="flex items-center gap-1 bg-[#1e2623] ring-1 ring-[#334D44]/60 rounded-xl p-1">
              <button
                v-for="t in tabs"
                :key="t.value"
                type="button"
                @click="activeTab = t.value"
                :class="[
                  'flex-1 rounded-lg px-3 py-2 text-xs sm:text-sm transition',
                  activeTab === t.value ? 'bg-[#b9f1cf] text-[#0a1f14] font-semibold' : 'text-white/80 hover:bg-white/5'
                ]"
              >{{ t.label }}</button>
            </div>
            <select v-model.number="itemsPerPage" class="rounded-xl bg-white/5 ring-1 ring-white/10 focus:ring-2 focus:ring-[#b9f1cf] px-3 py-2.5 text-sm">
              <option :value="5">۵ ردیف</option>
              <option :value="10">۱۰ ردیف</option>
              <option :value="20">۲۰ ردیف</option>
              <option :value="50">۵۰ ردیف</option>
            </select>
          </div>
        </div>

        <div class="mt-4 flex flex-wrap items-center gap-2">
          <span class="inline-flex items-center gap-2 rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/60 px-3 py-1.5 text-xs">
            کل: <span class="font-semibold text-white">{{ orders.length }}</span>
          </span>
          <span class="inline-flex items-center gap-2 rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/60 px-3 py-1.5 text-xs">
            خرید: <span class="font-semibold text-emerald-300">{{ buyCount }}</span>
          </span>
          <span class="inline-flex items-center gap-2 rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/60 px-3 py-1.5 text-xs">
            فروش: <span class="font-semibold text-rose-300">{{ sellCount }}</span>
          </span>
          <button type="button" @click="resetFilters" class="ms-auto px-4 py-2 rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/60 hover:bg-[#22302b] text-sm">
            پاک‌سازی فیلترها
          </button>
        </div>

        <div class="mt-4 rounded-2xl bg-white/5 ring-1 ring-white/10 p-3 sm:p-4">
          <div v-if="loading" class="space-y-3">
            <div v-for="n in 6" :key="n" class="h-10 rounded-lg bg-white/10 animate-pulse"></div>
          </div>

          <div v-else>
            <div v-if="paginatedOrders.length" class="hidden md:block overflow-x-auto rounded-xl ring-1 ring-white/10">
              <table class="min-w-full text-right">
                <thead class="bg-white/5 text-white">
                  <tr>
                    <th class="px-3 py-3 text-xs font-semibold">#</th>
                    <th class="px-3 py-3 text-xs font-semibold">نوع سفارش</th>
                    <th class="px-3 py-3 text-xs font-semibold">قیمت (تومان)</th>
                    <th class="px-3 py-3 text-xs font-semibold">وزن (گرم)</th>
                    <th class="px-3 py-3 text-xs font-semibold">کارمزد (تومان)</th>
                    <th class="px-3 py-3 text-xs font-semibold">قیمت طلا (تومان)</th>
                    <th class="px-3 py-3 text-xs font-semibold">تاریخ ثبت</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/10 text-white/90">
                  <tr v-for="(item, index) in paginatedOrders" :key="item._id" class="hover:bg-white/5 transition">
                    <td class="px-3 py-3 text-xs text-white/70 w-12">{{ rowNumber(index) }}</td>
                    <td class="px-3 py-3 text-sm font-bold" :class="item.typeorder === 'buy' ? 'text-emerald-300' : 'text-rose-300'">
                      {{ item.typeorder === 'buy' ? 'خرید' : 'فروش' }}
                    </td>
                    <td class="px-3 py-3 text-sm">{{ formatMoney(item.price) }}</td>
                    <td class="px-3 py-3 text-sm">{{ formatWeight(item.weight) }}</td>
                    <td class="px-3 py-3 text-sm">{{ formatMoney(item.fee) }}</td>
                    <td class="px-3 py-3 text-sm">{{ formatMoney(item.goldprice) }}</td>
                    <td class="px-3 py-3 text-xs text-white/70 whitespace-nowrap">{{ formatDate(item.createdAt) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-else class="py-14 text-center">
              <div class="mx-auto h-16 w-16 rounded-2xl bg-white/5 ring-1 ring-white/10 grid place-items-center">
                <svg class="h-8 w-8 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M3 7h18M5 7v8a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V7"/>
                </svg>
              </div>
              <p class="mt-3 text-sm text-white/70">سفارشی مطابق فیلترهای فعلی پیدا نشد.</p>
            </div>

            <div class="md:hidden grid gap-3">
              <div
                v-for="(item, index) in paginatedOrders"
                :key="item._id"
                class="rounded-2xl bg-[#1e2623] ring-1 ring-[#334D44]/60 px-4 py-3"
              >
                <div class="flex items-center justify-between">
                  <span class="text-xs text-white/60">{{ rowNumber(index) }}</span>
                  <span :class="['text-xs px-2 py-1 rounded-lg ring-1',
                                item.typeorder === 'buy'
                                  ? 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/30'
                                  : 'bg-rose-500/15 text-rose-300 ring-rose-400/30']">
                    {{ item.typeorder === 'buy' ? 'خرید' : 'فروش' }}
                  </span>
                </div>
                <div class="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div class="text-white/80">قیمت</div>
                  <div class="text-white font-semibold text-left">{{ formatMoney(item.price) }}</div>
                  <div class="text-white/80">وزن</div>
                  <div class="text-white font-semibold text-left">{{ formatWeight(item.weight) }} گرم</div>
                  <div class="text-white/80">کارمزد</div>
                  <div class="text-white font-semibold text-left">{{ formatMoney(item.fee) }}</div>
                  <div class="text-white/80">قیمت طلا</div>
                  <div class="text-white font-semibold text-left">{{ formatMoney(item.goldprice) }}</div>
                </div>
                <div class="mt-2 text-[11px] text-white/50 text-left">{{ formatDate(item.createdAt) }}</div>
              </div>
            </div>

            <div v-if="filteredOrders.length" class="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div class="text-xs text-white/60">
                نمایش <span class="text-white">{{ rangeStart }}</span> – <span class="text-white">{{ rangeEnd }}</span> از
                <span class="text-white">{{ filteredOrders.length }}</span>
              </div>
              <div class="flex items-center gap-2">
                <button @click="changePage(1)" :disabled="currentPage===1" class="px-3 py-1.5 rounded-lg bg-[#1e2623] ring-1 ring-[#334D44]/60 disabled:opacity-40">«</button>
                <button @click="changePage(currentPage-1)" :disabled="currentPage===1" class="px-3 py-1.5 rounded-lg bg-[#1e2623] ring-1 ring-[#334D44]/60 disabled:opacity-40">‹</button>
                <template v-for="p in pagesToShow" :key="p">
                  <button
                    v-if="p !== '...'"
                    @click="changePage(p)"
                    :class="['px-3 py-1.5 rounded-lg',
                             currentPage===p
                               ? 'bg-[#b9f1cf] text-[#0a1f14] font-semibold'
                               : 'bg-[#1e2623] ring-1 ring-[#334D44]/60 text-white']"
                  >{{ p }}</button>
                  <span v-else class="px-2 text-white/40">…</span>
                </template>
                <button @click="changePage(currentPage+1)" :disabled="currentPage===totalPages" class="px-3 py-1.5 rounded-lg bg-[#1e2623] ring-1 ring-[#334D44]/60 disabled:opacity-40">›</button>
                <button @click="changePage(totalPages)" :disabled="currentPage===totalPages" class="px-3 py-1.5 rounded-lg bg-[#1e2623] ring-1 ring-[#334D44]/60 disabled:opacity-40">»</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!loading && !orders.length" class="flex justify-center items-center py-16">
        <svg class="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, computed, watch, onMounted } from 'vue'

const url = process.env.VUE_APP_API_URL || ''

const orders = ref([])
const loading = ref(true)
const search = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(20)
const activeTab = ref('all')

const tabs = [
  { value: 'all', label: 'همه' },
  { value: 'buy', label: 'خرید' },
  { value: 'sell', label: 'فروش' }
]

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleString('fa-IR', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' })
}
function formatMoney(n) {
  const v = Number(n) || 0
  return new Intl.NumberFormat('fa-IR').format(Math.round(v))
}
function formatWeight(n) {
  const v = Number(n) || 0
  const s = v.toLocaleString('fa-IR', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
  if (s.endsWith('٫000') || s.endsWith('.000')) return Number(v).toLocaleString('fa-IR')
  return s
}

const filteredOrders = computed(() => {
  let list = orders.value.slice()
  if (activeTab.value === 'buy') list = list.filter(i => i.typeorder === 'buy')
  if (activeTab.value === 'sell') list = list.filter(i => i.typeorder === 'sell')
  const q = search.value.trim().toLowerCase()
  if (q) {
    list = list.filter(item => {
      const typeText = item.typeorder === 'buy' ? 'خرید' : 'فروش'
      const priceStr = String(item.price || '')
      const dateStr = formatDate(item.createdAt)
      return typeText.includes(q) || priceStr.includes(q) || dateStr.includes(q)
    })
  }
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredOrders.value.length / itemsPerPage.value)))
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredOrders.value.slice(start, start + itemsPerPage.value)
})
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
const rangeStart = computed(() => filteredOrders.value.length ? (currentPage.value - 1) * itemsPerPage.value + 1 : 0)
const rangeEnd = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredOrders.value.length))
const buyCount = computed(() => orders.value.filter(i => i.typeorder === 'buy').length)
const sellCount = computed(() => orders.value.filter(i => i.typeorder === 'sell').length)

function changePage(page) {
  if (typeof page !== 'number') return
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function rowNumber(index) {
  return (currentPage.value - 1) * itemsPerPage.value + index + 1
}
function resetFilters() {
  search.value = ''
  activeTab.value = 'all'
  currentPage.value = 1
}
function goFirstPage() {
  currentPage.value = 1
}

watch([search, itemsPerPage, activeTab], () => { currentPage.value = 1 })

onMounted(async () => {
  try {
    const res = await axios.get(`${url}/user/order`)
    orders.value = res.data?.data || []
  } catch {
    orders.value = []
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
</style>
