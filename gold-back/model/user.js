const mongoose = require('mongoose');

function generateRefCode() {
    return Math.floor(1000000 + Math.random() * 9000000); 
}

const userSchema = new mongoose.Schema({
    username: String,
    fname: String,
    lname: String,
    phone: { type: String, required: true },
    codemeli: String,
    imgcartmeli: String,
    email: String,
    password: String,
    address: String,
    role: { type: String, default: "USER" },
    otp: Number,
    avatar: String,
    date: { type: Date, default: Date.now },
    attempts: { type: Number, default: 0 },
    status: { type: String, default: "registering" },
    isAuthentication: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isflag: { type: Boolean, default: false },
    isreject: { type: Boolean, default: false },
    isRejected: { type: String },
    gold: { type: Number, default: 0 },
    silver: { type: Number, default: 0 },
    toman: { type: Number, default: 0 },
    invitation: { type: Number, default: 0 },
    gift: { type: Number, default: 0 },
    refcode: { type: Number, unique: true }
});


userSchema.pre('save', async function (next) {
    if (!this.refcode) {
        let code;
        let exists = true;
        while (exists) {
            code = generateRefCode();
            exists = await mongoose.models.user.findOne({ refcode: code });
        }
        this.refcode = code;
    }
    next();
});

const usermodel = mongoose.model("user", userSchema);

module.exports = usermodel;
