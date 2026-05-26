
<template>
  <div class="trading-bot-container">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="bot-header">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 class="text-3xl font-bold text-white flex items-center mb-2">
              <div class="bot-icon-wrapper">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              </div>
              ربات معامله گر هوشمند
            </h1>
            <p class="text-yellow-200 text-lg">سود تضمینی روزانه با تحلیل هوشمند بازار</p>
          </div>
          <div class="flex items-center gap-4 flex-wrap">
            <!-- Demo Mode Toggle -->
            <div class="status-badge">
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
            <div class="text-left status-badge">
              <div class="text-sm text-yellow-200 mb-1">وضعیت اشتراک</div>
              <div :class="subscriptionStatus === 'active' ? 'text-green-400' : 'text-red-400'" class="font-bold text-xl flex items-center">
                <div :class="subscriptionStatus === 'active' ? 'bg-green-500' : 'bg-red-500'" class="status-dot"></div>
                {{ subscriptionStatus === 'active' ? 'فعال' : 'غیرفعال' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Subscription Section -->
      <div v-if="subscriptionStatus !== 'active' && !isDemoMode" class="subscription-card">
        <!-- Background decoration -->
        <div class="subscription-bg-decoration top-right"></div>
        <div class="subscription-bg-decoration bottom-left"></div>
        
        <div class="subscription-content">
          <div class="text-center">
            <div class="subscription-badge">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
              شروع کسب سود
            </div>
            <h2 class="text-4xl font-bold mb-4">ربات معامله گر هوشمند طلا</h2>
            <p class="text-xl mb-8 text-yellow-100">با خرید اشتراک، ربات به صورت خودکار برای شما معامله کرده و سود روزانه تضمینی محاسبه می‌کند</p>
            
            <div class="subscription-stats-grid">
              <div class="subscription-stat-card">
                <div class="stat-value">24%</div>
                <div class="stat-label">سود تضمینی ماهانه</div>
                <div class="stat-description">بازگشت سرمایه تضمین شده</div>
              </div>
              <div class="subscription-stat-card">
                <div class="stat-value">0.8%</div>
                <div class="stat-label">سود روزانه میانگین</div>
                <div class="stat-description">تا 1.5% در روز</div>
              </div>
              <div class="subscription-stat-card">
                <div class="stat-value">30 روز</div>
                <div class="stat-label">مدت اشتراک</div>
                <div class="stat-description">قابل تمدید</div>
              </div>
            </div>

            <button 
              @click="purchaseSubscription" 
              :disabled="loading"
              class="purchase-btn"
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
        <div class="stats-grid">
          <div class="stat-card stat-card-green">
            <div class="flex items-center justify-between mb-4">
              <span class="text-green-200 text-sm font-semibold">سرمایه فعلی</span>
              <div class="stat-icon-wrapper stat-icon-green">
                <svg class="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>
            <div class="text-3xl font-bold text-white mb-2">{{ formatCurrency(botStats.currentInvestment) }}</div>
            <div class="text-green-200 text-sm">مبلغ سرمایه‌گذاری شده</div>
          </div>
          
          <div class="stat-card stat-card-blue">
            <div class="flex items-center justify-between mb-4">
              <span class="text-blue-200 text-sm font-semibold">سود امروز</span>
              <div class="stat-icon-wrapper stat-icon-blue">
                <svg class="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                </svg>
              </div>
            </div>
            <div class="text-3xl font-bold text-white mb-2">{{ formatCurrency(botStats.todayProfit) }}</div>
            <div class="text-blue-200 text-sm">سود کسب شده امروز</div>
          </div>
          
          <div class="stat-card stat-card-purple">
            <div class="flex items-center justify-between mb-4">
              <span class="text-purple-200 text-sm font-semibold">سود کل</span>
              <div class="stat-icon-wrapper stat-icon-purple">
                <svg class="w-5 h-5 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                </svg>
              </div>
            </div>
            <div class="text-3xl font-bold text-white mb-2">{{ formatCurrency(botStats.totalProfit) }}</div>
            <div class="text-purple-200 text-sm">مجموع سودها</div>
          </div>
          
          <div class="stat-card stat-card-orange">
            <div class="flex items-center justify-between mb-4">
              <span class="text-orange-200 text-sm font-semibold">تعداد معاملات</span>
              <div class="stat-icon-wrapper stat-icon-orange">
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
        <div class="bot-activity-section">
          <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h3 class="text-2xl font-bold text-white flex items-center">
              <div class="stat-icon-wrapper stat-icon-green ml-3">
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
            <div class="flex items-center justify-between p-4 bg-white/10 backdrop-blur rounded-xl border border-white/20 flex-wrap gap-4">
              <div class="flex items-center">
                <div class="status-dot bg-green-500 ml-3"></div>
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

            <div class="price-cards-grid">
              <div class="price-card price-card-high">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-green-800 font-semibold">بیشترین قیمت امروز</span>
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 14l5-5 5 5z"/>
                  </svg>
                </div>
                <div class="text-2xl font-bold text-green-700">{{ formatPrice(todayPrices.high) }}</div>
              </div>

              <div class="price-card price-card-low">
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
        <div class="trades-section">
          <div class="flex items-center justify-between mb-4 flex-wrap gap-4">
            <h3 class="text-xl font-bold text-gray-900">معاملات اخیر</h3>
            <button @click="refreshTrades" class="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              تازه سازی
            </button>
          </div>
          
          <div class="trades-table">
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
                <tr v-for="trade in recentTrades" :key="trade.id" class="border-b hover:bg-gray-50 transition-colors">
                  <td class="py-3 px-4">{{ formatTime(trade.time) }}</td>
                  <td class="py-3 px-4">
                    <span :class="trade.type === 'BUY' ? 'trade-type-buy' : 'trade-type-sell'" 
                          class="trade-type-badge">
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

<style scoped>
/* Trading Bot Page - Modern Mobile-First Design */
.trading-bot-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0d1117 0%, #161b22 50%, #0d1117 100%);
  padding: 1rem;
}

@media (max-width: 640px) {
  .trading-bot-container {
    padding: 0.75rem;
    padding-bottom: 100px;
  }
}

/* Header Section */
.bot-header {
  background: linear-gradient(135deg, rgba(234, 179, 8, 0.1) 0%, rgba(249, 115, 22, 0.1) 50%, rgba(239, 68, 68, 0.1) 100%);
  backdrop-filter: blur(16px);
  border-radius: 24px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(234, 179, 8, 0.2);
  box-shadow: 0 8px 32px rgba(234, 179, 8, 0.1);
}

@media (max-width: 640px) {
  .bot-header {
    padding: 1rem;
    border-radius: 20px;
  }
  
  .bot-header h1 {
    font-size: 1.25rem !important;
  }
  
  .bot-header p {
    font-size: 0.875rem !important;
  }
}

.bot-icon-wrapper {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #fbbf24, #f97316);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.75rem;
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
}

@media (max-width: 640px) {
  .bot-icon-wrapper {
    width: 2rem;
    height: 2rem;
    border-radius: 10px;
  }
  
  .bot-icon-wrapper svg {
    width: 1.25rem;
    height: 1.25rem;
  }
}

/* Status Badges */
.status-badge {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  margin-left: 0.5rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Subscription Card */
.subscription-card {
  background: linear-gradient(135deg, #eab308, #f97316, #ef4444);
  border-radius: 24px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(234, 179, 8, 0.3);
}

@media (max-width: 640px) {
  .subscription-card {
    padding: 1.5rem;
    border-radius: 20px;
  }
  
  .subscription-card h2 {
    font-size: 1.5rem !important;
  }
  
  .subscription-card p {
    font-size: 0.875rem !important;
  }
}

.subscription-bg-decoration {
  position: absolute;
  width: 16rem;
  height: 16rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  filter: blur(64px);
}

.subscription-bg-decoration.top-right {
  top: 0;
  right: 0;
}

.subscription-bg-decoration.bottom-left {
  bottom: 0;
  left: 0;
}

.subscription-content {
  position: relative;
  z-index: 10;
}

.subscription-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.subscription-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .subscription-stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.subscription-stat-card {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  text-align: center;
  transition: all 0.3s ease;
}

.subscription-stat-card:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-4px);
}

@media (max-width: 640px) {
  .subscription-stat-card {
    padding: 1rem;
  }
  
  .subscription-stat-card .stat-value {
    font-size: 2.5rem !important;
  }
}

.stat-value {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1.125rem;
  font-weight: 600;
}

.stat-description {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 0.5rem;
}

.purchase-btn {
  background: white;
  color: #ea580c;
  padding: 1rem 3rem;
  border-radius: 16px;
  font-weight: 700;
  font-size: 1.25rem;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 auto;
}

.purchase-btn:hover:not(:disabled) {
  background: #fef3c7;
  transform: scale(1.05);
  box-shadow: 0 12px 32px rgba(255, 255, 255, 0.3);
}

.purchase-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .purchase-btn {
    padding: 0.875rem 2rem;
    font-size: 1rem;
    width: 100%;
    justify-content: center;
  }
}

/* Stats Cards Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.stat-card {
  backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
}

@media (max-width: 640px) {
  .stat-card {
    padding: 1rem;
  }
  
  .stat-card .stat-value {
    font-size: 1.5rem !important;
  }
}

.stat-card-green {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.2));
  border-color: rgba(34, 197, 94, 0.3);
}

.stat-card-blue {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2));
  border-color: rgba(59, 130, 246, 0.3);
}

.stat-card-purple {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2));
  border-color: rgba(168, 85, 247, 0.3);
}

.stat-card-orange {
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(239, 68, 68, 0.2));
  border-color: rgba(249, 115, 22, 0.3);
}

.stat-icon-wrapper {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon-green { background: rgba(34, 197, 94, 0.3); }
.stat-icon-blue { background: rgba(59, 130, 246, 0.3); }
.stat-icon-purple { background: rgba(168, 85, 247, 0.3); }
.stat-icon-orange { background: rgba(249, 115, 22, 0.3); }

/* Bot Activity Section */
.bot-activity-section {
  background: linear-gradient(135deg, rgba(22, 27, 34, 0.8), rgba(13, 17, 23, 0.8));
  backdrop-filter: blur(16px);
  border-radius: 24px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

@media (max-width: 640px) {
  .bot-activity-section {
    padding: 1rem;
    border-radius: 20px;
  }
}

.price-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (max-width: 640px) {
  .price-cards-grid {
    grid-template-columns: 1fr;
  }
}

.price-card {
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid;
}

.price-card-high {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

.price-card-low {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
}

/* Trades Table */
.trades-section {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

@media (max-width: 640px) {
  .trades-section {
    padding: 1rem;
    border-radius: 12px;
  }
}

.trades-table {
  width: 100%;
  overflow-x: auto;
}

.trades-table th {
  text-align: right;
  padding: 0.75rem 1rem;
  color: #6b7280;
  font-size: 0.875rem;
  white-space: nowrap;
}

.trades-table td {
  padding: 0.75rem 1rem;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .trades-table th,
  .trades-table td {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
}

.trade-type-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.trade-type-buy {
  background: rgba(34, 197, 94, 0.1);
  color: #166534;
}

.trade-type-sell {
  background: rgba(239, 68, 68, 0.1);
  color: #991b1b;
}

/* Animations */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card,
.subscription-stat-card,
.bot-activity-section {
  animation: slideUp 0.5s ease-out;
}

/* Scrollbar Styling */
.trades-table::-webkit-scrollbar {
  height: 6px;
}

.trades-table::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}

.trades-table::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.trades-table::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
