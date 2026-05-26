const mongoose = require('mongoose');

// اسکیمای هر قسط
const InstallmentSchema = new mongoose.Schema({
    number: { type: Number, required: true }, // شماره قسط (۱، ۲، ...)
    amount: { type: Number, required: true }, // مبلغ قسط
    dueDate: { type: Date, required: true },  // تاریخ سررسید
    status: { 
        type: String, 
        enum: ['pending', 'paid', 'overdue'], 
        default: 'pending' 
    }, // وضعیت: در انتظار، پرداخت شده، دیرکرد
    paidAt: { type: Date } // تاریخ واقعی پرداخت
});

const LoanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LoanPlan'
    },
    title: { type: String, required: true },
    amount: { type: Number, required: true }, // مبلغ وام دریافتی
    interestRate: { type: Number, required: true },
    durationMonths: { type: Number, required: true },
    totalRepayment: { type: Number, required: true }, // کل مبلغ بازپرداخت
    
    // آرایه اقساط (مهم‌ترین بخش)
    installments: [InstallmentSchema],

    status: {
        type: String,
        enum: ['pending', 'active', 'rejected', 'completed', 'overdue'],
        default: 'pending'
    },
    
    // تاریخ شروع وام (زمان تایید ادمین)
    startDate: { type: Date },
    
    // مبلغی که تا الان پرداخت کرده
    totalPaid: { type: Number, default: 0 }

}, { timestamps: true });

module.exports = mongoose.model("Loan", LoanSchema);