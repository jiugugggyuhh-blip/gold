const usermodel = require("../model/user")
const jwt = require('jsonwebtoken');
const { mockUsers } = require("../mockUser");

const isAadmin = async (req, res, next) => {

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'توکن ارسال نشده یا فرمت نادرسته' });
        }
        // console.log("isAadmin CHECK PASSED");

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        
        let user = null;
        // Try mock users first
        if (decoded.id === 'admin123') {
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