// Mock user for testing without database
const mockUsers = {
    admin: {
        _id: 'admin123',
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        name: 'مدیر سیستم',
        email: 'admin@test.com',
        phone: '09123456789',
        isActive: true,
        createdAt: new Date()
    },
    user: {
        _id: 'user123',
        username: 'user',
        password: 'user123',
        role: 'user',
        name: 'کاربر تست',
        email: 'user@test.com',
        phone: '09876543210',
        isActive: true,
        createdAt: new Date()
    }
};

// Mock database functions
const mockDB = {
    findOne: async (model, query) => {
        if (model === 'users' || model === 'User') {
            if (query.username === 'admin') return mockUsers.admin;
            if (query.username === 'user') return mockUsers.user;
            if (query._id === 'admin123') return mockUsers.admin;
            if (query._id === 'user123') return mockUsers.user;
        }
        return null;
    },
    
    create: async (model, data) => {
        console.log('Mock create:', model, data);
        return { ...data, _id: Date.now().toString() };
    },
    
    find: async (model, query = {}) => {
        if (model === 'historygold' || model === 'historysilver') {
            return [
                { _id: '1', date: new Date(), price: 2500000 },
                { _id: '2', date: new Date(Date.now() - 86400000), price: 2480000 }
            ];
        }
        return [];
    }
};

module.exports = { mockUsers, mockDB };
