const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    uid: {
        type: Number,
        default: Date.now()
    },
    userid: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    item: {
        type: String,
    },
    img: {
        type: String,
    },
    link: {
        type: String,
    },
    network: {
        type: String,
    },
}, { timestamps: true });

const CryptoOrdermodel = mongoose.model("cryptoorder", orderSchema);

module.exports = CryptoOrdermodel