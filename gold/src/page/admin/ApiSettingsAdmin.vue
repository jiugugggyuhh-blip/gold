<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
    <div class="max-w-6xl mx-auto px-4">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-blue-400/30 shadow-2xl">
        <h1 class="text-3xl font-bold text-white flex items-center mb-2">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center ml-3 shadow-lg">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          تنظیمات API قیمت طلا
        </h1>
        <p class="text-blue-200 text-lg">مدیریت API Key و تنظیمات دریافت قیمت طلا</p>
      </div>

      <!-- API Status Card -->
      <div class="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-gray-700/50 shadow-xl">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-white flex items-center">
            <div class="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center ml-2">
              <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            وضعیت فعلی API
          </h3>
          <button @click="refreshStatus" class="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-lg font-semibold transition-all border border-blue-400/30">
            تازه سازی
          </button>
        </div>
        
        <div class="grid md:grid-cols-3 gap-4">
          <div class="p-4 rounded-xl border backdrop-blur" :class="apiStatus.isActive ? 'bg-green-500/20 border-green-400/50' : 'bg-red-500/20 border-red-400/50'">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-semibold" :class="apiStatus.isActive ? 'text-green-300' : 'text-red-300'">
                وضعیت API
              </span>
              <div class="w-3 h-3 rounded-full animate-pulse" :class="apiStatus.isActive ? 'bg-green-400' : 'bg-red-400'"></div>
            </div>
            <div class="text-xl font-bold" :class="apiStatus.isActive ? 'text-green-200' : 'text-red-200'">
              {{ apiStatus.isActive ? 'فعال' : 'غیرفعال' }}
            </div>
          </div>

          <div class="p-4 bg-blue-500/20 rounded-xl border border-blue-400/50 backdrop-blur">
            <div class="text-sm font-semibold text-blue-300 mb-2">آخرین به‌روزرسانی</div>
            <div class="text-xl font-bold text-blue-200">
              {{ apiStatus.lastUpdate ? formatDate(apiStatus.lastUpdate) : 'هیچ‌وقت' }}
            </div>
          </div>

          <div class="p-4 bg-yellow-500/20 rounded-xl border border-yellow-400/50 backdrop-blur">
            <div class="text-sm font-semibold text-yellow-300 mb-2">قیمت فعلی</div>
            <div class="text-xl font-bold text-yellow-200">
              {{ formatCurrency(apiStatus.currentPrice) }}
            </div>
          </div>
        </div>

        <div class="mt-4 p-4 rounded-xl border backdrop-blur" :class="apiStatus.isFallback ? 'bg-orange-500/20 border-orange-400/50' : 'bg-gray-500/20 border-gray-400/50'">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-semibold" :class="apiStatus.isFallback ? 'text-orange-300' : 'text-gray-300'">
                منبع داده
              </div>
              <div class="text-sm" :class="apiStatus.isFallback ? 'text-orange-200' : 'text-gray-200'">
                {{ apiStatus.isFallback ? 'پیش‌فرض (API در دسترس نیست)' : 'API واقعی BRS' }}
              </div>
            </div>
            <div class="text-sm text-gray-400 bg-gray-500/20 px-3 py-1 rounded-lg">
              API Key: {{ apiStatus.apiKey }}
            </div>
          </div>
        </div>
      </div>

      <!-- API Settings Form -->
      <div class="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-gray-700/50 shadow-xl">
        <h3 class="text-xl font-bold text-white mb-4 flex items-center">
          <div class="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center ml-2">
            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
          </div>
          تنظیمات API
        </h3>
        
        <form @submit.prevent="saveSettings" class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-gray-300 mb-2">API Key</label>
            <div class="relative">
              <input 
                v-model="settings.goldApi.apiKey" 
                type="password" 
                class="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur"
                placeholder="کلید API را وارد کنید"
              />
              <button 
                type="button" 
                @click="toggleApiKeyVisibility"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path v-if="showApiKey" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  <path v-else d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                </svg>
              </button>
            </div>
            <p class="mt-2 text-xs text-gray-400">کلید API دریافت شده از BRS</p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-300 mb-2">API URL</label>
            <input 
              v-model="settings.goldApi.apiUrl" 
              type="url" 
              class="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur"
              placeholder="آدرس API را وارد کنید"
            />
            <p class="mt-2 text-xs text-gray-400">آدرس کامل API برای دریافت قیمت طلا</p>
          </div>

          <div class="flex items-center">
            <input 
              v-model="settings.goldApi.isActive" 
              type="checkbox" 
              id="api-active"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label for="api-active" class="mr-2 text-sm font-medium text-gray-700">
              API فعال باشد
            </label>
          </div>

          <div class="flex items-center space-x-4 space-x-reverse">
            <button 
              type="submit" 
              :disabled="saving"
              class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {{ saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات' }}
            </button>
            
            <button 
              type="button"
              @click="testApi"
              :disabled="testing"
              class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {{ testing ? 'در حال تست...' : 'تست API' }}
            </button>
          </div>
        </form>
      </div>

      <!-- API Response Preview -->
      <div v-if="testResult" class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">نتیجه تست API</h3>
        <div class="p-4 rounded-lg" :class="testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
          <div class="flex items-center justify-between mb-2">
            <span class="font-medium" :class="testResult.success ? 'text-green-800' : 'text-red-800'">
              {{ testResult.success ? 'موفقیت' : 'خطا' }}
            </span>
            <div class="w-2 h-2 rounded-full" :class="testResult.success ? 'bg-green-500' : 'bg-red-500'"></div>
          </div>
          <div class="text-sm" :class="testResult.success ? 'text-green-700' : 'text-red-700'">
            {{ testResult.message }}
          </div>
          <div v-if="testResult.data" class="mt-2 text-xs text-gray-600">
            <pre>{{ JSON.stringify(testResult.data, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ApiSettingsAdmin',
  data() {
    return {
      settings: {
        goldApi: {
          apiKey: '',
          apiUrl: 'https://api.brsapi.ir/Market/Gold_Currency.php',
          isActive: true
        }
      },
      apiStatus: {
        isActive: false,
        lastUpdate: null,
        currentPrice: 0,
        isFallback: false,
        apiKey: 'تنظیم نشده'
      },
      testResult: null,
      saving: false,
      testing: false,
      showApiKey: false
    }
  },
  mounted() {
    this.loadSettings();
    this.loadApiStatus();
  },
  methods: {
    async loadSettings() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api-settings/settings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          this.settings = response.data.data;
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    },

    async loadApiStatus() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api-settings/status`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          this.apiStatus = response.data.data;
        }
      } catch (error) {
        console.error('Error loading API status:', error);
      }
    },

    async saveSettings() {
      this.saving = true;
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/api-settings/settings`, this.settings, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          await this.$swal.fire({
            title: 'موفقیت!',
            text: 'تنظیمات با موفقیت ذخیره شد',
            icon: 'success',
            confirmButtonText: 'باشه'
          });
          this.loadApiStatus();
        }
      } catch (error) {
        await this.$swal.fire({
          title: 'خطا!',
          text: 'خطا در ذخیره تنظیمات',
          icon: 'error',
          confirmButtonText: 'باشه'
        });
      } finally {
        this.saving = false;
      }
    },

    async testApi() {
      this.testing = true;
      this.testResult = null;
      
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/api-settings/test`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        this.testResult = response.data;
      } catch (error) {
        this.testResult = {
          success: false,
          message: 'خطا در تست API',
          error: error.message
        };
      } finally {
        this.testing = false;
      }
    },

    async refreshStatus() {
      await this.loadApiStatus();
    },

    toggleApiKeyVisibility() {
      this.showApiKey = !this.showApiKey;
      const input = document.querySelector('input[type="password"]');
      if (input) {
        input.type = this.showApiKey ? 'text' : 'password';
      }
    },

    formatCurrency(amount) {
      return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
    },

    formatDate(date) {
      return new Date(date).toLocaleString('fa-IR');
    }
  }
}
</script>
