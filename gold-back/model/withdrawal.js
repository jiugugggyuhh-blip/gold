const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
    uid: {
        type: Number,
        default: Date.now()
    },
    userid: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    cardId: {
        type: mongoose.Types.ObjectId,
        ref: "card"
    },
    amount: {
        type: Number,
    },
    status: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const withdrawalmodel = mongoose.model("withdrawal", withdrawalSchema);

module.exports = withdrawalmodel