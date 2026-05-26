<template>
  <div dir="rtl" class="min-h-screen max-w-7xl overflow-auto px-3 sm:px-0">
    <div class="rounded-2xl bg-[#0f1417] ring-1 ring-[#334D44]/60 p-4 sm:p-6 mb-6 text-white">
      <h2 class="text-lg sm:text-xl font-extrabold mb-4">ثبت کارت</h2>
      <form class="space-y-4" @submit.prevent="submitCard">
        <div>
          <label class="block mb-2 text-sm sm:text-base text-white/90">شماره کارت (۱۶ رقم، با - جداکننده)</label>
          <div class="flex flex-col sm:flex-row gap-3">
            <input
              v-model="cardDisplay"
              @input="onCardInput"
              @blur="onBlurValidate"
              inputmode="numeric"
              maxlength="19"
              placeholder="xxxx-xxxx-xxxx-xxxx"
              class="flex-1 rounded-xl bg-[#141a1e] px-3 py-2 text-white placeholder-white/30 ring-1 ring-[#334D44]/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div class="min-w-[180px] sm:text-right">
              <div class="text-xs text-white/60">بانک</div>
              <div class="font-semibold" :class="bankName ? 'text-white' : 'text-white/60'">{{ bankName || 'نامشخص' }}</div>
            </div>
          </div>
          <div v-if="cardDisplay && cardError" class="mt-2 text-xs text-red-300">{{ cardError }}</div>
        </div>

        <div class="flex flex-col sm:flex-row gap-2">
          <button
            type="submit"
            :disabled="submitting"
            class="flex-1 rounded-2xl bg-[#b9f1cf] text-[#0a1f14] font-bold px-4 py-2.5 hover:brightness-95 disabled:opacity-60"
          >
            {{ submitting ? 'در حال ثبت…' : 'ثبت کارت' }}
          </button>
          <button
            type="button"
            @click="clearInput"
            class="rounded-2xl bg-[#141a1e] text-white ring-1 ring-white/10 px-4 py-2.5 hover:bg-[#1b2428]"
          >
            پاک کردن
          </button>
        </div>
      </form>
    </div>

    <div class="rounded-2xl bg-[#0f1417] ring-1 ring-[#334D44]/60 p-4 sm:p-6 text-white">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
        <h3 class="text-base sm:text-lg font-extrabold">کارت‌های ثبت‌شده</h3>
        <button @click="fetchCards" class="rounded-xl bg-[#141a1e] text-white ring-1 ring-white/10 px-3 py-2 hover:bg-[#1b2428]">بروزرسانی</button>
      </div>

      <div v-if="loadingCards" class="py-8 grid gap-3">
        <div class="h-10 rounded-xl bg-white/5 animate-pulse"></div>
        <div class="h-10 rounded-xl bg-white/5 animate-pulse"></div>
        <div class="h-10 rounded-xl bg-white/5 animate-pulse"></div>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full text-right">
          <thead>
            <tr class="text-xs sm:text-sm text-white/60">
              <th class="px-3 py-2 font-medium">#</th>
              <th class="px-3 py-2 font-medium">شماره کارت</th>
              <th class="px-3 py-2 font-medium">بانک</th>
              <th class="px-3 py-2 font-medium">وضعیت</th>
              <th class="px-3 py-2 font-medium">تاریخ ثبت</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(c, i) in cards" :key="c._id" class="border-t border-white/10 hover:bg-white/5">
              <td class="px-3 py-3 text-xs sm:text-sm text-white/80 w-12">{{ i + 1 }}</td>
              <td class="px-3 py-3 text-xs sm:text-sm">{{ formatStoredCard(c.card) }}</td>
              <td class="px-3 py-3 text-xs sm:text-sm text-white/80">{{ detectBankName(c.card) || 'نامشخص' }}</td>
              <td class="px-3 py-3 text-xs sm:text-sm">
                <span :class="c.status ? 'text-emerald-300' : 'text-yellow-300'">
                  {{ c.status ? 'تأیید شده' : 'در انتظار' }}
                </span>
              </td>
              <td class="px-3 py-3 text-xs sm:text-sm text-white/70 whitespace-nowrap">{{ formatDate(c.createdAt) }}</td>
            </tr>
            <tr v-if="cards.length === 0">
              <td colspan="5" class="p-8 text-center text-white/60">کارتی ثبت نشده است.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

const url = process.env.VUE_APP_API_URL || ''
const token = localStorage.getItem('token')
if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

const cardDisplay = ref('')
const cardError = ref('')
const submitting = ref(false)
const cards = ref([])
const loadingCards = ref(true)
const binMap = {
  '603799': 'بانک ملی ایران',
  '589463': 'بانک صادرات ایران',
  '627412': 'بانک ملت',
  '627381': 'بانک پارسیان',
  '502229': 'بانک سامان',
  '627488': 'بانک کارآفرین',
  '627760': 'پست بانک ایران',
  '627353': 'بانک اقتصادنوین',
  '627648': 'بانک توسعه صادرات',
  '627961': 'بانک صنعت و معدن',
  '627414': 'بانک مسکن',
  '505801': 'مؤسسه اعتباری کوثر',
  '636214': 'بانک آینده',
  '621986': 'بانک کشاورزی',
  '639347': 'بانک پاسارگاد',
  '502938': 'بانک دی',
  '627781': 'بانک رفاه کارگران',
  '627973': 'بانک تجارت'
}


function onlyDigits(s) {
  return String(s || '').replace(/\D/g, '')
}

function formatWithDashes(digits) {
  const groups = digits.match(/.{1,4}/g) || []
  return groups.join('-')
}

function luhnValid(d) {
  if (d.length !== 16) return false
  let sum = 0
  for (let i = 0; i < 16; i++) {
    let n = Number(d[i])
    if (i % 2 === 0) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
  }
  return sum % 10 === 0
}

function onCardInput(e) {
  cardError.value = ''
  const raw = onlyDigits(e.target.value)
  const trimmed = raw.slice(0, 16)
  cardDisplay.value = formatWithDashes(trimmed)
}

function onBlurValidate() {
  cardError.value = ''
  const d = onlyDigits(cardDisplay.value)
  if (!d) return
  if (d.length !== 16) {
    cardError.value = 'شماره کارت باید دقیقاً ۱۶ رقم باشد.'
    return
  }
  if (!luhnValid(d)) {
    cardError.value = 'شماره کارت نامعتبر است.'
  }
}

const bankName = computed(() => {
  const d = onlyDigits(cardDisplay.value)
  if (d.length < 6) return ''
  const bin = d.slice(0, 6)
  return binMap[bin] || ''
})

function detectBankName(storedCard) {
  const d = onlyDigits(storedCard)
  if (d.length < 6) return ''
  const bin = d.slice(0, 6)
  return binMap[bin] || ''
}

function formatStoredCard(storedCard) {
  const d = onlyDigits(storedCard)
  if (!d) return '-'
  const shown = d.replace(/^(\d{4})(\d{4})(\d{4})(\d{4})$/, '$1-$2-$3-$4')
  return shown || d
}

function formatDate(d) {
  if (!d) return '—'
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return d
  return dt.toLocaleString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

async function fetchCards() {
  loadingCards.value = true
  try {
    const res = await axios.get(`${url}/user/getcard`)
    cards.value = res.data?.data || []
  } catch {
    cards.value = []
  } finally {
    loadingCards.value = false
  }
}

async function submitCard() {
  const digits = onlyDigits(cardDisplay.value)
  if (digits.length !== 16) {
    await Swal.fire({ icon: 'error', title: 'شماره کارت نامعتبر است', text: 'شماره کارت باید دقیقاً ۱۶ رقم باشد.', toast: true, position: 'top-end', timer: 2500, showConfirmButton: false })
    return
  }
  if (!luhnValid(digits)) {
    await Swal.fire({ icon: 'error', title: 'شماره کارت نامعتبر است', text: 'لطفاً شماره کارت معتبر وارد کنید.', toast: true, position: 'top-end', timer: 2500, showConfirmButton: false })
    return
  }
  submitting.value = true
  try {
    const res = await axios.post(`${url}/user/card`, { card: digits })
    await Swal.fire({ icon: 'success', title: res.data?.data || 'کارت ثبت شد', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false })
    cardDisplay.value = ''
    await fetchCards()
  } catch (err) {
    const msg = err.response?.data?.data || err.response?.data?.message || err.response?.data || err.message || 'خطا'
    await Swal.fire({ icon: 'error', title: String(msg), toast: true, position: 'top-end', timer: 3000, showConfirmButton: false })
  } finally {
    submitting.value = false
  }
}

function clearInput() {
  cardDisplay.value = ''
  cardError.value = ''
}

onMounted(fetchCards)
</script>

<style scoped></style>
