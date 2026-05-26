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
    goldprice: {
        type: Number,
    },
    price: {
        type: Number,
    },
    fee: {
        type: Number,
    },
    weight: {
        type: String,
    },
    typeorder: {
        type: String,
    }
}, { timestamps: true });

const ordermodel = mongoose.model("order", orderSchema);

module.exports = ordermodel