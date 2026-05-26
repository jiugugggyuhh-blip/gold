<template>
  <div class="pb-20">
    <div class="max-w-7xl mx-auto p-4">
      <div v-if="loading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="i in 8" :key="i" class="rounded-2xl p-4 bg-[#141a1e] ring-1 ring-[#334D44]/50 animate-pulse">
          <div class="h-36 rounded bg-[#1e2623] ring-1 ring-[#334D44]/40 mb-3"></div>
          <div class="h-4 bg-white/10 rounded w-2/3 mb-2"></div>
          <div class="h-4 bg-white/10 rounded w-1/2 mb-2"></div>
          <div class="h-4 bg-white/10 rounded w-1/3"></div>
        </div>
      </div>

      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="p in paginated" :key="p._id"
             class="rounded-2xl p-4 flex flex-col bg-[#141a1e] ring-1 ring-[#334D44]/50 text-white hover:ring-[#3d5b50]/70 transition">
          <div class="relative">
            <img :src="p.img || placeholder" alt=""
                 class="h-36 w-full object-contain mx-auto mb-3 rounded bg-[#1e2623] ring-1 ring-[#334D44]/40">
            <div class="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full ring-1"
                 :class="p.status ? 'bg-emerald-400/15 ring-emerald-300/40 text-emerald-200' : 'bg-yellow-300/15 ring-yellow-300/40 text-yellow-200'">
              {{ p.status ? 'فعال' : 'غیرفعال' }}
            </div>
          </div>

          <div class="flex-1 text-right">
            <h3 class="text-base font-semibold line-clamp-1">{{ p.title }}</h3>
            <div class="mt-3 grid grid-cols-2 gap-2 text-xs text-white/80">
              <div class="rounded-lg bg-[#1e2623] ring-1 ring-[#334D44]/40 p-2">
                <div class="text-white/50">وزن (گرم)</div>
                <div class="font-medium">{{ p.weightGram ?? '-' }}</div>
              </div>
              <div class="rounded-lg bg-[#1e2623] ring-1 ring-[#334D44]/40 p-2">
                <div class="text-white/50">وزن (سوت)</div>
                <div class="font-medium">{{ p.weightSot ?? '-' }}</div>
              </div>
            </div>
            <div class="mt-3">
              <div class="text-xs text-white/60">قیمت تقریبی خرید</div>
              <div class="mt-1 text-lg font-bold text-[#b9f1cf]">{{ priceDisplay(p) }}</div>
            </div>
          </div>

          <div class="mt-4 flex gap-2">
            <button @click="openQuickOrder(p)" :disabled="!p.status"
                    class="flex-1 px-3 py-2 rounded-full bg-[#b9f1cf] text-[#0a1f14] font-semibold hover:brightness-95 disabled:opacity-60">
              ثبت سفارش خرید
            </button>
            <button @click="openDetails(p)"
                    class="px-3 py-2 rounded-full bg-[#1e2623] text-white hover:bg-[#22302b] ring-1 ring-[#334D44]/60">
              جزئیات
            </button>
          </div>
        </div>
      </div>

      <div class="mt-6 flex items-center justify-center gap-2 flex-wrap">
        <button @click="prevPage" :disabled="currentPage === 1"
                class="px-3 py-1 rounded bg-[#1e2623] text-white ring-1 ring-[#334D44]/60 disabled:opacity-50">قبلی</button>
        <button v-for="p in pagesToShow" :key="p" @click="goToPage(p)"
                :class="['px-3 py-1 rounded ring-1 ring-[#334D44]/60',
                         currentPage === p ? 'bg-[#b9f1cf] text-[#0a1f14]' : 'bg-[#141a1e] text-white']">
          {{ p }}
        </button>
        <button @click="nextPage" :disabled="currentPage === totalPages"
                class="px-3 py-1 rounded bg-[#1e2623] text-white ring-1 ring-[#334D44]/60 disabled:opacity-50">بعدی</button>
      </div>

      <div class="mt-3 text-center text-white/60">
        نمایش {{ paginated.length }} از {{ filtered.length }} محصول — صفحه {{ currentPage }} از {{ totalPages }}
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="bg-[#141a1e] text-white rounded-2xl w-full max-w-2xl p-0 ring-1 ring-[#334D44]/60 overflow-hidden">
        <div class="grid grid-cols-12 gap-0">
          <div class="col-span-12 md:col-span-5 p-6 border-b md:border-b-0 md:border-l border-[#334D44]/40">
            <img :src="modalProduct.img || placeholder"
                 class="w-full h-44 object-contain rounded bg-[#1e2623] ring-1 ring-[#334D44]/40">
            <div class="mt-4 space-y-2 text-sm text-white/80">
              <div>نوع: <span class="font-medium">{{ modalProduct.type }}</span></div>
              <div>وزن (گرم): <span class="font-medium">{{ modalProduct.weightGram }}</span></div>
              <div>وزن (سوت): <span class="font-medium">{{ modalProduct.weightSot }}</span></div>
            </div>
          </div>
          <div class="col-span-12 md:col-span-7 p-6">
            <h3 class="text-lg font-semibold">{{ modalProduct.title }}</h3>
            <p class="text-sm text-white/70 mt-2 leading-7 break-words">{{ modalProduct.description }}</p>

            <div class="mt-4 rounded-xl p-4 bg-[#1e2623] ring-1 ring-[#334D44]/40">
              <div class="text-sm text-white/70">جزئیات قیمت</div>
              <div class="mt-2 text-sm space-y-1">
                <div>قیمت پایه: <span class="font-medium">{{ productBasePriceDisplay }}</span></div>
                <div>کارمزد: <span class="font-medium">{{ productFeeDisplay }}</span></div>
                <div class="pt-2 font-bold text-lg">قیمت نهایی خرید: <span class="text-[#b9f1cf]">{{ productTotalDisplay }}</span></div>
              </div>
            </div>

            <div class="mt-5 flex gap-2">
              <button @click="confirmOrder(modalProduct)"
                      class="flex-1 px-4 py-2 rounded-full bg-[#b9f1cf] text-[#0a1f14] font-semibold hover:brightness-95">
                تایید و رفتن به سفارش
              </button>
              <button @click="closeModal"
                      class="px-4 py-2 rounded-full bg-[#1e2623] text-white ring-1 ring-[#334D44]/60 hover:bg-[#22302b]">
                بستن
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { io } from 'socket.io-client'

const url = process.env.VUE_APP_API_URL || ''
const WS_URL = process.env.VUE_APP_API_WS || ''
const router = useRouter()

const products = ref([])
const loading = ref(false)
const search = ref('')
const itemsPerPage = ref(12)
const currentPage = ref(1)

const showModal = ref(false)
const modalProduct = ref({})
const placeholder = '/images/placeholder.png'

const item = ref(null)
const buyFeePercent = ref(1.5)
const sellFeePercent = ref(0.9)

const goldPrice = ref(null)
let socket = null

function parsePrice(v) {
  if (v == null) return null
  if (typeof v === 'number' && Number.isFinite(v)) return v
  let s = String(v).trim()
  const p = '۰۱۲۳۴۵۶۷۸۹', a = '٠١٢٣٤٥٦٧٨٩'
  s = s.replace(/[۰-۹]/g, ch => p.indexOf(ch)).replace(/[٠-٩]/g, ch => a.indexOf(ch))
       .replace(/\u066B/g, '.').replace(/\u066C/g, '').replace(/[,٬\s\u00A0\u200C\u200B\u200D]+/g, '')
       .replace(/تومان|تومانی/gi, '').replace(/[^\d.-]/g, '')
  const n = parseFloat(s)
  return Number.isFinite(n) ? n : null
}

async function fetchSetting() {
  try {
    if (!url) return
    const res = await axios.get(`${url}/admin/setting`)
    item.value = res.data.data || null
    if (item.value) {
      buyFeePercent.value = Number(item.value.feebuy) || buyFeePercent.value
      sellFeePercent.value = Number(item.value.feesell) || sellFeePercent.value
    }
  } catch (e) {
    console.error('fetchSetting', e)
  }
}

function openSocket() {
  try {
    socket = io(WS_URL, { path: '/socket.io', transports: ['websocket'], withCredentials: true })
  } catch (e) {
    console.error('socket init', e)
    return
  }
  socket.on('goldData', (payload = {}) => {
    try {
      const row = (payload.items || []).find(i =>
        (i.name || '').includes('طلای 18 عیار') || (i.name || '').includes('گرم طلای 18 عیار')
      )
      if (row?.price != null) {
        const p = parsePrice(row.price)
        if (p !== null) goldPrice.value = p
      }
    } catch (e) {
      console.error('goldData handler', e)
    }
  })
}

async function fetchProducts() {
  loading.value = true
  try {
    const res = await axios.get(`${url}/products`)
    products.value = res.data?.data || res.data || []
  } catch (e) {
    console.error('fetchProducts', e)
    products.value = []
  } finally {
    loading.value = false
  }
}

const filtered = computed(() => {
  const q = String(search.value || '').trim().toLowerCase()
  if (!q) return products.value
  return products.value.filter(p =>
    (p.title || '').toLowerCase().includes(q) ||
    (p.type || '').toLowerCase().includes(q) ||
    String(p.weightGram || '').includes(q) ||
    String(p.weightSot || '').includes(q)
  )
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / itemsPerPage.value)))
const paginated = computed(() => filtered.value.slice((currentPage.value - 1) * itemsPerPage.value, currentPage.value * itemsPerPage.value))

function goToPage(n){ currentPage.value = Math.min(Math.max(1, Number(n||1)), totalPages.value); window.scrollTo({top:0,behavior:'smooth'}) }
function prevPage(){ if(currentPage.value>1) goToPage(currentPage.value-1) }
function nextPage(){ if(currentPage.value<totalPages.value) goToPage(currentPage.value+1) }

const pagesToShow = computed(() => {
  const t=totalPages.value,c=currentPage.value,d=2,arr=[]
  for(let i=Math.max(1,c-d); i<=Math.min(t,c+d); i++) arr.push(i)
  if(arr[0]!==1) arr.unshift(1)
  if(arr[arr.length-1]!==t) arr.push(t)
  return arr
})

const numericGoldPrice = computed(() => Number(goldPrice.value) || 0)
const productBasePrice = computed(() => {
  const p = modalProduct.value || {}
  const g = p.weightGram ?? (p.weightSot ? Number(p.weightSot) * 0.001 : 0)
  return (!g || !numericGoldPrice.value) ? 0 : g * numericGoldPrice.value
})
const productFee = computed(() => productBasePrice.value * ((Number(buyFeePercent.value) || 0) / 100))
const productTotal = computed(() => productBasePrice.value + productFee.value)
const fmt = n => new Intl.NumberFormat('fa-IR').format(Math.round(n))
const productBasePriceDisplay = computed(() => productBasePrice.value ? fmt(productBasePrice.value) + ' تومان' : '—')
const productFeeDisplay = computed(() => productFee.value ? fmt(productFee.value) + ' تومان' : '—')
const productTotalDisplay = computed(() => productTotal.value ? fmt(productTotal.value) + ' تومان' : '—')

function priceDisplay(p){
  const g = p.weightGram ?? (p.weightSot ? Number(p.weightSot) * 0.001 : 0)
  if(!g || !numericGoldPrice.value) return '—'
  const base = g * numericGoldPrice.value
  const fee = base * ((Number(buyFeePercent.value)||0)/100)
  return fmt(base+fee) + ' تومان'
}

function requireLoginRedirect(target){
  const tk = localStorage.getItem('token')
  if(!tk){
    Swal.fire({ title:'برای ادامه باید وارد شوید', text:'برای ثبت سفارش ابتدا وارد حساب شوید.', icon:'warning', showCancelButton:true, confirmButtonText:'ورود / ثبت‌نام', cancelButtonText:'انصراف' })
      .then(r => { if(r.isConfirmed) router.push({ path:'/login' }) })
    return false
  }
  router.push({ path:'/user', query:{ fromProduct: modalProduct.value?._id || '', action: target } })
  return true
}
function openDetails(p){ modalProduct.value = p; showModal.value = true }
function openQuickOrder(p){ modalProduct.value = p; showModal.value = true }
function closeModal(){ showModal.value = false; modalProduct.value = {} }
function confirmOrder(){ closeModal(); requireLoginRedirect('buy') }

onMounted(() => { fetchProducts(); fetchSetting(); openSocket() })
</script>


<style scoped></style>
