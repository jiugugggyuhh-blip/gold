const express = require('express');
const axios = require('axios');
const router = express.Router();

// تست مستقیم API BRS بدون نیاز به دیتابیس
router.get('/test-brs', async (req, res) => {
    try {
        const apiKey = 'B3HsYAYhzDQsmPdg2s9QPHQmlkWG1HGu';
        const apiUrl = `https://Api.BrsApi.ir/Market/Gold_Currency.php?key=${apiKey}`;

        console.log('Testing BRS API...');
        const response = await axios.get(apiUrl, {
            timeout: 10000
        });

        console.log('BRS API Response:', response.data);

        res.json({
            success: true,
            message: 'API BRS با موفقیت پاسخ داد',
            data: response.data
        });

    } catch (error) {
        console.error('BRS API Error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            details: error.toString()
        });
    }
});

// تست مستقیم API دمو ربات
router.get('/test-bot-demo', async (req, res) => {
    try {
        // ایجاد داده‌های دمو
        const demoData = {
            success: true,
            data: {
                status: 'active',
                investment: 50000000,
                daysLeft: 25,
                stats: {
                    currentInvestment: 50000000,
                    todayProfit: 400000,
                    totalProfit: 2000000,
                    totalTrades: 15
                },
                trades: [
                    { id: 1, type: 'BUY', price: 3500000, amount: 10, profit: 50000, time: new Date() },
                    { id: 2, type: 'SELL', price: 3550000, amount: 10, profit: 100000, time: new Date() },
                    { id: 3, type: 'BUY', price: 3480000, amount: 15, profit: 75000, time: new Date() }
                ],
                prices: {
                    high: 3600000,
                    low: 3450000,
                    current: 3520000
                }
            }
        };

        res.json(demoData);

    } catch (error) {
        console.error('Bot Demo Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// تست همه API ها
router.get('/test-all', async (req, res) => {
    const results = {
        brs: null,
        bot: null
    };

    try {
        // تست API BRS
        try {
            const apiKey = 'B3HsYAYhzDQsmPdg2s9QPHQmlkWG1HGu';
            const apiUrl = `https://Api.BrsApi.ir/Market/Gold_Currency.php?key=${apiKey}`;
            const brsResponse = await axios.get(apiUrl, { timeout: 10000 });
            
            results.brs = {
                success: true,
                message: 'API BRS با موفقیت پاسخ داد',
                data: brsResponse.data
            };
        } catch (error) {
            results.brs = {
                success: false,
                error: error.message
            };
        }

        // تست API دمو ربات
        results.bot = {
            success: true,
            message: 'API دمو ربات با موفقیت پاسخ داد',
            data: {
                status: 'active',
                investment: 50000000,
                daysLeft: 25,
                stats: {
                    currentInvestment: 50000000,
                    todayProfit: 400000,
                    totalProfit: 2000000,
                    totalTrades: 15
                },
                trades: [
                    { id: 1, type: 'BUY', price: 3500000, amount: 10, profit: 50000, time: new Date() },
                    { id: 2, type: 'SELL', price: 3550000, amount: 10, profit: 100000, time: new Date() },
                    { id: 3, type: 'BUY', price: 3480000, amount: 15, profit: 75000, time: new Date() }
                ],
                prices: {
                    high: 3600000,
                    low: 3450000,
                    current: 3520000
                }
            }
        };

        res.json({
            success: true,
            message: 'تست همه API ها انجام شد',
            data: results
        });

    } catch (error) {
        console.error('Test All Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
