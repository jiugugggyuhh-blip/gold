// =============================================================
// ⚠️  TEST MODE ONLY - MOCK DATA
// این فایل فقط برای تست و طراحی UI است
// قبل از deploy به production حتماً این داده‌ها را حذف یا غیرفعال کنید
// TODO: REMOVE OR DISABLE MOCK DATA BEFORE PRODUCTION DEPLOY
// =============================================================

// شناسه‌های معتبر ObjectId برای جلوگیری از CastError در mongoose
// این مقادیر 24 کاراکتر hex معتبر هستند
const MOCK_ADMIN_ID = '000000000000000000000001';
const MOCK_USER_ID  = '000000000000000000000002';

const mockUsers = {
    admin: {
        _id: MOCK_ADMIN_ID,
        id: MOCK_ADMIN_ID,
        username: 'admin_test',
        password: 'admin123',
        role: 'admin',
        fname: 'مدیر',
        lname: 'سیستم',
        name: 'مدیر سیستم',
        email: 'admin@test.com',
        phone: '09123456789',
        isActive: true,
        isAuthentication: true,
        isflag: false,
        toman: 150000000,
        gold: 25.5,
        silver: 500,
        refcode: 'ADMIN001',
        invitation: 5,
        gift: 50000,
        createdAt: new Date('2024-01-01'),
        avatar: null,
        codemeli: '0012345678',
        address: 'تهران، خیابان ولیعصر',
        // mock save() برای جلوگیری از crash وقتی کد user.save() صدا می‌زند
        save: async () => {}
    },
    user: {
        _id: MOCK_USER_ID,
        id: MOCK_USER_ID,
        username: 'user_test',
        password: 'user123',
        role: 'user',
        fname: 'علی',
        lname: 'محمدی',
        name: 'کاربر تست',
        email: 'user@test.com',
        phone: '09876543210',
        isActive: true,
        isAuthentication: true,
        isflag: false,
        toman: 12500000,
        gold: 3.2,
        silver: 120,
        refcode: 'USER001',
        invitation: 2,
        gift: 10000,
        createdAt: new Date('2024-03-15'),
        avatar: null,
        codemeli: '0098765432',
        address: 'اصفهان، خیابان چهارباغ',
        save: async () => {}
    }
};

const mockWallet = {
    [MOCK_USER_ID]: {
        _id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
        userId: MOCK_USER_ID,
        toman: 12500000,
        gold: 3.2,
        silver: 120,
        updatedAt: new Date()
    },
    [MOCK_ADMIN_ID]: {
        _id: 'bbbbbbbbbbbbbbbbbbbbbbbb',
        userId: MOCK_ADMIN_ID,
        toman: 150000000,
        gold: 25.5,
        silver: 500,
        updatedAt: new Date()
    }
};

// قیمت‌های mock برای طلا، نقره و ارز
const mockPrices = {
    gold: [
        { symbol: 'gold_18k', name: 'گرم طلای 18 عیار', name_en: 'Gold 18K', price: 4250000, change_value: 35000, change_percent: 0.83, unit: 'تومان' },
        { symbol: 'gold_24k', name: 'گرم طلای 24 عیار', name_en: 'Gold 24K', price: 5650000, change_value: 47000, change_percent: 0.84, unit: 'تومان' },
        { symbol: 'mesghal', name: 'مثقال طلا', name_en: 'Mesghal Gold', price: 19800000, change_value: 165000, change_percent: 0.84, unit: 'تومان' },
        { symbol: 'sekke_emami', name: 'سکه امامی', name_en: 'Emami Coin', price: 85000000, change_value: 500000, change_percent: 0.59, unit: 'تومان' },
        { symbol: 'nim_sekke', name: 'نیم سکه', name_en: 'Half Coin', price: 45000000, change_value: 250000, change_percent: 0.56, unit: 'تومان' },
        { symbol: 'rob_sekke', name: 'ربع سکه', name_en: 'Quarter Coin', price: 24000000, change_value: 120000, change_percent: 0.5, unit: 'تومان' }
    ],
    silver: [
        { symbol: 'silver_999', name: 'نقره 999', name_en: 'Silver 999', price: 42000, change_value: 300, change_percent: 0.72, unit: 'تومان' },
        { symbol: 'silver_925', name: 'نقره 925', name_en: 'Silver 925', price: 38000, change_value: 250, change_percent: 0.66, unit: 'تومان' }
    ],
    currency: [
        { symbol: 'usd', name: 'دلار آمریکا', name_en: 'USD', price: 92500, change_value: 500, change_percent: 0.54, unit: 'تومان' },
        { symbol: 'eur', name: 'یورو', name_en: 'EUR', price: 102000, change_value: 700, change_percent: 0.69, unit: 'تومان' },
        { symbol: 'gbp', name: 'پوند انگلیس', name_en: 'GBP', price: 119000, change_value: 600, change_percent: 0.51, unit: 'تومان' },
        { symbol: 'aed', name: 'درهم امارات', name_en: 'AED', price: 25200, change_value: 150, change_percent: 0.6, unit: 'تومان' }
    ]
};

// تاریخچه قیمت طلا (۳۰ روز اخیر)
function generatePriceHistory(basePrice, days = 30) {
    const history = [];
    let price = basePrice;
    for (let i = days; i >= 0; i--) {
        const change = (Math.random() - 0.48) * basePrice * 0.015;
        price = Math.max(price + change, basePrice * 0.85);
        history.push({
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
            price: Math.round(price)
        });
    }
    return history;
}

const mockOrders = [
    { _id: 'order1', userid: 'user123', type: 'gold', typeorder: 'buy', amount: 1.5, price: 6375000, status: 'done', createdAt: new Date(Date.now() - 2 * 86400000) },
    { _id: 'order2', userid: 'user123', type: 'gold', typeorder: 'sell', amount: 0.5, price: 2125000, status: 'done', createdAt: new Date(Date.now() - 5 * 86400000) },
    { _id: 'order3', userid: 'user123', type: 'silver', typeorder: 'buy', amount: 50, price: 2100000, status: 'done', createdAt: new Date(Date.now() - 8 * 86400000) },
    { _id: 'order4', userid: 'user123', type: 'gold', typeorder: 'buy', amount: 2.0, price: 8500000, status: 'pending', createdAt: new Date(Date.now() - 1 * 86400000) }
];

const mockWithdrawals = [
    { _id: 'w1', userid: 'user123', amount: 5000000, status: 'pending', createdAt: new Date(Date.now() - 1 * 86400000) },
    { _id: 'w2', userid: 'user123', amount: 3000000, status: 'done', createdAt: new Date(Date.now() - 10 * 86400000) }
];

const mockCards = [
    { _id: 'card1', userid: 'user123', card: '6219-8610-1234-5678', status: 'active', createdAt: new Date(Date.now() - 30 * 86400000) }
];

const mockNotifs = [
    { _id: 'n1', title: 'خوش آمدید', body: 'به سیستم مدیریت طلا خوش آمدید', createdAt: new Date(Date.now() - 1 * 86400000) },
    { _id: 'n2', title: 'قیمت طلا', body: 'قیمت طلای 18 عیار امروز افزایش یافت', createdAt: new Date(Date.now() - 2 * 86400000) },
    { _id: 'n3', title: 'احراز هویت', body: 'لطفاً احراز هویت خود را تکمیل کنید', createdAt: new Date(Date.now() - 5 * 86400000) }
];

const mockTickets = [
    { _id: 't1', userid: 'user123', title: 'سوال درباره خرید طلا', body: 'آیا حداقل خرید طلا وجود دارد؟', status: 'open', createdAt: new Date(Date.now() - 3 * 86400000) },
    { _id: 't2', userid: 'user123', title: 'مشکل در واریز', body: 'واریز انجام شده ولی موجودی بروز نشده', status: 'closed', createdAt: new Date(Date.now() - 15 * 86400000) }
];

const mockLoanPlans = [
    { _id: 'lp1', title: 'وام کوتاه‌مدت', amount: 5000000, duration: 3, interest: 2, minGold: 1, description: 'وام ۳ ماهه با سود ۲ درصد ماهیانه' },
    { _id: 'lp2', title: 'وام میان‌مدت', amount: 20000000, duration: 12, interest: 1.5, minGold: 4, description: 'وام ۱۲ ماهه با سود ۱.۵ درصد ماهیانه' },
    { _id: 'lp3', title: 'وام بلند‌مدت', amount: 50000000, duration: 24, interest: 1.2, minGold: 10, description: 'وام ۲۴ ماهه با سود ۱.۲ درصد ماهیانه' }
];

const mockLoans = [
    { _id: 'loan1', userid: 'user123', planId: 'lp1', amount: 5000000, goldPledge: 1.5, status: 'active', startDate: new Date(Date.now() - 30 * 86400000), endDate: new Date(Date.now() + 60 * 86400000) }
];

// داده‌های کاربران برای پنل ادمین
const mockUserList = [
    { ...mockUsers.admin, orders: 12, totalBuy: 180000000 },
    { ...mockUsers.user, orders: 4, totalBuy: 19000000 },
    {
        _id: 'user456', username: 'sara_k', fname: 'سارا', lname: 'کریمی', phone: '09111111111',
        email: 'sara@test.com', role: 'user', toman: 8000000, gold: 1.8, silver: 80,
        isAuthentication: true, isflag: false, createdAt: new Date('2024-05-10'), orders: 7, totalBuy: 32000000
    },
    {
        _id: 'user789', username: 'reza_m', fname: 'رضا', lname: 'مرادی', phone: '09222222222',
        email: 'reza@test.com', role: 'user', toman: 3000000, gold: 0.5, silver: 30,
        isAuthentication: false, isflag: true, createdAt: new Date('2024-08-20'), orders: 1, totalBuy: 2500000
    }
];

const mockDeposits = [
    { _id: 'd1', userId: 'user123', amount: 10000000, status: 'pending', createdAt: new Date(Date.now() - 1 * 86400000) },
    { _id: 'd2', userId: 'user456', amount: 5000000, status: 'done', createdAt: new Date(Date.now() - 3 * 86400000) }
];

const mockBanners = [
    { _id: 'b1', title: 'خرید طلا آسان', image: 'https://via.placeholder.com/800x300/FFD700/000000?text=MaxiGold', link: '/', isActive: true },
    { _id: 'b2', title: 'سرمایه‌گذاری در نقره', image: 'https://via.placeholder.com/800x300/C0C0C0/000000?text=Silver', link: '/', isActive: true }
];

const mockSettings = {
    _id: 'settings1',
    siteName: 'ماکسی گلد',
    buyFee: 0.5,
    sellFee: 0.3,
    minBuyGold: 0.1,
    minBuySilver: 10,
    gift: 50000,
    smsActive: false,
    maintenanceMode: false
};

module.exports = {
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
};
