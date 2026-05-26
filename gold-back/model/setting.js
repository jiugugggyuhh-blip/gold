const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    title: {
        type: String
    },
    subtitle: {
        type: String
    },
    favicon: {
        type: String
    },
    dec: {
        type: String
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    feebuy: {
        type: Number
    },
    feesell: {
        type: Number
    },
    gift: {
        type: Number
    },
    cartNumber: {
        type: Number
    },
    cardOwner: {
        type: String,
        trim: true,
        default: ''
    },
    transactions: {
        type: Boolean,
        default: false
    },
});


const settingmodel = mongoose.model("setting", settingSchema);

module.exports = settingmodel;




