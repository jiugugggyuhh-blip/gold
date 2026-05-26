const jwt = require('jsonwebtoken');
const usermodel = require('../model/user');
const { mockUsers } = require('../mockUser');
require('dotenv').config();

const isuser = async (req, res, next) => {


    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'توکن ارسال نشده یا فرمت نادرسته' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        
        let user = null;
        // Try mock users first
        if (decoded.id === 'user123') {
            user = mockUsers.user;
        } else if (decoded.id === 'admin123') {
            user = mockUsers.admin;
        } else {
            // Try database
            try {
                user = await usermodel.findById(decoded.id);
            } catch (dbError) {
                console.log('DB not available, using mock only');
            }
        }
        
        if (!user) {
            return res.status(401).json({ message: 'کاربر یافت نشد' });
        }
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'توکن منقضی شده است' });
        }
        return res.status(401).json({ message: 'توکن معتبر نیست' });
    }




}

module.exports = isuser