const mongoose = require('mongoose');

const tradingBotSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    subscriptionStatus: {
        type: String,
        enum: ['active', 'inactive', 'expired'],
        default: 'inactive'
    },
    subscriptionStartDate: {
        type: Date,
        default: null
    },
    subscriptionEndDate: {
        type: Date,
        default: null
    },
    investment: {
        type: Number,
        default: 0
    },
    totalProfit: {
        type: Number,
        default: 0
    },
    todayProfit: {
        type: Number,
        default: 0
    },
    totalTrades: {
        type: Number,
        default: 0
    },
    trades: [{
        type: {
            type: String,
            enum: ['BUY', 'SELL'],
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        profit: {
            type: Number,
            default: 0
        },
        time: {
            type: Date,
            default: Date.now
        }
    }],
    lastTradeTime: {
        type: Date,
        default: null
    },
    isActive: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for faster queries
tradingBotSchema.index({ userId: 1 });
tradingBotSchema.index({ subscriptionStatus: 1 });
tradingBotSchema.index({ isActive: 1 });

module.exports = mongoose.model('TradingBot', tradingBotSchema);
