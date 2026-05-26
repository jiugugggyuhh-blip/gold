
<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
    <div class="max-w-6xl mx-auto px-4">
      <!-- Header -->
      <div class="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-yellow-400/30 shadow-2xl">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-white flex items-center mb-2">
              <div class="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center ml-3 shadow-lg">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              </div>
              ربات معامله گر هوشمند
            </h1>
            <p class="text-yellow-200 text-lg">سود تضمینی روزانه با تحلیل هوشمند بازار</p>
          </div>
          <div class="flex items-center gap-4">
            <!-- Demo Mode Toggle -->
            <div class="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
              <div class="text-sm text-yellow-200 mb-2">حالت نمایش</div>
              <button 
                @click="toggleDemoMode" 
                :class="isDemoMode ? 'bg-purple-500 hover:bg-purple-600' : 'bg-green-500 hover:bg-green-600'"
                class="px-4 py-2 rounded-lg text-white font-semibold transition-colors flex items-center gap-2"
              >
                <svg v-if="isDemoMode" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41 1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 2.58 4.85L12 22 2 17.13l3.66-3.96-5-4.83z"/>
                </svg>
                {{ isDemoMode ? 'حالت دمو' : 'حالت واقعی' }}
              </button>
            </div>
            
            <!-- Subscription Status -->
            <div class="text-left bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
              <div class="text-sm text-yellow-200 mb-1">وضعیت اشتراک</div>
              <div :class="subscriptionStatus === 'active' ? 'text-green-400' : 'text-red-400'" class="font-bold text-xl flex items-center">
                <div :class="subscriptionStatus === 'active' ? 'bg-green-500' : 'bg-red-500'" class="w-2 h-2 rounded-full ml-2 animate-pulse"></div>
                {{ subscriptionStatus === 'active' ? 'فعال' : 'غیرفعال' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Subscription Section -->
      <div v-if="subscriptionStatus !== 'active' && !isDemoMode" class="bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 rounded-3xl p-8 mb-6 text-white shadow-2xl relative overflow-hidden">
        <!-- Background decoration -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        
        <div class="relative z-10">
          <div class="text-center">
            <div class="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur px-4 py-2 text-sm font-semibold mb-4">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
              شروع کسب سود
            </div>
            <h2 class="text-4xl font-bold mb-4">ربات معامله گر هوشمند طلا</h2>
            <p class="text-xl mb-8 text-yellow-100">با خرید اشتراک، ربات به صورت خودکار برای شما معامله کرده و سود روزانه تضمینی محاسبه می‌کند</p>
            
            <div class="grid md:grid-cols-3 gap-6 mb-8">
              <div class="bg-white/20 backdrop-blur rounded-2xl p-6 border border-white/30 hover:bg-white/30 transition">
                <div class="text-5xl font-bold mb-2">24%</div>
                <div class="text-lg font-semibold">سود تضمینی ماهانه</div>
                <div class="text-sm text-yellow-100 mt-2">بازگشت سرمایه تضمین شده</div>
              </div>
              <div class="bg-white/20 backdrop-blur rounded-2xl p-6 border border-white/30 hover:bg-white/30 transition">
                <div class="text-5xl font-bold mb-2">0.8%</div>
                <div class="text-lg font-semibold">سود روزانه میانگین</div>
                <div class="text-sm text-yellow-100 mt-2">تا 1.5% در روز</div>
              </div>
              <div class="bg-white/20 backdrop-blur rounded-2xl p-6 border border-white/30 hover:bg-white/30 transition">
                <div class="text-5xl font-bold mb-2">30 روز</div>
                <div class="text-lg font-semibold">مدت اشتراک</div>
                <div class="text-sm text-yellow-100 mt-2">قابل تمدید</div>
              </div>
            </div>

            <button 
              @click="purchaseSubscription" 
              :disabled="loading"
              class="bg-white text-orange-600 px-12 py-4 rounded-2xl font-bold text-xl hover:bg-yellow-50 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
              {{ loading ? 'در حال پردازش...' : 'خرید اشتراک (۱,۰۰۰,۰۰۰ تومان)' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Bot Dashboard -->
      <div v-if="subscriptionStatus === 'active' || isDemoMode">
        <!-- Stats Cards -->
        <div class="grid md:grid-cols-4 gap-6 mb-6">
          <div class="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-lg rounded-2xl p-6 border border-green-400/30 shadow-xl">
            <div class="flex items-center justify-between mb-4">
              <span class="text-green-200 text-sm font-semibold">سرمایه فعلی</span>
              <div class="w-10 h-10 bg-green-500/30 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>
            <div class="text-3xl font-bold text-white mb-2">{{ formatCurrency(botStats.currentInvestment) }}</div>
            <div class="text-green-200 text-sm">مبلغ سرمایه‌گذاری شده</div>
          </div>
          
          <div class="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-400/30 shadow-xl">
            <div class="flex items-center justify-between mb-4">
              <span class="text-blue-200 text-sm font-semibold">سود امروز</span>
              <div class="w-10 h-10 bg-blue-500/30 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                </svg>
              </div>
            </div>
            <div class="text-3xl font-bold text-white mb-2">{{ formatCurrency(botStats.todayProfit) }}</div>
            <div class="text-blue-200 text-sm">سود کسب شده امروز</div>
          </div>
          
          <div class="bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-400/30 shadow-xl">
            <div class="flex items-center justify-between mb-4">
              <span class="text-purple-200 text-sm font-semibold">سود کل</span>
              <div class="w-10 h-10 bg-purple-500/30 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                </svg>
              </div>
            </div>
            <div class="text-3xl font-bold text-white mb-2">{{ formatCurrency(botStats.totalProfit) }}</div>
            <div class="text-purple-200 text-sm">مجموع سودها</div>
          </div>
          
          <div class="bg-gradient-to-br from-orange-500/20 to-red-600/20 backdrop-blur-lg rounded-2xl p-6 border border-orange-400/30 shadow-xl">
            <div class="flex items-center justify-between mb-4">
              <span class="text-orange-200 text-sm font-semibold">تعداد معاملات</span>
              <div class="w-10 h-10 bg-orange-500/30 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-orange-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                </svg>
              </div>
            </div>
            <div class="text-3xl font-bold text-white mb-2">{{ botStats.totalTrades }}</div>
            <div class="text-orange-200 text-sm">معاملات انجام شده</div>
          </div>
        </div>

        <!-- Bot Activity -->
        <div class="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-gray-700/50 shadow-xl">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-white flex items-center">
              <div class="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center ml-3">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              فعالیت امروز ربات
            </h3>
            <div class="text-sm text-gray-400">
              آخرین آپدیت: {{ formatTime(lastUpdate) }}
            </div>
          </div>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-white/10 backdrop-blur rounded-xl border border-white/20">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-500 rounded-full ml-3 animate-pulse"></div>
                <div>
                  <div class="font-semibold">ربات فعال است</div>
                  <div class="text-sm text-gray-500">در حال تحلیل بازار و اجرای معاملات</div>
                </div>
              </div>
              <div class="text-left">
                <div class="text-sm text-gray-500">آخرین به‌روزرسانی</div>
                <div class="font-semibold">{{ formatTime(lastUpdate) }}</div>
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <div class="p-4 bg-green-50 rounded-lg border border-green-200">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-green-800 font-semibold">بیشترین قیمت امروز</span>
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 14l5-5 5 5z"/>
                  </svg>
                </div>
                <div class="text-2xl font-bold text-green-700">{{ formatPrice(todayPrices.high) }}</div>
              </div>

              <div class="p-4 bg-red-50 rounded-lg border border-red-200">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-red-800 font-semibold">کمترین قیمت امروز</span>
                  <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                </div>
                <div class="text-2xl font-bold text-red-700">{{ formatPrice(todayPrices.low) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Trades -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-gray-900">معاملات اخیر</h3>
            <button @click="refreshTrades" class="text-blue-600 hover:text-blue-700 font-semibold">
              تازه سازی
            </button>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b">
                  <th class="text-right py-3 px-4 text-gray-600">زمان</th>
                  <th class="text-right py-3 px-4 text-gray-600">نوع</th>
                  <th class="text-right py-3 px-4 text-gray-600">قیمت</th>
                  <th class="text-right py-3 px-4 text-gray-600">مقدار</th>
                  <th class="text-right py-3 px-4 text-gray-600">سود</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="trade in recentTrades" :key="trade.id" class="border-b hover:bg-gray-50">
                  <td class="py-3 px-4">{{ formatTime(trade.time) }}</td>
                  <td class="py-3 px-4">
                    <span :class="trade.type === 'BUY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
                          class="px-2 py-1 rounded text-xs font-semibold">
                      {{ trade.type === 'BUY' ? 'خرید' : 'فروش' }}
                    </span>
                  </td>
                  <td class="py-3 px-4">{{ formatPrice(trade.price) }}</td>
                  <td class="py-3 px-4">{{ trade.amount }} گرم</td>
                  <td class="py-3 px-4">
                    <span :class="trade.profit >= 0 ? 'text-green-600' : 'text-red-600'" class="font-semibold">
                      {{ formatCurrency(trade.profit) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'TradingBot',
  data() {
    return {
      subscriptionStatus: 'inactive',
      botStats: {
        currentInvestment: 0,
        todayProfit: 0,
        totalProfit: 0,
        totalTrades: 0
      },
      todayPrices: {
        high: 0,
        low: 0
      },
      lastUpdate: new Date(),
      recentTrades: [],
      loading: false,
      isDemoMode: false // حالت دمو پیش‌فرض خاموش
    }
  },
  async mounted() {
    await this.checkSubscription();
    // اگر اشتراک فعال بود یا حالت دمو فعال بود، داده‌ها رو بارگذاری کن
    if (this.subscriptionStatus === 'active' || this.isDemoMode) {
      await this.loadBotData();
      this.startRealTimeUpdates();
    }
  },
  methods: {
    // سوئیچ بین حالت واقعی و دمو
    toggleDemoMode() {
      this.isDemoMode = !this.isDemoMode;
      
      // بارگذاری مجدد داده‌ها با حالت جدید
      if (this.subscriptionStatus === 'active') {
        if (this.isDemoMode) {
          this.loadDemoData();
        } else {
          this.loadBotData();
        }
      }
      
      // نمایش پیام به کاربر
      if (this.$swal) {
        this.$swal.fire({
          title: 'تغییر حالت',
          text: this.isDemoMode ? 'حالت دمو فعال شد' : 'حالت واقعی فعال شد',
          icon: 'info',
          confirmButtonText: 'باشه',
          timer: 2000
        });
      }
    },
    
    async checkSubscription() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.push('/login');
          return;
        }
        
        // اگر حالت دمو فعال باشه، از API دمو استفاده کن
        const apiPath = this.isDemoMode ? '/bot/demo' : '/bot';
        const response = await axios.get(`${process.env.VUE_APP_API_URL}${apiPath}/subscription`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.subscriptionStatus = response.data.status;
      } catch (error) {
        console.error('Error checking subscription:', error);
        this.subscriptionStatus = 'inactive';
        // اگر خطای 404 بود، از حالت مخالف استفاده کن
        if (error.response?.status === 404) {
          if (this.isDemoMode) {
            this.checkRealSubscription();
          } else {
            this.checkDemoSubscription();
          }
        }
      }
    },
    
    // بررسی اشتراک واقعی
    async checkRealSubscription() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/bot/subscription`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.subscriptionStatus = response.data.status;
      } catch (error) {
        console.error('Error checking real subscription:', error);
        this.subscriptionStatus = 'inactive';
      }
    },
    
    // بررسی اشتراک دمو
    async checkDemoSubscription() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/bot/demo/subscription`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.subscriptionStatus = response.data.status;
      } catch (error) {
        console.error('Error checking demo subscription:', error);
        this.subscriptionStatus = 'inactive';
      }
    },
    
    async purchaseSubscription() {
      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/bot/purchase`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          this.subscriptionStatus = 'active';
          await this.loadBotData();
          this.startRealTimeUpdates();
          if (this.$swal) {
            await this.$swal.fire({
              title: 'موفقیت!',
              text: 'اشتراک ربات با موفقیت فعال شد',
              icon: 'success',
              confirmButtonText: 'باشه'
            });
          } else {
            alert('اشتراک ربات با موفقیت فعال شد');
          }
        }
      } catch (error) {
        console.error('Purchase error:', error);
        // اگر خطای 404 بود، از API دمو استفاده کن
        if (error.response?.status === 404) {
          await this.purchaseDemoSubscription();
          return;
        }
        
        const errorMsg = error.response?.data?.error || 'خطا در خرید اشتراک';
        if (this.$swal) {
          await this.$swal.fire({
            title: 'خطا!',
            text: errorMsg,
            icon: 'error',
            confirmButtonText: 'باشه'
          });
        } else {
          alert(errorMsg);
        }
      } finally {
        this.loading = false;
      }
    },
    
    // خرید اشتراک دمو (رایگان)
    async purchaseDemoSubscription() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/bot/demo/purchase`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          this.subscriptionStatus = 'active';
          await this.loadDemoData();
          this.startRealTimeUpdates();
          if (this.$swal) {
            await this.$swal.fire({
              title: 'موفقیت!',
              text: 'اشتراک دمو با موفقیت فعال شد (رایگان)',
              icon: 'success',
              confirmButtonText: 'باشه'
            });
          } else {
            alert('اشتراک دمو با موفقیت فعال شد (رایگان)');
          }
        }
      } catch (error) {
        console.error('Demo purchase error:', error);
        const errorMsg = error.response?.data?.error || 'خطا در فعال‌سازی اشتراک دمو';
        if (this.$swal) {
          await this.$swal.fire({
            title: 'خطا!',
            text: errorMsg,
            icon: 'error',
            confirmButtonText: 'باشه'
          });
        } else {
          alert(errorMsg);
        }
      }
    },
    
    async loadBotData() {
      // اگر اشتراک فعال نبود ولی حالت دمو فعال بود، از API دمو استفاده کن
      if (this.subscriptionStatus !== 'active' && !this.isDemoMode) return;
      
      try {
        const token = localStorage.getItem('token');
        
        // انتخاب API بر اساس حالت
        const apiPath = this.isDemoMode ? '/bot/demo' : '/bot';
        
        const [statsRes, tradesRes, pricesRes] = await Promise.all([
          axios.get(`${process.env.VUE_APP_API_URL}${apiPath}/stats`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${process.env.VUE_APP_API_URL}${apiPath}/trades`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${process.env.VUE_APP_API_URL}${apiPath}/prices`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        this.botStats = statsRes.data;
        this.recentTrades = tradesRes.data || [];
        this.todayPrices = pricesRes.data || { high: 0, low: 0 };
        this.lastUpdate = new Date();
      } catch (error) {
        console.error('Error loading bot data:', error);
        // اگر خطای 404 بود، از API دمو استفاده کن
        if (error.response?.status === 404) {
          this.loadDemoData();
        }
      }
    },
    
    // بارگذاری داده‌های دمو در صورت خطا
    async loadDemoData() {
      try {
        const token = localStorage.getItem('token');
        const [statsRes, tradesRes, pricesRes] = await Promise.all([
          axios.get(`${process.env.VUE_APP_API_URL}/bot/demo/stats`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${process.env.VUE_APP_API_URL}/bot/demo/trades`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${process.env.VUE_APP_API_URL}/bot/demo/prices`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        this.botStats = statsRes.data;
        this.recentTrades = tradesRes.data || [];
        this.todayPrices = pricesRes.data || { high: 0, low: 0 };
        this.lastUpdate = new Date();
      } catch (error) {
        console.error('Error loading demo data:', error);
      }
    },
    
    startRealTimeUpdates() {
      setInterval(() => {
        this.loadBotData();
      }, 30000); // Update every 30 seconds
    },
    
    refreshTrades() {
      this.loadBotData();
    },
    
    formatCurrency(amount) {
      if (!amount) return '0 تومان';
      return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
    },
    
    formatPrice(price) {
      if (!price) return '0 تومان/گرم';
      return new Intl.NumberFormat('fa-IR').format(price) + ' تومان/گرم';
    },
    
    formatTime(time) {
      if (!time) return '--:--';
      return new Date(time).toLocaleTimeString('fa-IR');
    }
  }
}
</script>
