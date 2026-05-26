const mongoose = require('mongoose');
const moment = require('moment');
const Ticketmodel = mongoose.model("Ticket", {
    title: {
        type: String,
    },
    userid: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    date: {
        type: String,
    },
    lastdate: {
        type: String,
    },
    category: {
        type: String,
    },
    status: {
        type: String,
    },
    uuid: {
        type: Number
    },
    masssge: [{ 
        text: {
            type: String
        },
        time: {
            type: String,
            default: () => moment().format('jYYYY/jM/jD , HH:mm')
        }
    }],
    masssgeadmin: [{ 
        text: {
            type: String
        },
        time: {
            type: String,
            default: () => moment().format('jYYYY/jM/jD , HH:mm')
        }
    }]
});

module.exports = Ticketmodel;
