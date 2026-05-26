const mongoose = require('mongoose');

const CharitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // با حروف کوچک چون در مدل کاربر احتمالا اینطوری تعریف شده
        required: true
    },
    // نوع ارز اهدایی
    currencyType: {
        type: String,
        enum: ['GOLD', 'TOMAN'],
        required: true
    },
    // مقدار اهدا شده
    amount: {
        type: Number,
        required: true
    },
    // پیام کاربر (نیت خیر، توضیحات و...)
    message: {
        type: String,
        default: ''
    },
    // وضعیت (معمولا موفق است چون آنی کسر میشه)
    status: {
        type: String,
        enum: ['success', 'failed'],
        default: 'success'
    }
}, { timestamps: true });

module.exports = mongoose.model("Charity", CharitySchema);