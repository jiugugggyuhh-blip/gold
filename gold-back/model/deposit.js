const mongoose = require('mongoose');

const depositSchema = new mongoose.Schema({
    uid: {
        type: Number,
        default: Date.now()
    },
    userid: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    amount: {
        type: Number,
    },
    img: {
        type: String
    },
   
}, { timestamps: true });

const depositmodel = mongoose.model("deposit", depositSchema);

module.exports = depositmodel