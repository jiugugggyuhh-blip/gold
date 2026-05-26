const blogmodel = require("../model/blog");
const ordermodel = require("../model/order");
const usermodel = require("../model/user")
const siteContentModel = require("../model/siteContent");
const path = require('path');
const bannermodel = require("../model/banner");
const settingmodel = require("../model/setting");
const notifmodel = require("../model/notif");
const Ticketmodel = require("../model/Ticket");
const moment = require('moment');
const cardmodel = require("../model/card");
const withdrawalmodel = require("../model/withdrawal");
const productmodel = require("../model/product");
const cryptosettingmodel = require("../model/cryptosetting");
const CryptoOrdermodel = require("../model/cryptoOrder");
const LoanPlan = require('../model/LoanPlans');
const Loan = require('../model/Loan');
const Pledge = require("../model/PledgeModel");
const mongoose = require('mongoose');
const Charity = require('../model/Charity');


exports.userlist = async (req, res) => {
    try {

        const users = await usermodel.find({}).sort({date: -1})

        res.json({
            admin: req.admin,
            users,

        });

    } catch (error) {
        res.json(`${error}`);
    }
};

exports.updateUser = async (req, res) => {
    try {
        const {userId, username, fname, lname, phone, codemeli, imgcartmeli, email, address, role} = req.body;

        const user = await usermodel.findByIdAndUpdate(
            userId,
            {username, fname, lname, phone, codemeli, imgcartmeli, email, address, role},
            {new: true}
        );

        if (!user) return res.json({status: false, msg: "کاربر یافت نشد"});

        res.json({status: true, user});

    } catch (error) {
        res.json({status: false, error: `${error}`});
    }
};
exports.updateBalance = async (req, res) => {
    try {
        const {userId, gold = 0, toman = 0} = req.body;

        const user = await usermodel.findById(userId);
        if (!user) return res.json({status: false, msg: "کاربر یافت نشد"});

        user.gold += Number(gold);
        user.toman += Number(toman);

        await user.save();

        res.json({
            status: true,
            msg: "بروزرسانی انجام شد",
            gold: user.gold,
            toman: user.toman
        });

    } catch (error) {
        res.json({status: false, error: `${error}`});
    }
};


exports.changerole = async (req, res) => {
    try {

        const user = await usermodel.findOne({_id: req.params.id})

        if (user.role == "USER") {
            user.role = "ADMIN"
            user.save()

        } else {
            user.role = "USER"
            user.save()
        }

        res.json("با موفقیت رول  تغییر پیدا کرد")

    } catch (error) {
        res.json(`${error}`)
    }

}
exports.createUser = async (req, res) => {
    try {
        const {username, fname, lname, phone, codemeli, email, address, role} = req.body

        // بررسی تکراری بودن‌ها
        const existingPhone = await usermodel.findOne({phone})
        if (existingPhone) return res.status(409).json({message: 'شماره تلفن تکراری است'})

        const existingCodemeli = await usermodel.findOne({codemeli})
        if (existingCodemeli) return res.status(409).json({message: 'کد ملی تکراری است'})

        const existingEmail = await usermodel.findOne({email})
        if (existingEmail) return res.status(409).json({message: 'ایمیل تکراری است'})

        // ایجاد کاربر
        const newUser = await usermodel.create({
            username,
            fname,
            lname,
            phone,
            codemeli,
            email,
            address,
            role,
            isActive: true,
            isAuthentication: true
        })


        const fullName = (fname || lname) ? `${fname || ''} ${lname || ''}`.trim() : "کاربر گرامی";


        console.log("Sending SMS payload:", {user: fullName, phone});

        await sendSmsfaraz2(phone, "9znc4f2lai0ap34", {
            user: fullName,
            phone: phone
        })
        // ---------------------------

        res.status(201).json({
            message: 'کاربر جدید با موفقیت ایجاد شد',
            user: newUser
        })

    } catch (error) {
        console.error("Create User Error:", error); // لاگ خطا در کنسول سرور
        res.status(500).json({error: error.message})
    }
}


exports.isactive = async (req, res) => {
    try {

        const user = await usermodel.findOne({_id: req.params.id})

        user.isActive = !user.isActive

        user.save()
        res.json("با موفقیت وضعیت  تغییر پیدا کرد")

    } catch (error) {
        res.json(`${error}`)
    }

}

exports.authentication = async (req, res) => {
    try {
        const user = await usermodel.findById(req.params.id)
        if (!user) {
            return res.status(404).json({error: 'کاربر یافت نشد'})
        }
        user.isflag = true
        user.isAuthentication = true
        user.isreject = false
        user.isRejected = ""
        await user.save()

        return res.json('احراز هویت با موفقیت انجام شد')
    } catch (error) {
        console.error(error)
        return res.status(500).json({error: 'خطای سرور'})
    }
}

exports.isRejectedpage = async (req, res) => {
    try {

        const user = await usermodel.findOne({_id: req.params.id})


        res.json({user: user})

    } catch (error) {
        res.json(`${error}`)
    }

}

exports.isRejected = async (req, res) => {
    try {

        const {userId, text} = req.body


        await usermodel.findOneAndUpdate({_id: userId}, {
            isRejected: text,
            isAuthentication: false,
            isflag: false,
            isreject: true
        })

        res.json("کار با موفقیت رد شد")


    } catch (error) {
        res.json(`${error}`)
    }

}

exports.deleteuser = async (req, res) => {
    try {
        const user = await usermodel.findOneAndDelete({_id: req.params.id})
        res.json("کاربر حذف شد")
    } catch (error) {
        res.json(`${error}`)
    }

}


// order
exports.order = async (req, res) => {
    try {
        const orders = await ordermodel.find({})
            .populate("userid")

        res.json({
            data:
                orders,
        });
    } catch (error) {
        res.json({ message: `${error.message}` });
    }
};

exports.deleteorder = async (req, res) => {
    try {

        await ordermodel.findOneAndDelete({ _id: req.params.id })
        res.json({
            data: "حذف شد"
        });
    } catch (error) {
        res.json({ message: `${error.message}` });
    }
};



// product

exports.product = async (req, res) => {
    try {

        const Product = await productmodel.find({})
        res.json({ data: Product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.productcreate = async (req, res) => {
    try {
        let {
            uid,
            title,
            type,
            weightGram,
            weightSot,
            status,
            description
        } = req.body;

        let img = null;

        if (req.file) {
            const normalizedPath = req.file.path.replace(/\\/g, '/');
            const relativePath = path.posix.join('/', normalizedPath);
            const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
            img = `${baseUrl}${relativePath}`;
        }

        const newProduct = await productmodel.create({
            uid: uid || Date.now(),
            title,
            type,
            weightGram: weightGram ? Number(weightGram) : undefined,
            weightSot: weightSot ? Number(weightSot) : undefined,
            status: status === 'true' || status === true,
            description,
            img
        });

        res.json({ data: newProduct, message: "محصول با موفقیت ثبت شد" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.productupdate = async (req, res) => {
    try {
        const { id } = req.params;
        let updateData = { ...req.body };

        if (req.file) {
            const normalizedPath = req.file.path.replace(/\\/g, '/');
            const relativePath = path.posix.join('/', normalizedPath);
            const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
            updateData.img = `${baseUrl}${relativePath}`;
        }

        if (updateData.weightGram) updateData.weightGram = Number(updateData.weightGram);
        if (updateData.weightSot) updateData.weightSot = Number(updateData.weightSot);
        if (updateData.status !== undefined) updateData.status = updateData.status === 'true' || updateData.status === true;

        const updated = await productmodel.findByIdAndUpdate(id, updateData, { new: true });

        if (!updated) return res.status(404).json({ message: "محصول پیدا نشد" });

        res.json({ data: updated, message: "محصول با موفقیت بروزرسانی شد" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.productdelete = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await productmodel.findByIdAndDelete(id);

        if (!deleted) return res.status(404).json({ message: "محصول پیدا نشد" });

        res.json({ message: "محصول با موفقیت حذف شد" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




// blog ✅

exports.bloglist = async (req, res) => {
    try {
        const blogs = await blogmodel.find({});
        return res.json({
            admin: req.admin,
            blogs
        });
    } catch (error) {
        return res.status(500).json({ error: `${error}` });
    }
};

exports.addblog = async (req, res) => {
    try {
        const { title, href, dec, text, MetaTitle, MetaDescription, keywords, alt } = req.body;
        const uid = Math.floor(Math.random() * 999999);
        const imgPath = req.file ? path.posix.join('/', req.file.path) : null;

        const newBlog = await blogmodel.create({
            title,
            href,
            dec,
            uid,
            img: imgPath,
            text,
            MetaTitle,
            MetaDescription,
            keywords,
            alt
        });

        return res.json({
            data: "بلاگ با موفقیت افزوده شد",
            blog: newBlog
        });
    } catch (error) {
        return res.status(500).json({ error: `${error}` });
    }
};

exports.editblogpage = async (req, res) => {
    try {
        const blog = await blogmodel.findOne({ _id: req.params.id });
        if (!blog) {
            return res.status(404).json({ message: "بلاگ یافت نشد" });
        }
        return res.json({
            admin: req.admin,
            blog
        });
    } catch (error) {
        return res.status(500).json({ error: `${error}` });
    }
};

exports.editblogform = async (req, res) => {
    try {
        const { title, href, dec, text, id } = req.body;
        const imgPath = req.file ? path.posix.join('/', req.file.path) : null;

        const updatedBlog = await blogmodel.findOneAndUpdate(
            { _id: id },
            { title, href, dec, text, img: imgPath },
            { new: true }
        );
        if (!updatedBlog) {
            return res.status(404).json({ message: "بلاگ یافت نشد" });
        }
        return res.json({
            data: "بلاگ با موفقیت به‌روز شد",
            blog: updatedBlog
        });
    } catch (error) {
        return res.status(500).json({ error: `${error}` });
    }
};

exports.removeblog = async (req, res) => {
    try {
        const deletedBlog = await blogmodel.findOneAndDelete({ _id: req.params.id });
        if (!deletedBlog) {
            return res.status(404).json({ message: "بلاگ یافت نشد" });
        }
        return res.json({
            data: "بلاگ حذف شد",
            blog: deletedBlog
        });
    } catch (error) {
        return res.status(500).json({ error: `${error}` });
    }
};








// getbanner
exports.getbanner = async (req, res) => {
    try {
        const banner = await bannermodel.find({})
        res.json({ data: banner })
    } catch (error) {
        res.json(`${error}`);
    }
};

// addbanner
exports.addbanner = async (req, res) => {
    try {
        const { title, href } = req.body;

        const BASE_URL = process.env.BACKEND_URL || "http://localhost:8701";

        const img = req.file
            ? `${BASE_URL}/${req.file.path.replace(/\\/g, "/")}`
            : null;

        const banner = await bannermodel.create({
            title,
            href,
            img
        });

        res.json({ msg: "بنر اد شد", banner });

    } catch (error) {
        console.log(error);
        res.status(500).json(`${error}`);
    }
};


// removebanner
exports.removebanner = async (req, res) => {
    try {
        await bannermodel.findOneAndDelete({ _id: req.params.id })
        res.json({ msg: "بنر حذف شد" })
    } catch (error) {
        res.json(`${error}`);
    }
};



// setting
exports.getsetting = async (req, res) => {
    try {

        const item = await settingmodel.findOne({})
        res.json({ data: item })

    } catch (error) {
        res.json(`${error}`);
    }
};

exports.editsetting = async (req, res) => {
    try {
        const { title, subtitle, dec, phone, address, feebuy, feesell, id, gift, transactions, cartNumber } = req.body;
        let favicon = null;
        if (req.file) {
            const normalizedPath = req.file.path.replace(/\\/g, '/');
            const relativePath = path.posix.join('/', normalizedPath);
            const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
            favicon = `${baseUrl}${relativePath}`;
        }

        const datasetting = { title, subtitle, dec, phone, address, feebuy, feesell, gift, transactions, cartNumber };

        if (favicon) {
            datasetting.favicon = favicon;
        }

        const updated = await settingmodel.findOneAndUpdate(
            { _id: id },
            datasetting,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: "تنظیمات پیدا نشد" });
        }

        res.json({ data: "با موفقیت اطلاعات آپدیت شد", setting: updated });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// notif

exports.getnotif = async (req, res) => {
    try {

        const item = await notifmodel.find({})
        res.json({ data: item })

    } catch (error) {
        res.json(`${error}`);
    }
};

exports.createnotif = async (req, res) => {
    try {
        const { title, text } = req.body;
        await notifmodel.create({ title, text })
        res.json({ data: "اعلان با موفقیت ایجاد شد" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletenotif = async (req, res) => {
    try {
        await notifmodel.findOneAndDelete({ _id: req.params.id })
        res.json({ data: "اعلان با  موفقیت حذف شد" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




// ticket
exports.ticketpage = async (req, res) => {
    try {
        const tickets = await Ticketmodel.find({}).sort({ date: -1 })
        res.json({
            data: tickets,
        });
    } catch (error) {
        console.error("Error in editproduct:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.ticketuser = async (req, res) => {
    try {
        const ticket = await Ticketmodel.findOne({ _id: req.params.id })

        res.json({
            data:
                ticket
        });

    } catch (error) {
        console.error("Error in editproduct:", error);
        res.status(500).json({ message: error.message });
    }
};


exports.adminReply = async (req, res) => {
    try {
        const { ticketId, text } = req.body;
        const time = moment().format('jYYYY/jM/jD , HH:mm');

        await Ticketmodel.findByIdAndUpdate(ticketId, {
            $push: { masssgeadmin: { text, time } },
            lastdate: time
        });

        res.json({ data: "پیام ارسال شد" });
    } catch (error) {
        console.error("Error in adminReply:", error);
        res.status(500).json({ message: error.message });
    }
};


exports.statustick = async (req, res) => {
    try {
        const tick = await Ticketmodel.findOne({ _id: req.params.id })

        if (tick.status == "open") {
            tick.status = "close"
            tick.save()
        } else {
            tick.status = "open"
            tick.save()
        }

        res.json({ data: "وضعیت اپدیت شد " });


    } catch (error) {
        console.error("Error in adminReply:", error);
        res.status(500).json({ message: error.message });
    }
};


// withdrawal

exports.withdrawal = async (req, res) => {
    try {
        const withdrawal = await withdrawalmodel.find({}).populate("userid").populate("cardId").sort({ createdAt: -1 })
        res.json({ data: withdrawal });

    } catch (error) {
        console.error("Error in adminReply:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.withdrawalstatus = async (req, res) => {
    try {
        const order = await withdrawalmodel.findOne({ _id: req.params.id })
        if (order.status == false) {
            order.status = true
            order.save()
        } else {
            order.status = false
            order.save()
        }
        res.json({ data: "وضعیت اپدیت شد " });

    } catch (error) {
        console.error("Error in adminReply:", error);
        res.status(500).json({ message: error.message });
    }
};



// card

exports.cards = async (req, res) => {
    try {
        const cards = await cardmodel.find({}).populate("userid").sort({ createdAt: -1 })
        res.json({ data: cards });

    } catch (error) {
        console.error("Error in adminReply:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.cardstatus = async (req, res) => {
    try {
        const card = await cardmodel.findOne({ _id: req.params.id })
        if (card.status == false) {
            card.status = true
            card.save()
        } else {
            card.status = false
            card.save()
        }
        res.json({ data: "وضعیت اپدیت شد " });

    } catch (error) {
        console.error("Error in adminReply:", error);
        res.status(500).json({ message: error.message });
    }
};

// cryptosetting
exports.Createcryptosetting = async (req, res) => {
    try {
        const { item, network, address } = req.body;

        if (!item || !network || !address) {
            return res.status(400).json({ message: "فیلدهای ضروری وارد نشده‌اند" });
        }

        const data = await cryptosettingmodel.create({
            item,
            network,
            address
        });

        res.json({ message: "ارز با موفقیت ثبت شد", data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.GetAllCryptoSettings = async (req, res) => {
    try {
        const data = await cryptosettingmodel.find().sort({ createdAt: -1 });
        res.json({ data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.UpdateCryptoSetting = async (req, res) => {
    try {
        const id = req.params.id;
        const { item, network, address } = req.body;

        const data = await cryptosettingmodel.findByIdAndUpdate(
            id,
            { item, network, address },
            { new: true }
        );

        if (!data) return res.status(404).json({ message: "آیتم پیدا نشد" });

        res.json({ message: "ویرایش شد", data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.DeleteCryptoSetting = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await cryptosettingmodel.findByIdAndDelete(id);

        if (!data) return res.status(404).json({ message: "آیتم پیدا نشد" });

        res.json({ message: "حذف شد" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// CryptoOrder

exports.CryptoOrder = async (req, res) => {
    try {
        const data = await CryptoOrdermodel.find({})

        res.json({ data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.CryptoOrderGetOne = async (req, res) => {
    try {
        const data = await CryptoOrdermodel.findOne({ _id: req.params.id })
        if (!data) {
            return res.status(400).json({ msg: "یافت نشد" })
        }
        res.json({ data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// loanplan
// ---  Create (ساخت طرح وام جدید) ---
exports.createLoanPlan = async (req, res) => {
    try {

        const { title, amount, interestRate, durationMonths, description } = req.body;


        if (!title || !amount || !durationMonths) {
            return res.status(400).json({ message: "لطفا فیلدهای ضروری (عنوان، مبلغ، مدت) را پر کنید." });
        }


        const newPlan = new LoanPlan({
            title,
            amount,
            interestRate,
            durationMonths,
            description
        });


        await newPlan.save();

        res.status(201).json({
            message: "طرح وام با موفقیت ایجاد شد",
            data: newPlan
        });

    } catch (error) {
        res.status(500).json({ message: "خطا در ساخت وام", error: error.message });
    }
};

// ---  Read (دریافت لیست همه طرح‌ها) ---
exports.getAllLoanPlans = async (req, res) => {
    try {

        const plans = await LoanPlan.find().sort({ createdAt: -1 });

        res.status(200).json({
            count: plans.length,
            data: plans
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// دریافت لیست تمام وام‌ها (با قابلیت فیلتر و جستجو)
exports.getAllLoans = async (req, res) => {
    try {
        const loans = await Loan.find()
            .populate('user', 'fname lname phone username') // اطلاعات کاربر
            .sort({ createdAt: -1 });

        res.json({ success: true, data: loans });
    } catch (error) {
        res.status(500).json({ message: "خطا در دریافت وام‌ها", error: error.message });
    }
};
exports.decideLoan = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminMessage } = req.body; // status: 'active' | 'rejected'

        const loan = await Loan.findById(id);
        if (!loan) {
            return res.status(404).json({ message: "وام یافت نشد." });
        }

        if (loan.status !== 'pending') {
            return res.status(400).json({ message: "این وام قبلاً تعیین وضعیت شده است." });
        }

        const user = await usermodel.findById(loan.user);
        if (!user) {
            return res.status(404).json({ message: "کاربر وام‌گیرنده یافت نشد." });
        }

        if (status === 'active') {
            // --- تایید وام ---
            
            // 1. تنظیم تاریخ شروع به "همین لحظه"
            const startDate = new Date();
            loan.startDate = startDate;

            // 2. به‌روزرسانی تاریخ سررسید اقساط
            loan.installments.forEach((inst) => {
                const newDueDate = new Date(startDate);
                newDueDate.setMonth(startDate.getMonth() + inst.number);
                inst.dueDate = newDueDate;
            });

            // 3. واریز مبلغ وام به حساب کاربر (تومان)
            user.toman = (user.toman || 0) + loan.amount;

            loan.status = 'active';
            loan.adminMessage = adminMessage || "تایید شده توسط مدیریت";

            // اول کاربر را ذخیره می‌کنیم (واریز پول)
            await user.save();
            // سپس وضعیت وام را آپدیت می‌کنیم
            await loan.save();

        } else if (status === 'rejected') {
            // --- رد وام ---
            loan.status = 'rejected';
            loan.adminMessage = adminMessage;
            
            // فقط وضعیت وام ذخیره می‌شود
            await loan.save();
        } else {
            return res.status(400).json({ message: "وضعیت نامعتبر است." });
        }

        res.json({
            success: true,
            message: status === 'active' 
                ? "وام تایید و مبلغ به کیف پول کاربر واریز شد." 
                : "درخواست وام رد شد."
        });

    } catch (error) {
        console.error("Decide Loan Error:", error);
        res.status(500).json({ message: "خطا در عملیات", error: error.message });
    }
};

// ---: Update (ویرایش یک طرح خاص) ---
exports.updateLoanPlan = async (req, res) => {
    try {
        const { id } = req.params; 
        const updates = req.body;   

        
        const updatedPlan = await LoanPlan.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedPlan) {
            return res.status(404).json({ message: "طرح وام پیدا نشد" });
        }

        res.status(200).json({
            message: "طرح وام ویرایش شد",
            data: updatedPlan
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- : Delete (حذف یک طرح) ---
exports.deleteLoanPlan = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedPlan = await LoanPlan.findByIdAndDelete(id);

        if (!deletedPlan) {
            return res.status(404).json({ message: "طرح وام پیدا نشد" });
        }

        res.status(200).json({ message: "طرح وام با موفقیت حذف شد" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// acive plan
exports.aciveLoanPlan = async (req, res) => {
    try {
        const { id } = req.params;

        const Plan = await LoanPlan.findById(id);

        Plan.isActive = !Plan.isActive

        await Plan.save()

        res.status(200).json({ message: "وضعیت پلن با موفقیت تغیر کرد" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// --- 1. دریافت همه درخواست‌ها ---
exports.getAllPledges = async (req, res) => {
    try {
        const pledges = await Pledge.find()
            .populate('user', 'fname lname phone username')
            .sort({ createdAt: -1 });
        
        res.json({ success: true, data: pledges });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- 2. تصمیم‌گیری اولیه (فقط تغییر وضعیت - بدون واریز پول) ---
exports.decidePledge = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, loanAmount, adminNote } = req.body; 

        const pledge = await Pledge.findById(id);
        if (!pledge) return res.status(404).json({ message: "درخواست یافت نشد." });

        if (pledge.status !== 'pending') {
            return res.status(400).json({ message: "این درخواست قبلاً تعیین وضعیت شده است." });
        }

        const user = await usermodel.findById(pledge.user);
        if (!user) return res.status(404).json({ message: "کاربر یافت نشد." });

        // --- حالت تایید (ACTIVE) ---
        if (status === 'active') {
            if (!loanAmount || loanAmount <= 0) {
                return res.status(400).json({ message: "برای تایید، مبلغ وام مصوب الزامی است." });
            }

            // 1. تنظیم اطلاعات وام
            pledge.loanAmountGiven = loanAmount;
            pledge.startDate = new Date();
            
            // محاسبه تاریخ سررسید
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + (pledge.durationMonths || 1));
            pledge.endDate = endDate;
            
            pledge.status = 'active';
            pledge.adminNote = adminNote || "تایید شده توسط ادمین";

            // *** نکته مهم: اینجا دیگر پولی به کیف پول کاربر اضافه نمی‌شود ***
            // فقط رکورد وام آپدیت می‌شود
            
            await pledge.save();

            return res.json({ success: true, message: "وام تایید و فعال شد (مبلغی به کیف پول اضافه نشد)." });

        // --- حالت رد (REJECTED) ---
        } else if (status === 'rejected') {
            // در حالت رد شدن، باید وثیقه بلوکه شده را آزاد کنیم (برگردانیم به حساب)
            if (pledge.collateralType === 'GOLD') {
                user.gold += Number(pledge.collateralAmount);
            } else {
                user.toman += Number(pledge.collateralAmount);
            }

            pledge.status = 'rejected';
            pledge.adminNote = adminNote;

            await user.save();   // ذخیره تغییر موجودی کاربر (برگشت پول)
            await pledge.save(); // ذخیره تغییر وضعیت وام

            return res.json({ success: true, message: "درخواست رد شد و مبلغ وثیقه به حساب کاربر برگشت." });
        }

        res.status(400).json({ message: "وضعیت نامعتبر است." });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- 3. آزادسازی نهایی وثیقه (بعد از تسویه وام) ---
exports.releaseCollateral = async (req, res) => {
    try {
        const { id } = req.params;
        const { adminNote } = req.body;

        const pledge = await Pledge.findById(id);
        if (!pledge) return res.status(404).json({ message: "درخواست یافت نشد." });

        if (pledge.status !== 'active') {
            return res.status(400).json({ message: "فقط وثیقه‌های فعال قابل آزادسازی هستند." });
        }

        const user = await usermodel.findById(pledge.user);

        // بازگرداندن وثیقه بلوکه شده به کیف پول کاربر
        if (pledge.collateralType === 'GOLD') {
            user.gold += Number(pledge.collateralAmount);
        } else {
            user.toman += Number(pledge.collateralAmount);
        }

        pledge.status = 'released';
        pledge.adminNote = adminNote || "تسویه وام و آزادسازی وثیقه توسط ادمین";
        pledge.endDate = new Date();

        await user.save();
        await pledge.save();

        res.json({ 
            success: true, 
            message: "وثیقه آزاد شد و به حساب کاربر بازگشت.",
            data: pledge
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// --- siteContent CMS ---
exports.getSiteContent = async (req, res) => {
    try {
        let content = await siteContentModel.findOne({});
        if (!content) {
            content = await siteContentModel.create({});
        }
        res.json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateSiteContent = async (req, res) => {
    try {
        const {
            hero_chip, hero_title, hero_title_highlight, hero_desc,
            hero_btn_primary, hero_btn_secondary, metrics,
            features_chip, features_title, features,
            shop_title, shop_desc, faq_title, faqs
        } = req.body;

        const update = {
            hero_chip, hero_title, hero_title_highlight, hero_desc,
            hero_btn_primary, hero_btn_secondary, metrics,
            features_chip, features_title, features,
            shop_title, shop_desc, faq_title, faqs
        };

        // حذف فیلدهای undefined
        Object.keys(update).forEach(k => update[k] === undefined && delete update[k]);

        let content = await siteContentModel.findOne({});
        if (!content) {
            content = await siteContentModel.create(update);
        } else {
            content = await siteContentModel.findOneAndUpdate({}, update, { new: true, runValidators: false });
        }

        res.json({ success: true, data: content, message: 'محتوای سایت با موفقیت بروزرسانی شد' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- دریافت کل کمک‌ها (برای ادمین) ---
exports.getAllDonations = async (req, res) => {
    try {
        const donations = await Charity.find()
            .populate('user', 'fname lname phone username')
            .sort({ createdAt: -1 });
        
        // محاسبه مجموع کمک‌ها
        const totalGold = donations.filter(d => d.currencyType === 'GOLD').reduce((sum, d) => sum + d.amount, 0);
        const totalToman = donations.filter(d => d.currencyType === 'TOMAN').reduce((sum, d) => sum + d.amount, 0);

        res.json({ 
            success: true, 
            data: donations,
            stats: { totalGold, totalToman }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};