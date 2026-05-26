const mongoose = require('mongoose');

const bannermodel = mongoose.model("banner", {
    title: {
        type: String,
    },
    img: {
        type: String,
    },
    href:{
        type: String,
    }


})

module.exports = bannermodel