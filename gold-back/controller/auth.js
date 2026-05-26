const usermodel = require("../model/user");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const refmodel = require("../model/ref");
const settingmodel = require("../model/setting");
const { mockUsers, mockDB } = require("../mockUser");
require('dotenv').config();

async function sendOtpSms(phone, templateId, code) {
    try {
        const payload = {
            mobile: phone,
            templateId,
            parameters: [{ name: "Code", value: code }]
        };
        await axios.post("https://api.sms.ir/v1/send/verify", payload, {
            headers: {
                "x-api-key": "hCPrm4mhz6QRgLCslnoiX2flqkWVHq2eJK8QfMN26dl14utX",
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        console.log(error);
    }
}


async function sendOtpSmsfaraz(phone, patternCode, otpCode) {

    let normalized = String(phone).trim();
    if (normalized.startsWith('0')) normalized = '98' + normalized.slice(1);
    if (normalized.startsWith('+')) normalized = normalized.slice(1);

    const payload = {
        sending_type: "pattern",
        from_number: "+983000505",
        code: String(patternCode),
        recipients: [normalized],
        params: { code: Number(otpCode) }
    };


    const headers = {
        'Content-Type': 'application/json',
        Authorization: "OWZlMWY5NjctMDQzNS00NjJlLThkNGMtMTNjZDdlNzUyMWEwZDc2NDJhNTAwNmI1MmU0ZjRlMTJmMDhlMDhkOTlhNWM="
    };

    try {
        const response = await axios.post('https://edge.ippanel.com/v1/api/send', payload, { headers });
        return response.data;
    } catch (err) {
        console.error('IPPANEL error status:', err.response?.status, err.response?.data || err.message);
        throw err;
    }
}



// exports.login = async (req, res) => {
//     const { phone } = req.body;
//     if (!phone) return res.status(400).json({ error_msg: "شماره ارسال نشده" });
//     const user = await usermodel.findOne({ phone });
//     if (!user) return res.status(400).json({ error_msg: "کاربر وجود ندارد" });

//     const code = Math.floor(100000 + Math.random() * 900000);
//     try {
//         await sendOtpSms(phone, "100000", code);
//         user.otp = code;
//         user.attempts = 0;
//         await user.save();
//         res.status(200).json({ data: "کد ارسال شد" });
//     } catch (e) {
//         res.status(500).json({ error_msg: "خطا در ارسال کد" });
//     }
// };

exports.login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        if (!phone) return res.status(400).json({ error_msg: "شماره ارسال نشده" });
        
        // Try mock users first (for testing)
        let user = null;
        if (phone === '09123456789' && password === 'admin123') {
            user = mockUsers.admin;
        } else if (phone === '09876543210' && password === 'user123') {
            user = mockUsers.user;
        } else {
            // Try database if no mock user found
            try {
                user = await usermodel.findOne({ phone });
            } catch (dbError) {
                console.log('DB not available, using mock only');
            }
        }
        
        if (!user) return res.status(400).json({ error_msg: "کاربر وجود ندارد" });

        if (user.password === password) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: "7d" });
            res.status(200).json({ data: token });
        } else {
            return res.status(400).json({ error_msg: "پسورد اشتباه است" });
        }

    } catch (e) {
        res.status(500).json({ error_msg: "خطا در ارسال کد" });
    }
};

exports.register = async (req, res) => {
    const { phone, username, email, fname, lname, password } = req.body;
    const ref = req.body.refcode

    if (!phone || !username || !email) {
        return res.status(400).json({ error_msg: "فیلدهای ضروری ارسال نشده" });
    }

    if (await usermodel.exists({ phone })) {
        return res.status(400).json({ error_msg: "این شماره قبلاً ثبت شده" });
    }

    const code = Math.floor(100000 + Math.random() * 900000);
    try {
        await sendOtpSmsfaraz(phone, "4sdj8eai1799vfu", code);

        const user = await usermodel.create({ phone, otp: code, password, username, email, fname, lname, status: "registering", attempts: 0, isflag: false });
        const gift = await settingmodel.findOne({})
        if (ref) {
            const refUser = await usermodel.findOne({ refcode: ref });
            if (refUser) {
                await refmodel.findOneAndUpdate(
                    { userid: refUser._id },
                    { $addToSet: { refid: user._id } },
                    { upsert: true, new: true }
                );
                refUser.invitation += 1
                refUser.gift += gift.gift
                refUser.toman += gift.gift
                await refUser.save()
            }
        }

        res.status(200).json({ data: "کد ارسال شد", otp: code });
    } catch (e) {
        res.status(400).json({ error_msg: "خطا در ثبت‌نام" });
        console.log(e);
    }
};


exports.otp = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        if (!phone || !otp) {
            return res.status(400).json({ error_msg: "شماره یا کد ارسال نشده" });
        }
        const user = await usermodel.findOne({ phone });
        if (!user) return res.status(404).json({ error_msg: "کاربر یافت نشد" });

        if (user.otp !== Number(otp)) {
            user.attempts++;
            if (user.attempts >= 4 && user.status === "registering") {
                await usermodel.deleteOne({ phone });
                return res.status(403).json({ error_msg: "تعداد تلاش‌ها تمام شد، مجدداً ثبت‌نام کنید" });
            }
            await user.save();
            return res.status(400).json({ error_msg: "کد نادرست است" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: "7d" });
        user.status = "active";
        user.otp = 0;
        user.attempts = 0;
        await user.save();
        res.status(200).json({ data: token });
    } catch (error) {
        res.status(400).json({ error_msg: "خطا در ثبت‌نام" });
        console.log(error);
    }
};


