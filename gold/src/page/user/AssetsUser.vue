<template>
  <div class="min-h-screen max-w-7xl overflow-auto px-3 sm:px-6 lg:px-10 py-6 space-y-6">
    <!-- Top insight cards -->
    <section class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div class="rounded-2xl bg-gradient-to-br from-[#1b2421] to-[#141a1e] ring-1 ring-[#334D44]/60 p-4 text-white">
        <div class="text-xs text-white/60">موجودی طلا</div>
        <div class="mt-2 text-2xl font-extrabold">{{ formatWeight(user.gold) }} گرم</div>
      </div>
      <div class="rounded-2xl bg-gradient-to-br from-[#1c2024] to-[#141a1e] ring-1 ring-[#334D44]/60 p-4 text-white">
        <div class="text-xs text-white/60">موجودی تومان</div>
        <div class="mt-2 text-2xl font-extrabold">{{ formatMoney(user.toman) }} تومان</div>
      </div>
      <div class="rounded-2xl bg-[#141a1e] ring-1 ring-[#334D44]/60 p-4 text-white">
        <div class="text-xs text-white/60">جمع خریدها</div>
        <div class="mt-2 text-2xl font-extrabold">{{ formatMoney(totalBuy) }} تومان</div>
      </div>
      <div class="rounded-2xl bg-[#141a1e] ring-1 ring-[#334D44]/60 p-4 text-white">
        <div class="text-xs text-white/60">جمع فروش‌ها</div>
        <div class="mt-2 text-2xl font-extrabold">{{ formatMoney(totalSell) }} تومان</div>
      </div>
    </section>

    <!-- Toolbar -->
    <section class="sticky top-2 z-10">
      <div class="rounded-2xl bg-[#0f1417]/90 backdrop-blur-md ring-1 ring-[#334D44]/60 p-4 sm:p-5 text-white">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          <div class="lg:col-span-5">
            <div class="relative">
              <input
                v-model="q"
                placeholder="جستجو: عنوان، نوع، تاریخ، سفارش…"
                class="w-full rounded-xl bg-[#1a2421] ring-1 ring-[#334D44]/50 px-3 py-2 pr-9 placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-white/50">⌕</span>
            </div>
          </div>

          <div class="lg:col-span-2">
            <select
              v-model="typeorder"
              class="w-full rounded-xl bg-[#1a2421] ring-1 ring-[#334D44]/50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">همه‌ی سفارش‌ها</option>
              <option value="buy">فقط خرید</option>
              <option value="sell">فقط فروش</option>
            </select>
          </div>

          <div class="lg:col-span-2">
            <select
              v-model="sortKey"
              class="w-full rounded-xl bg-[#1a2421] ring-1 ring-[#334D44]/50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="date">مرتب‌سازی: تاریخ</option>
              <option value="price">مرتب‌سازی: قیمت</option>
              <option value="weight">مرتب‌سازی: وزن</option>
              <option value="title">مرتب‌سازی: عنوان</option>
            </select>
          </div>

          <div class="lg:col-span-1">
            <select
              v-model="sortDir"
              class="w-full rounded-xl bg-[#1a2421] ring-1 ring-[#334D44]/50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="desc">نزولی</option>
              <option value="asc">صعودی</option>
            </select>
          </div>

          <div class="lg:col-span-1">
            <select
              v-model.number="pageSize"
              class="w-full rounded-xl bg-[#1a2421] ring-1 ring-[#334D44]/50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option v-for="s in pageSizes" :key="s" :value="s">{{ s }}/صفحه</option>
            </select>
          </div>

          <div class="lg:col-span-1 flex items-center justify-end gap-2">
            <button
              @click="exportCsv"
              class="inline-flex items-center gap-2 rounded-xl bg-[#b9f1cf] text-[#0a1f14] px-3 py-2 text-sm font-semibold hover:brightness-95"
            >
              خروجی CSV
            </button>
          </div>
        </div>

        <!-- Quick filter chips -->
        <div class="mt-3 flex flex-wrap gap-2 text-xs">
          <button
            class="rounded-full px-3 py-1 ring-1 ring-white/15"
            :class="chipActive('today') ? 'bg-white/10 text-emerald-300' : 'bg-white/5 text-white/75 hover:bg-white/10'"
            @click="toggleChip('today')"
          >
            امروز
          </button>
          <button
            class="rounded-full px-3 py-1 ring-1 ring-white/15"
            :class="chipActive('7d') ? 'bg-white/10 text-emerald-300' : 'bg-white/5 text-white/75 hover:bg-white/10'"
            @click="toggleChip('7d')"
          >
            ۷ روز اخیر
          </button>
          <button
            class="rounded-full px-3 py-1 ring-1 ring-white/15"
            :class="chipActive('30d') ? 'bg-white/10 text-emerald-300' : 'bg-white/5 text-white/75 hover:bg-white/10'"
            @click="toggleChip('30d')"
          >
            ۳۰ روز اخیر
          </button>
          <button
            class="rounded-full px-3 py-1 ring-1 ring-white/15"
            :class="chipActive('highPrice') ? 'bg-white/10 text-emerald-300' : 'bg-white/5 text-white/75 hover:bg-white/10'"
            @click="toggleChip('highPrice')"
          >
            مبلغ بالاتر از ۱۰M
          </button>
        </div>
      </div>
    </section>

    <!-- Loading skeleton -->
    <section v-if="loading" class="grid gap-3 sm:gap-4">
      <div v-for="i in 8" :key="i" class="rounded-2xl bg-[#141a1e] ring-1 ring-[#334D44]/60 p-4 animate-pulse">
        <div class="h-4 w-1/3 bg-white/10 rounded mb-3"></div>
        <div class="h-3 w-1/2 bg-white/10 rounded mb-2"></div>
        <div class="h-3 w-2/3 bg-white/10 rounded"></div>
      </div>
    </section>

    <section v-else>
      <!-- Desktop table -->
      <div class="hidden md:block rounded-2xl overflow-hidden ring-1 ring-[#334D44]/60">
        <table class="min-w-full text-right bg-[#141a1e] text-white">
          <thead class="bg-white/5">
            <tr class="text-sm">
              <th class="px-4 py-3 font-semibold">تصویر</th>
              <th class="px-4 py-3 font-semibold">عنوان</th>
              <th class="px-4 py-3 font-semibold">نوع</th>
              <th class="px-4 py-3 font-semibold">وزن (گرم)</th>
              <th class="px-4 py-3 font-semibold">قیمت (تومان)</th>
              <th class="px-4 py-3 font-semibold">نوع سفارش</th>
              <th class="px-4 py-3 font-semibold">تاریخ</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in paginated"
              :key="row._id"
              class="border-t border-white/10 hover:bg-white/5"
            >
              <td class="px-4 py-3">
                <img :src="itemImg(row)" class="h-12 w-12 object-contain rounded bg-[#1e2623] ring-1 ring-white/10" />
              </td>
              <td class="px-4 py-3 font-bold">{{ itemTitle(row) }}</td>
              <td class="px-4 py-3 text-white/80">{{ itemType(row) }}</td>
              <td class="px-4 py-3">{{ formatWeight(itemWeight(row)) }}</td>
              <td class="px-4 py-3">{{ formatMoney(itemPrice(row)) }}</td>
              <td class="px-4 py-3">
                <span
                  :class="row.typeorder==='buy' ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30' : 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/30'"
                  class="inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold"
                >
                  {{ itemOrderLabel(row) }}
                </span>
              </td>
              <td class="px-4 py-3 text-yellow-300 text-sm">{{ fmtDate(row.date) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile cards -->
      <div class="md:hidden grid gap-4">
        <div
          v-for="row in paginated"
          :key="row._id"
          class="rounded-2xl bg-[#141a1e] ring-1 ring-[#334D44]/60 p-4 text-white"
        >
          <div class="flex gap-3">
            <img :src="itemImg(row)" class="h-20 w-20 object-contain rounded bg-[#1e2623] ring-1 ring-white/10" />
            <div class="flex-1">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <div class="font-extrabold leading-6">{{ itemTitle(row) }}</div>
                  <div class="text-xs text-white/60 mt-1">{{ itemType(row) }}</div>
                </div>
                <span
                  :class="row.typeorder==='buy' ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30' : 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/30'"
                  class="inline-flex h-7 items-center rounded-full px-3 text-[11px] font-semibold"
                >
                  {{ itemOrderLabel(row) }}
                </span>
              </div>
              <div class="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div class="rounded-lg bg-[#1e2623] ring-1 ring-white/10 px-3 py-2">
                  <div class="text-white/60 text-xs">وزن</div>
                  <div class="font-bold">{{ formatWeight(itemWeight(row)) }} گرم</div>
                </div>
                <div class="rounded-lg bg-[#1e2623] ring-1 ring-white/10 px-3 py-2">
                  <div class="text-white/60 text-xs">قیمت</div>
                  <div class="font-bold">{{ formatMoney(itemPrice(row)) }} تومان</div>
                </div>
              </div>
              <div class="mt-3 text-xs text-yellow-300">{{ fmtDate(row.date) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="mt-6 flex flex-col md:flex-row md:items-center gap-3">
        <div class="flex items-center gap-2">
          <button @click="changePage(1)" :disabled="page===1" class="px-3 py-1 rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/50 text-white disabled:opacity-50">اول</button>
          <button @click="changePage(page-1)" :disabled="page===1" class="px-3 py-1 rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/50 text-white disabled:opacity-50">قبلی</button>
        </div>
        <div class="flex items-center gap-2 overflow-x-auto">
          <button
            v-for="p in pages"
            :key="p"
            @click="changePage(p)"
            :class="[
              'px-3 py-1 rounded-xl ring-1 ring-[#334D44]/60',
              p===page ? 'bg-[#b9f1cf] text-[#0a1f14] font-semibold' : 'bg-[#1e2623] text-white'
            ]"
          >
            {{ p }}
          </button>
        </div>
        <div class="flex items-center gap-2 md:ml-auto">
          <button @click="changePage(page+1)" :disabled="page===totalPages" class="px-3 py-1 rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/50 text-white disabled:opacity-50">بعدی</button>
          <button @click="changePage(totalPages)" :disabled="page===totalPages" class="px-3 py-1 rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/50 text-white disabled:opacity-50">آخر</button>
        </div>
      </div>

      <div v-if="!paginated.length && !loading" class="mt-8 rounded-2xl bg-[#141a1e] ring-1 ring-[#334D44]/60 p-10 text-center text-white/70">
        موردی یافت نشد.
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'

const url = process.env.VUE_APP_API_URL || ''
const pageSizes = [5, 10, 20, 50]

const user = ref({ gold: 0, toman: 0 })
const loading = ref(false)
const items = ref([])

const q = ref('')
const page = ref(1)
const pageSize = ref(10)
const sortKey = ref('date')
const sortDir = ref('desc')
const typeorder = ref('') // '', 'buy', 'sell'

const chips = ref([]) // 'today' | '7d' | '30d' | 'highPrice'

function chipActive(k){ return chips.value.includes(k) }
function toggleChip(k){
  chips.value = chipActive(k) ? chips.value.filter(x => x!==k) : [...chips.value, k]
}

function fmtDate(d){
  if(!d) return '—'
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return '—'
  return dt.toLocaleDateString('fa-IR')
}
function formatMoney(n){
  if(!isFinite(n)) return '۰'
  return new Intl.NumberFormat('fa-IR').format(Math.round(Number(n)))
}
function formatWeight(n){
  if(!isFinite(n)) return '۰.۰۰'
  const v = Number(n)
  const s = v.toLocaleString('fa-IR', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
  if (s.endsWith('٫000') || s.endsWith('.000')) return Number(v).toLocaleString('fa-IR')
  return s
}
function normalizeOrder(o){
  const product = o.goldid || o.product || o.productData || o.item || {}
  return {
    _id: o._id || o.id || (product && product._id) || Math.random().toString(36).slice(2,9),
    img: product.img || product.image || product.img1 || '',
    title: product.title || product.name || o.title || 'بدون عنوان',
    type: product.type || product.category || o.type || 'نامشخص',
    weight: product.weightGram ?? product.weight ?? o.weightGram ?? o.weight ?? 0,
    price: o.price ?? product.price ?? o.priceReal ?? 0,
    typeorder: o.typeorder || '—',
    date: o.date || o.createdAt || o.time || null
  }
}
const normalized = computed(() => items.value.map(normalizeOrder))

const filtered = computed(() => {
  const search = (q.value || '').toString().trim().toLowerCase()
  let list = normalized.value.slice()

  if (search) {
    list = list.filter(i =>
      (i.title || '').toString().toLowerCase().includes(search) ||
      (i.type || '').toString().toLowerCase().includes(search) ||
      (i.typeorder || '').toString().toLowerCase().includes(search) ||
      fmtDate(i.date).toString().toLowerCase().includes(search)
    )
  }

  if (typeorder.value) {
    list = list.filter(i => (i.typeorder || '').toLowerCase() === typeorder.value)
  }

  const now = new Date()
  if (chipActive('today')) {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    list = list.filter(i => i.date && new Date(i.date) >= start)
  }
  if (chipActive('7d')) {
    const start = new Date(now); start.setDate(start.getDate() - 7)
    list = list.filter(i => i.date && new Date(i.date) >= start)
  }
  if (chipActive('30d')) {
    const start = new Date(now); start.setDate(start.getDate() - 30)
    list = list.filter(i => i.date && new Date(i.date) >= start)
  }
  if (chipActive('highPrice')) {
    list = list.filter(i => Number(i.price || 0) >= 10_000_000)
  }

  list.sort((a,b) => {
    const dir = sortDir.value === 'asc' ? 1 : -1
    if (sortKey.value === 'date'){
      const av = a.date ? new Date(a.date).getTime() : 0
      const bv = b.date ? new Date(b.date).getTime() : 0
      return (av - bv) * dir
    }
    if (sortKey.value === 'price'){
      return (Number(a.price||0) - Number(b.price||0)) * dir
    }
    if (sortKey.value === 'weight'){
      return (Number(a.weight||0) - Number(b.weight||0)) * dir
    }
    const at = (a.title||'').toString()
    const bt = (b.title||'').toString()
    return at.localeCompare(bt, 'fa') * dir
  })

  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)))
const pages = computed(() => {
  const arr = []
  const start = Math.max(1, page.value - 3)
  const end = Math.min(totalPages.value, start + 6)
  for (let i = start; i <= end; i++) arr.push(i)
  return arr
})
const paginated = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

const totalBuy = computed(() =>
  filtered.value.filter(x => x.typeorder === 'buy').reduce((s, x) => s + (Number(x.price)||0), 0)
)
const totalSell = computed(() =>
  filtered.value.filter(x => x.typeorder === 'sell').reduce((s, x) => s + (Number(x.price)||0), 0)
)

function changePage(p){
  if (p < 1) p = 1
  if (p > totalPages.value) p = totalPages.value
  page.value = p
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function itemImg(i){ return i.img || '/placeholder.png' }
function itemTitle(i){ return i.title || 'بدون عنوان' }
function itemType(i){ return i.type || 'نامشخص' }
function itemWeight(i){ return Number(i.weight) || 0 }
function itemPrice(i){ return Number(i.price) || 0 }
function itemOrderLabel(i){
  if(!i || !i.typeorder) return '—'
  if(i.typeorder === 'buy') return 'خرید'
  if(i.typeorder === 'sell') return 'فروش'
  return i.typeorder
}

async function loadProfile(){
  const res = await axios.get(`${url}/user/profile`)
  user.value = res.data.user || user.value
}
async function loadAssets(){
  loading.value = true
  try{
    const res = await axios.get(`${url}/user/assets`)
    items.value = res.data?.data || []
    page.value = 1
  } finally {
    loading.value = false
  }
}

function exportCsv(){
  const rows = [
    ['عنوان','نوع','وزن(گرم)','قیمت(تومان)','نوع سفارش','تاریخ']
  ]
  filtered.value.forEach(i => {
    rows.push([
      itemTitle(i),
      itemType(i),
      String(itemWeight(i)),
      String(itemPrice(i)),
      itemOrderLabel(i),
      fmtDate(i.date)
    ])
  })
  const csv = rows.map(r => r.map(cell =>
    /[",\n]/.test(cell) ? `"${String(cell).replace(/"/g,'""')}"` : cell
  ).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const urlBlob = URL.createObjectURL(blob)
  link.setAttribute('href', urlBlob)
  link.setAttribute('download', 'assets.csv')
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(urlBlob)
}

watch([q, pageSize, sortKey, sortDir, typeorder, chips], () => { page.value = 1 })

onMounted(async () => {
  await Promise.all([loadProfile(), loadAssets()])
})
</script>

<style scoped></style>
