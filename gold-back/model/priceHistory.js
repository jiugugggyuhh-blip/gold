const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['gold', 'silver', 'crypto'],
        required: true
    },
    symbol: {
        type: String, // برای ارزهای دیجیتال مثل BTC، برای طلا/نقره می‌تواند '18k' یا '999' باشد
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        index: true
    }
});

// ایندکس ترکیبی برای جستجوی سریع‌تر بر اساس نوع و تاریخ
priceHistorySchema.index({ type: 1, date: -1 });

module.exports = mongoose.model('PriceHistory', priceHistorySchema);
