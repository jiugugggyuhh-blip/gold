<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-blue-400/30 shadow-2xl">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-white flex items-center mb-2">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center ml-3 shadow-lg">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              صفحه تست API
            </h1>
            <p class="text-blue-200 text-lg">تست اتصال و عملکرد API های سیستم</p>
          </div>
          <button 
            @click="runAllTests"
            :disabled="loading"
            class="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50"
          >
            {{ loading ? 'در حال تست...' : 'تست همه API ها' }}
          </button>
        </div>
      </div>

      <!-- API Settings Info -->
      <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
        <h2 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          تنظیمات API
        </h2>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-white/5 rounded-xl p-4 border border-white/10">
            <div class="text-sm text-gray-400 mb-1">API URL</div>
            <div class="text-white font-mono text-sm break-all">{{ apiUrl }}</div>
          </div>
          <div class="bg-white/5 rounded-xl p-4 border border-white/10">
            <div class="text-sm text-gray-400 mb-1">API Key</div>
            <div class="text-white font-mono text-sm">{{ apiKey ? apiKey.substring(0, 10) + '...' : 'تنظیم نشده' }}</div>
          </div>
        </div>
      </div>

      <!-- Test Results -->
      <div class="grid md:grid-cols-2 gap-6">
        <!-- BRS API Test -->
        <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              تست API طلا (BRS)
            </h3>
            <span :class="brsTest.status === 'success' ? 'bg-green-500' : brsTest.status === 'error' ? 'bg-red-500' : 'bg-gray-500'" class="px-3 py-1 rounded-full text-white text-sm">
              {{ brsTest.status === 'success' ? 'موفق' : brsTest.status === 'error' ? 'خطا' : 'منتظر تست' }}
            </span>
          </div>
          
          <button 
            @click="testBrsApi"
            :disabled="brsTest.loading"
            class="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all disabled:opacity-50 mb-4"
          >
            {{ brsTest.loading ? 'در حال تست...' : 'تست API BRS' }}
          </button>

          <div v-if="brsTest.result" class="space-y-2">
            <div class="bg-white/5 rounded-lg p-3 border border-white/10">
              <div class="text-sm text-gray-400">قیمت طلای ۱۸ عیار</div>
              <div class="text-xl font-bold text-green-400">{{ formatPrice(brsTest.result.gold18) }}</div>
            </div>
            <div class="bg-white/5 rounded-lg p-3 border border-white/10">
              <div class="text-sm text-gray-400">قیمت طلای ۲۴ عیار</div>
              <div class="text-xl font-bold text-yellow-400">{{ formatPrice(brsTest.result.gold24) }}</div>
            </div>
            <div class="bg-white/5 rounded-lg p-3 border border-white/10">
              <div class="text-sm text-gray-400">طلای آب شده</div>
              <div class="text-xl font-bold text-blue-400">{{ formatPrice(brsTest.result.goldMelted) }}</div>
            </div>
          </div>

          <div v-if="brsTest.error" class="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-200 text-sm">
            خطا: {{ brsTest.error }}
          </div>
        </div>

        <!-- Trading Bot Demo API Test -->
        <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <svg class="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
              تست API ربات دمو
            </h3>
            <span :class="botTest.status === 'success' ? 'bg-green-500' : botTest.status === 'error' ? 'bg-red-500' : 'bg-gray-500'" class="px-3 py-1 rounded-full text-white text-sm">
              {{ botTest.status === 'success' ? 'موفق' : botTest.status === 'error' ? 'خطا' : 'منتظر تست' }}
            </span>
          </div>
          
          <button 
            @click="testBotApi"
            :disabled="botTest.loading"
            class="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 mb-4"
          >
            {{ botTest.loading ? 'در حال تست...' : 'تست API ربات' }}
          </button>

          <div v-if="botTest.result" class="space-y-2">
            <div class="bg-white/5 rounded-lg p-3 border border-white/10">
              <div class="text-sm text-gray-400">وضعیت اشتراک</div>
              <div class="text-lg font-bold" :class="botTest.result.status === 'active' ? 'text-green-400' : 'text-red-400'">
                {{ botTest.result.status === 'active' ? 'فعال' : 'غیرفعال' }}
              </div>
            </div>
            <div class="bg-white/5 rounded-lg p-3 border border-white/10">
              <div class="text-sm text-gray-400">سرمایه‌گذاری</div>
              <div class="text-lg font-bold text-blue-400">{{ formatCurrency(botTest.result.investment) }}</div>
            </div>
            <div class="bg-white/5 rounded-lg p-3 border border-white/10">
              <div class="text-sm text-gray-400">روزهای باقیمانده</div>
              <div class="text-lg font-bold text-yellow-400">{{ botTest.result.daysLeft }} روز</div>
            </div>
          </div>

          <div v-if="botTest.error" class="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-200 text-sm">
            خطا: {{ botTest.error }}
          </div>
        </div>
      </div>

      <!-- Raw Response -->
      <div v-if="showRawData" class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mt-6 border border-white/20">
        <h3 class="text-lg font-bold text-white mb-4">پاسخ خام API</h3>
        <pre class="bg-black/30 rounded-lg p-4 text-green-400 text-sm overflow-x-auto font-mono">{{ rawResponse }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ApiTest',
  data() {
    return {
      apiUrl: '',
      apiKey: '',
      loading: false,
      showRawData: false,
      rawResponse: '',
      brsTest: {
        status: 'pending',
        loading: false,
        result: null,
        error: null
      },
      botTest: {
        status: 'pending',
        loading: false,
        result: null,
        error: null
      }
    };
  },
  mounted() {
    this.loadApiSettings();
  },
  methods: {
    async loadApiSettings() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/admin/api-settings`);
        if (response.data.success) {
          this.apiUrl = response.data.data.goldApi.apiUrl;
          this.apiKey = response.data.data.goldApi.apiKey;
        }
      } catch (error) {
        console.error('Error loading API settings:', error);
        // استفاده از مقادیر پیش‌فرض
        this.apiUrl = 'https://Api.BrsApi.ir/Market/Gold_Currency.php?key=';
        this.apiKey = 'B3HsYAYhzDQsmPdg2s9QPHQmlkWG1HGu';
      }
    },

    async testBrsApi() {
      this.brsTest.loading = true;
      this.brsTest.status = 'pending';
      this.brsTest.error = null;
      
      try {
        // تست API BRS برای قیمت طلا
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/admin/gold-prices`, {
          timeout: 10000
        });
        
        if (response.data.success) {
          this.brsTest.result = response.data.data;
          this.brsTest.status = 'success';
          this.rawResponse = JSON.stringify(response.data, null, 2);
          this.showRawData = true;
        } else {
          throw new Error('پاسخ نامعتبر از API');
        }
      } catch (error) {
        console.error('BRS API test error:', error);
        this.brsTest.error = error.response?.data?.error || error.message || 'خطا در اتصال به API';
        this.brsTest.status = 'error';
      } finally {
        this.brsTest.loading = false;
      }
    },

    async testBotApi() {
      this.botTest.loading = true;
      this.botTest.status = 'pending';
      this.botTest.error = null;
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // تست بدون احراز هویت
          const response = await axios.get(`${process.env.VUE_APP_API_URL}/bot/demo/subscription`, {
            timeout: 10000
          });
          
          if (response.data.success) {
            this.botTest.result = response.data.data;
            this.botTest.status = 'success';
          } else {
            throw new Error('پاسخ نامعتبر از API');
          }
        } else {
          // تست با احراز هویت
          const response = await axios.get(`${process.env.VUE_APP_API_URL}/bot/demo/subscription`, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000
          });
          
          if (response.data.success) {
            this.botTest.result = response.data.data;
            this.botTest.status = 'success';
          } else {
            throw new Error('پاسخ نامعتبر از API');
          }
        }
      } catch (error) {
        console.error('Bot API test error:', error);
        this.botTest.error = error.response?.data?.error || error.message || 'خطا در اتصال به API';
        this.botTest.status = 'error';
      } finally {
        this.botTest.loading = false;
      }
    },

    async runAllTests() {
      this.loading = true;
      await Promise.all([
        this.testBrsApi(),
        this.testBotApi()
      ]);
      this.loading = false;
    },

    formatPrice(price) {
      if (!price) return '0 تومان';
      return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
    },

    formatCurrency(amount) {
      if (!amount) return '0 تومان';
      return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
    }
  }
};
</script>
