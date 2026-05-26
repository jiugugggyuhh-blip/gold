const TradingBot = require('../model/tradingBot');
const User = require('../model/user');

class TradingBotDemoController {
    // دریافت آمار ربات برای دمو
    async getBotStats(req, res) {
        try {
            // آمار شبیه‌سازی شده برای دمو
            const demoStats = {
                currentInvestment: 1000000, // ۱ میلیون تومان
                todayProfit: 8000, // ۸ هزار تومان سود روزانه
                totalProfit: 240000, // ۲۴۰ هزار تومان سود کل (۳۰ روز)
                totalTrades: 45, // ۴۵ معامله در ۳۰ روز
                successRate: 85, // ۸۵٪ موفقیت
                avgDailyProfit: 8000, // میانگین سود روزانه
                subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // ۳۰ روز دیگر
            };

            res.json({
                success: true,
                data: demoStats
            });
        } catch (error) {
            console.error('Error getting demo bot stats:', error);
            res.status(500).json({
                success: false,
                error: 'خطا در دریافت آمار ربات'
            });
        }
    }

    // دریافت معاملات اخیر برای دمو
    async getRecentTrades(req, res) {
        try {
            // ایجاد معاملات شبیه‌سازی شده
            const demoTrades = [];
            const now = new Date();
            
            // ایجاد ۱۰ معامله اخیر
            for (let i = 0; i < 10; i++) {
                const tradeTime = new Date(now.getTime() - (i * 2 * 60 * 60 * 1000));
                const isProfit = Math.random() > 0.3; // ۷۰٪ سودده
                
                demoTrades.push({
                    _id: `demo_${i}`,
                    date: tradeTime,
                    type: isProfit ? 'buy' : 'sell',
                    amount: Math.floor(Math.random() * 100000) + 50000, // ۵۰ تا ۱۵۰ هزار تومان
                    price: Math.floor(Math.random() * 2000) + 2500000, // ۲.۵ تا ۲.۷ میلیون تومان
                    profit: isProfit ? Math.floor(Math.random() * 5000) + 1000 : -(Math.floor(Math.random() * 3000) + 500), // سود یا ضرر
                    status: isProfit ? 'profit' : 'loss'
                });
            }

            res.json({
                success: true,
                data: demoTrades
            });
        } catch (error) {
            console.error('Error getting demo trades:', error);
            res.status(500).json({
                success: false,
                error: 'خطا در دریافت معاملات'
            });
        }
    }

    // دریافت قیمت‌های امروز برای دمو
    async getTodayPrices(req, res) {
        try {
            // قیمت‌های شبیه‌سازی شده
            const demoPrices = {
                currentPrice: 2845000, // قیمت فعلی طلا
                openPrice: 2830000, // قیمت افتتاح
                highPrice: 2860000, // بالاترین قیمت
                lowPrice: 2820000, // پایین‌ترین قیمت
                change: 15000, // تغییر قیمت
                changePercent: 0.53 // درصد تغییر
            };

            res.json({
                success: true,
                data: demoPrices
            });
        } catch (error) {
            console.error('Error getting demo prices:', error);
            res.status(500).json({
                success: false,
                error: 'خطا در دریافت قیمت‌ها'
            });
        }
    }

    // دریافت قیمت فعلی برای دمو
    async getCurrentPrice(req, res) {
        try {
            const currentPrice = {
                price: 2845000,
                timestamp: new Date(),
                source: 'demo_api'
            };

            res.json({
                success: true,
                data: currentPrice
            });
        } catch (error) {
            console.error('Error getting current price:', error);
            res.status(500).json({
                success: false,
                error: 'خطا در دریافت قیمت فعلی'
            });
        }
    }

    // دریافت وضعیت اشتراک برای دمو
    async getSubscriptionStatus(req, res) {
        try {
            const userId = req.user._id || req.user.id;

            // ایجاد رکورد شبیه‌سازی شده
            let bot = await TradingBot.findOne({ userId });
            
            if (!bot) {
                bot = new TradingBot({
                    userId,
                    subscriptionStatus: 'active',
                    subscriptionStartDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // ۱۵ روز پیش شروع شده
                    subscriptionEndDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // ۱۵ روز دیگه تموم می‌شه
                    isActive: true,
                    investment: 1000000
                });
                await bot.save();
            }

            const daysLeft = Math.ceil((bot.subscriptionEndDate - new Date()) / (1000 * 60 * 60 * 24));
            
            res.json({
                success: true,
                data: {
                    status: bot.subscriptionStatus,
                    subscriptionEndDate: bot.subscriptionEndDate,
                    investment: bot.investment,
                    daysLeft: daysLeft > 0 ? daysLeft : 0
                }
            });
        } catch (error) {
            console.error('Error getting demo subscription status:', error);
            res.status(500).json({
                success: false,
                error: 'خطا در دریافت وضعیت اشتراک'
            });
        }
    }

    // خرید اشتراک دمو (رایگان)
    async purchaseSubscription(req, res) {
        try {
            const userId = req.user._id || req.user.id;

            // ایجاد یا به‌روزرسانی رکورد
            let bot = await TradingBot.findOne({ userId });
            
            if (!bot) {
                bot = new TradingBot({
                    userId,
                    subscriptionStatus: 'active',
                    subscriptionStartDate: new Date(),
                    subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    isActive: true,
                    investment: 1000000
                });
            } else {
                bot.subscriptionStatus = 'active';
                bot.subscriptionStartDate = new Date();
                bot.subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                bot.isActive = true;
                bot.investment = 1000000;
            }
            
            await bot.save();

            res.json({
                success: true,
                message: 'اشتراک دمو با موفقیت فعال شد (رایگان)',
                endDate: bot.subscriptionEndDate
            });
        } catch (error) {
            console.error('Error purchasing demo subscription:', error);
            res.status(500).json({
                success: false,
                error: 'خطا در فعال‌سازی اشتراک دمو'
            });
        }
    }
}

module.exports = new TradingBotDemoController();
