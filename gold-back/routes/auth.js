const express = require('express');
const authRouter = express.Router()
const authcontroller = require("../controller/auth");


/**
 * @swagger
 * tags:
 *   - name: auth 
 *     description: عملیات ورود، ثبت‌نام  کاربران
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: ارسال شماره برای دریافت کد ورود
 *     tags: [auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                 type: string
 *                 description: شماره موبایل کاربر
 *                 example: "09121234567"
 *     responses:
 *       200:
 *         description: کد OTP به شماره ارسال شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   example: "کد ارسال شد"
 *       400:
 *         description: کاربر یافت نشد
 *       500:
 *         description: خطای داخلی سرور
 */
authRouter.post("/login", authcontroller.login);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: ثبت‌نام کاربر و ارسال کد تأیید
 *     tags: [auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - username
 *               - email
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "09121234567"
 *               username:
 *                 type: string
 *                 example: "testuser"
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               fname:
 *                 type: string
 *                 example: "نام"
 *               lname:
 *                 type: string
 *                 example: "خانوادگی"
 *     responses:
 *       200:
 *         description: کد OTP برای ثبت‌نام ارسال شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   example: "کد ارسال شد"
 *                 otp:
 *                   type: number
 *                   example: 54321
 *       400:
 *         description: شماره قبلاً ثبت شده است
 *       500:
 *         description: خطای داخلی سرور
 */
authRouter.post("/register", authcontroller.register);

/**
 * @swagger
 * /auth/otp:
 *   post:
 *     summary: تأیید کد OTP و ورود نهایی
 *     tags: [auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - otp
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "09121234567"
 *               otp:
 *                 type: string
 *                 example: "54321"
 *     responses:
 *       200:
 *         description: کاربر با موفقیت وارد شد و توکن JWT صادر شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   description: توکن JWT
 *                   example: "eyJhbGciOiJIUzI1NiIs..."
 *       400:
 *         description: کد نادرست یا ثبت‌نام ناقص
 *       403:
 *         description: تعداد تلاش‌ها به پایان رسیده است
 *       404:
 *         description: کاربر یافت نشد
 *       500:
 *         description: خطای داخلی سرور
 */
authRouter.post("/otp", authcontroller.otp);





module.exports = authRouter