import { ref, computed } from 'vue'
import axios from 'axios'

const url = process.env.VUE_APP_API_URL || ''

// State
const goldPrices = ref([])
const silverPrices = ref([])
const lastUpdate = ref(new Date())
const loading = ref(false)
const error = ref(null)

// Computed properties for current prices
const currentGoldPrice = computed(() => {
  const gold18 = goldPrices.value.find(item => item.name.includes('18'))
  return gold18 ? parsePrice(gold18.price) : 0
})

const currentSilverPrice = computed(() => {
  if (silverPrices.value.length > 0) {
    return parsePrice(silverPrices.value[0].price)
  }
  return 0
})

const currentGoldPriceFormatted = computed(() => formatMoney(currentGoldPrice.value))
const currentSilverPriceFormatted = computed(() => formatMoney(currentSilverPrice.value))

// Parse price function
function parsePrice(v) {
  if (typeof v === 'number') return v
  if (!v || typeof v !== 'string') return 0
  return parseFloat(v.replace(/,/g, '')) || 0
}

// Format money function
function formatMoney(v) {
  return new Intl.NumberFormat('fa-IR').format(Math.round(v))
}

// Fetch current prices
async function fetchPrices() {
  if (loading.value) return
  
  loading.value = true
  error.value = null
  
  try {
    const response = await axios.get(`${url}/prices/current`, {
      timeout: 10000
    })
    
    if (response.data.success) {
      goldPrices.value = response.data.data.gold || []
      silverPrices.value = response.data.data.silver || []
      lastUpdate.value = new Date()
    } else {
      throw new Error(response.data.error || 'Failed to fetch prices')
    }
  } catch (err) {
    console.error('Price fetch error:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Get price by name for specific metals
function getGoldPriceByName(name) {
  const item = goldPrices.value.find(item => item.name.includes(name))
  return item ? parsePrice(item.price) : 0
}

function getSilverPriceByName(name) {
  const item = silverPrices.value.find(item => item.name.includes(name))
  return item ? parsePrice(item.price) : 0
}

// Calculate final price with fees
function calculateFinalPrice(basePrice, weight, feePercent, isBuy = true) {
  if (!basePrice || !weight) return 0
  
  if (isBuy) {
    return Math.round(weight * basePrice * (1 + feePercent / 100))
  } else {
    return Math.round(weight * basePrice * (1 - feePercent / 100))
  }
}

// Calculate weight from amount
function calculateWeightFromAmount(amount, basePrice, feePercent, isBuy = true) {
  if (!amount || !basePrice) return 0
  
  if (isBuy) {
    return (amount / (basePrice * (1 + feePercent / 100))).toFixed(3)
  } else {
    return (amount / (basePrice * (1 - feePercent / 100))).toFixed(3)
  }
}

// Auto-refresh timer
let priceTimer = null

function startAutoRefresh(intervalMs = 30000) {
  stopAutoRefresh()
  priceTimer = setInterval(fetchPrices, intervalMs)
}

function stopAutoRefresh() {
  if (priceTimer) {
    clearInterval(priceTimer)
    priceTimer = null
  }
}

// Initialize and start auto-refresh
function init() {
  fetchPrices()
  startAutoRefresh()
}

// Cleanup
function cleanup() {
  stopAutoRefresh()
}

export function usePrices() {
  return {
    // State
    goldPrices,
    silverPrices,
    lastUpdate,
    loading,
    error,
    
    // Computed
    currentGoldPrice,
    currentSilverPrice,
    currentGoldPriceFormatted,
    currentSilverPriceFormatted,
    
    // Methods
    fetchPrices,
    getGoldPriceByName,
    getSilverPriceByName,
    calculateFinalPrice,
    calculateWeightFromAmount,
    formatMoney,
    parsePrice,
    
    // Auto-refresh
    startAutoRefresh,
    stopAutoRefresh,
    init,
    cleanup
  }
}
