<template>
  <div class="price-bar-wrapper" dir="rtl">
    <div class="ticker-track" ref="track">
      <div class="ticker-inner" :style="{ animationDuration: duration + 's' }">
        <template v-for="pass in 2" :key="pass">
          <span v-for="item in allItems" :key="pass + '-' + item.symbol" class="ticker-item">
            <span class="ticker-icon" :class="item.colorClass">{{ item.icon }}</span>
            <span class="ticker-name">{{ item.name }}</span>
            <span class="ticker-price">{{ fmt(item.price) }}</span>
            <span class="ticker-unit">{{ item.unit }}</span>
            <span v-if="item.change_value !== 0" class="ticker-change" :class="item.change_value > 0 ? 'up' : 'down'">
              {{ item.change_value > 0 ? '▲' : '▼' }} {{ fmtChange(item.change_percent) }}٪
            </span>
            <span class="ticker-sep">•</span>
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const ICONS = {
  gold: '🥇', silver: '🥈', coin: '🪙', currency: '💵'
};

export default {
  name: 'PriceBar',
  data() {
    return {
      allItems: [],
      duration: 40,
    };
  },
  mounted() {
    this.fetchPrices();
    setInterval(this.fetchPrices, 60000);
  },
  methods: {
    async fetchPrices() {
      try {
        const res = await axios.get(`${process.env.VUE_APP_API_URL}/prices/current`, { timeout: 12000 });
        if (!res.data.success) return;
        const { gold, silver, currency } = res.data.data;

        const goldSymbols = ['IR_GOLD_18K','IR_GOLD_24K','IR_GOLD_MELTED','XAUUSD','IR_COIN_EMAMI','IR_COIN_BAHAR','IR_COIN_HALF','IR_COIN_QUARTER','IR_COIN_1G'];
        const currencySymbols = ['USD','EUR','AED','GBP','USDT_IRT','TRY','AUD','CAD'];

        const items = [];

        goldSymbols.forEach(sym => {
          const item = gold.find(i => i.symbol === sym);
          if (!item) return;
          const isCoin = sym.includes('COIN');
          items.push({
            symbol: item.symbol,
            name: item.name,
            price: item.price,
            unit: item.unit || 'تومان',
            change_value: item.change_value || 0,
            change_percent: item.change_percent || 0,
            icon: isCoin ? ICONS.coin : ICONS.gold,
            colorClass: isCoin ? 'icon-coin' : 'icon-gold',
          });
        });

        silver.forEach(item => {
          items.push({
            symbol: item.symbol,
            name: item.name,
            price: item.price,
            unit: item.unit || 'تومان',
            change_value: 0,
            change_percent: 0,
            icon: ICONS.silver,
            colorClass: 'icon-silver',
          });
        });

        currencySymbols.forEach(sym => {
          const item = currency.find(i => i.symbol === sym);
          if (!item) return;
          items.push({
            symbol: item.symbol,
            name: item.name,
            price: item.price,
            unit: item.unit || 'تومان',
            change_value: item.change_value || 0,
            change_percent: item.change_percent || 0,
            icon: ICONS.currency,
            colorClass: 'icon-currency',
          });
        });

        this.allItems = items;
        this.duration = Math.max(30, items.length * 4);
      } catch (e) {
        console.error('PriceBar error:', e.message);
      }
    },
    fmt(v) {
      if (!v) return '—';
      return Number(v).toLocaleString('fa-IR');
    },
    fmtChange(v) {
      if (!v) return '0';
      return Math.abs(Number(v)).toLocaleString('fa-IR');
    }
  }
};
</script>

<style scoped>
.price-bar-wrapper {
  background: linear-gradient(90deg, #0d1a12 0%, #0f1f17 50%, #0d1a12 100%);
  border-bottom: 1px solid rgba(185, 241, 207, 0.08);
  overflow: hidden;
  height: 40px;
  display: flex;
  align-items: center;
  position: relative;
}

.price-bar-wrapper::before,
.price-bar-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 60px;
  z-index: 2;
  pointer-events: none;
}
.price-bar-wrapper::before {
  right: 0;
  background: linear-gradient(to left, #0d1a12, transparent);
}
.price-bar-wrapper::after {
  left: 0;
  background: linear-gradient(to right, #0d1a12, transparent);
}

.ticker-track {
  width: 100%;
  overflow: hidden;
}

.ticker-inner {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  animation: ticker-scroll linear infinite;
}

@keyframes ticker-scroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.ticker-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
  font-size: 12px;
}

.ticker-icon {
  font-size: 14px;
}

.ticker-name {
  color: rgba(255,255,255,0.55);
  font-size: 11px;
}

.ticker-price {
  color: #e8f5e9;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.02em;
}

.ticker-unit {
  color: rgba(255,255,255,0.3);
  font-size: 10px;
}

.ticker-change {
  font-size: 10px;
  font-weight: 600;
  padding: 1px 4px;
  border-radius: 4px;
}
.ticker-change.up {
  color: #4ade80;
  background: rgba(74, 222, 128, 0.1);
}
.ticker-change.down {
  color: #f87171;
  background: rgba(248, 113, 113, 0.1);
}

.ticker-sep {
  color: rgba(185, 241, 207, 0.15);
  margin: 0 6px;
}

.icon-gold    { filter: hue-rotate(0deg);   }
.icon-silver  { filter: hue-rotate(200deg); }
.icon-coin    { filter: hue-rotate(30deg);  }
.icon-currency{ filter: hue-rotate(120deg); }
</style>
