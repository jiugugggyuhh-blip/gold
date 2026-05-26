const express = require('express');
const tradingBotController = require('../controller/tradingBotController');
const tradingBotDemoController = require('../controller/tradingBotDemoController');
const isuser = require('../Middleware/isuser');

const router = express.Router();

// User routes
router.get('/subscription', isuser, tradingBotController.getSubscriptionStatus);
router.post('/purchase', isuser, tradingBotController.purchaseSubscription);
router.get('/stats', isuser, tradingBotController.getBotStats);
router.get('/yesterday-report', isuser, tradingBotController.getYesterdayReport);
router.get('/trades', isuser, tradingBotController.getRecentTrades);
router.get('/prices', isuser, tradingBotController.getTodayPrices);
router.get('/current-price', isuser, tradingBotController.getCurrentPrice);
router.get('/settings', isuser, tradingBotController.getUserSettings);
router.put('/settings', isuser, tradingBotController.updateUserSettings);

// Demo routes (برای محیط دمو)
router.get('/demo/subscription', isuser, tradingBotDemoController.getSubscriptionStatus);
router.post('/demo/purchase', isuser, tradingBotDemoController.purchaseSubscription);
router.get('/demo/stats', isuser, tradingBotDemoController.getBotStats);
router.get('/demo/trades', isuser, tradingBotDemoController.getRecentTrades);
router.get('/demo/prices', isuser, tradingBotDemoController.getTodayPrices);
router.get('/demo/current-price', isuser, tradingBotDemoController.getCurrentPrice);

// Admin routes
router.get('/admin/stats', isuser, tradingBotController.getAdminStats);
router.get('/admin/users', isuser, tradingBotController.getAdminUsers);
router.post('/admin/users/:userId/toggle', isuser, tradingBotController.toggleUserStatus);
router.get('/admin/settings', isuser, (req, res) => {
    // تنظیمات پیش‌فرض ربات
    res.json({
        subscriptionPrice: 1000000,
        dailyProfitPercent: 0.8,
        minInvestment: 100000,
        maxInvestment: 10000000
    });
});
router.post('/admin/settings', isuser, (req, res) => {
    // ذخیره تنظیمات (می‌تونه در دیتابیس ذخیره بشه)
    res.json({ success: true, message: 'تنظیمات ذخیره شد' });
});

module.exports = router;
