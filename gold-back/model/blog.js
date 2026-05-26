const mongoose = require('mongoose');

const blogmodel = mongoose.model("blog", {
    title: {
        type: String,
    },
    href: {
        type: String,
    },
    dec: {
        type: String,
    },
    text: {
        type: String,
    },
    img: {
        type: String,
    },
    uid: {
        type: String,
    },
    MetaTitle : {
        type: String,
    },
    MetaDescription : {
        type: String,
    },
    keywords : {
        type: String,
    },
    MetaTitle : {
        type: String,
    },


})

module.exports = blogmodel