const mongoose = require('mongoose');

const LoanPlanSchema = new mongoose.Schema({
    // 1. عنوان طرح (مثلاً: وام فوری، وام مسکن)
    title: {
        type: String,
        required: true, 
        trim: true
    },

    // 2. مبلغ وام (مثلاً: 50,000,000 تومان)
    amount: {
        type: Number,
        required: true
    },

    // 3. درصد سود (مثلاً: 18 درصد)
    interestRate: {
        type: Number,
        required: true,
        default: 0
    },

    // 4. مدت بازپرداخت به ماه (مثلاً: 12 ماهه)
    durationMonths: {
        type: Number,
        required: true
    },

    // 5. توضیحات تکمیلی (شرایط دریافت و...)
    description: {
        type: String
    },

    // 6. وضعیت طرح (آیا الان این وام قابل دریافت هست یا نه؟)
    isActive: {
        type: Boolean,
        default: true
    }
});

const LoanPlanModel = mongoose.model("LoanPlan", LoanPlanSchema);

module.exports = LoanPlanModel;