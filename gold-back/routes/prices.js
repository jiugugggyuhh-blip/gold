const express = require('express');
const router = express.Router();
const axios = require('axios');
const { scrapeAllPrices } = require('../services/priceScraperService');
const HourlyPrice = require('../model/hourlyPrice');

const BRS_API_KEY = 'B3HsYAYhzDQsmPdg2s9QPHQmlkWG1HGu';
const BRS_URL = `https://api.brsapi.ir/Market/Gold_Currency.php?key=${BRS_API_KEY}`;

let cache = null;
let cacheTime = 0;
const CACHE_MS = 60000;

async function fetchBRS() {
    const res = await axios.get(BRS_URL, { timeout: 12000 });
    return res.data;
}

async function getCurrentPrices() {
    const now = Date.now();
    if (cache && now - cacheTime < CACHE_MS) return cache;

    // BRS برای طلا، سکه، ارز و نقره (اگر داشت)
    let brs = null;
    try {
        brs = await fetchBRS();
    } catch (e) {
        console.error('[prices] BRS API error:', e.message);
    }

    // tajnoghreh برای نقره و قیمت‌های تکمیلی
    let scrape = null;
    try {
        scrape = await scrapeAllPrices();
    } catch (e) {
        console.error('[prices] Scrape error:', e.message);
    }

    const goldItems = brs?.gold || [];
    const currencyItems = brs?.currency || [];

    // نقره از tajnoghreh چون BRS نداره
    const silver = [];
    if (scrape) {
        if (scrape['نقره 999']) silver.push({ symbol: 'silver999', name: 'نقره 999', price: scrape['نقره 999'], unit: 'تومان', change_value: 0, change_percent: 0 });
        if (scrape['نقره 925']) silver.push({ symbol: 'silver925', name: 'نقره 925', price: scrape['نقره 925'], unit: 'تومان', change_value: 0, change_percent: 0 });
    }

    // ارزهای مهم برای نوار
    const priorityCurrencies = ['USD', 'EUR', 'AED', 'GBP', 'USDT_IRT', 'TRY'];
    const currency = currencyItems.filter(i => priorityCurrencies.includes(i.symbol));

    cache = {
        gold: goldItems,
        silver,
        currency,
        allCurrency: currencyItems,
        fetchedAt: new Date()
    };
    cacheTime = now;
    return cache;
}

// قیمت لحظه‌ای
router.get('/current', async (req, res) => {
    try {
        const data = await getCurrentPrices();
        res.json({ success: true, data });
    } catch (err) {
        console.error('Price fetch error:', err.message);
        res.status(500).json({ success: false, error: 'خطا در دریافت قیمت‌ها' });
    }
});

// تاریخچه ساعتی از دیتابیس + قیمت لحظه‌ای
// GET /prices/history?symbol=goldMelted&period=7d
router.get('/history', async (req, res) => {
    try {
        const { symbol = 'goldMelted', period = '7d' } = req.query;

        const allowedSymbols = ['gold18', 'gold24', 'goldMelted', 'silver999', 'silver925', 'dollar', 'euro', 'coin'];
        if (!allowedSymbols.includes(symbol)) {
            return res.status(400).json({ success: false, error: 'symbol نامعتبر' });
        }

        const days = { '1d': 1, '7d': 7, '30d': 30, '90d': 90 }[period] || 7;
        const since = new Date(Date.now() - days * 24 * 3600 * 1000);

        const rows = await HourlyPrice.find(
            { recordedAt: { $gte: since }, [symbol]: { $gt: 0 } },
            { recordedAt: 1, [symbol]: 1, _id: 0 }
        ).sort({ recordedAt: 1 });

        let history = rows.map(r => ({ date: r.recordedAt, price: r[symbol] }));

        // فقط قیمت لحظه‌ای رو به عنوان آخرین نقطه اضافه کن — fake data در frontend ساخته میشه
        try {
            const live = await getCurrentPrices();
            const livePrice = symbol === 'goldMelted'
                ? live.gold.find(i => i.symbol === 'IR_GOLD_MELTED')?.price
                : symbol === 'gold18'
                ? live.gold.find(i => i.symbol === 'IR_GOLD_18K')?.price
                : symbol === 'gold24'
                ? live.gold.find(i => i.symbol === 'IR_GOLD_24K')?.price
                : symbol === 'silver999'
                ? live.silver.find(i => i.symbol === 'silver999')?.price
                : symbol === 'dollar'
                ? live.currency.find(i => i.symbol === 'USD')?.price
                : null;

            if (livePrice) {
                const lastSaved = history[history.length - 1];
                const now = new Date();
                if (!lastSaved || (now - new Date(lastSaved.date)) > 30 * 60 * 1000) {
                    history.push({ date: now, price: livePrice });
                }
            }
        } catch (_) {}

        res.json({ success: true, symbol, period, days, liveOnly: history.length <= 1, data: history });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// آمار 24 ساعته
router.get('/stats', async (req, res) => {
    try {
        const since = new Date(Date.now() - 24 * 3600 * 1000);

        const [goldStats, silverStats] = await Promise.all([
            HourlyPrice.aggregate([
                { $match: { recordedAt: { $gte: since }, goldMelted: { $gt: 0 } } },
                { $group: { _id: null, current: { $last: '$goldMelted' }, high: { $max: '$goldMelted' }, low: { $min: '$goldMelted' }, open: { $first: '$goldMelted' } } }
            ]),
            HourlyPrice.aggregate([
                { $match: { recordedAt: { $gte: since }, silver999: { $gt: 0 } } },
                { $group: { _id: null, current: { $last: '$silver999' }, high: { $max: '$silver999' }, low: { $min: '$silver999' }, open: { $first: '$silver999' } } }
            ])
        ]);

        const calcChange = (open, current) => open ? current - open : 0;
        const calcPercent = (open, current) => open ? ((current - open) / open * 100).toFixed(2) : '0';
        const g = goldStats[0] || {};
        const s = silverStats[0] || {};

        res.json({
            success: true,
            data: {
                gold: { ...g, change: calcChange(g.open, g.current), changePercent: calcPercent(g.open, g.current) },
                silver: { ...s, change: calcChange(s.open, s.current), changePercent: calcPercent(s.open, s.current) }
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
module.exports.getCurrentPrices = getCurrentPrices;
