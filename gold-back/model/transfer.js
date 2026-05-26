const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
   userid: {
      type: mongoose.Types.ObjectId,
      ref: 'user'
   },
   userref: {
      type: mongoose.Types.ObjectId,
      ref: 'user'
   },
   amount: {
      type: Number
   },
   type:{
      type: String
   }

});


const transfermodel = mongoose.model("transfer", transferSchema);

module.exports = transfermodel;




