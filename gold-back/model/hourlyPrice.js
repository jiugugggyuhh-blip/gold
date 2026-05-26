const mongoose = require('mongoose');

const hourlyPriceSchema = new mongoose.Schema({
    recordedAt: { type: Date, default: Date.now, index: true },
    gold18: Number,
    gold24: Number,
    goldMelted: Number,
    silver999: Number,
    silver925: Number,
    dollar: Number,
    euro: Number,
    coin: Number,
    halfCoin: Number,
    quarterCoin: Number,
});

hourlyPriceSchema.index({ recordedAt: -1 });

module.exports = mongoose.model('HourlyPrice', hourlyPriceSchema);
