// =============================================================
// ⚠️  TEST MODE ONLY
// TODO: REMOVE BEFORE PRODUCTION DEPLOY
// =============================================================

// شناسه‌های 24-کاراکتری hex معتبر برای mongoose ObjectId
// این مقادیر در isuser.js و isAdmin.js برای شناسایی کاربر تست استفاده می‌شوند
const MOCK_ADMIN_ID = '000000000000000000000001';
const MOCK_USER_ID  = '000000000000000000000002';

const mockUsers = {
    admin: {
        _id: MOCK_ADMIN_ID,
        id: MOCK_ADMIN_ID,
        username: 'admin_test',
        password: 'admin123',
        role: 'admin',
        fname: 'مدیر',
        lname: 'سیستم',
        name: 'مدیر سیستم',
        email: 'admin@test.com',
        phone: '09123456789',
        isActive: true,
        isAuthentication: true,
        isflag: false,
        toman: 150000000,
        gold: 25.5,
        silver: 500,
        refcode: 'ADMIN001',
        invitation: 5,
        gift: 50000,
        createdAt: new Date('2024-01-01'),
        avatar: null,
        codemeli: '0012345678',
        address: 'تهران، خیابان ولیعصر',
        save: async () => {}
    },
    user: {
        _id: MOCK_USER_ID,
        id: MOCK_USER_ID,
        username: 'user_test',
        password: 'user123',
        role: 'user',
        fname: 'علی',
        lname: 'محمدی',
        name: 'کاربر تست',
        email: 'user@test.com',
        phone: '09876543210',
        isActive: true,
        isAuthentication: true,
        isflag: false,
        toman: 12500000,
        gold: 3.2,
        silver: 120,
        refcode: 'USER001',
        invitation: 2,
        gift: 10000,
        createdAt: new Date('2024-03-15'),
        avatar: null,
        codemeli: '0098765432',
        address: 'اصفهان، خیابان چهارباغ',
        save: async () => {}
    }
};

const mockDB = {
    findOne: async (model, query) => {
        if (model === 'users' || model === 'User') {
            if (query.phone === '09123456789') return mockUsers.admin;
            if (query.phone === '09876543210') return mockUsers.user;
            if (String(query._id) === MOCK_ADMIN_ID) return mockUsers.admin;
            if (String(query._id) === MOCK_USER_ID) return mockUsers.user;
        }
        return null;
    },
    create: async (model, data) => {
        return { ...data, _id: Date.now().toString() };
    },
    find: async (model) => {
        if (model === 'historygold' || model === 'historysilver') {
            return [
                { _id: '1', date: new Date(), price: 4250000 },
                { _id: '2', date: new Date(Date.now() - 86400000), price: 4215000 }
            ];
        }
        return [];
    }
};

module.exports = { mockUsers, mockDB, MOCK_ADMIN_ID, MOCK_USER_ID };
