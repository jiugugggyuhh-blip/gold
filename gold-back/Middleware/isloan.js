const Loan = require('../model/Loan');
const isloan = async (req, res, next) => {
    const hasOverdue = await Loan.exists({ 
        user: req.user._id, 
        'installments.status': 'overdue' 
    });

    if (hasOverdue) {
        return res.status(403).json({ 
            message: "شما قسط عقب‌افتاده دارید! تا زمان تسویه، امکان استفاده از این بخش مسدود است." 
        });
    }
    next();
};

module.exports = isloan