const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
   
    item: {
        type: String,
    },
    address: {
        type: String,
    },
    network: {
        type: String,
    },
}, { timestamps: true });

const cryptosettingmodel = mongoose.model("cryptosetting", orderSchema);

module.exports = cryptosettingmodel