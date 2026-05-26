const TradingBot = require('../model/tradingBot');
const User = require('../model/user');
const HourlyPrice = require('../model/hourlyPrice');
const axios = require('axios');

const BRS_KEY = 'B3HsYAYhzDQsmPdg2s9QPHQmlkWG1HGu';

// قیمت لحظه‌ای طلا آب‌شده از BRS
async function getLiveGoldPrice() {
    const res = await axios.get(`https://api.brsapi.ir/Market/Gold_Currency.php?key=${BRS_KEY}`, { timeout: 12000 });
    const melted = res.data.gold.find(i => i.symbol === 'IR_GOLD_MELTED');
    if (!melted) throw new Error('طلا آب‌شده در API نیست');
    return {
        price: melted.price,
        change: melted.change_value || 0,
        changePercent: melted.change_percent || 0,
    };
}

// آمار بالاترین و پایین‌ترین قیمت 24 ساعت اخیر از دیتابیس
async function get24hStats() {
    const since = new Date(Date.now() - 24 * 3600 * 1000);
    const rows = await HourlyPrice.aggregate([
        { $match: { recordedAt: { $gte: since }, goldMelted: { $gt: 0 } } },
        { $group: { _id: null, high: { $max: '$goldMelted' }, low: { $min: '$goldMelted' }, open: { $first: '$goldMelted' }, close: { $last: '$goldMelted' }, count: { $sum: 1 } } }
    ]);
    return rows[0] || null;
}

// محاسبه سود روزانه بر اساس نوسان واقعی 24 ساعت گذشته
async function calcDailyProfit(investment) {
    const stats = await get24hStats();
    if (!stats || stats.count < 2) {
        // داده کافی نداریم، از change_percent BRS استفاده کن
        try {
            const live = await getLiveGoldPrice();
            const absChange = Math.abs(live.changePercent) || 0.5;
            const profitPercent = Math.min(absChange * 0.6 + 0.3, 1.5);
            return {
                dailyProfit: Math.round(investment * profitPercent / 100),
                profitPercent,
                high: live.price,
                low: Math.round(live.price * 0.985),
                open: Math.round(live.price * (1 - live.changePercent / 100)),
                close: live.price,
                source: 'live'
            };
        } catch {
            return { dailyProfit: Math.round(investment * 0.008), profitPercent: 0.8, high: 0, low: 0, open: 0, close: 0, source: 'default' };
        }
    }

    const dailyRange = stats.high - stats.low;
    const dailyChange = stats.close - stats.open;
    const dailyChangePercent = stats.open > 0 ? (dailyChange / stats.open) * 100 : 0;

    let profitPercent = 0.5;
    if (dailyChangePercent > 0)       profitPercent = Math.min(0.5 + dailyChangePercent * 0.3, 1.5);
    else if (dailyChangePercent < 0)  profitPercent = Math.max(0.3 + Math.abs(dailyChangePercent) * 0.15, 0.4);
    else                              profitPercent = 0.7;

    return {
        dailyProfit: Math.round(investment * profitPercent / 100),
        profitPercent,
        high: stats.high,
        low: stats.low,
        open: stats.open,
        close: stats.close,
        dailyRange,
        dailyChangePercent,
        source: 'db'
    };
}

// تولید معاملات مجازی روزانه بر اساس قیمت واقعی
async function generateDailyTrades(investment, dailyProfit, currentPrice) {
    const trades = [];
    const numTrades = Math.floor(Math.random() * 4) + 3;
    const profitPerTrade = dailyProfit / numTrades;
    const variation = currentPrice * 0.015;
    const now = Date.now();

    for (let i = 0; i < numTrades; i++) {
        const delta = (Math.random() - 0.5) * variation;
        const tradePrice = Math.round(currentPrice + delta);
        const amount = Math.round((investment / tradePrice) * 0.1 * 1000) / 1000;
        const isBuy = delta >= 0 ? Math.random() > 0.3 : Math.random() > 0.7;
        trades.push({
            type: isBuy ? 'BUY' : 'SELL',
            amount,
            price: tradePrice,
            profit: Math.round(profitPerTrade),
            time: new Date(now - (numTrades - i) * 3600000 * (24 / numTrades))
        });
    }
    return trades;
}

class TradingBotController {

    async getSubscriptionStatus(req, res) {
        try {
            const userId = req.user._id || req.user.id;
            let bot = await TradingBot.findOne({ userId });
            if (!bot) { bot = new TradingBot({ userId }); await bot.save(); }

            if (bot.subscriptionEndDate && new Date() > bot.subscriptionEndDate) {
                bot.subscriptionStatus = 'expired';
                bot.isActive = false;
                await bot.save();
            }

            res.json({ status: bot.subscriptionStatus, subscriptionEndDate: bot.subscriptionEndDate, investment: bot.investment });
        } catch (err) {
            res.status(500).json({ error: 'خطا در دریافت وضعیت اشتراک' });
        }
    }

    async purchaseSubscription(req, res) {
        try {
            const userId = req.user._id || req.user.id;
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ error: 'کاربر یافت نشد' });

            const subscriptionPrice = 1000000;
            if (user.toman < subscriptionPrice) return res.status(400).json({ error: 'موجودی کافی نیست' });

            user.toman -= subscriptionPrice;
            await user.save();

            let bot = await TradingBot.findOne({ userId }) || new TradingBot({ userId });
            bot.subscriptionStatus = 'active';
            bot.subscriptionStartDate = new Date();
            bot.subscriptionEndDate = new Date(Date.now() + 30 * 24 * 3600 * 1000);
            bot.isActive = true;
            bot.investment = subscriptionPrice;
            await bot.save();

            res.json({ success: true, message: 'اشتراک ربات با موفقیت فعال شد', endDate: bot.subscriptionEndDate });
        } catch (err) {
            res.status(500).json({ error: 'خطا در خرید اشتراک' });
        }
    }

    async getBotStats(req, res) {
        try {
            const userId = req.user._id || req.user.id;
            const bot = await TradingBot.findOne({ userId });
            if (!bot || bot.subscriptionStatus !== 'active') {
                return res.status(400).json({ error: 'اشتراک ربات فعال نیست' });
            }

            // اگر ربات غیرفعال است
            if (bot.botEnabled === false) {
                return res.json({
                    currentInvestment: bot.customInvestment || bot.investment,
                    todayProfit: 0,
                    totalProfit: bot.totalProfit,
                    totalTrades: bot.totalTrades,
                    profitPercent: '0.00',
                    livePrice: 0,
                    liveChange: 0,
                    liveChangePercent: 0,
                    marketInfo: null,
                    botPaused: true
                });
            }

            // بررسی آیا امروز سود محاسبه شده یا نه
            const today = new Date(); today.setHours(0, 0, 0, 0);

            // سرمایه مؤثر: اگر کاربر مقدار سفارشی تنظیم کرده از آن استفاده کن
            const effectiveInvestment = (bot.customInvestment > 0) ? bot.customInvestment : bot.investment;

            let liveData = null;
            try { liveData = await getLiveGoldPrice(); } catch (_) {}

            if (!bot.lastTradeTime || bot.lastTradeTime < today) {
                const profitData = await calcDailyProfit(effectiveInvestment);
                const currentPrice = liveData?.price || profitData.close || profitData.high || 0;
                const newTrades = await generateDailyTrades(effectiveInvestment, profitData.dailyProfit, currentPrice);

                bot.todayProfit = profitData.dailyProfit;
                bot.totalProfit += profitData.dailyProfit;
                bot.trades.push(...newTrades);
                bot.totalTrades += newTrades.length;
                bot.lastTradeTime = new Date();
                await bot.save();
            }

            const stats24h = await get24hStats();

            res.json({
                currentInvestment: effectiveInvestment,
                todayProfit: bot.todayProfit,
                totalProfit: bot.totalProfit,
                totalTrades: bot.totalTrades,
                profitPercent: bot.todayProfit > 0 ? ((bot.todayProfit / bot.investment) * 100).toFixed(2) : '0.00',
                livePrice: liveData?.price || 0,
                liveChange: liveData?.change || 0,
                liveChangePercent: liveData?.changePercent || 0,
                marketInfo: stats24h ? {
                    highPrice: stats24h.high,
                    lowPrice: stats24h.low,
                    openPrice: stats24h.open,
                    closePrice: stats24h.close,
                } : null
            });
        } catch (err) {
            console.error('getBotStats error:', err.message);
            res.status(500).json({ error: 'خطا در دریافت آمار ربات' });
        }
    }

    async getRecentTrades(req, res) {
        try {
            const userId = req.user._id || req.user.id;
            const bot = await TradingBot.findOne({ userId });
            if (!bot || bot.subscriptionStatus !== 'active') return res.json([]);

            const trades = bot.trades
                .sort((a, b) => b.time - a.time)
                .slice(0, 15)
                .map(t => ({ id: t._id, type: t.type, amount: t.amount, price: t.price, profit: t.profit, time: t.time }));

            res.json(trades);
        } catch (err) {
            res.status(500).json({ error: 'خطا در دریافت معاملات' });
        }
    }

    async getCurrentPrice(req, res) {
        try {
            const data = await getLiveGoldPrice();
            res.json({ price: data.price, change: data.change, changePercent: data.changePercent, timestamp: new Date() });
        } catch (err) {
            res.status(500).json({ error: 'خطا در دریافت قیمت' });
        }
    }

    async getTodayPrices(req, res) {
        try {
            const stats = await get24hStats();
            let live = null;
            try { live = await getLiveGoldPrice(); } catch (_) {}

            const current = live?.price || stats?.close || 0;
            res.json({
                high: stats?.high || current,
                low: stats?.low || current,
                current,
                open: stats?.open || current,
            });
        } catch (err) {
            res.status(500).json({ error: 'خطا در دریافت قیمت‌ها' });
        }
    }

    async getYesterdayReport(req, res) {
        try {
            const userId = req.user._id || req.user.id;
            const bot = await TradingBot.findOne({ userId });
            if (!bot || bot.subscriptionStatus !== 'active') return res.status(400).json({ error: 'اشتراک فعال نیست' });

            const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1); yesterday.setHours(0, 0, 0, 0);
            const end = new Date(yesterday.getTime() + 24 * 3600 * 1000);

            const rows = await HourlyPrice.aggregate([
                { $match: { recordedAt: { $gte: yesterday, $lt: end }, goldMelted: { $gt: 0 } } },
                { $group: { _id: null, high: { $max: '$goldMelted' }, low: { $min: '$goldMelted' }, open: { $first: '$goldMelted' }, close: { $last: '$goldMelted' } } }
            ]);
            const s = rows[0] || {};

            res.json({ date: yesterday, investment: bot.investment, profit: bot.todayProfit, marketData: s });
        } catch (err) {
            res.status(500).json({ error: 'خطا در گزارش دیروز' });
        }
    }

    async getAdminStats(req, res) {
        try {
            const totalActiveUsers = await TradingBot.countDocuments({ subscriptionStatus: 'active', isActive: true });
            const today = new Date(); today.setHours(0, 0, 0, 0);
            const todayRevenue = await TradingBot.countDocuments({ subscriptionStartDate: { $gte: today } }) * 1000000;
            const avgResult = await TradingBot.aggregate([
                { $match: { subscriptionStatus: 'active' } },
                { $group: { _id: null, avgProfit: { $avg: '$totalProfit' }, avgInv: { $avg: '$investment' } } }
            ]);
            const avg = avgResult[0] || {};
            res.json({ totalActiveUsers, todayRevenue, avgProfit: avg.avgInv ? ((avg.avgProfit / avg.avgInv) * 100).toFixed(2) : 0 });
        } catch (err) {
            res.status(500).json({ error: 'خطا در آمار ادمین' });
        }
    }

    async getAdminUsers(req, res) {
        try {
            const bots = await TradingBot.find({}).populate('userId', 'fname lname phone email').sort({ createdAt: -1 });
            const users = bots.map(bot => ({
                id: bot.userId?._id, name: `${bot.userId?.fname || ''} ${bot.userId?.lname || ''}`.trim(),
                phone: bot.userId?.phone, subscriptionStatus: bot.subscriptionStatus,
                investment: bot.investment, totalProfit: bot.totalProfit, startDate: bot.subscriptionStartDate
            }));
            res.json(users);
        } catch (err) {
            res.status(500).json({ error: 'خطا در لیست کاربران' });
        }
    }

    async getUserSettings(req, res) {
        try {
            const userId = req.user._id || req.user.id;
            let bot = await TradingBot.findOne({ userId });
            if (!bot) return res.json({ customInvestment: 0, botEnabled: true, riskLevel: 'medium' });
            res.json({
                customInvestment: bot.customInvestment || 0,
                botEnabled: bot.botEnabled !== false,
                riskLevel: bot.riskLevel || 'medium',
                investment: bot.investment
            });
        } catch (err) {
            res.status(500).json({ error: 'خطا در دریافت تنظیمات' });
        }
    }

    async updateUserSettings(req, res) {
        try {
            const userId = req.user._id || req.user.id;
            const { customInvestment, botEnabled, riskLevel } = req.body;

            let bot = await TradingBot.findOne({ userId });
            if (!bot) return res.status(404).json({ error: 'اشتراک ربات فعال نیست' });
            if (bot.subscriptionStatus !== 'active') return res.status(400).json({ error: 'اشتراک ربات فعال نیست' });

            if (customInvestment !== undefined) {
                const inv = Number(customInvestment);
                if (inv < 0 || inv > 100000000) return res.status(400).json({ error: 'مقدار سرمایه نامعتبر است' });
                bot.customInvestment = inv;
            }
            if (botEnabled !== undefined) bot.botEnabled = !!botEnabled;
            if (riskLevel !== undefined) {
                if (!['low', 'medium', 'high'].includes(riskLevel)) return res.status(400).json({ error: 'سطح ریسک نامعتبر' });
                bot.riskLevel = riskLevel;
            }
            await bot.save();
            res.json({ success: true, customInvestment: bot.customInvestment, botEnabled: bot.botEnabled, riskLevel: bot.riskLevel });
        } catch (err) {
            res.status(500).json({ error: 'خطا در ذخیره تنظیمات' });
        }
    }

    async toggleUserStatus(req, res) {
        try {
            const { userId } = req.params;
            const bot = await TradingBot.findOne({ userId });
            if (!bot) return res.status(404).json({ error: 'کاربر یافت نشد' });
            bot.isActive = !bot.isActive;
            bot.subscriptionStatus = bot.isActive ? 'active' : 'inactive';
            await bot.save();
            res.json({ success: true, status: bot.subscriptionStatus });
        } catch (err) {
            res.status(500).json({ error: 'خطا در تغییر وضعیت' });
        }
    }
}

module.exports = new TradingBotController();
