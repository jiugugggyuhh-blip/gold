<template>
  <div class="col-span-12 mt-6 md:mt-0 md:col-span-5 bg-[#242728] rounded-2xl shadow-xl p-6 z-20 text-sm ring-1 ring-[#334D44]/60">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-lg font-semibold text-white">ماشین‌حساب سریع</h3>
      <button class="flex items-center gap-2 bg-[#b9f1cf] text-[#0a1f14] px-3 py-1.5 rounded-lg hover:brightness-95 transition">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z"/>
        </svg>
        <span>راهنما</span>
      </button>
    </div>

    <div class="grid gap-4">
      <div class="rounded-lg p-4 bg-[#b9f1cf]/10 text-white">
        <div class="flex items-center justify-between">
          <div class="text-sm text-white/80">قیمت بازار (گرم طلای ۱۸ عیار)</div>
          <div class="text-right">
            <div class="text-xs text-white/50">آخرین بروزرسانی</div>
            <div class="text-sm text-white/80">{{ lastUpdateLabel }}</div>
          </div>
        </div>
        <div class="mt-3 text-center">
          <div class="text-3xl font-extrabold">{{ goldPriceDisplay }} تومان</div>
          <div class="text-sm text-white/60 mt-1">قیمت هر گرم طلای ۱۸ عیار</div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div class="p-4 rounded-lg bg-[#b9f1cf]/10 text-right text-white">
          <div class="text-sm text-white/80">قیمت خرید (برای مشتری)</div>
          <div class="mt-2 font-semibold text-emerald-300">{{ buyPerGram }} تومان / گرم</div>
          <div class="text-xs text-white/60 mt-1">کارمزد: {{ buyFeePercent }}%</div>
        </div>
        <div class="p-4 rounded-lg bg-[#b9f1cf]/10 text-right text-white">
          <div class="text-sm text-white/80">قیمت فروش (خرید از شما)</div>
          <div class="mt-2 font-semibold text-rose-300">{{ sellPerGram }} تومان / گرم</div>
          <div class="text-xs text-white/60 mt-1">کارمزد فروش: {{ sellFeePercent }}%</div>
        </div>
      </div>

      <div class="rounded-lg bg-[#b9f1cf]/10 p-4 text-white flex flex-col gap-3 ring-1 ring-[#334D44]/50">
        <div class="flex items-center justify-between">
          <label class="text-sm">عیار طلا</label>
          <select v-model="form.type" class="bg-[#b9f1cf] text-[#0a1f14] rounded px-2 py-1">
            <option value="18">۱۸ عیار</option>
            <option value="24">۲۴ عیار</option>
          </select>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex-1">
            <label class="text-sm">مقدار (گرم)</label>
            <input v-model.number="form.grams" type="number" min="0" step="0.01"
                   class="w-full mt-1 rounded bg-[#1e2623] px-3 py-2 text-white placeholder-white/40 ring-1 ring-[#334D44] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                   placeholder="مثلاً 1.00" />
          </div>
          <div class="w-44 text-right">
            <div class="text-xs text-white/70">مبلغ تقریبی</div>
            <div class="font-bold text-lg mt-1 text-emerald-200">{{ estimatedPriceDisplay }}</div>
          </div>
        </div>

        <div class="flex gap-2 mt-1">
          <button @click="onBuyClick" class="flex-1 bg-emerald-600 hover:bg-emerald-700 rounded-full py-2 font-semibold">خرید → پنل کاربری</button>
          <button @click="onSellClick" class="flex-1 bg-rose-600 hover:bg-rose-700 rounded-full py-2 font-semibold">فروش → پنل کاربری</button>
        </div>
        <div class="text-xs text-white/80 text-center">
          برای تکمیل سفارش به پنل کاربری منتقل می‌شوید. در پنل موجودی و کارت ثبت‌شده را بررسی و سفارش را نهایی کنید.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import axios from 'axios'

const url = process.env.VUE_APP_API_URL || ''

const buyFeePercent = ref(1.5)
const sellFeePercent = ref(0.9)

const item = ref(null)
async function fetchSetting() {
  try {
    if (!url) return
    const res = await axios.get(`${url}/admin/setting`)
    item.value = res.data.data || null
    if (item.value) {
      buyFeePercent.value = Number(item.value.feebuy) || buyFeePercent.value
      sellFeePercent.value = Number(item.value.feesell) || sellFeePercent.value
    }
  } catch (err) {
    console.error('fetchSetting error:', err)
  }
}

const goldPrice = ref(null)
const lastUpdate = ref(null)
const router = useRouter()
const form = ref({ type: '18', grams: 1 })
let socket = null

// دریافت قیمت طلا از API جدید
async function fetchGoldPrice() {
  try {
    const response = await axios.get(`${url}/prices/current`, { timeout: 10000 })
    if (response.data.success && response.data.data.gold) {
      const gold18k = response.data.data.gold.find(item => item.name.includes('18'))
      if (gold18k) {
        goldPrice.value = parsePrice(gold18k.price)
        lastUpdate.value = new Date()
      }
    }
  } catch (error) {
    console.error('Error fetching gold price:', error)
  }
}

function parsePrice(value) {
  if (value == null) return null
  if (typeof value === 'number' && Number.isFinite(value)) return value
  let s = String(value).trim()
  const persian = '۰۱۲۳۴۵۶۷۸۹'
  s = s.replace(/[۰-۹]/g, ch => persian.indexOf(ch))
  const arabic = '٠١٢٣٤٥٦٧٨٩'
  s = s.replace(/[٠-٩]/g, ch => arabic.indexOf(ch))
  s = s.replace(/\u066B/g, '.').replace(/\u066C/g, '')
  s = s.replace(/[,٬\s\u00A0\u200C\u200B\u200D]+/g, '')
  s = s.replace(/تومان|تومانی/gi, '').replace(/[^\d.-]/g, '')
  const n = parseFloat(s)
  return Number.isFinite(n) ? n : null
}

// حذف WebSocket و استفاده از API
function openSocket() {
  // استفاده از API به جای WebSocket
  fetchGoldPrice()
  // آپدیت هر 60 ثانیه
  setInterval(fetchGoldPrice, 60000)
}

onMounted(() => { openSocket(); fetchSetting() })
onBeforeUnmount(() => { if (socket) socket.disconnect() })

const numericGoldPrice = computed(() => Number(goldPrice.value) || 0)
const goldPriceDisplay = computed(() => numericGoldPrice.value ? new Intl.NumberFormat('fa-IR').format(Math.round(numericGoldPrice.value)) : '—')
const buyPerGram = computed(() => numericGoldPrice.value ? new Intl.NumberFormat('fa-IR').format(Math.round(numericGoldPrice.value * (1 + (Number(buyFeePercent.value)||0)/100))) : '—')
const sellPerGram = computed(() => numericGoldPrice.value ? new Intl.NumberFormat('fa-IR').format(Math.round(numericGoldPrice.value * (1 - (Number(sellFeePercent.value)||0)/100))) : '—')
const lastUpdateLabel = computed(() => lastUpdate.value ? lastUpdate.value.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) : '—')
const estimatedPriceDisplay = computed(() => {
  const g = Number(form.value.grams) || 0
  const base = numericGoldPrice.value * g
  const fee = base * (Number(buyFeePercent.value) / 100)
  const total = base + fee
  return base ? new Intl.NumberFormat('fa-IR').format(Math.round(total)) + ' تومان' : '—'
})

function requireLoginRedirect() {
  const tk = localStorage.getItem('token')
  if (!tk) {
    Swal.fire({ title: 'برای ادامه باید وارد شوید', text: 'برای ثبت سفارش ابتدا وارد حساب شوید.', icon: 'warning', showCancelButton: true, confirmButtonText: 'ورود / ثبت‌نام', cancelButtonText: 'انصراف' })
      .then(r => { if (r.isConfirmed) router.push({ path: '/login' }) })
    return false
  }
  router.push({ path: '/user/gold' })
  return true
}
function onBuyClick() { requireLoginRedirect() }
function onSellClick() { requireLoginRedirect() }
</script>

<style scoped>
@media (max-width: 640px){ .grid-cols-12 { grid-template-columns: repeat(12,minmax(0,1fr)); } }
</style>
