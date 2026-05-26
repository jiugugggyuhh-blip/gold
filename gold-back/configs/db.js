const mongoose = require('mongoose');
const dburl = 'mongodb://127.0.0.1:27017/maxigold_app'

mongoose.connect(dburl, {
    family: 4
})
    .then(() => console.log("MongoDB connected"))
    .catch((err) => {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    });

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});




