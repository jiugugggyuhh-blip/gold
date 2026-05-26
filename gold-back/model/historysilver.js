const mongoose = require('mongoose');

const historysilverSchema = new mongoose.Schema({
    date: { type: Date },
    price: { type: Number },
});

const historysilvermodel = mongoose.model("historysilver", historysilverSchema);

module.exports = historysilvermodel;
