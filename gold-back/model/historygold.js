const mongoose = require('mongoose');

const historygoldSchema = new mongoose.Schema({
    date: {
       type: Date
    },
    price: {
       type:Number
    },
    highPrice: {
       type: Number,
       default: null
    },
    lowPrice: {
       type: Number,
       default: null
    },
    dailyChange: {
       type: Number,
       default: 0
    },
    dailyChangePercent: {
       type: Number,
       default: 0
    }

});


const historygoldmodel = mongoose.model("historygold", historygoldSchema);

module.exports = historygoldmodel;




