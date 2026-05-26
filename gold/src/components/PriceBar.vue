<template>
  <div class="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/30">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2 py-2 px-2">
        <!-- طلا 24 عیار -->
        <div v-for="item in goldItems" :key="item.symbol" class="flex items-center gap-2 bg-gray-800/30 rounded-lg px-3 py-2 border border-gray-700/20 hover:bg-gray-800/50 transition-all">
          <div class="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-md flex items-center justify-center flex-shrink-0">
            <svg class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
            </svg>
          </div>
          <div class="min-w-0">
            <div class="text-[10px] text-gray-400 truncate">{{ item.name }}</div>
            <div class="text-sm font-bold text-yellow-400">{{ formatPrice(item.price) }}</div>
          </div>
          <div v-if="item.change_value" class="flex-shrink-0 ml-auto">
            <span :class="item.change_value >= 0 ? 'text-green-400' : 'text-red-400'" class="text-xs font-semibold">
              {{ item.change_value >= 0 ? '+' : '' }}{{ formatChange(item.change_value) }}
            </span>
          </div>
        </div>

        <!-- دلار -->
        <div v-for="item in currencyItems" :key="item.symbol" class="flex items-center gap-2 bg-gray-800/30 rounded-lg px-3 py-2 border border-gray-700/20 hover:bg-gray-800/50 transition-all">
          <div class="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-600 rounded-md flex items-center justify-center flex-shrink-0">
            <svg class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div class="min-w-0">
            <div class="text-[10px] text-gray-400 truncate">{{ item.name }}</div>
            <div class="text-sm font-bold text-green-400">{{ formatPrice(item.price) }}</div>
          </div>
          <div v-if="item.change_value" class="flex-shrink-0 ml-auto">
            <span :class="item.change_value >= 0 ? 'text-green-400' : 'text-red-400'" class="text-xs font-semibold">
              {{ item.change_value >= 0 ? '+' : '' }}{{ formatChange(item.change_value) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PriceBar',
  data() {
    return {
      prices: {
        gold: [],
        silver: [],
        currency: []
      },
      loading: false
    };
  },
  computed: {
    goldItems() {
      // انتخاب مهم‌ترین آیتم‌های طلا - طلای آب‌شده و طلا 24 عیار
      const meltedGold = this.prices.gold.find(item => item.symbol === 'IR_GOLD_MELTED');
      const gold24k = this.prices.gold.find(item => item.symbol === 'IR_GOLD_24K');
      const gold18k = this.prices.gold.find(item => item.name.includes('18'));
      
      const items = [];
      if (meltedGold) items.push(meltedGold);
      if (gold24k) items.push(gold24k);
      if (gold18k && items.length < 2) items.push(gold18k);
      
      return items.slice(0, 2);
    },
    currencyItems() {
      // انتخاب مهم‌ترین آیتم‌های ارز - دلار و تتر
      const usd = this.prices.currency.find(item => item.symbol === 'USD');
      const usdt = this.prices.currency.find(item => item.symbol === 'USDT_IRT');
      
      const items = [];
      if (usd) items.push(usd);
      if (usdt && items.length < 2) items.push(usdt);
      if (this.prices.currency[0] && items.length < 2) items.push(this.prices.currency[0]);
      
      return items.slice(0, 2);
    }
  },
  mounted() {
    this.fetchPrices();
    // آپدیت هر 60 ثانیه
    setInterval(() => {
      this.fetchPrices();
    }, 60000);
  },
  methods: {
    async fetchPrices() {
      this.loading = true;
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/prices/current`, {
          timeout: 10000
        });
        if (response.data.success) {
          this.prices = response.data.data;
        }
      } catch (error) {
        console.error('Error fetching prices:', error);
      } finally {
        this.loading = false;
      }
    },
    formatPrice(price) {
      if (!price) return '0';
      return new Intl.NumberFormat('fa-IR').format(price);
    },
    formatChange(value) {
      if (!value) return '0';
      return new Intl.NumberFormat('fa-IR').format(value);
    }
  }
};
</script>
