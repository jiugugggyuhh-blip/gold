const express = require('express')
const app = express()
require('dotenv').config()
require('./configs/db')
require('./cron/cronJobs')
require('./cron/tradingBotCron') // اضافه کردن cron jobهای ربات معامله‌گر
const axios = require('axios')
const cheerio = require('cheerio')
const http = require('http')
const { Server } = require('socket.io')
const historygoldmodel = require('./model/historygold')
const historysilvermodel = require('./model/historysilver')
const PriceHistory = require('./model/priceHistory')
const bodyparser = require('body-parser')
const cookieparser = require('cookie-parser')
const pageRouter = require('./routes/page')
const path = require('path')
const authRouter = require('./routes/auth')
const session = require('express-session')
const userRouter = require('./routes/user')
const adminRouter = require('./routes/admin')
const tradingBotRouter = require('./routes/tradingBot')
const apiSettingsRouter = require('./routes/apiSettings')
const testSetupRouter = require('./routes/testSetup')
const testApiRouter = require('./routes/testApi')
const pricesRouter = require('./routes/prices')
const priceHistoryRouter = require('./routes/priceHistory')
const helmet = require('helmet')
const cors = require('cors')
const setupSwagger = require('./swagger')
setupSwagger(app)

app.set('views', path.join(__dirname, 'view'))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(cookieparser())
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
app.use(cors({
    origin: true, // اجازه به همه آدرس‌های فرانت‌اند (داینامیک)
    credentials: true, // برای ارسال کوکی و سشن
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}))
app.use("/", pageRouter)
app.use("/auth", authRouter)
app.use("/user", userRouter)
app.use("/admin", adminRouter)
app.use("/bot", tradingBotRouter)
app.use("/api-settings", apiSettingsRouter)
app.use("/test-setup", testSetupRouter)
app.use("/test-api", testApiRouter)
app.use("/prices", pricesRouter)
app.use("/price-history", priceHistoryRouter)

app.get('/api/gold/history', async (req, res) => {
    try {
        const history = await historygoldmodel.find().sort({ date: 1 })
        res.json(history)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

const port = 8701
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        // origin: 'https://gold.nodora.ir',
        origin: 'http://localhost:8080',
        methods: ['GET', 'POST'],
        credentials: true
    }
})

server.listen(port, () => {
    console.log(new Date().toISOString(), `Server running on port ${port}`)
})

// =============================
// CONFIG
// =============================
// استفاده از API جدید BRS به جای scraping
const GOLD_URL = 'https://Api.BrsApi.ir/Market/Gold_Currency.php?key='
const SILVER_URL = 'https://tajnoghreh.com/silver-price/'
const SCRAPE_INTERVAL = 60000  // 1 دقیقه
const CACHE_DURATION = 60000

// =============================
// GLOBAL STATE
// =============================
let lastGold = null
let goldCacheTime = 0

let lastSilver = null
let silverCacheTime = 0

let previousGold = null
let isSavingGold = false
let isSavingSilver = false

// =============================
// HELPERS
// =============================
function toEnglishDigits(str) {
    if (!str) return ''
    return str
        .replace(/[\u06F0-\u06F9]/g, c => String(c.charCodeAt(0) - 0x06F0))
        .replace(/[\u0660-\u0669]/g, c => String(c.charCodeAt(0) - 0x0660))
}

// =============================
// GOLD SCRAPER
// =============================
async function scrapeGold() {
    const now = Date.now()
    if (lastGold && now - goldCacheTime < CACHE_DURATION) return lastGold

    try {
        // استفاده از API جدید BRS
        const ApiSettings = require('./model/apiSettings');
        const settings = await ApiSettings.getSettings();
        
        if (!settings.goldApi.isActive) {
            throw new Error('API غیرفعال است');
        }

        const axios = require('axios');
        const response = await axios.get(settings.goldApi.apiUrl + settings.goldApi.apiKey, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (response.data && response.data.gold) {
            const goldData = response.data.gold;
            const items = [];

            // تبدیل داده‌های API به ساختار قدیمی برای سازگاری
            goldData.forEach(item => {
                let change = '0';
                let changePercent = '0';
                
                if (item.change_value) {
                    change = item.change_value > 0 ? `+${item.change_value}` : item.change_value.toString();
                    changePercent = item.change_percent ? item.change_percent.toString() : '0';
                }

                items.push({
                    name: item.name,
                    price: item.price.toString(),
                    change: change,
                    realPrice: item.price.toString(),
                    bubble: change,
                    bubblePercent: changePercent
                });
            });

            lastGold = { items, fetchedAt: new Date() }
            goldCacheTime = now;

            return lastGold;
        } else {
            throw new Error('پاسخ نامعتبر از API');
        }

    } catch (err) {
        console.error("ERROR GOLD API:", err.message);
        // اگر خطای اتصال بود، از کش استفاده کن
        if (err.code === 'ECONNRESET' || err.code === 'ECONNREFUSED') {
            console.log("Connection error, using cached data")
            return lastGold
        }
        return lastGold
    }
}

// =============================
// SILVER SCRAPER
// =============================
async function scrapeSilver() {
    const now = Date.now()
    if (lastSilver && now - silverCacheTime < CACHE_DURATION) return lastSilver

    try {
        const response = await axios.get(SILVER_URL, {
            headers: { "User-Agent": "Mozilla/5.0" },
            timeout: 15000
        })

        const $ = cheerio.load(response.data)

        const row = $('tr.sheyda_hamarz_table_item')
            .filter((i, el) =>
                $(el).find('[data-column="label"]').text().trim() === "نقره 999"
            )
            .first()

        const priceRaw = row.find('[data-column="price"]').text().trim()

        const normalized = toEnglishDigits(priceRaw)
        const cleaned = normalized.replace(/[^\d]/g, "")
        const price = parseInt(cleaned, 10) || 0

        lastSilver = { price, fetchedAt: new Date() }
        silverCacheTime = now

        return lastSilver

    } catch (err) {
        console.error("ERROR SILVER SCRAPE:", err.message)
        return lastSilver
    }
}

// =============================
// SOCKET.IO
// =============================
io.on('connection', socket => {
    if (lastGold) socket.emit("goldData", lastGold)
    if (lastSilver) socket.emit("silverData", lastSilver)
})

// =============================
// GOLD INTERVAL
// =============================
setInterval(async () => {
    try {
        const newData = await scrapeGold()
        if (!newData) return

        io.emit("goldData", newData)

        // جلوگیری از ذخیره روزانه تکراری
        if (JSON.stringify(newData) === JSON.stringify(previousGold)) return
        previousGold = newData

        const gold18 = newData.items.find(i => i.name === "گرم طلای 18 عیار")
        if (!gold18) return

        const normalized = toEnglishDigits(gold18.price)
        const cleaned = normalized.replace(/[^\d]/g, "")
        const todayPrice = parseInt(cleaned, 10) || 0
        if (todayPrice <= 0) return

        if (!isSavingGold) {
            isSavingGold = true

            const start = new Date()
            start.setHours(0, 0, 0, 0)

            const end = new Date(start.getTime() + 86400000)

            const exists = await historygoldmodel.findOne({
                date: { $gte: start, $lt: end }
            })

            if (!exists) {
                await historygoldmodel.create({
                    date: new Date(),
                    price: todayPrice
                })
            }

            // ذخیره در تاریخچه جدید برای نمودار تغییرات
            await PriceHistory.create({
                type: 'gold',
                symbol: '18k',
                price: todayPrice,
                date: new Date()
            });

            isSavingGold = false
        }

    } catch (err) {
        console.error("INTERVAL GOLD ERROR:", err.message)
    }
}, SCRAPE_INTERVAL)

// =============================
// SILVER INTERVAL
// =============================
setInterval(async () => {
    try {
        const silver = await scrapeSilver()
        if (!silver) return

        io.emit("silverData", silver)

        const todayPrice = silver.price
        if (todayPrice <= 0) return

        if (!isSavingSilver) {
            isSavingSilver = true

            const start = new Date()
            start.setHours(0, 0, 0, 0)

            const end = new Date(start.getTime() + 86400000)

            const exists = await historysilvermodel.findOne({
                date: { $gte: start, $lt: end }
            })

            if (!exists) {
                await historysilvermodel.create({
                    date: new Date(),
                    price: todayPrice
                })
            }

            // ذخیره در تاریخچه جدید برای نمودار تغییرات
            await PriceHistory.create({
                type: 'silver',
                symbol: '999',
                price: todayPrice,
                date: new Date()
            });

            isSavingSilver = false
        }

    } catch (err) {
        console.error("INTERVAL SILVER ERROR:", err.message)
    }
}, SCRAPE_INTERVAL)

// =============================
// INITIAL SCRAPE
// =============================
scrapeGold()
scrapeSilver()

// =============================
// EXPORTS
// =============================
module.exports = {
    lastGold,
    scrapeGold,
    lastSilver,
    scrapeSilver
}
