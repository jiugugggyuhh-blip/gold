const path = require("path")
const usermodel = require("../model/user");
const { json } = require("body-parser");
const axios = require('axios');
const ordermodel = require("../model/order");
const notifmodel = require("../model/notif");
const moment = require('moment');
const Ticketmodel = require("../model/Ticket");
const withdrawalmodel = require("../model/withdrawal");
const cardmodel = require("../model/card");
const orderPhysical = require("../model/orderPhysical");
const depositmodel = require("../model/deposit");
const walletmodel = require("../model/wallet");
const Pledge = require("../model/PledgeModel");
const CryptoOrdermodel = require("../model/cryptoOrder");
const LoanPlan = require('../model/LoanPlans');
const Loan = require('../model/Loan');
const mongoose = require('mongoose');
const Charity = require('../model/Charity');
const transfermodel = require("../model/transfer");
const PriceHistory = require("../model/priceHistory");
const historygoldmodel = require("../model/historygold");
const historysilvermodel = require("../model/historysilver");

// profile ✅
exports.profilepage = async (req, res) => {
    try {
        res.json({
            user: req.user,
        });

    } catch (error) {
        res.json(`${error}`);
    }
};

exports.profile = async (req, res) => {
    try {
        const { username, email, codemeli, address, fname, lname } = req.body

        let avatar;

        if (req.file) {
            avatar = req.file ? path.posix.join('/', req.file.path) : null;
        }

        const user = await usermodel.findOneAndUpdate({ _id: req.user._id }, { username, email, codemeli, address, fname, lname, avatar })

        res.json({
            message: "پروفایل کاربر با موفقیت به‌روزرسانی شد",
            user: user
        });


    } catch (error) {
        res.json(`${error}`);
    }
};

exports.refgift = async (req, res) => {
    try {

        res.json({
            user: req.user,
        });

    } catch (error) {
        res.json(`${error}`);
    }
};

exports.getnotif = async (req, res) => {
    try {

        const item = await notifmodel.find({})
        res.json({ data: item })

    } catch (error) {
        res.json(`${error}`);
    }
};



// auth

exports.Authentication = async (req, res) => {
    try {

        const { codemeli } = req.body

        let image = null

        const normalizedPath = req.file.path.replace(/\\/g, '/');
        const relativePath = path.posix.join('/', normalizedPath);
        const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
        image = `${baseUrl}${relativePath}`;

        await usermodel.findOneAndUpdate({ _id: req.user._id }, { imgcartmeli: image, codemeli, isflag: true, isAuthentication: false })

        res.json({ data: "احراز هویت  شما ارسال و نتیجه اعلام خواهد شد" })

    } catch (error) {
        res.json(`${error}`)
    }

}


//wallet

exports.wallet = async (req, res) => {
    try {
        const { amount } = req.body;
        const merchant = process.env.ZIBAL_MERCHANT || 'zibal';

        const callbackUrl = `http://localhost:7033/user/pay?userid=${req.user._id}&amount=${amount}`;

        const payload = { merchant, amount: amount * 10, callbackUrl };
        const zibalRes = await axios.post('https://gateway.zibal.ir/v1/request', payload, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (!zibalRes.data || !zibalRes.data.trackId) {
            return res.status(502).json({ error: 'خطا در ارتباط با درگاه' });
        }

        const trackId = zibalRes.data.trackId;
        return res.json({ data: `https://gateway.zibal.ir/start/${trackId}` });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.pay = async (req, res) => {
    try {
        const { trackId, amount, userid } = req.query;
        const merchant = process.env.ZIBAL_MERCHANT || 'zibal';

        const verifyRes = await axios.post('https://gateway.zibal.ir/v1/verify', { merchant, trackId }, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (verifyRes.data?.paidAt && verifyRes.data?.status === 1) {
            const user = await usermodel.findById(userid);
            if (user) {
                user.toman = Number(user.toman || 0) + Number(amount || 0);
                await user.save();
            }
            return res.redirect('http://localhost:8080/user/wallet?status=success&amount=' + amount);
        } else {
            return res.redirect('http://localhost:8080/user/wallet?status=failed');
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


exports.walletCart = async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || Number(amount) < 100000) {
            return res.status(400).json({ error: 'حداقل مبلغ ۱۰۰٬۰۰۰ تومان است' });
        }

        const img = req.file ? path.posix.join('/', req.file.path) : null;
        const deposit = await depositmodel.create({
            userId: req.user._id,
            amount: Number(amount),
            img
        });

        return res.json({ msg: 'درخواست شما برای واریز ثبت شد', data: deposit });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};



exports.withdrawal = async (req, res) => {
    try {
        const { amount, cardId } = req.body;
        const user = await usermodel.findOne({ _id: req.user._id });


        if (!user) {
            return res.status(404).json({ data: "کاربر یافت نشد" });
        }

        if (user.toman < amount) {
            return res.status(400).json({ data: "موجودی شما کمتر از مقدار وارد شده می باشد" });
        }

        await withdrawalmodel.create({ userid: req.user._id, amount, cardId });
        user.toman -= amount;
        await user.save();

        res.status(200).json({ data: "درخواست شما با موفقیت ثبت شد" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

exports.listwithdrawal = async (req, res) => {
    try {
        const withdrawal = await withdrawalmodel.find({ userid: req.user._id }).populate("userid")
        res.json({ data: withdrawal });

    } catch (error) {
        console.error("Error in adminReply:", error);
        res.status(500).json({ message: error.message });
    }
};


exports.card = async (req, res) => {
    try {
        const { card } = req.body;

        await cardmodel.create({ userid: req.user._id, card });

        res.status(200).json({ data: "درخواست شما ثبت و به زودی  بررسی می شود" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

exports.getcard = async (req, res) => {
    try {

        const cards = await cardmodel.find({ userid: req.user._id })
        res.status(200).json({ data: cards });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};



// buy gold - coin

exports.coin = async (req, res) => {
    try {
        const { goldid, price, typeorder } = req.body;
        if (!req.user.isAuthentication) {
            return res.status(401).json({ error: "کاربر گرامی برای خرید و فروش احتیاج به احراز هویت میباشد" });
        }
        const user = req.user

        if (price == null || goldid == null || !typeorder) {
            return res.status(400).json({ error: "تمامی فیلدها الزامی هستند" });
        }
        const validTypes = ["buy", "sell"];
        if (!validTypes.includes(typeorder)) {
            return res.status(400).json({ error: "نوع سفارش نامعتبر است" });
        }
        if (typeorder === "buy" && price > user.toman) {
            return res.status(400).json({ error: "موجودی شما کافی نیست لطفا حساب خود را شارژ کنید" });

        }

        const order = await orderPhysical.create({
            goldid,
            price,
            typeorder,
            userid: user._id
        });

        if (typeorder === "buy") {
            user.toman = user.toman - price
        }

        await user.save()

        return res.json({
            data: typeorder === "buy" ? "خرید با موفقیت انجام شد" : "فروش با موفقیت انجام شد"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "خطای سرور" });
    }
};


// assets

exports.assets = async (req, res) => {
    try {
        const order = await orderPhysical.find({
            userid: req.user._id
        }).populate("userid").populate("goldid")
        return res.json({
            data: order
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "خطای سرور" });
    }
};







// gold buy sell
exports.gold = async (req, res) => {
    try {
        const { price, fee, weight, typeorder, goldprice } = req.body;
        if (!req.user.isAuthentication) {
            return res.status(401).json({ error: "کاربر گرامی برای خرید و فروش احتیاج به احراز هویت میباشد" });
        }
        const user = req.user

        if (price == null || fee == null || weight == null || !typeorder) {
            return res.status(400).json({ error: "تمامی فیلدها الزامی هستند" });
        }
        const validTypes = ["buy", "sell"];
        if (!validTypes.includes(typeorder)) {
            return res.status(400).json({ error: "نوع سفارش نامعتبر است" });
        }
        if (typeorder === "buy" && price > user.toman) {
            return res.status(400).json({ error: "موجودی شما کافی نیست لطفا حساب خود را شارژ کنید" });

        }
        if (typeorder === "sell" && weight >= user.gold) {
            return res.status(400).json({ error: `موجودی طلای شما ${user.gold} میباشد` });

        }



        const order = await ordermodel.create({
            price,
            fee,
            weight,
            typeorder,
            goldprice,
            userid: user._id
        });


        if (typeorder === "buy") {
            user.toman = user.toman - price
            user.gold = user.gold + weight
        } else {
            user.toman = user.toman + (price - fee)
            user.gold = user.gold - weight
        }

        await user.save()


        return res.json({
            data: typeorder === "buy" ? "خرید با موفقیت انجام شد" : "فروش با موفقیت انجام شد"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "خطای سرور" });
    }
};
exports.silver = async (req, res) => {
    try {
        const { price, fee, weight, typeorder, goldprice } = req.body;
        if (!req.user.isAuthentication) {
            return res.status(401).json({ error: "کاربر گرامی برای خرید و فروش احتیاج به احراز هویت میباشد" });
        }
        const user = req.user

        if (price == null || fee == null || weight == null || !typeorder) {
            return res.status(400).json({ error: "تمامی فیلدها الزامی هستند" });
        }
        const validTypes = ["buy", "sell"];
        if (!validTypes.includes(typeorder)) {
            return res.status(400).json({ error: "نوع سفارش نامعتبر است" });
        }
        if (typeorder === "buy" && price > user.toman) {
            return res.status(400).json({ error: "موجودی شما کافی نیست لطفا حساب خود را شارژ کنید" });

        }
        if (typeorder === "sell" && weight >= user.silver) {
            return res.status(400).json({ error: `موجودی نقره شما ${user.silver} میباشد` });

        }


        const order = await ordermodel.create({
            price,
            fee,
            weight,
            typeorder,
            goldprice,
            userid: user._id
        });


        if (typeorder === "buy") {
            user.toman = user.toman - price
            user.gold = user.gold + weight
        } else {
            user.toman = user.toman + (price - fee)
            user.gold = user.gold - weight
        }

        await user.save()


        return res.json({
            data: typeorder === "buy" ? "خرید با موفقیت انجام شد" : "فروش با موفقیت انجام شد"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "خطای سرور" });
    }
};



// order
exports.order = async (req, res) => {
    try {
        let orders;
        try {
            orders = await ordermodel.find({ userid: req.user._id });
        } catch (dbError) {
            console.error('Database error fetching orders:', dbError);
            return res.status(500).json({ error: 'Database connection error' });
        }
        
        return res.json({
            data: orders || []
        });
    } catch (error) {
        console.error('Order fetch error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}



// ticket
exports.Ticket = async (req, res) => {
    try {

        const tickets = await Ticketmodel.find({ userid: req.user._id })
            .sort({ date: -1 });

        res.json({ data: tickets })


    } catch (error) {

        res.status(500).json({ error: error.message });
    }
};


exports.sendTicketpage = async (req, res) => {
    try {
        const tick = await Ticketmodel.findOne({ _id: req.params.id })

        res.json({ data: tick })
    } catch (error) {
        res.json(`${error}`)
    }

}


exports.sendTicket = async (req, res) => {
    try {
        const { title, text, category } = req.body;
        const time = moment().format("YYYY-MM-DD HH:mm");
        const uuid = Date.now();

        const newTicket = await Ticketmodel.create({
            uuid,
            title,
            userid: req.user._id,
            date: time,
            lastdate: time,
            category,
            status: "open",
            masssge: [{ text, time }]
        });

        res.json({ data: "تیکت ارسال شد" })

    } catch (error) {

        res.status(500).json({ error: error.message });
    }
};






exports.sendmessage = async (req, res) => {
    try {
        const { ticketId, text } = req.body;
        const time = moment().format("YYYY-MM-DD HH:mm");

        await Ticketmodel.findByIdAndUpdate(ticketId, {
            $push: { masssge: { text, time } },
            lastdate: time
        });
        res.json("تیکت ارسال شد")
    } catch (error) {


        res.status(500).json({ error: error.message });
    }
};

// wallet

exports.walletCrypto = async (req, res) => {
    try {
        const { item, link, network } = req.body
        const img = req.file ? path.posix.join('/', req.file.path) : null;
        const items = await CryptoOrdermodel.create({ userid: req.user._id, item, link, network, img })
        res.json({msg:"درخواست شما با موفقیت ثبت شد" , items})
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getWalletCrypto = async (req, res) => {
    try {
        const items = await CryptoOrdermodel.find({ userid: req.user._id, })
        res.json({ items})
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// loan

// --- دریافت طرح‌های فعال وام ---
exports.getActivePlans = async (req, res) => {
    try {
        const plans = await LoanPlan.find({ isActive: true }).sort({ amount: 1 });
        res.status(200).json({
            success: true,
            data: plans
        });
    } catch (error) {
        res.status(500).json({ message: "خطا در دریافت لیست وام‌ها", error: error.message });
    }
};

// --- ثبت درخواست وام ---
exports.requestLoan = async (req, res) => {
    try {
        const userId = req.user._id;
        const { planId } = req.body;

        const plan = await LoanPlan.findById(planId);
        if (!plan || !plan.isActive) {
            return res.status(404).json({ message: "طرح وام نامعتبر است." });
        }

        // بررسی وام باز قبلی
        const activeLoan = await Loan.findOne({ 
            user: userId, 
            status: { $in: ['pending', 'active', 'overdue'] } 
        });
        if (activeLoan) {
            return res.status(400).json({ message: "شما یک وام تسویه نشده دارید." });
        }

        // محاسبات مالی
        const profit = (plan.amount * plan.interestRate) / 100;
        const totalRepayment = plan.amount + profit;
        const monthlyPayment = Math.ceil(totalRepayment / plan.durationMonths);

        // تولید اقساط (به صورت موقت، تاریخ دقیق بعد از تایید ادمین ست می‌شود)
        const installments = [];
        const today = new Date();
        
        for (let i = 1; i <= plan.durationMonths; i++) {
            const dueDate = new Date(today);
            dueDate.setMonth(today.getMonth() + i);

            installments.push({
                number: i,
                amount: monthlyPayment,
                dueDate: dueDate,
                status: 'pending'
            });
        }

        // تصحیح قسط آخر
        const currentSum = monthlyPayment * plan.durationMonths;
        const diff = currentSum - totalRepayment;
        if (diff !== 0) {
            installments[installments.length - 1].amount -= diff;
        }

        const newLoan = new Loan({
            user: userId,
            plan: plan._id,
            title: plan.title,
            amount: plan.amount,
            interestRate: plan.interestRate,
            durationMonths: plan.durationMonths,
            totalRepayment,
            installments,
            status: 'pending'
        });

        await newLoan.save();

        res.status(201).json({
            success: true,
            message: "درخواست وام ثبت شد. پس از تایید مدیریت، اقساط فعال می‌شوند.",
            data: newLoan
        });

    } catch (error) {
        res.status(500).json({ message: "خطا در ثبت وام", error: error.message });
    }
};

// --- دریافت وام‌های من ---
exports.getMyLoans = async (req, res) => {
    try {
        const myLoans = await Loan.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: myLoans
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- دریافت جزئیات یک وام ---
exports.getLoanDetails = async (req, res) => {
    try {
        const { loanId } = req.params;
        const loan = await Loan.findOne({ _id: loanId, user: req.user._id });
        
        if (!loan) return res.status(404).json({ message: "وام یافت نشد" });

        res.json({ success: true, data: loan });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- پرداخت قسط (اصلاح شده: بدون Transaction) ---
exports.payInstallment = async (req, res) => {
    try {
        const userId = req.user._id;
        const { loanId, installmentNumber } = req.body;

        // 1. دریافت اطلاعات وام و کاربر
        const loan = await Loan.findOne({ _id: loanId, user: userId });
        const user = await usermodel.findById(userId);

        if (!loan || loan.status !== 'active') {
            return res.status(400).json({ message: "وام فعال یافت نشد یا هنوز تایید نشده است." });
        }
        if (!user) {
            return res.status(404).json({ message: "کاربر یافت نشد." });
        }

        // 2. پیدا کردن قسط مورد نظر
        const installment = loan.installments.find(i => i.number === installmentNumber);
        
        if (!installment) {
            return res.status(404).json({ message: "قسط مورد نظر یافت نشد." });
        }
        if (installment.status === 'paid') {
            return res.status(400).json({ message: "این قسط قبلاً پرداخت شده است." });
        }

        // 3. چک کردن ترتیب پرداخت
        const previousUnpaid = loan.installments.find(i => i.number < installmentNumber && i.status !== 'paid');
        if (previousUnpaid) {
            return res.status(400).json({ message: `لطفاً ابتدا قسط شماره ${previousUnpaid.number} را پرداخت کنید.` });
        }

        // 4. بررسی موجودی کاربر
        if (user.toman < installment.amount) {
            return res.status(400).json({ message: "موجودی کیف پول شما برای پرداخت این قسط کافی نیست." });
        }

        // --- انجام عملیات (بدون تراکنش) ---
        
        // الف) کسر از موجودی کاربر
        user.toman -= installment.amount;
        await user.save();

        // ب) آپدیت وضعیت قسط
        installment.status = 'paid';
        installment.paidAt = new Date();

        // ج) آپدیت مجموع پرداختی وام
        loan.totalPaid += installment.amount;

        // د) بررسی تسویه کامل
        const allPaid = loan.installments.every(i => i.status === 'paid');
        if (allPaid) {
            loan.status = 'completed';
        }

        await loan.save();

        res.json({
            success: true,
            message: `قسط شماره ${installmentNumber} با موفقیت پرداخت شد.`,
            loanStatus: loan.status,
            remainingBalance: user.toman
        });

    } catch (error) {
        console.error("Pay Installment Error:", error);
        res.status(500).json({ message: "خطا در پرداخت قسط", error: error.message });
    }
};
// 3. دریافت وام‌های من (تاریخچه وام‌های کاربر)
exports.getMyLoans = async (req, res) => {
    try {
        const myLoans = await Loan.find({ user: req.user._id }).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            data: myLoans
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// --- USER: ثبت درخواست بلوکه کردن پول (وثیقه) ---
exports.requestPledge = async (req, res) => {
    try {
        const userId = req.user._id;
        const { collateralType, collateralAmount, durationMonths, loanType } = req.body;

        if (collateralAmount <= 0) {
            return res.status(400).json({ message: "مقدار وثیقه باید بیشتر از صفر باشد." });
        }

        const user = await usermodel.findById(userId);
        if (!user) return res.status(404).json({ message: "کاربر یافت نشد." });


        if (collateralType === 'GOLD') {
            if (user.gold < collateralAmount) {
                return res.status(400).json({ message: "موجودی طلا کافی نیست." });
            }
            user.gold -= collateralAmount;
          
        } else if (collateralType === 'TOMAN') {
            if (user.toman < collateralAmount) {
                return res.status(400).json({ message: "موجودی تومان کافی نیست." });
            }
            user.toman -= collateralAmount;
        }

        await user.save();

        // 2. ایجاد درخواست
        const pledge = new Pledge({
            user: userId,
            collateralType,
            collateralAmount,
            durationMonths,
            loanType
        });

        await pledge.save();

        res.status(201).json({ 
            success: true, 
            message: "درخواست وثیقه ثبت و مبلغ از حساب شما کسر (بلوکه) شد.", 
            data: pledge 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- USER: دریافت لیست وثیقه‌های من ---
exports.getMyPledges = async (req, res) => {
    try {
        const pledges = await Pledge.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, data: pledges });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// --- ثبت کمک خیریه ---
exports.donate = async (req, res) => {
    try {
        const userId = req.user._id;
        const { amount, currencyType, message } = req.body;

        // 1. اعتبارسنجی ورودی
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "مقدار اهدا باید بیشتر از صفر باشد." });
        }
        if (!['GOLD', 'TOMAN'].includes(currencyType)) {
            return res.status(400).json({ message: "نوع ارز نامعتبر است." });
        }

        // 2. دریافت اطلاعات کاربر
        const user = await usermodel.findById(userId);
        if (!user) return res.status(404).json({ message: "کاربر یافت نشد." });

        // 3. بررسی موجودی و کسر وجه
        if (currencyType === 'GOLD') {
            if (user.gold < amount) {
                return res.status(400).json({ message: "موجودی طلا کافی نیست." });
            }
            user.gold -= Number(amount);
        } else { // TOMAN
            if (user.toman < amount) {
                return res.status(400).json({ message: "موجودی تومان کافی نیست." });
            }
            user.toman -= Number(amount);
        }

        // 4. ذخیره تغییرات کاربر
        await user.save();

        // 5. ثبت رکورد خیریه
        const newDonation = new Charity({
            user: userId,
            amount: Number(amount),
            currencyType,
            message
        });

        await newDonation.save();

        res.status(201).json({
            success: true,
            message: "کمک شما با موفقیت ثبت و پرداخت شد. اجرتان با خدا.",
            data: newDonation,
            remainingBalance: {
                gold: user.gold,
                toman: user.toman
            }
        });

    } catch (error) {
        console.error("Donation Error:", error);
        res.status(500).json({ message: "خطا در ثبت کمک خیریه", error: error.message });
    }
};

// --- دریافت تاریخچه کمک‌های من ---
exports.getMyDonations = async (req, res) => {
    try {
        const donations = await Charity.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, data: donations });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// transfer



exports.transferCreate = async (req, res) => {
    try {
        const { target, amount, type } = req.body;
        const senderId = req.user._id;

        if (!['gold', 'silver'].includes(type)) {
            return res.status(400).json({ message: "نوع ارز نامعتبر است" });
        }

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "مقدار نامعتبر است" });
        }

        const sender = await usermodel.findById(senderId);
        if (!sender) {
            return res.status(404).json({ message: "کاربر یافت نشد" });
        }

        const receiver = await usermodel.findOne({ 
            $or: [{ _id: target }] 
        });

        if (!receiver) {
            return res.status(404).json({ message: "کاربر مقصد یافت نشد" });
        }

        if (sender._id.equals(receiver._id)) {
            return res.status(400).json({ message: "انتقال به خود امکان‌پذیر نیست" });
        }

        if (sender[type] < amount) {
            return res.status(400).json({ message: "موجودی کافی نیست" });
        }

        sender[type] -= Number(amount);
        receiver[type] += Number(amount);

        await sender.save();
        await receiver.save();

        const newTransfer = await transfermodel.create({
            userid: sender._id,
            userref: receiver._id,
            amount: amount,
            type: type
        });

        res.status(200).json({ message: "انتقال با موفقیت انجام شد", data: newTransfer });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.walletDetails = async (req, res) => {
    try {
        let user;
        try {
            user = await usermodel.findById(req.user._id);
        } catch (dbError) {
            console.error('Database error finding user:', dbError);
            return res.status(500).json({ error: 'Database connection error' });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // دریافت آخرین قیمت‌ها از کش برنامه یا دیتابیس
        // برای سادگی فعلا از مدل‌های تاریخچه آخرین قیمت رو میگیریم
        let lastGold, lastSilver;
        try {
            lastGold = await historygoldmodel.findOne().sort({ date: -1 });
            lastSilver = await historysilvermodel.findOne().sort({ date: -1 });
        } catch (dbError) {
            console.error('Database error fetching prices:', dbError);
            lastGold = null;
            lastSilver = null;
        }
        
        const goldPrice = lastGold ? lastGold.price : 0;
        const silverPrice = lastSilver ? lastSilver.price : 0;

        // محاسبه ارزش دارایی‌ها
        const goldValue = (user.gold || 0) * goldPrice;
        const silverValue = (user.silver || 0) * silverPrice;
        const tomanValue = user.toman || 0;
        
        // دارایی کل
        const totalAssets = goldValue + silverValue + tomanValue;

        // تاریخچه تغییرات هفتگی (7 روز اخیر)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        let goldHistory = [], silverHistory = [], weekAgoGold = null;
        try {
            goldHistory = await PriceHistory.find({
                type: 'gold',
                date: { $gte: sevenDaysAgo }
            }).sort({ date: 1 });

            silverHistory = await PriceHistory.find({
                type: 'silver',
                date: { $gte: sevenDaysAgo }
            }).sort({ date: 1 });

            // محاسبه درصد تغییرات نسبت به هفته گذشته
            weekAgoGold = await PriceHistory.findOne({
                type: 'gold',
                date: { $lte: sevenDaysAgo }
            }).sort({ date: -1 });
        } catch (dbError) {
            console.error('Database error fetching price history:', dbError);
        }
        
        const goldChangePercent = weekAgoGold ? ((goldPrice - weekAgoGold.price) / weekAgoGold.price) * 100 : 0;

        res.json({
            totalAssets,
            assets: {
                gold: {
                    amount: user.gold || 0,
                    value: goldValue,
                    price: goldPrice,
                    changePercent: goldChangePercent.toFixed(2)
                },
                silver: {
                    amount: user.silver || 0,
                    value: silverValue,
                    price: silverPrice
                },
                toman: {
                    amount: tomanValue,
                    value: tomanValue
                },
                crypto: {
                    amount: 0, // فعلاً پیاده‌سازی نشده
                    value: 0
                }
            },
            history: {
                gold: goldHistory,
                silver: silverHistory
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.transferAll = async (req, res) => {
    try {
        const transfers = await transfermodel.find({
            $or: [{ userid: req.user._id }, { userref: req.user._id }]
        })
        .populate('userid', 'fname lname phone')
        .populate('userref', 'fname lname phone')
        .sort({ _id: -1 });

        res.status(200).json(transfers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};