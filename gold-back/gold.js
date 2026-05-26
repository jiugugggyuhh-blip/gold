const goldPriceService = require('./services/goldPriceService');
const historygoldmodel = require('./model/historygold');
const WebSocket = require('ws');

const SCRAPE_INTERVAL = 60000;
const CACHE_DURATION = 60000; 

let lastData = null;
let lastCacheTime = 0;

async function scrapeData() {
    const now = Date.now();
    if (lastData && now - lastCacheTime < CACHE_DURATION) {
        return lastData;
    }

    try {
        // استفاده از API جدید برای دریافت قیمت طلا
        const priceData = await goldPriceService.getGoldPrice();
        
        // تبدیل داده‌های API به فرمت قبلی برای سازگاری
        const items = [
            {
                name: 'گرم طلای 18 عیار',
                price: priceData.gold18.toLocaleString('fa-IR'),
                change: priceData.change > 0 ? `+${priceData.change.toLocaleString('fa-IR')}` : priceData.change.toLocaleString('fa-IR'),
                realPrice: priceData.gold18.toLocaleString('fa-IR'),
                bubble: '0',
                bubblePercent: '0%'
            },
            {
                name: 'گرم طلای 24 عیار',
                price: priceData.gold24.toLocaleString('fa-IR'),
                change: priceData.change > 0 ? `+${priceData.change.toLocaleString('fa-IR')}` : priceData.change.toLocaleString('fa-IR'),
                realPrice: priceData.gold24.toLocaleString('fa-IR'),
                bubble: '0',
                bubblePercent: '0%'
            }
        ];

        lastData = { items, timestamp: priceData.timestamp };
        lastCacheTime = now;
        
        return lastData;
    } catch (error) {
        console.error('خطا در دریافت قیمت از API:', error.message);
        return lastData; 
    }
}

// راه‌اندازی WebSocket
const wss = new WebSocket.Server({ port: 4040 });

wss.on('connection', ws => {
    if (lastData) {
        ws.send(JSON.stringify(lastData));
    }
});

// به‌روزرسانی دوره‌ای داده‌ها
let previousData = null;
setInterval(async () => {
    const newData = await scrapeData();
    if (newData && JSON.stringify(newData) !== JSON.stringify(previousData)) {
        previousData = newData;
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(newData));
            }
        });
    }
}, SCRAPE_INTERVAL);


scrapeData().then(data => {
    if (data) {
        console.log('اسکریپ اولیه با موفقیت انجام شد');
    }
}).catch(error => {
    console.error('خطا در اسکریپ اولیه:', error.message);
});

setInterval(async () => {
    const newData = await scrapeData();

    if (newData && JSON.stringify(newData) !== JSON.stringify(previousData)) {
        previousData = newData;

        const gold18 = newData.items.find(item => item.name === 'گرم طلای 18 عیار');

        if (gold18) {
            const todayPrice = Number(
                gold18.price.replace(/[٬,]/g, '').replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)) || 0
            );

            if (todayPrice > 0) {
           
                const startOfDay = new Date();
                startOfDay.setHours(0, 0, 0, 0);

                
                const exists = await historygoldmodel.findOne({
                    date: { $gte: startOfDay }
                });

                if (!exists) {
                    await historygoldmodel.create({
                        date: new Date(),
                        price: todayPrice
                    });
                   
                } 
            }
        }

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(newData));
            }
        });
    }
}, SCRAPE_INTERVAL);



module.exports = { lastData, scrapeData };