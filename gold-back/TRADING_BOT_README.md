# ربات معامله‌گر طلا - مستندات فنی

## توضیحات کلی
این ربات به صورت خودکار بر اساس نوسانات واقعی بازار طلا، سود کاربران را محاسبه کرده و گزارش 24 ساعته ارائه می‌دهد.

## نحوه کار

### 1. دریافت قیمت از API
- قیمت لحظه‌ای طلا از API تنظیم شده در `apiSettings` دریافت می‌شود
- سرویس استفاده شده: `goldPriceService.js`

### 2. ذخیره‌سازی قیمت‌ها
- **هر ساعت**: قیمت لحظه‌ای طلا ذخیره می‌شود
- بالاترین (High) و پایین‌ترین (Low) قیمت روز ثبت می‌شود
- داده‌ها در مدل `historygold` ذخیره می‌شوند

### 3. محاسبه سود روزانه
- **ساعت 23:59 هر روز**: سود کاربران محاسبه می‌شود
- مبنای محاسبه: نوسان واقعی بازار (اختلاف بالاترین و پایین‌ترین قیمت)
- فرمول محاسبه:
  - اگر بازار صعودی باشد: 0.5% تا 1.5% سود
  - اگر بازار نزولی باشد: 0.4% تا 0.5% سود (هنوز مثبت!)
  - اگر بازار ثابت باشد: 0.7% تا 0.9% سود

### 4. نمایش به کاربر
- **هر 24 ساعت**: کاربر می‌تواند گزارش روز قبل را ببیند
- اطلاعات نمایش داده شده:
  - مقدار سود کسب شده (به تومان)
  - درصد سود
  - بالاترین و پایین‌ترین قیمت روز
  - لیست معاملات مجازی انجام شده

## API Endpoints

### کاربری
```
GET  /api/trading-bot/subscription      - وضعیت اشتراک
POST /api/trading-bot/purchase          - خرید اشتراک
GET  /api/trading-bot/stats             - آمار ربات (سود امروز)
GET  /api/trading-bot/yesterday-report  - گزارش عملکرد دیروز
GET  /api/trading-bot/trades            - لیست معاملات
GET  /api/trading-bot/prices            - قیمت‌های امروز (High/Low)
GET  /api/trading-bot/current-price     - قیمت لحظه‌ای
```

### دمو
```
GET  /api/trading-bot/demo/subscription
POST /api/trading-bot/demo/purchase
GET  /api/trading-bot/demo/stats
GET  /api/trading-bot/demo/trades
GET  /api/trading-bot/demo/prices
GET  /api/trading-bot/demo/current-price
```

### ادمین
```
GET  /api/trading-bot/admin/stats       - آمار کل کاربران
GET  /api/trading-bot/admin/users       - لیست کاربران
POST /api/trading-bot/admin/users/:userId/toggle - تغییر وضعیت کاربر
GET  /api/trading-bot/admin/settings    - تنظیمات ربات
POST /api/trading-bot/admin/settings    - ذخیره تنظیمات
```

## Cron Jobs

### 1. ذخیره قیمت لحظه‌ای
```javascript
cron.schedule('0 * * * *', ...) // هر ساعت
```
- دریافت قیمت از API
- ذخیره در دیتابیس
- به‌روزرسانی High و Low قیمت روز

### 2. محاسبه سود کاربران
```javascript
cron.schedule('59 23 * * *', ...) // هر روز 23:59
```
- دریافت نوسان بازار از دیتابیس
- محاسبه سود برای هر کاربر فعال
- ایجاد معاملات مجازی
- ذخیره در پروفایل کاربر

### 3. ریست سود روزانه
```javascript
cron.schedule('1 0 * * *', ...) // هر روز 00:01
```
- صفر کردن `todayProfit` همه کاربران

## مدل‌های دیتابیس

### TradingBot
```javascript
{
    userId: ObjectId,
    subscriptionStatus: 'active' | 'inactive' | 'expired',
    investment: Number,          // مبلغ سرمایه‌گذاری
    totalProfit: Number,         // سود کل
    todayProfit: Number,         // سود امروز
    totalTrades: Number,         // تعداد کل معاملات
    trades: [{                   // لیست معاملات
        type: 'BUY' | 'SELL',
        amount: Number,
        price: Number,
        profit: Number,
        time: Date
    }],
    lastTradeTime: Date,
    isActive: Boolean
}
```

### historygold
```javascript
{
    date: Date,                  // تاریخ رکورد
    price: Number,               // قیمت فعلی
    highPrice: Number,           // بالاترین قیمت روز
    lowPrice: Number,            // پایین‌ترین قیمت روز
    dailyChange: Number,         // تغییر قیمت نسبت به دیروز
    dailyChangePercent: Number   // درصد تغییر
}
```

## مثال پاسخ API

### GET /stats
```json
{
    "currentInvestment": 10000000,
    "todayProfit": 85000,
    "totalProfit": 2500000,
    "totalTrades": 45,
    "profitPercent": 0.85,
    "marketInfo": {
        "highPrice": 2850000,
        "lowPrice": 2780000,
        "dailyRange": 70000,
        "dailyChangePercent": 1.2
    }
}
```

### GET /yesterday-report
```json
{
    "date": "2025-01-14T00:00:00.000Z",
    "investment": 10000000,
    "profit": 85000,
    "profitPercent": 0.85,
    "marketData": {
        "highPrice": 2850000,
        "lowPrice": 2780000,
        "openPrice": 2800000,
        "closePrice": 2840000,
        "dailyRange": 70000,
        "dailyChangePercent": 1.43
    }
}
```

## تنظیمات

### قیمت اشتراک
- پیش‌فرض: 1,000,000 تومان
- مدت اشتراک: 30 روز

### محدوده سرمایه‌گذاری
- حداقل: 100,000 تومان
- حداکثر: 10,000,000 تومان

### درصد سود
- حداقل: 0.4%
- حداکثر: 1.5%
- متوسط: 0.8%

## نکات مهم

1. **عدم معامله واقعی**: این ربات فقط شبیه‌سازی است و معامله واقعی انجام نمی‌دهد
2. **سود تضمینی**: در همه حالت‌ها (حتی بازار نزولی) سود مثبت است
3. **شفافیت**: کاربران می‌توانند نوسان واقعی بازار را ببینند
4. **گزارش 24 ساعته**: هر روز عملکرد روز قبل نمایش داده می‌شود

## فایل‌های مرتبط

```
gold-back/
├── controller/
│   └── tradingBotController.js    # منطق اصلی ربات
├── model/
│   ├── tradingBot.js              # مدل کاربر ربات
│   └── historygold.js             # مدل تاریخچه قیمت
├── routes/
│   └── tradingBot.js              # مسیرهای API
├── services/
│   └── goldPriceService.js        # سرویس دریافت قیمت
└── cron/
    └── tradingBotCron.js          # وظایف زمان‌بندی شده
```

## راه‌اندازی

1. اطمینان از اتصال به دیتابیس MongoDB
2. تنظیم API قیمت طلا در پنل ادمین
3. اجرای سرور با دستور: `npm start`
4. Cron jobs به صورت خودکار شروع می‌شوند

## پشتیبانی

برای تغییر تنظیمات یا گزارش مشکل، با تیم فنی تماس بگیرید.
