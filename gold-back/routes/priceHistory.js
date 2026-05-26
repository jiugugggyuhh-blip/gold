const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// مدل‌های دیتابیس برای ذخیره قیمت‌ها
const GoldPriceSchema = new mongoose.Schema({
    price: Number,
    date: { type: Date, default: Date.now },
    symbol: String,
    change: Number,
    changePercent: Number,
    high: Number,
    low: Number
});

const SilverPriceSchema = new mongoose.Schema({
    price: Number,
    date: { type: Date, default: Date.now },
    symbol: String,
    change: Number,
    changePercent: Number,
    high: Number,
    low: Number
});

const CryptoPriceSchema = new mongoose.Schema({
    price: Number,
    date: { type: Date, default: Date.now },
    symbol: String,
    change: Number,
    changePercent: Number,
    high: Number,
    low: Number
});

const CurrencyPriceSchema = new mongoose.Schema({
    price: Number,
    date: { type: Date, default: Date.now },
    symbol: String,
    change: Number,
    changePercent: Number,
    high: Number,
    low: Number
});

// ساخت مدل‌ها
const GoldPrice = mongoose.models.GoldPrice || mongoose.model('GoldPrice', GoldPriceSchema);
const SilverPrice = mongoose.models.SilverPrice || mongoose.model('SilverPrice', SilverPriceSchema);
const CryptoPrice = mongoose.models.CryptoPrice || mongoose.model('CryptoPrice', CryptoPriceSchema);
const CurrencyPrice = mongoose.models.CurrencyPrice || mongoose.model('CurrencyPrice', CurrencyPriceSchema);

// ذخیره قیمت‌های لحظه‌ای
router.post('/save-prices', async (req, res) => {
    try {
        const { gold, silver, crypto, currency } = req.body;
        
        // ذخیره قیمت طلا
        if (gold && Array.isArray(gold)) {
            for (const item of gold) {
                await GoldPrice.create({
                    price: item.price,
                    symbol: item.symbol,
                    change: item.change || 0,
                    changePercent: item.changePercent || 0,
                    high: item.high || item.price,
                    low: item.low || item.price
                });
            }
        }
        
        // ذخیره قیمت نقره
        if (silver && Array.isArray(silver)) {
            for (const item of silver) {
                await SilverPrice.create({
                    price: item.price,
                    symbol: item.symbol,
                    change: item.change || 0,
                    changePercent: item.changePercent || 0,
                    high: item.high || item.price,
                    low: item.low || item.price
                });
            }
        }
        
        // ذخیره قیمت ارز دیجیتال
        if (crypto && Array.isArray(crypto)) {
            for (const item of crypto) {
                await CryptoPrice.create({
                    price: item.price,
                    symbol: item.symbol,
                    change: item.change || 0,
                    changePercent: item.changePercent || 0,
                    high: item.high || item.price,
                    low: item.low || item.price
                });
            }
        }
        
        // ذخیره قیمت ارز
        if (currency && Array.isArray(currency)) {
            for (const item of currency) {
                await CurrencyPrice.create({
                    price: item.price,
                    symbol: item.symbol,
                    change: item.change || 0,
                    changePercent: item.changePercent || 0,
                    high: item.high || item.price,
                    low: item.low || item.price
                });
            }
        }
        
        res.json({
            success: true,
            message: 'قیمت‌ها با موفقیت ذخیره شدند'
        });
        
    } catch (error) {
        console.error('Error saving prices:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// دریافت تاریخچه قیمت طلا
router.get('/gold/history', async (req, res) => {
    try {
        const { period = '7d' } = req.query;
        let days = 7;
        
        switch (period) {
            case '1d': days = 1; break;
            case '7d': days = 7; break;
            case '30d': days = 30; break;
            case '90d': days = 90; break;
        }
        
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        const history = await GoldPrice.find({
            date: { $gte: startDate }
        }).sort({ date: 1 });
        
        res.json({
            success: true,
            data: history
        });
        
    } catch (error) {
        console.error('Error fetching gold history:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// دریافت تاریخچه قیمت نقره
router.get('/silver/history', async (req, res) => {
    try {
        const { period = '7d' } = req.query;
        let days = 7;
        
        switch (period) {
            case '1d': days = 1; break;
            case '7d': days = 7; break;
            case '30d': days = 30; break;
            case '90d': days = 90; break;
        }
        
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        const history = await SilverPrice.find({
            date: { $gte: startDate }
        }).sort({ date: 1 });
        
        res.json({
            success: true,
            data: history
        });
        
    } catch (error) {
        console.error('Error fetching silver history:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// دریافت تاریخچه قیمت ارز دیجیتال
router.get('/crypto/history', async (req, res) => {
    try {
        const { period = '7d' } = req.query;
        let days = 7;
        
        switch (period) {
            case '1d': days = 1; break;
            case '7d': days = 7; break;
            case '30d': days = 30; break;
            case '90d': days = 90; break;
        }
        
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        const history = await CryptoPrice.find({
            date: { $gte: startDate }
        }).sort({ date: 1 });
        
        res.json({
            success: true,
            data: history
        });
        
    } catch (error) {
        console.error('Error fetching crypto history:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// دریافت تاریخچه قیمت ارز
router.get('/currency/history', async (req, res) => {
    try {
        const { period = '7d' } = req.query;
        let days = 7;
        
        switch (period) {
            case '1d': days = 1; break;
            case '7d': days = 7; break;
            case '30d': days = 30; break;
            case '90d': days = 90; break;
        }
        
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        const history = await CurrencyPrice.find({
            date: { $gte: startDate }
        }).sort({ date: 1 });
        
        res.json({
            success: true,
            data: history
        });
        
    } catch (error) {
        console.error('Error fetching currency history:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// دریافت آمار قیمت‌ها
router.get('/stats', async (req, res) => {
    try {
        const now = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        // آمار طلا
        const goldStats = await GoldPrice.aggregate([
            { $match: { date: { $gte: yesterday } } },
            {
                $group: {
                    _id: null,
                    currentPrice: { $last: '$price' },
                    highPrice: { $max: '$price' },
                    lowPrice: { $min: '$price' },
                    avgPrice: { $avg: '$price' },
                    count: { $sum: 1 }
                }
            }
        ]);
        
        // آمار نقره
        const silverStats = await SilverPrice.aggregate([
            { $match: { date: { $gte: yesterday } } },
            {
                $group: {
                    _id: null,
                    currentPrice: { $last: '$price' },
                    highPrice: { $max: '$price' },
                    lowPrice: { $min: '$price' },
                    avgPrice: { $avg: '$price' },
                    count: { $sum: 1 }
                }
            }
        ]);
        
        // آمار ارز دیجیتال
        const cryptoStats = await CryptoPrice.aggregate([
            { $match: { date: { $gte: yesterday } } },
            {
                $group: {
                    _id: null,
                    currentPrice: { $last: '$price' },
                    highPrice: { $max: '$price' },
                    lowPrice: { $min: '$price' },
                    avgPrice: { $avg: '$price' },
                    count: { $sum: 1 }
                }
            }
        ]);
        
        // آمار ارز
        const currencyStats = await CurrencyPrice.aggregate([
            { $match: { date: { $gte: yesterday } } },
            {
                $group: {
                    _id: null,
                    currentPrice: { $last: '$price' },
                    highPrice: { $max: '$price' },
                    lowPrice: { $min: '$price' },
                    avgPrice: { $avg: '$price' },
                    count: { $sum: 1 }
                }
            }
        ]);
        
        res.json({
            success: true,
            data: {
                gold: goldStats[0] || {},
                silver: silverStats[0] || {},
                crypto: cryptoStats[0] || {},
                currency: currencyStats[0] || {}
            }
        });
        
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
