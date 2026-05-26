/* eslint-disable */
<template>
  <div dir="rtl" class="min-h-screen w-full max-w-7xl text-white">
    <!-- App Bar -->
    <header class="mt-4 rounded-2xl bg-gradient-to-b from-[#1a2220]/90 to-[#12181b]/90 ring-1 ring-[#334D44]/60 backdrop-blur-xl shadow-xl p-4">
      <div class="mx-auto max-w-6xl px-4 py-1 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-400/20 ring-1 ring-emerald-300/30 shadow-xl shadow-emerald-500/10">
            <svg class="h-5 w-5 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H15a3.5 3.5 0 0 1 0 7H6"/></svg>
          </span>
          <h1 class="text-sm font-bold text-emerald-200">
            {{ tab === 'card' ? 'واریز کارت‌به‌کارت | کیف پول' : 'پرداخت آنلاین | کیف پول' }}
          </h1>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-7xl py-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
      <!-- Left -->
      <section class="lg:col-span-2">
        <div class="rounded-2xl p-5 bg-white/5 backdrop-blur-xl ring-1 ring-emerald-400/15 shadow-2xl shadow-emerald-500/10">
          <!-- Tabs -->
          <div class="flex items-center gap-2 p-1 rounded-xl bg-white/5 ring-1 ring-emerald-400/15 w-full max-w-md">
            <button type="button" @click="tab='card'"
              :class="['flex-1 rounded-lg px-3 py-2 text-sm font-bold transition', tab==='card' ? 'bg-emerald-300 text-[#052016] ring-1 ring-emerald-200' : 'text-emerald-100 hover:bg-white/5']">
              کارت‌به‌کارت
            </button>
            <button type="button" @click="tab='online'"
              :class="['flex-1 rounded-lg px-3 py-2 text-sm font-bold transition', tab==='online' ? 'bg-emerald-300 text-[#052016] ring-1 ring-emerald-200' : 'text-emerald-100 hover:bg-white/5']">
              پرداخت آنلاین
            </button>
          </div>

          <!-- توضیح -->
          <div class="mt-4">
            <h2 class="text-lg font-extrabold" v-if="tab==='card'">شارژ کیف پول با کارت‌به‌کارت</h2>
            <h2 class="text-lg font-extrabold" v-else>شارژ کیف پول با پرداخت اینترنتی</h2>
            <p class="mt-1 text-sm text-emerald-200/80" v-if="tab==='card'">مبلغ را وارد کنید، تصویر رسید را آپلود کنید و ثبت را بزنید.</p>
            <p class="mt-1 text-sm text-emerald-200/80" v-else>مبلغ را وارد کنید و به درگاه پرداخت منتقل شوید.</p>
          </div>

          <!-- Quick amounts -->
          <div class="mt-5 grid grid-cols-4 gap-2">
            <button v-for="q in quickAmounts" :key="q" type="button"
              @click="amount = q; amountInput = formatMoney(q)"
              :class="['rounded-xl px-3 py-2 text-sm ring-1 transition', amount===q ? 'bg-emerald-400 text-[#062017] ring-emerald-300' : 'bg-white/5 text-emerald-100 ring-emerald-300/20 hover:bg-white/10']">
              {{ formatMoney(q) }}
            </button>
          </div>

          <!-- CARD-TO-CARD -->
          <form v-if="tab==='card'" class="mt-5 space-y-5" @submit.prevent="submitCard">
            <div>
              <label class="mb-2 block text-sm text-emerald-100">مبلغ (تومان)</label>
              <div class="relative">
                <input
                  v-model="amountInput"
                  @input="onAmountInput"
                  inputmode="numeric"
                  autocomplete="off"
                  placeholder="مثلاً ۱۰۰٬۰۰۰"
                  class="w-full rounded-2xl bg-[#0e1713]/60 backdrop-blur-xl px-4 py-3 text-base text-white placeholder:text-white/30 ring-1 ring-emerald-400/20 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                />
                <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-emerald-200/70">تومان</span>
              </div>
              <p class="mt-1 text-[11px] text-emerald-200/70">حداقل ۱۰۰٬۰۰۰ و حداکثر {{ formatMoney(maxAmount) }} تومان</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- اطلاعات واریز -->
              <div class="rounded-2xl p-4 bg-gradient-to-br from-emerald-500/15 to-emerald-300/10 ring-1 ring-emerald-400/25">
                <div class="text-xs text-emerald-200/80">اطلاعات واریز</div>
                <div class="mt-2 space-y-3">
                  <!-- Row: Card Number -->
                  <div class="flex items-center justify-between gap-2">
                    <div>
                      <div class="text-[11px] text-emerald-200/70">شماره کارت</div>
                      <div class="font-bold tracking-wider">
                        {{ cardNumber ? formatCard(cardNumber) : (settingsLoading ? 'در حال بارگذاری…' : '—') }}
                      </div>
                    </div>
                    <button type="button"
                            @click="copyToClipboard(cardNumber ? formatCard(cardNumber) : '')"
                            class="rounded-lg px-3 py-1.5 text-xs bg-white/10 ring-1 ring-emerald-400/20 hover:bg-white/15">
                      کپی
                    </button>
                  </div>

                  <!-- Row: Owner Name -->
                  <div class="flex items-center justify-between gap-2">
                    <div>
                      <div class="text-[11px] text-emerald-200/70">به نام</div>
                      <div class="font-bold tracking-wider">{{ cardOwner || '—' }}</div>
                    </div>
                    <button type="button"
                            @click="copyToClipboard(cardOwner || '')"
                            class="rounded-lg px-3 py-1.5 text-xs bg-white/10 ring-1 ring-emerald-400/20 hover:bg-white/15">
                      کپی
                    </button>
                  </div>
                </div>

                <p class="mt-3 text-[11px] text-emerald-200/70">پس از کارت‌به‌کارت، لطفاً تصویر رسید را بارگذاری کنید.</p>
              </div>

              <!-- آپلود رسید -->
              <div class="rounded-2xl p-4 bg-white/5 ring-1 ring-emerald-400/20">
                <div class="text-xs text-emerald-200/80 mb-2">تصویر رسید کارت‌به‌کارت</div>
                <label for="upload" @dragover.prevent @drop.prevent="onDrop"
                  class="group flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-400/30 bg-emerald-400/5 p-5 text-center transition hover:bg-emerald-400/10 cursor-pointer">
                  <svg class="h-7 w-7 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  <div class="text-sm">برای آپلود بکشید و رها کنید یا کلیک کنید</div>
                  <div class="text-[11px] text-emerald-200/70">PNG, JPG تا ۵ مگابایت</div>
                  <input id="upload" type="file" accept="image/*" class="hidden" @change="onFileChange" />
                </label>

                <div v-if="file" class="mt-3 flex items-center justify-between rounded-xl bg-white/5 p-2 ring-1 ring-emerald-400/20">
                  <div class="flex items-center gap-3 overflow-hidden">
                    <img :src="filePreview" alt="رسید" class="h-12 w-12 rounded-lg object-cover ring-1 ring-emerald-400/20" />
                    <div class="min-w-0">
                      <p class="truncate text-sm">{{ file.name }}</p>
                      <p class="text-[11px] text-emerald-200/70">{{ prettyBytes(file.size) }}</p>
                    </div>
                  </div>
                  <button type="button" @click="clearFile" class="rounded-lg px-3 py-1.5 text-xs bg-white/10 ring-1 ring-emerald-400/20 hover:bg-white/15">حذف</button>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between gap-3">
              <p class="text-[11px] text-emerald-200/70">پس از بررسی، مبلغ به کیف پول شما افزوده می‌شود.</p>
              <button type="submit" :disabled="busy" class="inline-flex items-center gap-2 rounded-2xl bg-emerald-300 text-[#052016] px-5 py-3 font-bold ring-1 ring-emerald-200 shadow-xl shadow-emerald-500/20 hover:brightness-95 disabled:opacity-60">
                <svg v-if="busy" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                <span>{{ busy ? 'در حال ثبت…' : 'ثبت درخواست واریز' }}</span>
              </button>
            </div>
          </form>

          <!-- ONLINE -->
          <form v-else class="mt-5 space-y-5" @submit.prevent="submitOnline">
            <div>
              <label class="mb-2 block text-sm text-emerald-100">مبلغ (تومان)</label>
              <div class="relative">
                <input
                  v-model="amountInput"
                  @input="onAmountInput"
                  inputmode="numeric"
                  autocomplete="off"
                  placeholder="مثلاً ۱۰۰٬۰۰۰"
                  class="w-full rounded-2xl bg-[#0e1713]/60 backdrop-blur-xl px-4 py-3 text-base text-white placeholder:text-white/30 ring-1 ring-emerald-400/20 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                />
                <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-emerald-200/70">تومان</span>
              </div>
              <p class="mt-1 text-[11px] text-emerald-200/70">حداقل ۱۰۰٬۰۰۰ و حداکثر {{ formatMoney(maxAmount) }} تومان</p>
            </div>

            <div class="rounded-2xl p-4 bg-emerald-400/10 ring-1 ring-emerald-400/25">
              <p class="text-sm">با فشردن دکمهٔ زیر به درگاه پرداخت منتقل می‌شوید.</p>
            </div>

            <div class="flex items-center justify-end">
              <button type="submit" :disabled="busy" class="inline-flex items-center gap-2 rounded-2xl bg-emerald-300 text-[#052016] px-5 py-3 font-bold ring-1 ring-emerald-200 shadow-xl shadow-emerald-500/20 hover:brightness-95 disabled:opacity-60">
                <svg v-if="busy" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                <span>{{ busy ? 'در حال انتقال…' : 'انتقال به درگاه' }}</span>
              </button>
            </div>
          </form>
        </div>

        <!-- نتیجه کارت‌به‌کارت -->
        <div v-if="result && tab==='card'" class="mt-5 rounded-2xl p-4 bg-emerald-400/10 ring-1 ring-emerald-400/25">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm">درخواست شما ثبت شد</p>
              <p class="text-[11px] text-emerald-200/80">کد پیگیری: {{ result.data?.uid }}</p>
            </div>
            <a :href="filePublicUrl(result.data?.img)" target="_blank" v-if="result.data?.img" class="text-xs underline text-emerald-200/90">مشاهده رسید</a>
          </div>
        </div>
      </section>

      <!-- Right -->
      <aside class="space-y-5">
        <div class="rounded-2xl p-5 bg-white/5 backdrop-blur-xl ring-1 ring-emerald-400/15">
          <div class="text-xs text-emerald-200/70 mb-2">کیف پول</div>
          <div class="grid grid-cols-2 gap-2">
            <StatCard label="موجودی طلا" :value="formatWeight(user.gold) + ' میلی‌گرم'" />
            <StatCard label="موجودی تومان" :value="formatMoney(user.toman) + ' تومان'" />
          </div>
        </div>

        <div class="rounded-2xl p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl ring-1 ring-emerald-400/15">
          <div class="text-xs text-emerald-200/70 mb-2">راهنما</div>
          <ol class="space-y-2 text-sm list-decimal list-inside text-emerald-50/90">
            <li>مبلغ را وارد کنید.</li>
            <li v-if="tab==='card'">کارت‌به‌کارت را انجام دهید و رسید را بارگذاری کنید.</li>
            <li v-else>به درگاه پرداخت منتقل شوید و پرداخت را تکمیل کنید.</li>
          </ol>
        </div>
      </aside>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, defineComponent } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

/* Inline components */
const StatCard = defineComponent({
  name: 'StatCard',
  props: { label: String, value: String },
  template: `
    <div class="rounded-xl p-3 bg-white/5 ring-1 ring-emerald-400/20">
      <div class="text-[11px] text-emerald-200/70 mb-1">{{ label }}</div>
      <div class="text-sm font-bold">{{ value }}</div>
    </div>
  `
})

/* Config */
const API = (import.meta.env?.VITE_API_URL || process.env?.VUE_APP_API_URL || '').replace(/\/$/, '')
const token = localStorage.getItem('token')

/* State */
const tab = ref('card') // 'card' | 'online'
const user = ref({ gold: 0, toman: 0 })
const userLoaded = ref(false)
const quickAmounts = ref([100000, 200000, 500000, 1000000])
const amount = ref(null)
const amountInput = ref('')
const maxAmount = 200000000
const file = ref(null)
const filePreview = ref('')
const busy = ref(false)
const result = ref(null)

/* Settings state (from /admin/setting) */
const cardNumber = ref('')
const cardOwner  = ref('')
const settingsLoading = ref(false)

/* Utils */
const faToEn = (s) => (s || '').replace(/[\u06F0-\u06F9]/g, d => String(d.charCodeAt(0) - 1776)).replace(/[\u0660-\u0669]/g, d => String(d.charCodeAt(0) - 1632))
const digitsOnly = (s) => (s || '').replace(/[^0-9]/g, '')
const prettyBytes = (n) => {
  if (!n && n !== 0) return ''
  const u = ['B','KB','MB','GB']; let i = 0; let v = n
  while (v >= 1024 && i < u.length - 1) { v /= 1024; i++ }
  return `${(+v).toFixed((i===0)?0:1)} ${u[i]}`
}
const formatMoney = (n) => new Intl.NumberFormat('fa-IR').format(Number(n||0))
const formatWeight = (n) => new Intl.NumberFormat('fa-IR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(Number(n||0))
const formatCard = (v) => String(v || '').replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim()

function onAmountInput(e){
  const raw = digitsOnly(faToEn(e.target.value))
  const num = Number(raw)
  amount.value = isFinite(num) ? num : 0
  amountInput.value = raw ? new Intl.NumberFormat('fa-IR').format(num) : ''
}

function onFileChange(ev){
  const f = ev.target.files?.[0]
  attachFile(f)
}
function onDrop(ev){
  const f = ev.dataTransfer?.files?.[0]
  attachFile(f)
}
function attachFile(f){
  if(!f) return
  if(!/^image\//.test(f.type)) return toast('فقط تصویر مجاز است', 'error')
  if(f.size > 5*1024*1024) return toast('حداکثر حجم فایل ۵ مگابایت است', 'error')
  file.value = f
  filePreview.value = URL.createObjectURL(f)
}
function clearFile(){
  if(filePreview.value) URL.revokeObjectURL(filePreview.value)
  file.value = null
  filePreview.value = ''
}

function toast(title, icon='success'){
  Swal.fire({ toast:true, position:'top-end', timer:2500, showConfirmButton:false, title, icon })
}

function copyToClipboard(val=''){
  const v = String(val || '')
  if(!v) return toast('چیزی برای کپی وجود ندارد', 'error')
  navigator.clipboard?.writeText(v).then(() => toast('کپی شد')).catch(() => toast('امکان کپی وجود ندارد', 'error'))
}

async function loadProfile(){
  try{
    const { data } = await axios.get(`${API}/user/profile`, { headers: { Authorization: `Bearer ${token}` } })
    user.value = data.user || user.value
  }catch(e){
    /* silent */
  }finally{
    userLoaded.value = true
  }
}
async function loadSettings() {
  settingsLoading.value = true
  try {
    const { data } = await axios.get(`${API}/admin/setting`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const s = data?.data || {}
    cardNumber.value = String(s.cartNumber || s.cardNumber || s.card || '')
    cardOwner.value  = String(s.cardOwner || s.owner || '')
    console.log('📦 کارت:', cardNumber.value, '👤 صاحب کارت:', cardOwner.value)
  } catch (e) {
    console.error('خطا در دریافت تنظیمات:', e)
  } finally {
    settingsLoading.value = false
  }
}

function filePublicUrl(p){
  if(!p) return ''
  const clean = p.replace(/\\/g, '/')
  if(/^https?:\/\//.test(clean)) return clean
  return `${API}${clean.startsWith('/')?'':'/'}${clean}`
}

/* Submit: Card-to-Card */
async function submitCard(){
  const val = Number(amount.value)
  if(!isFinite(val) || val < 100000) return toast('مبلغ باید حداقل ۱۰۰٬۰۰۰ تومان باشد', 'error')
  if(val > maxAmount) return toast(`حداکثر مبلغ ${formatMoney(maxAmount)} تومان است`, 'error')
  if(!file.value) return toast('آپلود تصویر رسید الزامی است', 'error')

  const fd = new FormData()
  fd.append('amount', String(val))
  fd.append('img', file.value)

  busy.value = true
  try{
    const { data } = await axios.post(`${API}/user/wallet/v2`, fd, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
    })
    result.value = data
    toast('درخواست شما با موفقیت ثبت شد')
    user.value.toman = Number(user.value.toman||0) + val
    amount.value = null
    amountInput.value = ''
    clearFile()
  }catch(err){
    const msg = err?.response?.data?.error || err.message || 'خطا در ثبت واریز'
    toast(String(msg), 'error')
  }finally{
    busy.value = false
  }
}

/* Submit: Online */
async function submitOnline(){
  const val = Number(amount.value)
  if(!isFinite(val) || val < 100000) return toast('مبلغ باید حداقل ۱۰۰٬۰۰۰ تومان باشد', 'error')
  if(val > maxAmount) return toast(`حداکثر مبلغ ${formatMoney(maxAmount)} تومان است`, 'error')

  busy.value = true
  try{
    const { data } = await axios.post(`${API}/user/wallet`, { amount: val }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const payUrl = data?.data
    if(!payUrl) throw new Error('آدرس درگاه در دسترس نیست')
    toast('در حال انتقال به درگاه پرداخت…')
    window.location.href = payUrl
  }catch(err){
    const msg = err?.response?.data?.error || err.message || 'خطا در ایجاد تراکنش'
    toast(String(msg), 'error')
  }finally{
    busy.value = false
  }
}

onMounted(()=>{
  if(token){ axios.defaults.headers.common['Authorization'] = `Bearer ${token}` }
  loadProfile()
  loadSettings()
  console.log(cardNumber);
})
</script>

<style scoped>
*::-webkit-scrollbar { height: 8px; width: 8px }
*::-webkit-scrollbar-thumb { background: rgba(16,185,129,.3); border-radius: 999px }
</style>
