const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    uid: {
        type: Number,
        default: Date.now()
    },
    userid: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    card: {
        type: Number,
    },
    status: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const cardmodel = mongoose.model("card", cardSchema);

module.exports = cardmodel