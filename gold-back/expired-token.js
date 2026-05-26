const jwt = require('jsonwebtoken');

const secret = 'b3a7fbf87acdc3ab4a7ee787bc54f27b9b8ba7e578fc5f78544050bb84c862b5';
const payload = { id: '6895927d431e2925431c1e11' };

// زمان انقضا رو عمداً ۱ دقیقه قبل تنظیم می‌کنیم
const token = jwt.sign(payload, secret, { expiresIn: -60 });

console.log('Expired Token:\n', token);
