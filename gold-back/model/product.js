const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  uid: {
    type: Number,
    default: () => Date.now()
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String, 
    required: true
  },
  weightGram: {
    type: Number, 
    required: true
  },
  weightSot: {
    type: Number, 
    required: true
  },
  status: {
    type: Boolean,
    default: false
  },
  description: {
    type: String 
  },
  img: {
    type: String 
  }
}, { timestamps: true });

const productmodel = mongoose.model("product", productSchema);

module.exports = productmodel;
