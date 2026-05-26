const cron = require('node-cron');
const Loan = require('../model/Loan'); // مسیر مدل وام

// هر روز ساعت ۰۰:۰۰ اجرا میشه
cron.schedule('0 0 * * *', async () => {
    console.log('--- شروع بررسی اقساط معوقه ---');
    
    const today = new Date();
    
    // وام‌های فعال رو پیدا کن
    const activeLoans = await Loan.find({ status: 'active' });

    for (const loan of activeLoans) {
        let isModified = false;

        for (const installment of loan.installments) {
            // اگر قسط پرداخت نشده و تاریخش گذشته
            if (installment.status === 'pending' && new Date(installment.dueDate) < today) {
                
                // 1. تغییر وضعیت به معوقه
                installment.status = 'overdue';
                
                // 2. اعمال جریمه (مثلاً 5 درصد مبلغ قسط)
                const penalty = installment.amount * 0.05; 
                installment.penaltyAmount = (installment.penaltyAmount || 0) + penalty;
                
                // اضافه کردن جریمه به مبلغ بازپرداخت کل وام (اختیاری)
                loan.totalRepayment += penalty;

                isModified = true;
                
                // اینجا میتونی SMS هم بفرستی
                // sendSms(loan.user, `قسط شما دیر شد! مبلغ ${penalty} تومان جریمه شدید.`);
            }
        }

        if (isModified) {
            await loan.save();
        }
    }
    console.log('--- پایان بررسی ---');
});