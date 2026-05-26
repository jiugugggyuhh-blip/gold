const mongoose = require('mongoose');

const orderPhysicalSchema = new mongoose.Schema({
    uid: {
        type: Number,
        default: Date.now()
    },
    goldid: {
        type: mongoose.Types.ObjectId,
        ref: "product"
    },
    userid: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    price: {
        type: Number,
    },
    typeorder: {
         type: String,
    }
}, { timestamps: true });

const orderPhysical = mongoose.model("orderPhysical", orderPhysicalSchema);

module.exports = orderPhysical