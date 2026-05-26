const ApiSettings = require('../model/apiSettings');
const goldPriceService = require('../services/goldPriceService');

class ApiSettingsController {
    // دریافت تنظیمات API
    async getSettings(req, res) {
        try {
            const settings = await ApiSettings.getSettings();
            res.json({
                success: true,
                data: {
                    goldApi: {
                        apiKey: settings.goldApi.apiKey,
                        apiUrl: settings.goldApi.apiUrl,
                        isActive: settings.goldApi.isActive,
                        lastUpdate: settings.goldApi.lastUpdate
                    }
                }
            });
        } catch (error) {
            console.error('Error getting API settings:', error);
            // اگر خطای timeout یا connection بود، مقادیر پیش‌فرض رو برگردون
            if (error.name === 'MongooseServerSelectionError' || error.message.includes('timeout')) {
                res.json({
                    success: true,
                    data: {
                        goldApi: {
                            apiKey: 'B3HsYAYhzDQsmPdg2s9QPHQmlkWG1HGu',
                            apiUrl: 'https://Api.BrsApi.ir/Market/Gold_Currency.php?key=',
                            isActive: true,
                            lastUpdate: new Date()
                        }
                    }
                });
            } else {
                res.status(500).json({ 
                    success: false, 
                    error: 'خطا در دریافت تنظیمات API' 
                });
            }
        }
    }

    // به‌روزرسانی تنظیمات API
    async updateSettings(req, res) {
        try {
            const { goldApi } = req.body;
            
            if (!goldApi) {
                return res.status(400).json({
                    success: false,
                    error: 'داده‌های نامعتبر'
                });
            }

            const settings = await ApiSettings.getSettings();
            
            // به‌روزرسانی تنظیمات
            if (goldApi.apiKey !== undefined) {
                settings.goldApi.apiKey = goldApi.apiKey;
            }
            
            if (goldApi.apiUrl !== undefined) {
                settings.goldApi.apiUrl = goldApi.apiUrl;
            }
            
            if (goldApi.isActive !== undefined) {
                settings.goldApi.isActive = goldApi.isActive;
            }

            await settings.save();
            
            // پاک کردن کش سرویس قیمت
            goldPriceService.clearCache();
            
            res.json({
                success: true,
                message: 'تنظیمات API با موفقیت به‌روزرسانی شد',
                data: {
                    goldApi: {
                        apiKey: settings.goldApi.apiKey,
                        apiUrl: settings.goldApi.apiUrl,
                        isActive: settings.goldApi.isActive,
                        lastUpdate: settings.goldApi.lastUpdate
                    }
                }
            });
        } catch (error) {
            console.error('Error updating API settings:', error);
            res.status(500).json({ 
                success: false, 
                error: 'خطا در به‌روزرسانی تنظیمات API' 
            });
        }
    }

    // تست API
    async testApi(req, res) {
        try {
            const settings = await ApiSettings.getSettings();
            
            if (!settings.goldApi.apiKey || !settings.goldApi.apiUrl) {
                return res.status(400).json({
                    success: false,
                    error: 'API Key و URL تنظیم نشده است'
                });
            }

            const result = await goldPriceService.fetchGoldPrice();
            
            res.json({
                success: true,
                data: {
                    status: result ? 'success' : 'failed',
                    message: result ? 'API در دسترس است' : 'API در دسترس نیست',
                    currentPrice: result ? result.currentPrice : null,
                    lastUpdate: settings.goldApi.lastUpdate
                }
            });
        } catch (error) {
            console.error('Error testing API:', error);
            res.status(500).json({
                success: false,
                error: 'خطا در تست API: ' + error.message
            });
        }
    }

    // دریافت وضعیت فعلی API
    async getApiStatus(req, res) {
        try {
            const settings = await ApiSettings.getSettings();
            const priceData = await goldPriceService.getGoldPrice();
            
            res.json({
                success: true,
                data: {
                    isActive: settings.goldApi.isActive,
                    lastUpdate: settings.goldApi.lastUpdate,
                    currentPrice: priceData.currentPrice,
                    isFallback: priceData.isFallback || false,
                    apiKey: settings.goldApi.apiKey ? '***' + settings.goldApi.apiKey.slice(-4) : 'تنظیم نشده'
                }
            });
        } catch (error) {
            console.error('Error getting API status:', error);
            res.status(500).json({
                success: false,
                error: 'خطا در دریافت وضعیت API'
            });
        }
    }
}

module.exports = new ApiSettingsController();
