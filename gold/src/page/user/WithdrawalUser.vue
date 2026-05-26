<template>
  <div class="min-h-screen max-w-7xl overflow-auto px-3 sm:px-6 lg:px-8 py-4">
    <!-- KPI cards -->
    <div class="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
      <div class="rounded-2xl bg-gradient-to-br from-[#1b2421] to-[#141a1e] ring-1 ring-[#334D44]/60 p-4 text-white">
        <div class="flex items-center justify-between">
          <span class="text-xs text-white/70">موجودی طلا</span>
          <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/30">Au</span>
        </div>
        <div class="mt-2 text-lg font-extrabold">{{ formatWeight(user.gold) }} میلی‌گرم</div>
      </div>
      <div class="rounded-2xl bg-gradient-to-br from-[#1c2024] to-[#141a1e] ring-1 ring-[#334D44]/60 p-4 text-white">
        <div class="flex items-center justify-between">
          <span class="text-xs text-white/70">موجودی تومان</span>
          <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/15 ring-1 ring-amber-400/30">﷼</span>
        </div>
        <div class="mt-2 text-lg font-extrabold">{{ formatMoney(user.toman) }} تومان</div>
      </div>
    </div>

    <!-- Main content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
      <!-- Withdraw form -->
      <div class="lg:col-span-2 rounded-2xl bg-[#141a1e] ring-1 ring-[#334D44]/60 p-4 sm:p-6 text-white">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-extrabold">برداشت پول</h2>
          <span v-if="submitting" class="inline-flex items-center gap-2 text-xs text-white/70">
            <span class="h-3 w-3 animate-ping rounded-full bg-emerald-400/80"></span> در حال پردازش
          </span>
        </div>

        <div class="mt-4 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-400/40 p-4">
          <div class="flex items-start justify-between gap-3">
            <div class="space-y-1">
              <div class="font-bold text-emerald-100">توجه</div>
              <p class="text-xs sm:text-sm text-emerald-200/90">حداقل مبلغ برداشت ۱۰۰٬۰۰۰ تومان است و تنها به کارت‌های تأییدشده شما واریز می‌شود.</p>
            </div>
            <div class="h-8 w-8 rounded-full grid place-items-center bg-emerald-400/15 ring-1 ring-emerald-300/30 text-emerald-200">i</div>
          </div>
        </div>

        <form class="mt-6 space-y-6" @submit.prevent="submitWithdraw">
          <!-- Amount -->
          <div>
            <label class="mb-2 block text-white/90">مبلغ برداشت (تومان)</label>
            <div class="flex gap-2">
              <input
                v-model.number="amount"
                type="number"
                inputmode="numeric"
                min="100000"
                step="1000"
                placeholder="مثلاً ۲٬۰۰۰٬۰۰۰"
                class="w-full rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/50 px-3 py-2 placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button type="button" @click="amount = chipClamp(100000)" class="px-3 py-2 rounded-xl bg-[#242728] ring-1 ring-[#334D44]/60 hover:bg-[#28312d]">۱۰۰k</button>
              <button type="button" @click="amount = chipClamp(500000)" class="px-3 py-2 rounded-xl bg-[#242728] ring-1 ring-[#334D44]/60 hover:bg-[#28312d]">۵۰۰k</button>
            </div>
            <div class="mt-2 flex flex-wrap gap-2">
              <button type="button" @click="amount = chipClamp(1000000)" class="text-xs rounded-full px-3 py-1 bg-white/5 ring-1 ring-[#334D44]/40 hover:bg-white/10">۱M</button>
              <button type="button" @click="amount = chipClamp(5000000)" class="text-xs rounded-full px-3 py-1 bg-white/5 ring-1 ring-[#334D44]/40 hover:bg-white/10">۵M</button>
              <button type="button" @click="amount = Math.max(100000, Math.floor(user.toman))" class="text-xs rounded-full px-3 py-1 bg-white/5 ring-1 ring-[#334D44]/40 hover:bg-white/10">کل موجودی</button>
            </div>
          </div>

          <!-- Card picker -->
          <div>
            <label class="mb-2 block text-white/90">انتخاب کارت (تأییدشده)</label>
            <div v-if="approvedCards.length" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                v-for="c in approvedCards"
                :key="c._id"
                type="button"
                @click="selectedCardId = c._id"
                :class="[
                  'w-full text-left rounded-xl px-3 py-3 ring-1 transition',
                  selectedCardId === c._id
                    ? 'bg-[#b9f1cf] text-[#0a1f14] ring-emerald-500'
                    : 'bg-[#1e2623] text-white ring-[#334D44]/50 hover:bg-[#22302b]'
                ]"
              >
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 rounded-xl grid place-items-center"
                       :class="selectedCardId === c._id ? 'bg-emerald-900/10 ring-1 ring-emerald-400/40' : 'bg-white/5 ring-1 ring-white/10'">
                    {{ bankInitial(detectBankName(c.card)) }}
                  </div>
                  <div class="space-y-0.5">
                    <div class="text-sm font-bold leading-5">{{ formatStoredCard(c.card) }}</div>
                    <div class="text-xs opacity-80">{{ detectBankName(c.card) }}</div>
                  </div>
                  <div class="mr-auto">
                    <span class="text-[10px] rounded-full px-2 py-0.5"
                          :class="selectedCardId === c._id ? 'bg-emerald-900/10 ring-1 ring-emerald-400/40' : 'bg-white/5 ring-1 ring-white/10'">
                      تأیید شده
                    </span>
                  </div>
                </div>
              </button>
            </div>
            <div v-else class="rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/50 px-3 py-3 text-white/70">
              هیچ کارت تأییدشده‌ای ثبت نشده است.
            </div>
          </div>

          <!-- Action row -->
          <div class="flex flex-col sm:flex-row gap-2">
            <button
              type="submit"
              :disabled="submitting"
              class="flex-1 rounded-xl px-4 py-2 bg-[#b9f1cf] text-[#0a1f14] font-semibold hover:brightness-95 disabled:opacity-60"
            >
              {{ submitting ? 'در حال ثبت...' : 'ثبت برداشت' }}
            </button>
            <button type="button" @click="refreshAll" class="rounded-xl px-4 py-2 bg-[#242728] ring-1 ring-[#334D44]/60 text-white hover:bg-[#28312d]">
              بروزرسانی
            </button>
          </div>
        </form>
      </div>

      <!-- Summary / History -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Summary -->
        <div class="rounded-2xl bg-[#141a1e] ring-1 ring-[#334D44]/60 p-4 sm:p-6 text-white">
          <h3 class="text-base font-extrabold">خلاصه درخواست</h3>
          <div class="mt-4 space-y-3 text-sm">
            <div class="flex items-center justify-between border-b border-white/10 pb-3">
              <span class="text-white/70">مبلغ برداشت</span>
              <span class="font-bold">{{ amount ? formatMoney(amount) : '—' }} تومان</span>
            </div>
            <div class="flex items-center justify-between border-b border-white/10 pb-3">
              <span class="text-white/70">کارت مقصد</span>
              <span class="font-bold truncate max-w-[160px] text-right">{{ pickedCardMasked || '—' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-white/70">مانده پس از برداشت (تقریبی)</span>
              <span class="font-bold">{{ remainAfter ? formatMoney(remainAfter) : '—' }} تومان</span>
            </div>
          </div>
        </div>

        <!-- History -->
        <div class="rounded-2xl bg-[#141a1e] ring-1 ring-[#334D44]/60 p-4 sm:p-6">
          <div class="flex items-center justify-between gap-2">
            <h3 class="text-base font-extrabold text-white">لیست برداشت‌ها</h3>
            <div class="flex items-center gap-2">
              <input
                v-model="search"
                placeholder="جستجو مبلغ/وضعیت"
                class="rounded-lg bg-[#1e2623] ring-1 ring-[#334D44]/50 px-3 py-1.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <select
                v-model.number="itemsPerPage"
                class="rounded-lg bg-[#1e2623] ring-1 ring-[#334D44]/50 px-2 py-1.5 text-white focus:outline-none"
              >
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="20">20</option>
              </select>
            </div>
          </div>

          <div v-if="loadingWithdrawals" class="py-8 text-center text-white/70">در حال بارگذاری...</div>

          <div v-else>
            <div v-if="filteredWithdrawals.length===0" class="py-10 text-center text-white/60">موردی یافت نشد.</div>

            <ul v-else class="mt-4 space-y-2">
              <li
                v-for="w in paginatedWithdrawals"
                :key="w._id"
                class="rounded-xl bg-[#1e2623] ring-1 ring-[#334D44]/40 p-3 text-white"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="space-y-0.5">
                    <div class="text-sm font-bold">{{ formatMoney(w.amount) }} تومان</div>
                    <div class="text-xs text-white/70">{{ formatDate(w.createdAt) }}</div>
                    <div class="text-xs text-white/80">{{ formatStoredCard(w.cardValue || w.cardMask || w.card || '') }}</div>
                  </div>
                  <span
                    :class="w.status ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30' : 'bg-yellow-500/15 text-yellow-300 ring-1 ring-yellow-400/30'"
                    class="inline-flex h-7 items-center rounded-full px-3 text-xs"
                  >
                    {{ w.status ? 'پرداخت شده' : 'در انتظار' }}
                  </span>
                </div>
              </li>
            </ul>

            <!-- Pagination -->
            <div class="mt-4 flex items-center justify-between text-white/70 text-xs">
              <div>نمایش {{ startItem }} - {{ endItem }} از {{ filteredWithdrawals.length }}</div>
              <div class="flex items-center gap-1">
                <button @click="changePage(currentPage-1)" :disabled="currentPage===1" class="px-2 py-1 rounded bg-[#1e2623] ring-1 ring-[#334D44]/50 disabled:opacity-50">قبلی</button>
                <button
                  v-for="(p,i) in pagesToShow"
                  :key="i"
                  @click="changePage(p)"
                  :class="['px-2 py-1 rounded ring-1 ring-[#334D44]/50',
                           currentPage===p ? 'bg-[#b9f1cf] text-[#0a1f14] font-semibold' : 'bg-[#1e2623] text-white']"
                >{{ p }}</button>
                <button @click="changePage(currentPage+1)" :disabled="currentPage===totalPages" class="px-2 py-1 rounded bg-[#1e2623] ring-1 ring-[#334D44]/50 disabled:opacity-50">بعدی</button>
              </div>
            </div>
          </div>
        </div>
      </div> <!-- /summary & history -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

const url = process.env.VUE_APP_API_URL || ''
const token = localStorage.getItem('token')
if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

const user = ref({ gold: 0, toman: 0 })
const userLoaded = ref(false)

const amount = ref(null)
const selectedCardId = ref('')
const submitting = ref(false)

const cards = ref([])
const withdrawals = ref([])

const loadingWithdrawals = ref(true)
const loadingCards = ref(true)

const search = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

/* helpers */
function onlyDigits(s){ return String(s || '').replace(/\D/g, '') }
function formatStoredCard(storedCard){
  const d = onlyDigits(storedCard)
  if (!d) return '-'
  return d.replace(/^(\d{4})(\d{4})(\d{4})(\d{4})$/, '$1-$2-$3-$4')
}
function formatMoney(n){
  if (!isFinite(n)) return '۰'
  return new Intl.NumberFormat('fa-IR').format(Math.round(Number(n)))
}
function formatWeight(n){
  if (!isFinite(n)) return '۰.۰۰'
  const v = Number(n)
  const withTwo = v.toLocaleString('fa-IR', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
  if (withTwo.endsWith('٫000') || withTwo.endsWith('.000')) return Number(v).toLocaleString('fa-IR')
  return withTwo
}
function formatDate(d){
  if (!d) return '—'
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return d
  return dt.toLocaleString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}
function detectBankName(storedCard){
  const d = onlyDigits(storedCard)
  if (d.length < 6) return 'نامشخص'
  const bin = d.slice(0, 6)
  const binMap = {
    '603799': 'بانک ملی ایران',
    '589463': 'بانک صادرات ایران',
    '627412': 'بانک ملت',
    '627381': 'بانک پارسیان',
    '502229': 'بانک سامان',
    '639347': 'بانک پاسارگاد',
    '639194': 'بانک رفاه',
    '627353': 'بانک اقتصادنوین',
    '621986': 'بانک کشاورزی',
    '636214': 'بانک آینده'
  }
  return binMap[bin] || 'نامشخص'
}
function bankInitial(name){
  if (!name || name === 'نامشخص') return 'بانک'
  return name.split(' ').slice(0,2).map(s => s[0]).join('')
}
function chipClamp(v){
  return Math.max(100000, Math.min(v, Math.floor(Number(user.value?.toman || 0))))
}

/* derived */
const approvedCards = computed(() => cards.value.filter(c => c.status === true))
const pickedCardMasked = computed(() => {
  const c = approvedCards.value.find(x => x._id === selectedCardId.value)
  return c ? formatStoredCard(c.card) : ''
})
const remainAfter = computed(() => {
  const a = Number(amount.value) || 0
  const t = Number(user.value?.toman || 0)
  if (!a || a > t) return 0
  return t - a
})

/* list filtering & pagination */
const filteredWithdrawals = computed(() => {
  const s = (search.value || '').trim()
  if (!s) return withdrawals.value
  return withdrawals.value.filter(w => {
    const amt = String(w.amount || '')
    const statusTxt = w.status ? 'پرداخت شده' : 'در انتظار'
    return amt.includes(s) || statusTxt.includes(s)
  })
})
const totalPages = computed(() => Math.max(1, Math.ceil(filteredWithdrawals.value.length / itemsPerPage.value)))
const paginatedWithdrawals = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredWithdrawals.value.slice(start, start + itemsPerPage.value)
})
const startItem = computed(() => filteredWithdrawals.value.length ? (currentPage.value - 1) * itemsPerPage.value + 1 : 0)
const endItem = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredWithdrawals.value.length))
const pagesToShow = computed(() => {
  const total = totalPages.value, cur = currentPage.value, delta = 2
  const pages = []
  const start = Math.max(1, cur - delta)
  const end = Math.min(total, cur + delta)
  for (let i = start; i <= end; i++) pages.push(i)
  if (pages[0] > 1) { if (pages[0] > 2) pages.unshift('...'); pages.unshift(1) }
  if (pages[pages.length - 1] < total) { if (pages[pages.length - 1] < total - 1) pages.push('...'); pages.push(total) }
  return pages
})
function changePage(p){
  if (p === '...') return
  if (p < 1) p = 1
  if (p > totalPages.value) p = totalPages.value
  currentPage.value = p
}

/* io */
async function loadProfile(){
  try{
    const res = await axios.get(`${url}/user/profile`)
    user.value = res.data.user || { gold: 0, toman: 0 }
  } finally { userLoaded.value = true }
}
async function fetchCards(){
  loadingCards.value = true
  try{
    const res = await axios.get(`${url}/user/getcard`)
    cards.value = res.data?.data || []
  } finally { loadingCards.value = false }
}
async function fetchWithdrawals(){
  loadingWithdrawals.value = true
  try{
    const res = await axios.get(`${url}/user/list-withdrawal`)
    withdrawals.value = res.data?.data || []
  } finally { loadingWithdrawals.value = false }
}
async function refreshAll(){
  await Promise.all([loadProfile(), fetchCards(), fetchWithdrawals()])
}

/* submit */
async function submitWithdraw(){
  const amt = Number(amount.value)
  if (!amt || isNaN(amt) || amt < 100000){
    await Swal.fire({ toast:true, position:'top-end', icon:'error', title:'حداقل مبلغ ۱۰۰٬۰۰۰ تومان است', showConfirmButton:false, timer:2500 })
    return
  }
  const toman = Number(user.value?.toman || 0)
  if (toman < amt){
    await Swal.fire({ toast:true, position:'top-end', icon:'error', title:'موجودی کافی نیست', showConfirmButton:false, timer:2500 })
    return
  }
  if (!selectedCardId.value){
    await Swal.fire({ toast:true, position:'top-end', icon:'error', title:'یک کارت تأییدشده انتخاب کنید', showConfirmButton:false, timer:2500 })
    return
  }
  submitting.value = true
  try{
    const res = await axios.post(`${url}/user/withdrawal`, { amount: amt, cardId: selectedCardId.value })
    const msg = res.data?.data || 'درخواست برداشت ثبت شد'
    await Swal.fire({ toast:true, position:'top-end', icon:'success', title:msg, showConfirmButton:false, timer:2000 })
    amount.value = null
    selectedCardId.value = ''
    await refreshAll()
  }catch(err){
    const serverMsg = err.response?.data?.data || err.response?.data?.message || err.response?.data || err.message || 'خطا'
    await Swal.fire({ toast:true, position:'top-end', icon:'error', title:String(serverMsg), showConfirmButton:false, timer:3500 })
  }finally{
    submitting.value = false
  }
}

onMounted(async () => {
  await refreshAll()
})
</script>

<style scoped></style>
