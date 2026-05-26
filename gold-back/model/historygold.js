const mongoose = require('mongoose');


const historygoldSchema = new mongoose.Schema({
    date: {
       type: Date
    },
    price: {
       type:Number
    },

});


const historygoldmodel = mongoose.model("historygold", historygoldSchema);

module.exports = historygoldmodel;




