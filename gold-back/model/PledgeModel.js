const mongoose = require('mongoose');

const PledgeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    // نوع دارایی که کاربر می‌خواهد بلوکه کند (وثیقه)
    collateralType: {
        type: String,
        enum: ['GOLD', 'TOMAN'],
        required: true
    },
    // مقدار دارایی بلوکه شده (مثلاً ۱۰ گرم یا ۵۰ میلیون تومان)
    collateralAmount: {
        type: Number,
        required: true
    },
    // مدت زمان بلوکه شدن (به ماه)
    durationMonths: {
        type: Number,
        required: true
    },
    // نوع وامی که می‌خواهد دریافت کند (معمولاً برعکس وثیقه است)
    loanType: {
        type: String,
        enum: ['GOLD', 'TOMAN'],
        required: true
    },
    // مبلغ وامی که ادمین تایید می‌کند و به کاربر داده می‌شود
    loanAmountGiven: {
        type: Number,
        default: 0
    },
    // وضعیت درخواست
    status: {
        type: String,
        enum: ['pending', 'active', 'rejected', 'completed', 'defaulted' ,'released'],
        default: 'pending'
    },
    // تاریخ شروع و پایان (بعد از تایید ادمین پر می‌شود)
    startDate: { type: Date },
    endDate: { type: Date },
    
    // توضیحات ادمین
    adminNote: { type: String }

}, { timestamps: true });

module.exports = mongoose.model("Pledge", PledgeSchema);