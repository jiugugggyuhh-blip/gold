const cron = require('node-cron');
const { scrapeAllPrices } = require('../services/priceScraperService');
const HourlyPrice = require('../model/hourlyPrice');

async function saveHourlyPrices() {
    try {
        const data = await scrapeAllPrices();

        await HourlyPrice.create({
            recordedAt: new Date(),
            gold18:      data['طلای 18 عیار / 750'] || 0,
            gold24:      data['طلا 24 عیار'] || 0,
            goldMelted:  data['آبشده نقدی'] || 0,
            silver999:   data['نقره 999'] || 0,
            silver925:   data['نقره 925'] || 0,
            dollar:      data['دلار'] || 0,
            euro:        data['یورو'] || 0,
            coin:        data['سکه امامی'] || 0,
            halfCoin:    data['نیم سکه'] || 0,
            quarterCoin: data['ربع سکه'] || 0,
        });

        console.log('[PriceCron] قیمت‌ها ذخیره شدند -', new Date().toLocaleTimeString('fa-IR'));
    } catch (err) {
        console.error('[PriceCron] خطا در ذخیره قیمت:', err.message);
    }
}

// هر ساعت اجرا می‌شه
cron.schedule('0 * * * *', saveHourlyPrices);

// اولین اجرا فوری بعد از استارت
saveHourlyPrices();

module.exports = { saveHourlyPrices };
