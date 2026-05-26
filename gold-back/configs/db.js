const mongoose = require('mongoose');
// const dburl = 'mongodb://localhost:27017/Gold'
const dburl = 'mongodb://maxigold_app:9-6&ZtwCVL7jj0!8BU@127.0.0.1:27017/maxigold_app'

// اتصال به MongoDB با timeout و خطای نرم
mongoose.connect(dburl, {
    serverSelectionTimeoutMS: 3000,
    connectTimeoutMS: 3000,
    bufferCommands: true  // Enable mongoose buffering to prevent errors
})
    .then(() => console.log("MongoDB connected"))
    .catch((err) => {
        console.log("MongoDB connection error (continuing without DB):", err.message);
        console.log("Starting application without database functionality...");
        // برنامه بدون دیتابیس ادامه پیدا می‌کنه
    });

// گوش دادن به خطاهای اتصال
mongoose.connection.on('error', (err) => {
    console.log('MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});




