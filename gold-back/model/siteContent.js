const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
    title: { type: String, default: '' },
    text: { type: String, default: '' }
}, { _id: false });

const faqSchema = new mongoose.Schema({
    question: { type: String, default: '' },
    answer: { type: String, default: '' }
}, { _id: false });

const metricSchema = new mongoose.Schema({
    value: { type: String, default: '' },
    label: { type: String, default: '' }
}, { _id: false });

const siteContentSchema = new mongoose.Schema({
    hero_chip: { type: String, default: 'پلتفرم خرید و فروش آنلاین طلا' },
    hero_title: { type: String, default: 'سرمایه گذاری روی طلا،' },
    hero_title_highlight: { type: String, default: 'ساده، امن و همیشه در دسترس' },
    hero_desc: { type: String, default: 'خرید و فروش طلای آب شده با قیمت لحظه ای، کارمزد شفاف و تسویه سریع. یک تجربه حرفه ای برای مدیریت دارایی طلا از موبایل یا دسکتاپ.' },
    hero_btn_primary: { type: String, default: 'شروع سرمایه گذاری' },
    hero_btn_secondary: { type: String, default: 'مشاهده کارمزدها' },
    metrics: {
        type: [metricSchema],
        default: [
            { value: '24/7', label: 'معامله شبانه روزی' },
            { value: 'شفاف', label: 'بدون هزینه پنهان' },
            { value: 'امن', label: 'پشتیبانی و احراز هویت' }
        ]
    },
    features_chip: { type: String, default: 'چرا ما' },
    features_title: { type: String, default: 'مزایای خرید طلا از مکسـی گلد' },
    features: {
        type: [featureSchema],
        default: [
            { title: 'خرید و فروش سریع', text: 'ثبت سفارش در چند ثانیه با قیمت روز و نمایش جزئیات کامل قبل از تایید.' },
            { title: 'نگهداری امن دارایی', text: 'ساختار امن برای مدیریت دارایی، همراه با گزارش شفاف تراکنش ها.' },
            { title: 'ورود با سرمایه کم', text: 'از مقادیر کم شروع کن و به مرور سرمایه ات را روی طلا افزایش بده.' },
            { title: 'تسویه و نقدشوندگی', text: 'هر زمان بخواهی امکان فروش و مدیریت موجودی با فرآیند ساده فراهم است.' }
        ]
    },
    shop_title: { type: String, default: 'فروشگاه طلا' },
    shop_desc: { type: String, default: 'انتخاب محصول، مشاهده قیمت تقریبی و ثبت سفارش سریع' },
    faq_title: { type: String, default: 'سوالات پرتکرار' },
    faqs: {
        type: [faqSchema],
        default: [
            { question: 'طلای آب شده چیست؟', answer: 'طلای آب شده طلای ذوب شده و استانداردی است که برای سرمایه گذاری و معامله استفاده می شود.' },
            { question: 'حداقل میزان خرید چقدر است؟', answer: 'می توانید با سرمایه کم شروع کنید و به مرور میزان خرید خود را افزایش دهید.' },
            { question: 'قیمت ها چگونه محاسبه می شوند؟', answer: 'قیمت بر اساس نرخ لحظه ای بازار و کارمزد شفاف پلتفرم محاسبه می شود.' },
            { question: 'آیا فروش فوری امکان پذیر است؟', answer: 'بله، در هر زمان می توانید دارایی خود را بفروشید و سفارش ثبت کنید.' },
            { question: 'امنیت حساب کاربری چگونه تامین می شود؟', answer: 'ورود امن، کنترل حساب کاربری و فرآیندهای تایید هویت برای افزایش امنیت در نظر گرفته شده است.' }
        ]
    }
}, { timestamps: true });

module.exports = mongoose.model('siteContent', siteContentSchema);
