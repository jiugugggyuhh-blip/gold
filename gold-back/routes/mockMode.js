// =============================================================
// ⚠️  TEST MODE ROUTES - فقط برای تست و طراحی UI
// این فایل شبیه‌ساز کامل API های پنل کاربری و ادمین است
// بدون نیاز به دیتابیس یا API خارجی کار می‌کند
// TODO: REMOVE THIS ROUTE FILE BEFORE PRODUCTION DEPLOY
// برای غیرفعال کردن: در app.js خط مربوطه را کامنت کنید
// =============================================================

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const {
    mockUsers,
    mockWallet,
    mockPrices,
    mockOrders,
    mockWithdrawals,
    mockCards,
    mockNotifs,
    mockTickets,
    mockLoanPlans,
    mockLoans,
    mockUserList,
    mockDeposits,
    mockBanners,
    mockSettings,
    generatePriceHistory
} = require('../mockData');

// ---- helper: استخراج کاربر از توکن بدون DB ----
function getUserFromToken(req) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        if (decoded.id === 'admin123') return mockUsers.admin;
        if (decoded.id === 'user123') return mockUsers.user;
        return null;
    } catch {
        return null;
    }
}

// ---- middleware ساده برای بررسی توکن ----
function requireAuth(req, res, next) {
    const user = getUserFromToken(req);
    if (!user) return res.status(401).json({ message: 'توکن معتبر نیست' });
    req.user = user;
    next();
}

function requireAdmin(req, res, next) {
    const user = getUserFromToken(req);
    if (!user) return res.status(401).json({ message: 'توکن معتبر نیست' });
    if (user.role !== 'admin') return res.status(403).json({ message: 'دسترسی ندارید' });
    req.user = user;
    next();
}

// =============================================================
// AUTH - لاگین تستی
// =============================================================

// POST /mock/auth/login
// phone: 09123456789, password: admin123  → ادمین
// phone: 09876543210, password: user123   → کاربر عادی
router.post('/auth/login', (req, res) => {
    const { phone, password } = req.body;

    let user = null;
    if (phone === '09123456789' && password === 'admin123') user = mockUsers.admin;
    else if (phone === '09876543210' && password === 'user123') user = mockUsers.user;

    if (!user) return res.status(400).json({ error_msg: 'شماره یا رمز اشتباه است. از اطلاعات تست استفاده کنید' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: '7d' });
    res.json({ data: token, role: user.role });
});

// GET /mock/auth/info - اطلاعات حساب تست
router.get('/auth/info', (req, res) => {
    res.json({
        testAccounts: [
            { type: 'ادمین', phone: '09123456789', password: 'admin123' },
            { type: 'کاربر عادی', phone: '09876543210', password: 'user123' }
        ],
        note: '⚠️ این endpoint فقط در حالت تست فعال است'
    });
});

// =============================================================
// PRICES - قیمت‌های mock
// =============================================================

// GET /mock/prices/current
router.get('/prices/current', (req, res) => {
    res.json({ success: true, data: mockPrices, isMock: true });
});

// GET /mock/prices/gold/history
router.get('/prices/gold/history', (req, res) => {
    res.json({ success: true, data: generatePriceHistory(4250000, 30), isMock: true });
});

// GET /mock/prices/silver/history
router.get('/prices/silver/history', (req, res) => {
    res.json({ success: true, data: generatePriceHistory(42000, 30), isMock: true });
});

// GET /mock/prices/currency/history
router.get('/prices/currency/history', (req, res) => {
    res.json({ success: true, data: generatePriceHistory(92500, 30), isMock: true });
});

// =============================================================
// USER PANEL - پنل کاربری
// =============================================================

// GET /mock/user/profile
router.get('/user/profile', requireAuth, (req, res) => {
    res.json({ user: req.user });
});

// GET /mock/user/wallet/details
router.get('/user/wallet/details', requireAuth, (req, res) => {
    const wallet = mockWallet[req.user._id] || mockWallet.user123;
    res.json({
        data: {
            toman: req.user.toman,
            gold: req.user.gold,
            silver: req.user.silver,
            wallet
        }
    });
});

// GET /mock/user/assets
router.get('/user/assets', requireAuth, (req, res) => {
    const goldPrice = mockPrices.gold[0].price;
    const silverPrice = mockPrices.silver[0].price;
    res.json({
        data: {
            toman: req.user.toman,
            gold: req.user.gold,
            silver: req.user.silver,
            goldValue: Math.round(req.user.gold * goldPrice),
            silverValue: Math.round(req.user.silver * silverPrice),
            totalValue: req.user.toman + Math.round(req.user.gold * goldPrice) + Math.round(req.user.silver * silverPrice)
        }
    });
});

// GET /mock/user/order
router.get('/user/order', requireAuth, (req, res) => {
    const orders = mockOrders.filter(o => o.userid === req.user._id);
    res.json({ data: orders });
});

// GET /mock/user/getnotif
router.get('/user/getnotif', requireAuth, (req, res) => {
    res.json({ data: mockNotifs });
});

// GET /mock/user/ticket
router.get('/user/ticket', requireAuth, (req, res) => {
    const tickets = mockTickets.filter(t => t.userid === req.user._id);
    res.json({ data: tickets });
});

// GET /mock/user/list-withdrawal
router.get('/user/list-withdrawal', requireAuth, (req, res) => {
    const items = mockWithdrawals.filter(w => w.userid === req.user._id);
    res.json({ data: items });
});

// GET /mock/user/getcard
router.get('/user/getcard', requireAuth, (req, res) => {
    const cards = mockCards.filter(c => c.userid === req.user._id);
    res.json({ data: cards });
});

// POST /mock/user/gold - خرید/فروش طلا
router.post('/user/gold', requireAuth, (req, res) => {
    const { amount, typeorder } = req.body;
    if (!amount || !typeorder) return res.status(400).json({ error: 'فیلدهای ضروری ارسال نشده' });
    const goldPrice = mockPrices.gold[0].price;
    const total = amount * goldPrice;
    res.json({
        data: {
            success: true,
            message: typeorder === 'buy' ? 'خرید طلا با موفقیت ثبت شد' : 'فروش طلا با موفقیت ثبت شد',
            order: { type: 'gold', typeorder, amount: Number(amount), price: Math.round(total), status: 'pending', createdAt: new Date() }
        }
    });
});

// POST /mock/user/silver - خرید/فروش نقره
router.post('/user/silver', requireAuth, (req, res) => {
    const { amount, typeorder } = req.body;
    if (!amount || !typeorder) return res.status(400).json({ error: 'فیلدهای ضروری ارسال نشده' });
    const silverPrice = mockPrices.silver[0].price;
    const total = amount * silverPrice;
    res.json({
        data: {
            success: true,
            message: typeorder === 'buy' ? 'خرید نقره با موفقیت ثبت شد' : 'فروش نقره با موفقیت ثبت شد',
            order: { type: 'silver', typeorder, amount: Number(amount), price: Math.round(total), status: 'pending', createdAt: new Date() }
        }
    });
});

// POST /mock/user/card - ثبت کارت بانکی
router.post('/user/card', requireAuth, (req, res) => {
    res.json({ data: 'کارت با موفقیت ثبت شد و در انتظار تایید است' });
});

// POST /mock/user/withdrawal - برداشت
router.post('/user/withdrawal', requireAuth, (req, res) => {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ error: 'مبلغ ارسال نشده' });
    if (Number(amount) > req.user.toman) return res.status(400).json({ data: 'موجودی شما کافی نیست' });
    res.json({ data: 'درخواست برداشت با موفقیت ثبت شد' });
});

// POST /mock/user/wallet - شارژ کیف پول (درگاه پرداخت mock)
router.post('/user/wallet', requireAuth, (req, res) => {
    const { amount } = req.body;
    res.json({ data: `https://mock-payment.test/pay?amount=${amount}&redirect=http://localhost:8080/user/wallet?status=success` });
});

// POST /mock/user/sendTicket - ارسال تیکت
router.post('/user/sendTicket', requireAuth, (req, res) => {
    res.json({ data: 'تیکت شما با موفقیت ثبت شد' });
});

// POST /mock/user/sendmessage - ارسال پیام در تیکت
router.post('/user/sendmessage', requireAuth, (req, res) => {
    res.json({ data: 'پیام ارسال شد' });
});

// GET /mock/user/loan/plans - طرح‌های وام
router.get('/user/loan/plans', requireAuth, (req, res) => {
    res.json({ data: mockLoanPlans });
});

// GET /mock/user/loan - وام‌های کاربر
router.get('/user/loan', requireAuth, (req, res) => {
    const loans = mockLoans.filter(l => l.userid === req.user._id);
    res.json({ data: loans });
});

// POST /mock/user/loan - درخواست وام
router.post('/user/loan', requireAuth, (req, res) => {
    res.json({ data: 'درخواست وام شما ثبت شد و در حال بررسی است' });
});

// GET /mock/user/ref - اطلاعات معرفی
router.get('/user/ref', requireAuth, (req, res) => {
    res.json({
        data: {
            refcode: req.user.refcode,
            invitation: req.user.invitation,
            gift: req.user.gift,
            refLink: `http://localhost:8080/register?ref=${req.user.refcode}`
        }
    });
});

// =============================================================
// ADMIN PANEL - پنل ادمین
// =============================================================

// GET /mock/admin/userlist
router.get('/admin/userlist', requireAdmin, (req, res) => {
    res.json({ admin: req.user, users: mockUserList });
});

// GET /mock/admin/orderlist
router.get('/admin/orderlist', requireAdmin, (req, res) => {
    res.json({ data: mockOrders });
});

// GET /mock/admin/withdrawallist
router.get('/admin/withdrawallist', requireAdmin, (req, res) => {
    res.json({ data: mockWithdrawals });
});

// GET /mock/admin/depositlist
router.get('/admin/depositlist', requireAdmin, (req, res) => {
    res.json({ data: mockDeposits });
});

// GET /mock/admin/notiflist
router.get('/admin/notiflist', requireAdmin, (req, res) => {
    res.json({ data: mockNotifs });
});

// GET /mock/admin/ticketlist
router.get('/admin/ticketlist', requireAdmin, (req, res) => {
    res.json({ data: mockTickets });
});

// GET /mock/admin/bannerlist
router.get('/admin/bannerlist', requireAdmin, (req, res) => {
    res.json({ data: mockBanners });
});

// GET /mock/admin/settings
router.get('/admin/settings', requireAdmin, (req, res) => {
    res.json({ data: mockSettings });
});

// POST /mock/admin/settings - آپدیت تنظیمات
router.post('/admin/settings', requireAdmin, (req, res) => {
    res.json({ data: 'تنظیمات با موفقیت ذخیره شد', settings: { ...mockSettings, ...req.body } });
});

// GET /mock/admin/loanlist
router.get('/admin/loanlist', requireAdmin, (req, res) => {
    res.json({ data: mockLoans });
});

// POST /mock/admin/sendnotif - ارسال اعلان
router.post('/admin/sendnotif', requireAdmin, (req, res) => {
    res.json({ data: 'اعلان با موفقیت ارسال شد' });
});

// POST /mock/admin/updateUser - ویرایش کاربر
router.post('/admin/updateUser', requireAdmin, (req, res) => {
    res.json({ status: true, msg: 'کاربر با موفقیت ویرایش شد' });
});

// POST /mock/admin/updateBalance - تغییر موجودی کاربر
router.post('/admin/updateBalance', requireAdmin, (req, res) => {
    res.json({ status: true, msg: 'موجودی کاربر بروزرسانی شد' });
});

// POST /mock/admin/withdrawal/approve - تایید برداشت
router.post('/admin/withdrawal/approve', requireAdmin, (req, res) => {
    res.json({ data: 'درخواست برداشت تایید شد' });
});

// POST /mock/admin/deposit/approve - تایید واریز
router.post('/admin/deposit/approve', requireAdmin, (req, res) => {
    res.json({ data: 'واریز تایید شد' });
});

// GET /mock/admin/stats - آمار کلی داشبورد
router.get('/admin/stats', requireAdmin, (req, res) => {
    res.json({
        data: {
            totalUsers: mockUserList.length,
            activeUsers: mockUserList.filter(u => u.isActive).length,
            totalOrders: mockOrders.length,
            pendingOrders: mockOrders.filter(o => o.status === 'pending').length,
            totalDeposits: mockDeposits.reduce((s, d) => s + d.amount, 0),
            pendingWithdrawals: mockWithdrawals.filter(w => w.status === 'pending').length,
            goldPrice: mockPrices.gold[0].price,
            silverPrice: mockPrices.silver[0].price
        }
    });
});

// =============================================================
// TRADING BOT - داده‌های mock برای ربات معامله‌گر
// =============================================================

function makeMockBotData(investment = 5000000) {
    const basePrice = 4250000;
    const trades = [];
    for (let i = 23; i >= 0; i--) {
        const variation = (Math.random() - 0.48) * basePrice * 0.008;
        const price = Math.round(basePrice + variation);
        trades.push({
            type: variation > 0 ? 'BUY' : 'SELL',
            amount: Math.round((investment / price) * 0.1 * 100) / 100,
            price,
            profit: Math.round(investment * (0.004 + Math.random() * 0.006)),
            time: new Date(Date.now() - i * 3600000)
        });
    }
    return { investment, trades, totalProfit: trades.reduce((s, t) => s + t.profit, 0) };
}

// GET /mock/bot/subscription
router.get('/bot/subscription', requireAuth, (req, res) => {
    res.json({ status: 'active', subscriptionEndDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), investment: 5000000, isMock: true });
});

// POST /mock/bot/purchase
router.post('/bot/purchase', requireAuth, (req, res) => {
    res.json({ success: true, message: 'اشتراک ربات فعال شد (تست)', endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), isMock: true });
});

// GET /mock/bot/stats
router.get('/bot/stats', requireAuth, (req, res) => {
    const d = makeMockBotData();
    res.json({ currentInvestment: d.investment, todayProfit: Math.round(d.investment * 0.008), totalProfit: d.totalProfit, totalTrades: d.trades.length, profitPercent: 0.8, marketInfo: { highPrice: 4301300, lowPrice: 4199500, dailyRange: 101800, dailyChangePercent: 0.83 }, isMock: true });
});

// GET /mock/bot/trades
router.get('/bot/trades', requireAuth, (req, res) => {
    const d = makeMockBotData();
    res.json(d.trades.slice(-10).reverse());
});

// GET /mock/bot/current-price
router.get('/bot/current-price', requireAuth, (req, res) => {
    res.json({ price: 4250000, timestamp: new Date().toISOString(), isMock: true });
});

// GET /mock/bot/prices - قیمت‌های امروز با نوسان
router.get('/bot/prices', requireAuth, (req, res) => {
    res.json({ high: 4301300, low: 4199500, current: 4250000, isMock: true });
});

// GET /mock/bot/yesterday-report - گزارش ۲۴ ساعت گذشته
router.get('/bot/yesterday-report', requireAuth, (req, res) => {
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    res.json({ date: yesterday, investment: 5000000, profit: 40000, profitPercent: 0.8, marketData: { highPrice: 4280000, lowPrice: 4180000, openPrice: 4200000, closePrice: 4250000, dailyRange: 100000, dailyChangePercent: 1.19 }, isMock: true });
});

// GET /mock/bot/24h-history - داده نمودار ۲۴ ساعته
router.get('/bot/24h-history', requireAuth, (req, res) => {
    const history = [];
    let price = 4250000;
    for (let i = 24; i >= 0; i--) {
        price = Math.round(price + (Math.random() - 0.48) * price * 0.006);
        history.push({ hour: 24 - i, price, time: new Date(Date.now() - i * 3600000) });
    }
    res.json({ success: true, data: history, isMock: true });
});

// همان‌ها برای demo routes
router.get('/bot/demo/subscription', requireAuth, (req, res) => {
    res.json({ success: true, data: { status: 'active', subscriptionEndDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), investment: 1000000, daysLeft: 15 }, isMock: true });
});

router.post('/bot/demo/purchase', requireAuth, (req, res) => {
    res.json({ success: true, message: 'اشتراک دمو فعال شد (تست)', endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), isMock: true });
});

router.get('/bot/demo/stats', requireAuth, (req, res) => {
    res.json({ success: true, data: { currentInvestment: 1000000, todayProfit: 8000, totalProfit: 240000, totalTrades: 45, successRate: 85, avgDailyProfit: 8000, subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }, isMock: true });
});

router.get('/bot/demo/trades', requireAuth, (req, res) => {
    const trades = [];
    for (let i = 0; i < 10; i++) {
        const isProfit = Math.random() > 0.3;
        trades.push({ _id: `demo_${i}`, date: new Date(Date.now() - i * 7200000), type: isProfit ? 'buy' : 'sell', amount: Math.floor(Math.random() * 100000) + 50000, price: Math.floor(Math.random() * 100000) + 4200000, profit: isProfit ? Math.floor(Math.random() * 5000) + 1000 : -(Math.floor(Math.random() * 3000) + 500), status: isProfit ? 'profit' : 'loss' });
    }
    res.json({ success: true, data: trades });
});

router.get('/bot/demo/prices', requireAuth, (req, res) => {
    res.json({ success: true, data: { currentPrice: 4250000, openPrice: 4215000, highPrice: 4301300, lowPrice: 4199500, change: 35000, changePercent: 0.83 } });
});

router.get('/bot/demo/current-price', requireAuth, (req, res) => {
    res.json({ success: true, data: { price: 4250000, timestamp: new Date(), source: 'mock' } });
});

module.exports = router;
