<template>
  <div class="wallet-dashboard min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <!-- Header -->
    <header class="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold text-white flex items-center gap-2">
            <div class="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
            </div>
            کیف پول من
          </h1>
          <div class="flex items-center gap-3">
            <button class="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
            </button>
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
              {{ userInitial }}
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-6 pb-24">
      <!-- Total Balance Card -->
      <section class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-6 shadow-2xl">
        <div class="text-center">
          <p class="text-white/80 text-sm mb-2">مجموع دارایی</p>
          <h2 class="text-4xl font-bold text-white mb-4">{{ formatNumber(totalBalance) }} تومان</h2>
          <div class="flex justify-center gap-4 text-sm">
            <span class="text-white/70">ارزش امروز:</span>
            <span class="text-green-300">{{ formatNumber(todayChange) }} تومان</span>
          </div>
        </div>
      </section>

      <!-- Quick Actions -->
      <section class="grid grid-cols-2 gap-4 mb-6">
        <button @click="showDepositModal = true" class="action-card bg-green-500/20 border-green-400/30 hover:bg-green-500/30">
          <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
          </svg>
          <span class="text-green-400">واریز</span>
        </button>
        <button @click="showWithdrawModal = true" class="action-card bg-red-500/20 border-red-400/30 hover:bg-red-500/30">
          <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"/>
          </svg>
          <span class="text-red-400">برداشت</span>
        </button>
      </section>

      <!-- Assets Grid -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <!-- Gold Wallet -->
        <div class="asset-card bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400/30">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 bg-yellow-500/30 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-white font-semibold">طلا</h3>
                <p class="text-white/60 text-xs">{{ goldBalance }} گرم</p>
              </div>
            </div>
            <span class="text-green-400 text-sm">+2.5%</span>
          </div>
          <div class="text-2xl font-bold text-white mb-2">{{ formatNumber(goldValue) }} تومان</div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-white/60">بالاترین: {{ formatNumber(goldHigh) }}</span>
            <span class="text-white/60">پایین‌ترین: {{ formatNumber(goldLow) }}</span>
          </div>
        </div>

        <!-- Silver Wallet -->
        <div class="asset-card bg-gradient-to-br from-gray-400/20 to-gray-500/20 border-gray-400/30">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 bg-gray-400/30 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-white font-semibold">نقره</h3>
                <p class="text-white/60 text-xs">{{ silverBalance }} گرم</p>
              </div>
            </div>
            <span class="text-green-400 text-sm">+1.8%</span>
          </div>
          <div class="text-2xl font-bold text-white mb-2">{{ formatNumber(silverValue) }} تومان</div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-white/60">بالاترین: {{ formatNumber(silverHigh) }}</span>
            <span class="text-white/60">پایین‌ترین: {{ formatNumber(silverLow) }}</span>
          </div>
        </div>

        <!-- Crypto Wallet -->
        <div class="asset-card bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-400/30">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 bg-blue-500/30 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1.81.45 1.61 1.67 1.89.35.31.77.5 1.3.5.96 0 1.27-.35 1.58-.91.36-.59.85-1.37 1.15-1.54.2-.09.42-.14.71-.14.97 0 .57.2 1.02.57 1.39.36.35.78.54 1.27.54.51 0 .93-.16 1.25-.49.31-.32.55-.78.55-1.36v-1.54h2.67v1.77c0 1.84-1.12 3.02-3.27 3.35z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-white font-semibold">ارز دیجیتال</h3>
                <p class="text-white/60 text-xs">{{ cryptoBalance }} USDT</p>
              </div>
            </div>
            <span class="text-green-400 text-sm">+3.2%</span>
          </div>
          <div class="text-2xl font-bold text-white mb-2">{{ formatNumber(cryptoValue) }} تومان</div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-white/60">بالاترین: {{ formatNumber(cryptoHigh) }}</span>
            <span class="text-white/60">پایین‌ترین: {{ formatNumber(cryptoLow) }}</span>
          </div>
        </div>
      </section>

      <!-- Price Changes -->
      <section class="bg-white/5 backdrop-blur rounded-2xl p-6 mb-6 border border-white/10">
        <h3 class="text-white font-semibold mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
          </svg>
          تغییرات قیمت لحظه‌ای
        </h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div class="flex items-center gap-3">
              <span class="text-yellow-400">طلا</span>
              <span class="text-white/60">{{ formatTime(lastGoldUpdate) }}</span>
            </div>
            <div class="text-right">
              <div class="text-white">{{ formatNumber(currentGoldPrice) }} تومان</div>
              <div class="text-green-400 text-sm">+{{ formatNumber(goldChange) }} ({{ goldChangePercent }}%)</div>
            </div>
          </div>
          <div class="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div class="flex items-center gap-3">
              <span class="text-gray-400">نقره</span>
              <span class="text-white/60">{{ formatTime(lastSilverUpdate) }}</span>
            </div>
            <div class="text-right">
              <div class="text-white">{{ formatNumber(currentSilverPrice) }} تومان</div>
              <div class="text-green-400 text-sm">+{{ formatNumber(silverChange) }} ({{ silverChangePercent }}%)</div>
            </div>
          </div>
          <div class="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div class="flex items-center gap-3">
              <span class="text-blue-400">دلار</span>
              <span class="text-white/60">{{ formatTime(lastDollarUpdate) }}</span>
            </div>
            <div class="text-right">
              <div class="text-white">{{ formatNumber(currentDollarPrice) }} تومان</div>
              <div class="text-green-400 text-sm">+{{ formatNumber(dollarChange) }} ({{ dollarChangePercent }}%)</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Charts Section -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
          <h3 class="text-white font-semibold mb-4">نمودار قیمت طلا (۷ روز)</h3>
          <div class="h-64 bg-white/5 rounded-lg flex items-center justify-center">
            <span class="text-white/60">نمودار در حال بارگذاری...</span>
          </div>
        </div>
        <div class="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
          <h3 class="text-white font-semibold mb-4">توزیع دارایی</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-yellow-400">طلا</span>
              <div class="flex items-center gap-2">
                <div class="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div class="h-full bg-yellow-400" style="width: 60%"></div>
                </div>
                <span class="text-white text-sm">60%</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-400">نقره</span>
              <div class="flex items-center gap-2">
                <div class="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div class="h-full bg-gray-400" style="width: 25%"></div>
                </div>
                <span class="text-white text-sm">25%</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-blue-400">ارز دیجیتال</span>
              <div class="flex items-center gap-2">
                <div class="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div class="h-full bg-blue-400" style="width: 15%"></div>
                </div>
                <span class="text-white text-sm">15%</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/10 z-50">
      <div class="grid grid-cols-5 gap-1">
        <button class="nav-item active">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span>خانه</span>
        </button>
        <button class="nav-item">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1.81.45 1.61 1.67 1.89.35.31.77.5 1.3.5.96 0 1.27-.35 1.58-.91.36-.59.85-1.37 1.15-1.54.2-.09.42-.14.71-.14.97 0 .57.2 1.02.57 1.39.36.35.78.54 1.27.54.51 0 .93-.16 1.25-.49.31-.32.55-.78.55-1.36v-1.54h2.67v1.77c0 1.84-1.12 3.02-3.27 3.35z"/>
          </svg>
          <span>کیف پول</span>
        </button>
        <button class="nav-item">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span>معامله</span>
        </button>
        <button class="nav-item">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <span>تاریخچه</span>
        </button>
        <button class="nav-item">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          <span>پروفایل</span>
        </button>
      </div>
    </nav>

    <!-- Deposit Modal -->
    <div v-if="showDepositModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-white/10">
        <h3 class="text-xl font-bold text-white mb-4">واریز وجه</h3>
        <div class="space-y-4">
          <div>
            <label class="text-white/80 text-sm mb-2 block">مبلغ (تومان)</label>
            <input v-model="depositAmount" type="number" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-yellow-400" placeholder="مبلغ مورد نظر را وارد کنید">
          </div>
          <div>
            <label class="text-white/80 text-sm mb-2 block">روش پرداخت</label>
            <select v-model="depositMethod" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-400">
              <option value="card">کارت به کارت</option>
              <option value="bank">انتقال بانکی</option>
              <option value="crypto">ارز دیجیتال</option>
            </select>
          </div>
        </div>
        <div class="flex gap-3 mt-6">
          <button @click="showDepositModal = false" class="flex-1 px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition">
            انصراف
          </button>
          <button @click="processDeposit" class="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-semibold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition">
            تایید واریز
          </button>
        </div>
      </div>
    </div>

    <!-- Withdraw Modal -->
    <div v-if="showWithdrawModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-white/10">
        <h3 class="text-xl font-bold text-white mb-4">برداشت وجه</h3>
        <div class="space-y-4">
          <div>
            <label class="text-white/80 text-sm mb-2 block">مبلغ (تومان)</label>
            <input v-model="withdrawAmount" type="number" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-yellow-400" placeholder="مبلغ مورد نظر را وارد کنید">
          </div>
          <div>
            <label class="text-white/80 text-sm mb-2 block">شماره کارت</label>
            <input v-model="withdrawCard" type="text" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-yellow-400" placeholder="شماره کارت مقصد">
          </div>
        </div>
        <div class="flex gap-3 mt-6">
          <button @click="showWithdrawModal = false" class="flex-1 px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition">
            انصراف
          </button>
          <button @click="processWithdraw" class="flex-1 px-4 py-3 bg-gradient-to-r from-red-400 to-red-600 text-white font-semibold rounded-lg hover:from-red-500 hover:to-red-700 transition">
            تایید برداشت
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const url = process.env.VUE_APP_API_URL || ''

// Modal states
const showDepositModal = ref(false)
const showWithdrawModal = ref(false)

// Form data
const depositAmount = ref('')
const depositMethod = ref('card')
const withdrawAmount = ref('')
const withdrawCard = ref('')

// User data
const userName = ref('علی رضایی')
const userInitial = computed(() => userName.value.charAt(0))

// Wallet balances
const goldBalance = ref(125.5)
const silverBalance = ref(850.3)
const cryptoBalance = ref(1500)

// Current prices
const currentGoldPrice = ref(25945000)
const currentSilverPrice = ref(312000)
const currentDollarPrice = ref(42000)

// Price changes
const goldChange = ref(125000)
const goldChangePercent = ref(2.5)
const silverChange = ref(5600)
const silverChangePercent = ref(1.8)
const dollarChange = ref(800)
const dollarChangePercent = ref(1.9)

// High/Low prices
const goldHigh = ref(26120000)
const goldLow = ref(25830000)
const silverHigh = ref(315000)
const silverLow = ref(309000)
const cryptoHigh = ref(42500)
const cryptoLow = ref(41800)

// Update times
const lastGoldUpdate = ref(new Date())
const lastSilverUpdate = ref(new Date())
const lastDollarUpdate = ref(new Date())

// Computed values
const goldValue = computed(() => goldBalance.value * currentGoldPrice.value)
const silverValue = computed(() => silverBalance.value * currentSilverPrice.value)
const cryptoValue = computed(() => cryptoBalance.value * currentDollarPrice.value)
const totalBalance = computed(() => goldValue.value + silverValue.value + cryptoValue.value)
const todayChange = computed(() => goldChange.value + silverChange.value + (cryptoBalance.value * 800))

// Methods
const formatNumber = (num) => {
  return new Intl.NumberFormat('fa-IR').format(Math.round(num))
}

const formatTime = (date) => {
  return new Intl.DateTimeFormat('fa-IR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const processDeposit = () => {
  console.log('Processing deposit:', depositAmount.value, depositMethod.value)
  showDepositModal.value = false
  // TODO: Implement deposit logic
}

const processWithdraw = () => {
  console.log('Processing withdraw:', withdrawAmount.value, withdrawCard.value)
  showWithdrawModal.value = false
  // TODO: Implement withdraw logic
}

// Real-time price updates
const updatePrices = async () => {
  try {
    const response = await axios.get(`${url}/prices/current`)
    if (response.data.success) {
      const { gold, silver, currency } = response.data.data
      
      // آپدیت قیمت‌های لحظه‌ای
      if (gold && gold.length > 0) {
        const goldItem = gold.find(item => item.symbol === 'IR_GOLD_24K')
        if (goldItem) {
          currentGoldPrice.value = goldItem.price
          goldChange.value = goldItem.change_value || 0
          goldChangePercent.value = goldItem.change_percent || 0
          lastGoldUpdate.value = new Date()
        }
      }
      
      if (silver && silver.length > 0) {
        const silverItem = silver[0]
        if (silverItem) {
          currentSilverPrice.value = silverItem.price
          silverChange.value = silverItem.change_value || 0
          silverChangePercent.value = silverItem.change_percent || 0
          lastSilverUpdate.value = new Date()
        }
      }
      
      if (currency && currency.length > 0) {
        const dollarItem = currency.find(item => item.symbol === 'USD')
        if (dollarItem) {
          currentDollarPrice.value = dollarItem.price
          dollarChange.value = dollarItem.change_value || 0
          dollarChangePercent.value = dollarItem.change_percent || 0
          lastDollarUpdate.value = new Date()
        }
      }
      
      // ذخیره قیمت‌ها در دیتابیس
      await savePricesToDatabase({ gold, silver, crypto: [], currency })
    }
  } catch (error) {
    console.error('Error updating prices:', error)
  }
}

// ذخیره قیمت‌ها در دیتابیس
const savePricesToDatabase = async (priceData) => {
  try {
    await axios.post(`${url}/price-history/save-prices`, priceData)
  } catch (error) {
    console.error('Error saving prices to database:', error)
  }
}

onMounted(() => {
  updatePrices()
  // Update prices every 30 seconds
  setInterval(updatePrices, 30000)
})
</script>

<style scoped>
.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid;
  transition: all 0.3s ease;
}

.asset-card {
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid;
  transition: all 0.3s ease;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  transition: color 0.3s ease;
}

.nav-item:hover {
  color: white;
}

.nav-item.active {
  color: #fbbf24;
}
</style>
