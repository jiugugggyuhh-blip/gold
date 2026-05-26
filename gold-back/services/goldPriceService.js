const axios = require('axios');
const ApiSettings = require('../model/apiSettings');

class GoldPriceService {
    constructor() {
        this.cache = null;
        this.cacheTime = 0;
        this.cacheDuration = 60000; // 1 دقیقه کش
    }

    async getApiSettings() {
        return await ApiSettings.getSettings();
    }

    async fetchGoldPrice() {
        try {
            const settings = await this.getApiSettings();
            
            if (!settings.goldApi.isActive) {
                throw new Error('API غیرفعال است');
            }

            const response = await axios.get(settings.goldApi.apiUrl + settings.goldApi.apiKey, {
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            if (response.data && (response.data.gold || response.data.currency)) {
                // به‌روزرسانی زمان آخرین آپدیت
                settings.goldApi.lastUpdate = new Date();
                await settings.save();

                return this.parseApiResponse(response.data);
            } else {
                throw new Error('پاسخ نامعتبر از API');
            }
        } catch (error) {
            console.error('Error fetching gold price from BRS API:', error.message);
            // در صورت خطا، از کش یا قیمت پیش‌فرض استفاده کن
            return this.getFallbackPrice();
        }
    }

    parseApiResponse(data) {
        try {
            // ساختار جدید API BRS:
            // {
            //   "gold": [
            //     {"symbol":"IR_GOLD_18K","name":"طلای 18 عیار","price":19460800,...},
            //     {"symbol":"IR_GOLD_24K","name":"طلای 24 عیار","price":25945000,...},
            //     {"symbol":"IR_GOLD_MELTED","name":"طلای آب‌شده نقدی","price":84300000,...}
            //   ],
            //   "currency": [...]
            // }
            
            let goldData = {
                currentPrice: 2800000,
                gold18: 2800000,
                gold24: 3200000,
                goldMelted: 84300000,
                change: 0,
                changePercent: 0,
                timestamp: new Date()
            };

            if (data.gold && Array.isArray(data.gold)) {
                // پیدا کردن طلای 18 عیار
                const gold18 = data.gold.find(item => item.symbol === 'IR_GOLD_18K');
                if (gold18) {
                    goldData.gold18 = parseInt(gold18.price);
                    goldData.currentPrice = goldData.gold18;
                    goldData.change = parseInt(gold18.change_value) || 0;
                    goldData.changePercent = parseFloat(gold18.change_percent) || 0;
                }
                
                // پیدا کردن طلای 24 عیار
                const gold24 = data.gold.find(item => item.symbol === 'IR_GOLD_24K');
                if (gold24) {
                    goldData.gold24 = parseInt(gold24.price);
                }
                
                // پیدا کردن طلای آب‌شده
                const goldMelted = data.gold.find(item => item.symbol === 'IR_GOLD_MELTED');
                if (goldMelted) {
                    goldData.goldMelted = parseInt(goldMelted.price);
                }
            }

            // اگر هیچ داده‌ای پیدا نشد، از مقادیر پیش‌فرض استفاده کن
            if (goldData.currentPrice === 2800000 && !data.gold) {
                console.warn('No valid gold data found in API response');
            }

            return goldData;
        } catch (error) {
            console.error('Error parsing API response:', error);
            return this.getFallbackPrice();
        }
    }

    parsePrice(priceString) {
        if (!priceString) return 2800000;
        
        // حذف کاراکترهای غیرعددی و تبدیل اعداد فارسی به انگلیسی
        const cleanPrice = String(priceString)
            .replace(/[^\d]/g, '')
            .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
        
        const price = parseInt(cleanPrice);
        return price > 0 ? price : 2800000;
    }

    parseChange(changeString) {
        if (!changeString) return 0;
        
        const cleanChange = String(changeString)
            .replace(/[^\d\-+]/g, '')
            .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
        
        const change = parseInt(cleanChange);
        return !isNaN(change) ? change : 0;
    }

    getFallbackPrice() {
        return {
            currentPrice: 2800000,
            gold18: 2800000,
            gold24: 3200000,
            change: 0,
            changePercent: 0,
            timestamp: new Date(),
            isFallback: true
        };
    }

    async getGoldPrice() {
        const now = Date.now();
        
        // اگر کش معتبر بود، از کش استفاده کن
        if (this.cache && (now - this.cacheTime) < this.cacheDuration) {
            return this.cache;
        }

        // دریافت قیمت جدید
        const priceData = await this.fetchGoldPrice();
        
        // ذخیره در کش
        this.cache = priceData;
        this.cacheTime = now;
        
        return priceData;
    }

    // برای استفاده در فرانت‌اند
    async getPriceForFrontend() {
        const data = await this.getGoldPrice();
        
        return {
            price: data.currentPrice,
            gold18: data.gold18,
            gold24: data.gold24,
            change: data.change,
            changePercent: data.changePercent,
            timestamp: data.timestamp,
            trend: data.change > 0 ? 'up' : data.change < 0 ? 'down' : 'stable'
        };
    }

    // برای ربات معامله گر
    async getPriceForBot() {
        const data = await this.getGoldPrice();
        return data.currentPrice;
    }

    // پاک کردن کش (برای تست یا آپدیت دستی)
    clearCache() {
        this.cache = null;
        this.cacheTime = 0;
    }
}

module.exports = new GoldPriceService();
