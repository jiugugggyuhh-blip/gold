const cron = require('node-cron');
const TradingBot = require('../model/tradingBot');
const historygoldmodel = require('../model/historygold');
const goldPriceService = require('../services/goldPriceService');

// ذخیره قیمت‌های روزانه طلا - هر ساعت اجرا می‌شود
cron.schedule('0 * * * *', async () => {
    console.log('--- ذخیره قیمت لحظه‌ای طلا ---');
    
    try {
        const currentPrice = await goldPriceService.getPriceForBot();
        const now = new Date();
        
        // دریافت یا ایجاد رکورد امروز
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let todayRecord = await historygoldmodel.findOne({ 
            date: { $gte: today } 
        });
        
        if (!todayRecord) {
            // ایجاد رکورد جدید برای امروز
            todayRecord = new historygoldmodel({
                date: now,
                price: currentPrice,
                highPrice: currentPrice,
                lowPrice: currentPrice
            });
        } else {
            // به‌روزرسانی رکورد امروز
            todayRecord.price = currentPrice;
            
            // به‌روزرسانی بالاترین و پایین‌ترین قیمت
            if (currentPrice > todayRecord.highPrice) {
                todayRecord.highPrice = currentPrice;
            }
            if (currentPrice < todayRecord.lowPrice) {
                todayRecord.lowPrice = currentPrice;
            }
        }
        
        await todayRecord.save();
        console.log(`قیمت طلا ذخیره شد: ${currentPrice} - بالا: ${todayRecord.highPrice} - پایین: ${todayRecord.lowPrice}`);
    } catch (error) {
        console.error('خطا در ذخیره قیمت طلا:', error);
    }
});

// محاسبه سود روزانه کاربران - هر روز ساعت 23:59 اجرا می‌شود
cron.schedule('59 23 * * *', async () => {
    console.log('--- محاسبه سود روزانه کاربران ---');
    
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // دریافت رکورد دیروز
        const yesterdayRecord = await historygoldmodel.findOne({
            date: { $gte: yesterday, $lt: today }
        });
        
        // دریافت رکورد امروز برای قیمت پایانی
        const todayRecord = await historygoldmodel.findOne({
            date: { $gte: today }
        }).sort({ date: -1 });
        
        if (!yesterdayRecord || !todayRecord) {
            console.log('داده‌ای برای محاسبه سود یافت نشد');
            return;
        }
        
        const openPrice = yesterdayRecord.price; // قیمت شروع (دیروز)
        const closePrice = todayRecord.price; // قیمت پایان (امروز)
        const highPrice = todayRecord.highPrice;
        const lowPrice = todayRecord.lowPrice;
        
        // محاسبه نوسان روزانه
        const dailyRange = highPrice - lowPrice;
        const dailyChange = closePrice - openPrice;
        const dailyChangePercent = openPrice > 0 ? (dailyChange / openPrice) * 100 : 0;
        
        console.log(`نوسان امروز: بالا=${highPrice}, پایین=${lowPrice}, تغییر=${dailyChange} (${dailyChangePercent.toFixed(2)}%)`);
        
        // به‌روزرسانی رکورد امروز با اطلاعات کامل
        todayRecord.dailyChange = dailyChange;
        todayRecord.dailyChangePercent = dailyChangePercent;
        await todayRecord.save();
        
        // دریافت تمام کاربران فعال ربات
        const activeBots = await TradingBot.find({ 
            subscriptionStatus: 'active',
            isActive: true 
        });
        
        console.log(`تعداد کاربران فعال: ${activeBots.length}`);
        
        for (const bot of activeBots) {
            try {
                const investment = bot.investment;
                
                // محاسبه سود بر اساس نوسان واقعی بازار
                // اگر نوسان مثبت بود، سود بیشتری، اگر منفی بود سود کمتری
                let profitPercent = 0.5; // سود پایه
                
                if (dailyChangePercent > 0) {
                    // بازار صعودی - سود بیشتر (تا 1.5%)
                    profitPercent = Math.min(0.5 + (dailyChangePercent * 0.3), 1.5);
                } else if (dailyChangePercent < 0) {
                    // بازار نزولی - سود کمتر ولی همچنان مثبت (برای جذابیت ربات)
                    profitPercent = Math.max(0.3 + Math.abs(dailyChangePercent * 0.15), 0.4);
                } else {
                    // بازار ثابت - سود متوسط
                    profitPercent = 0.7 + Math.random() * 0.2;
                }
                
                const dailyProfit = Math.round((investment * profitPercent) / 100);
                
                // به‌روزرسانی سود کاربر
                bot.todayProfit = dailyProfit;
                bot.totalProfit += dailyProfit;
                
                // ایجاد معاملات مجازی برای نمایش به کاربر
                const numTrades = Math.floor(Math.random() * 4) + 3; // 3 تا 6 معامله
                const profitPerTrade = Math.round(dailyProfit / numTrades);
                
                for (let i = 0; i < numTrades; i++) {
                    const tradePrice = Math.round(lowPrice + (Math.random() * (highPrice - lowPrice)));
                    const tradeType = Math.random() > 0.5 ? 'BUY' : 'SELL';
                    
                    bot.trades.push({
                        type: tradeType,
                        amount: Math.round((investment / tradePrice) * 0.1 * 100) / 100,
                        price: tradePrice,
                        profit: profitPerTrade,
                        time: new Date(today.getTime() + (i * 3600000)) // هر معامله با یک ساعت فاصله
                    });
                }
                
                bot.totalTrades += numTrades;
                bot.lastTradeTime = new Date();
                
                await bot.save();
                
                console.log(`کاربر ${bot.userId} - سرمایه: ${investment} - سود: ${dailyProfit} (${profitPercent.toFixed(2)}%)`);
            } catch (userError) {
                console.error(`خطا در محاسبه سود کاربر ${bot.userId}:`, userError);
            }
        }
        
        console.log('--- پایان محاسبه سود روزانه ---');
    } catch (error) {
        console.error('خطا در محاسبه سود روزانه:', error);
    }
});

// ریست کردن سود روزانه در ابتدای روز جدید - ساعت 00:01
cron.schedule('1 0 * * *', async () => {
    console.log('--- ریست کردن سود روزانه ---');
    
    try {
        await TradingBot.updateMany(
            { subscriptionStatus: 'active' },
            { $set: { todayProfit: 0 } }
        );
        console.log('سود روزانه همه کاربران ریست شد');
    } catch (error) {
        console.error('خطا در ریست کردن سود روزانه:', error);
    }
});

console.log('✅ Cron jobs for trading bot started');
