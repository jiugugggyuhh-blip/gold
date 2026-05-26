const usermodel = require("../model/user")
const jwt = require('jsonwebtoken');

const isAadmin = async (req, res, next) => {

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
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'دسترسی ندارید' });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(408).json({ message: 'توکن معتبر نیست یا منقضی شده' });
    }

}



module.exports = isAadmin
