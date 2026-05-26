const Loan = require('../model/Loan');

const isloan = async (req, res, next) => {
    try {
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
    } catch (err) {
        console.error('isloan middleware error:', err.message);
        res.status(500).json({ message: 'خطای سرور' });
    }
};

module.exports = isloan
