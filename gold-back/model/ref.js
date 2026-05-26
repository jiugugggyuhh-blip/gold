const mongoose = require('mongoose');


const refSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Types.ObjectId,
        ref:"user"
    },
    refid: [{
        type: mongoose.Types.ObjectId,
        ref:"user"
    }],

});


const refmodel = mongoose.model("ref", refSchema);

module.exports = refmodel;




