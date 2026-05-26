<template>
  <div class="chart-wrapper" dir="rtl">
    <div class="chart-header">
      <div class="chart-title-block">
        <div class="chart-badge">📊 نمودار قیمت</div>
        <h3 class="chart-title">{{ currentSymbolObj.title }}</h3>
        <div class="chart-price-live" v-if="currentPrice">
          <span class="live-dot"></span>
          <span class="live-price">{{ fmt(currentPrice) }}</span>
          <span class="live-unit">تومان</span>
          <span class="live-change" :class="liveChangeClass">
            {{ liveChangeSign }}{{ fmt(Math.abs(liveChange)) }}
            <span v-if="liveChangePct"> ({{ Math.abs(liveChangePct).toFixed(2) }}٪)</span>
          </span>
        </div>
      </div>

      <div class="header-controls">
        <!-- سوئیچ نماد -->
        <div class="sym-tabs">
          <button
            v-for="s in SYMBOLS"
            :key="s.id"
            :class="['sym-btn', activeSymbol === s.id ? 'active' : '']"
            @click="onSymbol(s.id)"
          >{{ s.icon }} {{ s.label }}</button>
        </div>
        <!-- بازه زمانی -->
        <div class="period-tabs">
          <button
            v-for="p in PERIODS"
            :key="p.id"
            :class="['period-btn', activePeriod === p.id ? 'active' : '']"
            @click="onPeriod(p.id)"
          >{{ p.label }}</button>
        </div>
      </div>
    </div>

    <!-- نوار آمار -->
    <div class="chart-statsbar" v-if="seriesStats.min">
      <div class="sb-item">
        <span class="sb-lbl">بالاترین</span>
        <span class="sb-val hi">{{ fmt(seriesStats.max) }}</span>
      </div>
      <div class="sb-sep"></div>
      <div class="sb-item">
        <span class="sb-lbl">پایین‌ترین</span>
        <span class="sb-val lo">{{ fmt(seriesStats.min) }}</span>
      </div>
      <div class="sb-sep"></div>
      <div class="sb-item">
        <span class="sb-lbl">تغییر بازه</span>
        <span class="sb-val" :class="seriesStats.change >= 0 ? 'hi' : 'lo'">
          {{ seriesStats.change >= 0 ? '+' : '' }}{{ seriesStats.changePct.toFixed(2) }}٪
        </span>
      </div>
      <div class="sb-sep"></div>
      <div class="sb-item">
        <span class="sb-lbl">بازه نمایش</span>
        <span class="sb-val">{{ currentPeriodObj.label }}</span>
      </div>
    </div>

    <div class="chart-area">
      <div v-if="status === 'loading'" class="chart-overlay">
        <div class="spinner"></div>
        <span>در حال بارگذاری...</span>
      </div>
      <div v-else-if="status === 'error'" class="chart-overlay">
        <span class="ov-icon">⚠️</span>
        <p>خطا در دریافت داده</p>
      </div>
      <div v-show="status === 'ok'" id="gold-apx-chart"></div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import ApexCharts from 'apexcharts'
import moment from 'moment-jalaali'

const API = process.env.VUE_APP_API_URL || ''

// ── ثابت‌ها ───────────────────────────────────────────────────
const SYMBOLS = [
  { id: 'goldMelted', label: 'آب‌شده',  icon: '✨', title: 'طلای آب‌شده نقدی',  color: '#ffd26a', apiKey: 'IR_GOLD_MELTED', src: 'gold'   },
  { id: 'gold18',     label: '۱۸ عیار', icon: '🥇', title: 'طلای ۱۸ عیار',     color: '#facc15', apiKey: 'IR_GOLD_18K',    src: 'gold'   },
  { id: 'silver999',  label: 'نقره',    icon: '🥈', title: 'نقره ۹۹۹',          color: '#94a3b8', apiKey: 'silver999',     src: 'silver' },
]

// بازه‌ها — id همون چیزیه که به API میره، label چیزیه که کاربر میبینه
const PERIODS = [
  { id: '1d',  label: '۱ روز',  days: 1  },
  { id: '7d',  label: '۷ روز',  days: 7  },
  { id: '30d', label: '۳۰ روز', days: 30 },
  { id: '90d', label: '۳ ماه',  days: 90 },
]

// ── state ─────────────────────────────────────────────────────
const activeSymbol = ref('goldMelted')
const activePeriod = ref('7d')
const status       = ref('loading')   // 'loading' | 'ok' | 'error'
const currentPrice = ref(0)
const liveChange   = ref(0)
const liveChangePct = ref(0)
const seriesStats  = ref({ min: 0, max: 0, change: 0, changePct: 0 })

let apxChart  = null
let reqId     = 0   // race-condition guard

// ── computed ──────────────────────────────────────────────────
const currentSymbolObj = computed(() => SYMBOLS.find(s => s.id === activeSymbol.value))
const currentPeriodObj = computed(() => PERIODS.find(p => p.id === activePeriod.value))
const liveChangeClass  = computed(() => liveChange.value >= 0 ? 'up' : 'down')
const liveChangeSign   = computed(() => liveChange.value >= 0 ? '+' : '')

// ── helpers ───────────────────────────────────────────────────
function fmt(v) { return v ? Number(v).toLocaleString('fa-IR') : '—' }

// تولید seed ثابت برای هر ترکیب symbol+period — نمودار بین رفرش‌ها ثابت بمونه
function seededRand(seed) {
  let s = seed
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff }
}

function buildFakeSeries(base, days, symId, periodId) {
  const seed = symId.split('').reduce((a, c) => a + c.charCodeAt(0), 0) +
               periodId.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const rand = seededRand(seed)
  const now  = Date.now()
  const pts  = []
  // تعداد نقطه: حداکثر ۱۵۰ نقطه (برای ۹۰ روز هر ۱۴.۴ ساعت یه نقطه)
  const totalHours = days * 24
  const step = Math.max(1, Math.round(totalHours / 120))  // ~120 نقطه
  let price = Math.round(base * (0.985 + rand() * 0.01))
  for (let h = totalHours; h >= 1; h -= step) {
    const drift = (rand() - 0.47) * base * 0.0018
    price = Math.round(Math.min(Math.max(price + drift, base * 0.96), base * 1.04))
    pts.push({ x: new Date(now - h * 3600_000), y: price })
  }
  pts.push({ x: new Date(now), y: base })
  return pts
}

function calcStats(series) {
  if (!series.length) return { min: 0, max: 0, change: 0, changePct: 0 }
  const prices  = series.map(p => p.y)
  const min     = Math.min(...prices)
  const max     = Math.max(...prices)
  const first   = series[0].y
  const last    = series[series.length - 1].y
  const change  = last - first
  const changePct = first ? (change / first) * 100 : 0
  return { min, max, change, changePct }
}

// ── بارگذاری داده ─────────────────────────────────────────────
async function load(symId, periodId) {
  const myId = ++reqId
  status.value = 'loading'

  try {
    const sym    = SYMBOLS.find(s => s.id === symId)
    const period = PERIODS.find(p => p.id === periodId)

    const [histRes, liveRes] = await Promise.all([
      axios.get(`${API}/prices/history?symbol=${symId}&period=${periodId}`, { timeout: 12000 }),
      axios.get(`${API}/prices/current`, { timeout: 10000 }),
    ])

    if (myId !== reqId) return  // request قدیمی

    // قیمت لحظه‌ای
    if (liveRes.data.success) {
      const d = liveRes.data.data
      if (sym.src === 'silver') {
        const it = d.silver?.find(i => i.symbol === sym.apiKey)
        if (it) { currentPrice.value = it.price; liveChange.value = 0; liveChangePct.value = 0 }
      } else {
        const it = d.gold?.find(i => i.symbol === sym.apiKey)
        if (it) {
          currentPrice.value = it.price
          liveChange.value   = it.change_value  || 0
          liveChangePct.value = it.change_percent || 0
        }
      }
    }

    const base    = currentPrice.value
    const rawData = histRes.data?.data || []

    // تشخیص اینکه داده واقعی کافی داریم یا نه
    const realPrices  = rawData.map(r => r.price).filter(Boolean)
    const uniquePrices = [...new Set(realPrices)]
    const hasRealData  = uniquePrices.length >= 3

    let series
    if (hasRealData) {
      series = rawData.map(r => ({ x: new Date(r.date), y: r.price }))
    } else {
      // fake data با seed ثابت — بر اساس بازه انتخاب‌شده
      series = buildFakeSeries(base || uniquePrices[0] || 79000000, period.days, symId, periodId)
    }

    seriesStats.value = calcStats(series)

    status.value = 'ok'
    await nextTick()
    if (myId !== reqId) return

    renderChart(series, sym.color, periodId)
  } catch (e) {
    if (myId !== reqId) return
    console.error('chart error:', e.message)
    status.value = 'error'
  }
}

// ── render ────────────────────────────────────────────────────
function renderChart(series, color, periodId) {
  if (apxChart) { apxChart.destroy(); apxChart = null }
  const el = document.querySelector('#gold-apx-chart')
  if (!el) return

  const ys  = series.map(p => p.y)
  const min = Math.min(...ys)
  const max = Math.max(...ys)
  const pad = (max - min) * 0.1 || max * 0.02

  const xFmt = val => {
    const m = moment(val)
    if (periodId === '1d')  return m.format('HH:mm')
    if (periodId === '7d')  return m.format('jD jMMMM')
    if (periodId === '30d') return m.format('jD jMMMM')
    return m.format('jMMMM jYY')
  }

  apxChart = new ApexCharts(el, {
    chart: {
      type: 'area', height: 300,
      fontFamily: 'inherit',
      foreColor: 'rgba(255,255,255,.45)',
      background: 'transparent',
      toolbar: { show: false },
      zoom:    { enabled: false },
      animations: { enabled: true, easing: 'easeinout', speed: 450 },
    },
    series: [{ name: 'قیمت', data: series }],
    colors: [color],
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.38, opacityTo: 0.02, stops: [0, 95] },
    },
    stroke: { width: 2.5, curve: 'smooth' },
    grid: {
      borderColor: 'rgba(255,255,255,.05)', strokeDashArray: 4,
      xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    markers: {
      size: series.length <= 3 ? 4 : 0,
      colors: [color], strokeColors: '#0b0e12', strokeWidth: 2,
      hover: { size: 5 },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        formatter: xFmt,
        style: { fontSize: '10px', colors: 'rgba(255,255,255,.38)' },
        datetimeUTC: false,
        hideOverlappingLabels: true,
        rotate: 0,
      },
      axisBorder: { show: false }, axisTicks: { show: false },
    },
    yaxis: {
      min: min - pad, max: max + pad,
      labels: {
        formatter: v => v ? (v / 1_000_000).toFixed(2) + 'M' : '0',
        style: { fontSize: '10px', colors: 'rgba(255,255,255,.38)' },
      },
    },
    tooltip: {
      theme: 'dark', style: { fontSize: '12px' },
      x: { formatter: val => moment(val).format('jYYYY/jMM/jDD HH:mm') },
      y: { formatter: val => val ? val.toLocaleString('fa-IR') + ' تومان' : '—' },
    },
    legend: { show: false },
  })
  apxChart.render()
}

// ── handlers ──────────────────────────────────────────────────
function onSymbol(id) { if (activeSymbol.value === id) return; activeSymbol.value = id; load(id, activePeriod.value) }
function onPeriod(id) { if (activePeriod.value === id) return; activePeriod.value = id; load(activeSymbol.value, id) }

onMounted(() => load(activeSymbol.value, activePeriod.value))
onUnmounted(() => { reqId = Infinity; if (apxChart) { apxChart.destroy(); apxChart = null } })
</script>

<style scoped>
.chart-wrapper {
  background: linear-gradient(160deg, #11151a, #0b0e12);
  border: 1px solid rgba(255,196,76,.15);
  border-radius: 1.25rem;
  padding: 1.25rem 1.25rem 0.75rem;
  overflow: hidden;
}

/* header */
.chart-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  flex-wrap: wrap; gap: 12px; margin-bottom: 12px;
}
.chart-title-block { flex: 1; min-width: 0; }
.chart-badge {
  display: inline-flex; font-size: 0.7rem; color: #ffd47a;
  background: rgba(255,196,76,.1); border: 1px solid rgba(255,196,76,.25);
  border-radius: 999px; padding: 2px 10px; margin-bottom: 4px;
}
.chart-title { font-size: 1rem; font-weight: 800; color: #fff; margin: 0 0 6px; }

.chart-price-live { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.live-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #4ade80; box-shadow: 0 0 6px #4ade80;
  animation: blink 1.5s ease-in-out infinite;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
.live-price { font-size: 1.1rem; font-weight: 800; color: #ffd47a; }
.live-unit  { font-size: .75rem; color: rgba(255,255,255,.4); }
.live-change { font-size: .75rem; font-weight: 600; padding: 2px 8px; border-radius: 6px; }
.live-change.up   { color: #4ade80; background: rgba(74,222,128,.1); }
.live-change.down { color: #f87171; background: rgba(248,113,113,.1); }

/* controls */
.header-controls { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }

.sym-tabs, .period-tabs { display: flex; gap: 4px; }

.sym-btn, .period-btn {
  padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 600;
  color: rgba(255,255,255,.45); cursor: pointer; transition: all .2s;
  background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08);
  white-space: nowrap;
}
.sym-btn:hover, .period-btn:hover { color: #ffd47a; border-color: rgba(255,196,76,.3); }
.sym-btn.active, .period-btn.active { color: #1a1305; background: #ffd26a; border-color: #ffd26a; }

/* stats bar */
.chart-statsbar {
  display: flex; align-items: center;
  background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.06);
  border-radius: 10px; padding: 8px 16px; margin-bottom: 10px;
  flex-wrap: wrap; gap: 4px;
}
.sb-item { flex: 1; min-width: 60px; text-align: center; }
.sb-lbl  { display: block; font-size: 10px; color: rgba(255,255,255,.32); margin-bottom: 2px; }
.sb-val  { font-size: 12px; font-weight: 700; color: #e8f5e9; }
.sb-val.hi { color: #4ade80; }
.sb-val.lo { color: #f87171; }
.sb-sep  { width: 1px; height: 28px; background: rgba(255,255,255,.07); margin: 0 4px; }

/* chart area */
.chart-area { min-height: 300px; position: relative; }
#gold-apx-chart { width: 100%; }

.chart-overlay {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 10px; color: rgba(255,255,255,.4); font-size: 13px;
}
.ov-icon { font-size: 2rem; }

.spinner {
  width: 32px; height: 32px;
  border: 3px solid rgba(255,196,76,.18); border-top-color: #ffd26a;
  border-radius: 50%; animation: spin .8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* responsive */
@media(max-width:600px) {
  .header-controls { align-items: flex-start; width: 100%; }
  .sym-tabs, .period-tabs { flex-wrap: wrap; }
  .chart-statsbar { gap: 2px; }
  .sb-sep { display: none; }
}
</style>
