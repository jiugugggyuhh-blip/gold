const TradingBot = require('../model/tradingBot');
const User = require('../model/user');
const axios = require('axios');
const moment = require('moment');
const goldPriceService = require('../services/goldPriceService');
const historygoldmodel = require('../model/historygold');

// دریافت قیمت واقعی طلا از API جدید
const getGoldPrice = async () => {
    try {
        return await goldPriceService.getPriceForBot();
    } catch (error) {
        console.error('Error getting real gold price:', error);
        return 2800000;
    }
};

// محاسبه سود بر اساس نوسان واقعی بازار (بالاترین و پایین‌ترین قیمت روز)
const calculateDailyProfitFromMarket = async (investment, date = null) => {
    try {
        const targetDate = date || new Date();
        targetDate.setHours(0, 0, 0, 0);
        
        const prevDate = new Date(targetDate);
        prevDate.setDate(prevDate.getDate() - 1);
        
        // دریافت رکورد روز مورد نظر
        const dayRecord = await historygoldmodel.findOne({
            date: { $gte: targetDate, $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000) }
        });
        
        // دریافت رکورد روز قبل
        const prevDayRecord = await historygoldmodel.findOne({
            date: { $gte: prevDate, $lt: targetDate }
        });
        
        if (!dayRecord) {
            // اگر داده‌ای نبود، از قیمت لحظه‌ای استفاده کن
            const currentPrice = await getGoldPrice();
            return {
                dailyProfit: Math.round(investment * 0.008),
                highPrice: currentPrice,
                lowPrice: Math.round(currentPrice * 0.985),
                openPrice: Math.round(currentPrice * 0.99),
                closePrice: currentPrice,
                profitPercent: 0.8
            };
        }
        
        const openPrice = prevDayRecord ? prevDayRecord.price : dayRecord.price;
        const closePrice = dayRecord.price;
        const highPrice = dayRecord.highPrice || dayRecord.price;
        const lowPrice = dayRecord.lowPrice || dayRecord.price;
        
        // محاسبه نوسان روزانه
        const dailyRange = highPrice - lowPrice;
        const dailyChange = closePrice - openPrice;
        const dailyChangePercent = openPrice > 0 ? (dailyChange / openPrice) * 100 : 0;
        
        // محاسبه سود بر اساس نوسان واقعی
        let profitPercent = 0.5; // سود پایه
        
        if (dailyChangePercent > 0) {
            // بازار صعودی - سود بیشتر (تا 1.5%)
            profitPercent = Math.min(0.5 + (dailyChangePercent * 0.3), 1.5);
        } else if (dailyChangePercent < 0) {
            // بازار نزولی - سود کمتر ولی همچنان مثبت
            profitPercent = Math.max(0.3 + Math.abs(dailyChangePercent * 0.15), 0.4);
        } else {
            // بازار ثابت - سود متوسط
            profitPercent = 0.7 + Math.random() * 0.2;
        }
        
        const dailyProfit = Math.round((investment * profitPercent) / 100);
        
        return {
            dailyProfit,
            highPrice,
            lowPrice,
            openPrice,
            closePrice,
            profitPercent,
            dailyRange,
            dailyChangePercent
        };
    } catch (error) {
        console.error('Error calculating daily profit:', error);
        return {
            dailyProfit: Math.round(investment * 0.008),
            highPrice: 2800000,
            lowPrice: 2750000,
            openPrice: 2780000,
            closePrice: 2800000,
            profitPercent: 0.8
        };
    }
};

// ایجاد معاملات مجازی بر اساس قیمت واقعی
const generateVirtualTrades = async (userId, investment, dailyProfit) => {
    const trades = [];
    const numTrades = Math.floor(Math.random() * 5) + 3; // 3 تا 7 معامله در روز
    const profitPerTrade = dailyProfit / numTrades;
    
    // دریافت قیمت‌های مختلف در طول روز برای شبیه‌سازی معاملات واقعی
    const currentPrice = await getGoldPrice();
    const priceVariation = currentPrice * 0.02; // 2% نوسان قیمت در طول روز
    
    for (let i = 0; i < numTrades; i++) {
        // ایجاد قیمت‌های مختلف برای هر معامله (شبیه‌سازی نوسان در طول روز)
        const randomVariation = (Math.random() - 0.5) * priceVariation;
        const tradePrice = Math.round(currentPrice + randomVariation);
        const amount = (investment / tradePrice) * 0.1; // 10% سرمایه در هر معامله
        
        // هوشمندانه‌تر کردن نوع معامله بر اساس جهت قیمت
        let tradeType = i % 2 === 0 ? 'BUY' : 'SELL';
        
        // اگر قیمت در حال افزایش است، معاملات خرید بیشتر
        if (randomVariation > 0 && Math.random() > 0.3) {
            tradeType = 'BUY';
        }
        // اگر قیمت در حال کاهش است، معاملات فروش بیشتر
        else if (randomVariation < 0 && Math.random() > 0.3) {
            tradeType = 'SELL';
        }
        
        trades.push({
            type: tradeType,
            amount: Math.round(amount * 100) / 100,
            price: tradePrice,
            profit: Math.round(profitPerTrade),
            time: new Date(Date.now() - (numTrades - i) * 3600000) // هر معامله با یک ساعت فاصله
        });
    }
    
    return trades;
};

class TradingBotController {
    // دریافت وضعیت اشتراک کاربر
    async getSubscriptionStatus(req, res) {
        try {
            const userId = req.user.id;
            let bot = await TradingBot.findOne({ userId });
            
            if (!bot) {
                bot = new TradingBot({ userId });
                await bot.save();
            }
            
            // بررسی انقضای اشتراک
            if (bot.subscriptionEndDate && new Date() > bot.subscriptionEndDate) {
                bot.subscriptionStatus = 'expired';
                bot.isActive = false;
                await bot.save();
            }
            
            res.json({
                status: bot.subscriptionStatus,
                subscriptionEndDate: bot.subscriptionEndDate,
                investment: bot.investment
            });
        } catch (error) {
            console.error('Error getting subscription status:', error);
            res.status(500).json({ error: 'خطا در دریافت وضعیت اشتراک' });
        }
    }

    // خرید اشتراک ربات
    async purchaseSubscription(req, res) {
        try {
            const userId = req.user.id;
            const user = await User.findById(userId);
            
            if (!user) {
                return res.status(404).json({ error: 'کاربر یافت نشد' });
            }
            
            // قیمت اشتراک (می‌تونه از تنظیمات خونده بشه)
            const subscriptionPrice = 1000000; // 1 میلیون تومان
            
            if (user.toman < subscriptionPrice) {
                return res.status(400).json({ error: 'موجودی کافی نیست' });
            }
            
            // کسر هزینه اشتراک
            user.toman -= subscriptionPrice;
            await user.save();
            
            // ایجاد یا به‌روزرسانی اشتراک ربات
            let bot = await TradingBot.findOne({ userId });
            if (!bot) {
                bot = new TradingBot({ userId });
            }
            
            bot.subscriptionStatus = 'active';
            bot.subscriptionStartDate = new Date();
            bot.subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 روز
            bot.isActive = true;
            bot.investment = subscriptionPrice;
            
            await bot.save();
            
            res.json({
                success: true,
                message: 'اشتراک ربات با موفقیت فعال شد',
                endDate: bot.subscriptionEndDate
            });
        } catch (error) {
            console.error('Error purchasing subscription:', error);
            res.status(500).json({ error: 'خطا در خرید اشتراک' });
        }
    }

    // دریافت آمار ربات کاربر
    async getBotStats(req, res) {
        try {
            const userId = req.user.id;
            const bot = await TradingBot.findOne({ userId });
            
            if (!bot || bot.subscriptionStatus !== 'active') {
                return res.status(400).json({ error: 'اشتراک ربات فعال نیست' });
            }
            
            // دریافت اطلاعات سود از دیتابیس (که توسط cron job محاسبه شده)
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            // اگر هنوز سود امروز محاسبه نشده، محاسبه کن
            if (!bot.lastTradeTime || bot.lastTradeTime < today) {
                const profitData = await calculateDailyProfitFromMarket(bot.investment);
                
                bot.todayProfit = profitData.dailyProfit;
                bot.totalProfit += profitData.dailyProfit;
                
                // ایجاد معاملات مجازی امروز
                const newTrades = await generateVirtualTrades(userId, bot.investment, profitData.dailyProfit);
                bot.trades.push(...newTrades);
                bot.totalTrades += newTrades.length;
                bot.lastTradeTime = new Date();
                
                await bot.save();
            }
            
            // دریافت اطلاعات نوسان بازار برای نمایش به کاربر
            const marketData = await calculateDailyProfitFromMarket(bot.investment);
            
            res.json({
                currentInvestment: bot.investment,
                todayProfit: bot.todayProfit,
                totalProfit: bot.totalProfit,
                totalTrades: bot.totalTrades,
                profitPercent: marketData.profitPercent,
                marketInfo: {
                    highPrice: marketData.highPrice,
                    lowPrice: marketData.lowPrice,
                    dailyRange: marketData.dailyRange,
                    dailyChangePercent: marketData.dailyChangePercent
                }
            });
        } catch (error) {
            console.error('Error getting bot stats:', error);
            res.status(500).json({ error: 'خطا در دریافت آمار ربات' });
        }
    }

    // دریافت گزارش عملکرد دیروز (24 ساعت گذشته)
    async getYesterdayReport(req, res) {
        try {
            const userId = req.user.id;
            const bot = await TradingBot.findOne({ userId });
            
            if (!bot || bot.subscriptionStatus !== 'active') {
                return res.status(400).json({ error: 'اشتراک ربات فعال نیست' });
            }
            
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            yesterday.setHours(0, 0, 0, 0);
            
            // دریافت اطلاعات سود دیروز
            const profitData = await calculateDailyProfitFromMarket(bot.investment, yesterday);
            
            res.json({
                date: yesterday,
                investment: bot.investment,
                profit: profitData.dailyProfit,
                profitPercent: profitData.profitPercent,
                marketData: {
                    highPrice: profitData.highPrice,
                    lowPrice: profitData.lowPrice,
                    openPrice: profitData.openPrice,
                    closePrice: profitData.closePrice,
                    dailyRange: profitData.dailyRange,
                    dailyChangePercent: profitData.dailyChangePercent
                }
            });
        } catch (error) {
            console.error('Error getting yesterday report:', error);
            res.status(500).json({ error: 'خطا در دریافت گزارش دیروز' });
        }
    }

    // دریافت معاملات اخیر
    async getRecentTrades(req, res) {
        try {
            const userId = req.user.id;
            const bot = await TradingBot.findOne({ userId });
            
            if (!bot || bot.subscriptionStatus !== 'active') {
                return res.json([]);
            }
            
            // دریافت 10 معامله اخیر
            const recentTrades = bot.trades
                .sort((a, b) => b.time - a.time)
                .slice(0, 10)
                .map(trade => ({
                    id: trade._id,
                    type: trade.type,
                    amount: trade.amount,
                    price: trade.price,
                    profit: trade.profit,
                    time: trade.time
                }));
            
            res.json(recentTrades);
        } catch (error) {
            console.error('Error getting recent trades:', error);
            res.status(500).json({ error: 'خطا در دریافت معاملات' });
        }
    }

    // دریافت قیمت لحظه‌ای طلا
    async getCurrentPrice(req, res) {
        try {
            const price = await getGoldPrice();
            res.json({
                price: price,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error getting current price:', error);
            res.status(500).json({ error: 'خطا در دریافت قیمت لحظه‌ای' });
        }
    }

    // دریافت قیمت‌های امروز از API واقعی
    async getTodayPrices(req, res) {
        try {
            const currentPrice = await getGoldPrice();
            
            // دریافت قیمت‌های امروز از تاریخچه برای محاسبه بالا و پایین
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            let highPrice = currentPrice;
            let lowPrice = currentPrice;
            
            try {
                const todayHistory = await historygoldmodel.find({
                    date: { $gte: today }
                }).sort({ date: 1 });
                
                if (todayHistory.length > 0) {
                    const prices = todayHistory.map(h => h.price);
                    prices.push(currentPrice);
                    
                    highPrice = Math.max(...prices);
                    lowPrice = Math.min(...prices);
                } else {
                    // اگر امروز داده‌ای نداشتیم، نوسان تخمینی محاسبه می‌کنیم
                    const estimatedVariation = currentPrice * 0.015; // 1.5% نوسان تخمینی
                    highPrice = Math.round(currentPrice + estimatedVariation);
                    lowPrice = Math.round(currentPrice - estimatedVariation);
                }
            } catch (historyError) {
                console.error('Error getting price history for today:', historyError);
                // در صورت خطا، نوسان تخمینی استفاده می‌کنیم
                const estimatedVariation = currentPrice * 0.015;
                highPrice = Math.round(currentPrice + estimatedVariation);
                lowPrice = Math.round(currentPrice - estimatedVariation);
            }
            
            res.json({
                high: Math.round(highPrice),
                low: Math.round(lowPrice),
                current: currentPrice
            });
        } catch (error) {
            console.error('Error getting today prices:', error);
            res.status(500).json({ error: 'خطا در دریافت قیمت‌ها' });
        }
    }

    // آمار برای ادمین
    async getAdminStats(req, res) {
        try {
            const totalActiveUsers = await TradingBot.countDocuments({ 
                subscriptionStatus: 'active',
                isActive: true 
            });
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            // درآمد امروز از اشتراک‌ها
            const todayRevenue = await TradingBot.aggregate([
                {
                    $match: {
                        subscriptionStartDate: { $gte: today }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1000000 } // قیمت هر اشتراک
                    }
                }
            ]);
            
            // کل معاملات امروز
            const todayTrades = await TradingBot.aggregate([
                {
                    $match: {
                        'trades.time': { $gte: today }
                    }
                },
                {
                    $project: {
                        tradeCount: {
                            $size: {
                                $filter: {
                                    input: '$trades',
                                    cond: { $gte: ['$$this.time', today] }
                                }
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$tradeCount' }
                    }
                }
            ]);
            
            // میانگین سود کاربران
            const avgProfitResult = await TradingBot.aggregate([
                {
                    $match: {
                        subscriptionStatus: 'active'
                    }
                },
                {
                    $group: {
                        _id: null,
                        avgProfit: { $avg: '$totalProfit' },
                        avgInvestment: { $avg: '$investment' }
                    }
                }
            ]);
            
            const avgProfit = avgProfitResult.length > 0 ? 
                ((avgProfitResult[0].avgProfit / avgProfitResult[0].avgInvestment) * 100).toFixed(2) : 0;
            
            res.json({
                totalActiveUsers,
                todayRevenue: todayRevenue.length > 0 ? todayRevenue[0].total : 0,
                todayTrades: todayTrades.length > 0 ? todayTrades[0].total : 0,
                avgProfit: parseFloat(avgProfit)
            });
        } catch (error) {
            console.error('Error getting admin stats:', error);
            res.status(500).json({ error: 'خطا در دریافت آمار ادمین' });
        }
    }

    // دریافت لیست کاربران برای ادمین
    async getAdminUsers(req, res) {
        try {
            const bots = await TradingBot.find({})
                .populate('userId', 'name email')
                .sort({ createdAt: -1 });
            
            const users = bots.map(bot => ({
                id: bot.userId._id,
                name: bot.userId.name,
                email: bot.userId.email,
                subscriptionStatus: bot.subscriptionStatus,
                investment: bot.investment,
                totalProfit: bot.totalProfit,
                totalTrades: bot.totalTrades,
                startDate: bot.subscriptionStartDate
            }));
            
            res.json(users);
        } catch (error) {
            console.error('Error getting admin users:', error);
            res.status(500).json({ error: 'خطا در دریافت لیست کاربران' });
        }
    }

    // تغییر وضعیت کاربر (برای ادمین)
    async toggleUserStatus(req, res) {
        try {
            const { userId } = req.params;
            const bot = await TradingBot.findOne({ userId });
            
            if (!bot) {
                return res.status(404).json({ error: 'کاربر یافت نشد' });
            }
            
            bot.isActive = !bot.isActive;
            bot.subscriptionStatus = bot.isActive ? 'active' : 'inactive';
            await bot.save();
            
            res.json({
                success: true,
                status: bot.subscriptionStatus
            });
        } catch (error) {
            console.error('Error toggling user status:', error);
            res.status(500).json({ error: 'خطا در تغییر وضعیت کاربر' });
        }
    }
}

module.exports = new TradingBotController();
