const mongoose = require('mongoose');
const moment = require('moment');

const notifSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    text: {
        type: String,
    },
    timeAt: {
        type: String,
        default: () => moment().format(' HH:mm')
    }
}, { timestamps: true });

const notifmodel = mongoose.model("notif", notifSchema);

module.exports = notifmodel;
