const express = require('express')
const app = express()
require('dotenv').config()
require('./configs/db')
require('./cron/cronJobs')
require('./cron/tradingBotCron')
require('./cron/priceCron')
const http = require('http')
const { Server } = require('socket.io')
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
    origin: true,
    credentials: true,
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

const port = 8701
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:8080',
        methods: ['GET', 'POST'],
        credentials: true
    }
})

server.listen(port, () => {
    console.log(new Date().toISOString(), `Server running on port ${port}`)
})

// =============================
// SOCKET.IO - ارسال قیمت لحظه‌ای هر دقیقه
// =============================
const { getCurrentPrices } = require('./routes/prices')
let lastEmitted = null

async function emitPrices() {
    try {
        const data = await getCurrentPrices()
        io.emit('priceData', data)
        // سازگاری با کد قدیمی فرانت‌اند
        io.emit('goldData', { items: data.gold, fetchedAt: data.fetchedAt })
        io.emit('silverData', { price: data.silver[0]?.price || 0, fetchedAt: data.fetchedAt })
        lastEmitted = data
    } catch (err) {
        console.error('Socket emit error:', err.message)
    }
}

io.on('connection', socket => {
    if (lastEmitted) {
        socket.emit('priceData', lastEmitted)
        socket.emit('goldData', { items: lastEmitted.gold, fetchedAt: lastEmitted.fetchedAt })
        socket.emit('silverData', { price: lastEmitted.silver[0]?.price || 0, fetchedAt: lastEmitted.fetchedAt })
    }
})

setInterval(emitPrices, 60000)
emitPrices()

module.exports = {}
