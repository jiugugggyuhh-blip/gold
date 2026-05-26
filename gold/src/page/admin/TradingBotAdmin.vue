<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h1 class="text-2xl font-bold text-gray-900 flex items-center">
          <svg class="w-8 h-8 ml-3 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
          </svg>
          مدیریت ربات معامله گر طلا
        </h1>
        <p class="text-gray-600 mt-1">مدیریت اشتراک‌ها و تنظیمات ربات معامله گر</p>
      </div>

      <!-- Stats Overview -->
      <div class="grid md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-500 text-sm">کل کاربران فعال</span>
            <svg class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
          </div>
          <div class="text-2xl font-bold text-gray-900">{{ stats.totalActiveUsers }}</div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-500 text-sm">درآمد امروز</span>
            <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
            </svg>
          </div>
          <div class="text-2xl font-bold text-green-600">{{ formatCurrency(stats.todayRevenue) }}</div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-500 text-sm">کل معاملات امروز</span>
            <svg class="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
            </svg>
          </div>
          <div class="text-2xl font-bold text-purple-600">{{ stats.todayTrades }}</div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-500 text-sm">میانگین سود کاربران</span>
            <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
            </svg>
          </div>
          <div class="text-2xl font-bold text-orange-600">{{ stats.avgProfit }}%</div>
        </div>
      </div>

      <!-- Bot Settings -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h3 class="text-xl font-bold text-gray-900 mb-4">تنظیمات ربات</h3>
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">قیمت اشتراک (تومان)</label>
            <input v-model="settings.subscriptionPrice" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">درصد سود روزانه (%)</label>
            <input v-model="settings.dailyProfitPercent" type="number" step="0.1" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">حداقل سرمایه (تومان)</label>
            <input v-model="settings.minInvestment" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">حداکثر سرمایه (تومان)</label>
            <input v-model="settings.maxInvestment" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
        </div>
        <button @click="saveSettings" class="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          ذخیره تنظیمات
        </button>
      </div>

      <!-- Users List -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-gray-900">کاربران ربات</h3>
          <div class="flex items-center space-x-2 space-x-reverse">
            <input v-model="searchUser" type="text" placeholder="جستجوی کاربر..." class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <button @click="refreshUsers" class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
              تازه سازی
            </button>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-right py-3 px-4 text-gray-600">کاربر</th>
                <th class="text-right py-3 px-4 text-gray-600">وضعیت اشتراک</th>
                <th class="text-right py-3 px-4 text-gray-600">سرمایه</th>
                <th class="text-right py-3 px-4 text-gray-600">سود کل</th>
                <th class="text-right py-3 px-4 text-gray-600">تاریخ شروع</th>
                <th class="text-right py-3 px-4 text-gray-600">عملیات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.id" class="border-b hover:bg-gray-50">
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center ml-2">
                      <span class="text-blue-600 font-semibold text-sm">{{ user.name.charAt(0) }}</span>
                    </div>
                    <div>
                      <div class="font-semibold">{{ user.name }}</div>
                      <div class="text-sm text-gray-500">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <span :class="user.subscriptionStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
                        class="px-2 py-1 rounded text-xs font-semibold">
                    {{ user.subscriptionStatus === 'active' ? 'فعال' : 'منقضی' }}
                  </span>
                </td>
                <td class="py-3 px-4 font-semibold">{{ formatCurrency(user.investment) }}</td>
                <td class="py-3 px-4">
                  <span :class="user.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'" class="font-semibold">
                    {{ formatCurrency(user.totalProfit) }}
                  </span>
                </td>
                <td class="py-3 px-4 text-gray-600">{{ formatDate(user.startDate) }}</td>
                <td class="py-3 px-4">
                  <div class="flex items-center space-x-2 space-x-reverse">
                    <button @click="toggleUserStatus(user)" 
                            :class="user.subscriptionStatus === 'active' ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'"
                            class="px-3 py-1 rounded text-sm font-semibold transition">
                      {{ user.subscriptionStatus === 'active' ? 'غیرفعال' : 'فعال' }}
                    </button>
                    <button @click="viewUserDetails(user)" class="bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm font-semibold hover:bg-blue-200 transition">
                      جزئیات
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'TradingBotAdmin',
  data() {
    return {
      stats: {
        totalActiveUsers: 0,
        todayRevenue: 0,
        todayTrades: 0,
        avgProfit: 0
      },
      settings: {
        subscriptionPrice: 1000000,
        dailyProfitPercent: 0.8,
        minInvestment: 100000,
        maxInvestment: 10000000
      },
      users: [],
      searchUser: ''
    }
  },
  computed: {
    filteredUsers() {
      if (!this.searchUser) return this.users;
      return this.users.filter(user => 
        user.name.toLowerCase().includes(this.searchUser.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchUser.toLowerCase())
      );
    }
  },
  mounted() {
    this.loadStats();
    this.loadSettings();
    this.loadUsers();
  },
  methods: {
    async loadStats() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/bot/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.stats = response.data;
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    },
    
    async loadSettings() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/bot/admin/settings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.settings = response.data;
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    },
    
    async saveSettings() {
      try {
        const token = localStorage.getItem('token');
        await axios.post(`${process.env.VUE_APP_API_URL}/bot/admin/settings`, this.settings, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.$swal('موفقیت!', 'تنظیمات با موفقیت ذخیره شد', 'success');
      } catch (error) {
        this.$swal('خطا!', 'خطا در ذخیره تنظیمات', 'error');
      }
    },
    
    async loadUsers() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/bot/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.users = response.data;
      } catch (error) {
        console.error('Error loading users:', error);
      }
    },
    
    async toggleUserStatus(user) {
      try {
        const token = localStorage.getItem('token');
        await axios.post(`${process.env.VUE_APP_API_URL}/bot/admin/users/${user.id}/toggle`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        user.subscriptionStatus = user.subscriptionStatus === 'active' ? 'inactive' : 'active';
      } catch (error) {
        this.$swal('خطا!', 'خطا در تغییر وضعیت کاربر', 'error');
      }
    },
    
    viewUserDetails(user) {
      this.$swal({
        title: 'جزئیات کاربر',
        html: `
          <div style="text-align: right;">
            <p><strong>نام:</strong> ${user.name}</p>
            <p><strong>ایمیل:</strong> ${user.email}</p>
            <p><strong>سرمایه:</strong> ${this.formatCurrency(user.investment)}</p>
            <p><strong>سود کل:</strong> ${this.formatCurrency(user.totalProfit)}</p>
            <p><strong>تعداد معاملات:</strong> ${user.totalTrades}</p>
            <p><strong>تاریخ شروع:</strong> ${this.formatDate(user.startDate)}</p>
          </div>
        `,
        icon: 'info'
      });
    },
    
    refreshUsers() {
      this.loadUsers();
      this.loadStats();
    },
    
    formatCurrency(amount) {
      return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
    },
    
    formatDate(date) {
      return new Date(date).toLocaleDateString('fa-IR');
    }
  }
}
</script>
