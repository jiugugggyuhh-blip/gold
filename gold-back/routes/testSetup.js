const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../model/user');
const Wallet = require('../model/wallet');
const router = express.Router();

// ایجاد کاربر ادمین برای تست
router.get('/create-admin', async (req, res) => {
    try {
        // بررسی اگه کاربر قبلاً وجود داره
        let admin = await User.findOne({ email: 'admin@test.com' });
        
        if (admin) {
            return res.json({
                success: true,
                message: 'کاربر ادمین قبلاً وجود دارد',
                data: {
                    email: 'admin@test.com',
                    password: 'admin123',
                    role: 'ADMIN'
                }
            });
        }

        // هش کردن پسورد
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // ایجاد کاربر ادمین
        admin = new User({
            fname: 'مدیر',
            lname: 'سیستم',
            email: 'admin@test.com',
            phone: '09123456789',
            password: hashedPassword,
            role: 'ADMIN',
            isActive: true,
            toman: 10000000, // ۱۰ میلیون تومان موجودی
            gold: 100, // ۱۰۰ گرم طلا
            silver: 1000, // ۱۰۰۰ گرم نقره
            verified: true
        });

        await admin.save();

        // ایجاد کیف پول برای کاربر
        const wallet = new Wallet({
            userId: admin._id,
            goldBalance: 100,
            silverBalance: 1000,
            tomanBalance: 10000000
        });

        await wallet.save();

        res.json({
            success: true,
            message: 'کاربر ادمین با موفقیت ایجاد شد',
            data: {
                email: 'admin@test.com',
                password: 'admin123',
                role: 'ADMIN',
                wallet: {
                    gold: 100,
                    silver: 1000,
                    toman: 10000000
                }
            }
        });

    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).json({
            success: false,
            error: 'خطا در ایجاد کاربر ادمین'
        });
    }
});

// ایجاد کاربر عادی برای تست
router.get('/create-user', async (req, res) => {
    try {
        // بررسی اگه کاربر قبلاً وجود داره
        let user = await User.findOne({ email: 'user@test.com' });
        
        if (user) {
            return res.json({
                success: true,
                message: 'کاربر قبلاً وجود دارد',
                data: {
                    email: 'user@test.com',
                    password: 'user123',
                    role: 'USER'
                }
            });
        }

        // هش کردن پسورد
        const hashedPassword = await bcrypt.hash('user123', 10);

        // ایجاد کاربر
        user = new User({
            fname: 'کاربر',
            lname: 'تست',
            email: 'user@test.com',
            phone: '09123456788',
            password: hashedPassword,
            role: 'USER',
            isActive: true,
            toman: 1000000, // ۱ میلیون تومان
            gold: 10, // ۱۰ گرم طلا
            silver: 100, // ۱۰۰ گرم نقره
            verified: true
        });

        await user.save();

        // ایجاد کیف پول برای کاربر
        const wallet = new Wallet({
            userId: user._id,
            goldBalance: 10,
            silverBalance: 100,
            tomanBalance: 1000000
        });

        await wallet.save();

        res.json({
            success: true,
            message: 'کاربر با موفقیت ایجاد شد',
            data: {
                email: 'user@test.com',
                password: 'user123',
                role: 'USER',
                wallet: {
                    gold: 10,
                    silver: 100,
                    toman: 1000000
                }
            }
        });

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            error: 'خطا در ایجاد کاربر'
        });
    }
});

// ایجاد هر دو کاربر
router.get('/setup-all', async (req, res) => {
    try {
        const results = {
            admin: null,
            user: null
        };

        // ایجاد ادمین
        let admin = await User.findOne({ email: 'admin@test.com' });
        if (!admin) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            admin = new User({
                fname: 'مدیر',
                lname: 'سیستم',
                email: 'admin@test.com',
                phone: '09123456789',
                password: hashedPassword,
                role: 'ADMIN',
                isActive: true,
                toman: 10000000,
                gold: 100,
                silver: 1000,
                verified: true
            });
            await admin.save();

            results.admin = {
                email: 'admin@test.com',
                password: 'admin123',
                role: 'ADMIN'
            };
        } else {
            results.admin = {
                email: 'admin@test.com',
                password: 'admin123',
                role: 'ADMIN',
                note: 'کاربر قبلاً وجود داشت'
            };
        }

        // ایجاد کاربر عادی
        let user = await User.findOne({ email: 'user@test.com' });
        if (!user) {
            const hashedPassword = await bcrypt.hash('user123', 10);
            user = new User({
                fname: 'کاربر',
                lname: 'تست',
                email: 'user@test.com',
                phone: '09123456788',
                password: hashedPassword,
                role: 'USER',
                isActive: true,
                toman: 1000000,
                gold: 10,
                silver: 100,
                verified: true
            });
            await user.save();

            results.user = {
                email: 'user@test.com',
                password: 'user123',
                role: 'USER'
            };
        } else {
            results.user = {
                email: 'user@test.com',
                password: 'user123',
                role: 'USER',
                note: 'کاربر قبلاً وجود داشت'
            };
        }

        res.json({
            success: true,
            message: 'تنظیمات اولیه با موفقیت انجام شد',
            data: results
        });

    } catch (error) {
        console.error('Error in setup:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'خطا در تنظیمات اولیه',
            details: error.toString()
        });
    }
});

module.exports = router;
