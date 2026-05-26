const express = require('express');
const axios = require('axios');
const router = express.Router();

// دریافت قیمت طلا، نقره و دلار از API BRS
router.get('/current', async (req, res) => {
    try {
        const apiKey = 'B3HsYAYhzDQsmPdg2s9QPHQmlkWG1HGu';
        const apiUrl = `https://Api.BrsApi.ir/Market/Gold_Currency.php?key=${apiKey}`;

        const response = await axios.get(apiUrl, {
            timeout: 10000
        });

        const data = response.data;

        // استخراج قیمت‌ها از ساختار واقعی API
        const prices = {
            gold: [],
            silver: [],
            currency: []
        };

        // استخراج طلا
        if (data.gold && Array.isArray(data.gold)) {
            prices.gold = data.gold.map(item => ({
                symbol: item.symbol,
                name: item.name,
                name_en: item.name_en,
                price: item.price,
                change_value: item.change_value,
                change_percent: item.change_percent,
                unit: item.unit
            }));
        }

        // استخراج نقره
        if (data.silver && Array.isArray(data.silver)) {
            prices.silver = data.silver.map(item => ({
                symbol: item.symbol,
                name: item.name,
                name_en: item.name_en,
                price: item.price,
                change_value: item.change_value,
                change_percent: item.change_percent,
                unit: item.unit
            }));
        }

        // استخراج ارز
        if (data.currency && Array.isArray(data.currency)) {
            prices.currency = data.currency.map(item => ({
                symbol: item.symbol,
                name: item.name,
                name_en: item.name_en,
                price: item.price,
                change_value: item.change_value,
                change_percent: item.change_percent,
                unit: item.unit
            }));
        }

        res.json({
            success: true,
            data: prices
        });

    } catch (error) {
        console.error('Price API Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// دریافت تاریخچه قیمت طلا برای نمودار
router.get('/gold/history', async (req, res) => {
    try {
        // استفاده از داده‌های شبیه‌سازی شده برای نمودار
        const basePrice = 25945000; // قیمت پایه طلا
        
        // ایجاد داده‌های نمودار با قیمت‌های واقعی‌تر
        const history = [
            { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), price: basePrice - 120000 },
            { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), price: basePrice - 80000 },
            { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), price: basePrice - 45000 },
            { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), price: basePrice - 70000 },
            { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), price: basePrice - 30000 },
            { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), price: basePrice - 15000 },
            { date: new Date(), price: basePrice }
        ];

        res.json({
            success: true,
            data: history
        });

    } catch (error) {
        console.error('Gold History API Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// دریافت تاریخچه قیمت نقره
router.get('/silver/history', async (req, res) => {
    try {
        const apiKey = 'B3HsYAYhzDQsmPdg2s9QPHQmlkWG1HGu';
        const apiUrl = `https://Api.BrsApi.ir/Market/Gold_Currency.php?key=${apiKey}`;

        const response = await axios.get(apiUrl, {
            timeout: 10000
        });

        const data = response.data;

        // ایجاد داده‌های نمودار
        const history = [
            { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), price: data.silver - 500 },
            { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), price: data.silver - 300 },
            { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), price: data.silver - 100 },
            { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), price: data.silver - 200 },
            { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), price: data.silver - 150 },
            { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), price: data.silver - 50 },
            { date: new Date(), price: data.silver }
        ];

        res.json({
            success: true,
            data: history
        });

    } catch (error) {
        console.error('Silver History API Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// دریافت تاریخچه قیمت دلار
router.get('/currency/history', async (req, res) => {
    try {
        const apiKey = 'B3HsYAYhzDQsmPdg2s9QPHQmlkWG1HGu';
        const apiUrl = `https://Api.BrsApi.ir/Market/Gold_Currency.php?key=${apiKey}`;

        const response = await axios.get(apiUrl, {
            timeout: 10000
        });

        const data = response.data;

        // ایجاد داده‌های نمودار
        const history = [
            { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), price: data.dollar - 500 },
            { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), price: data.dollar - 300 },
            { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), price: data.dollar - 100 },
            { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), price: data.dollar - 200 },
            { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), price: data.dollar - 150 },
            { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), price: data.dollar - 50 },
            { date: new Date(), price: data.dollar }
        ];

        res.json({
            success: true,
            data: history
        });

    } catch (error) {
        console.error('Currency History API Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
