const jwt = require('jsonwebtoken');
const usermodel = require('../model/user');
require('dotenv').config();

const isuser = async (req, res, next) => {

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'توکن ارسال نشده یا فرمت نادرسته' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const user = await usermodel.findById(decoded.id);

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
