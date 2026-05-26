const express = require('express');
const pageRouter = express.Router()
const pagecontroller = require("../controller/page");
const isuser = require('../Middleware/isuser');



pageRouter.get("/products" , pagecontroller.products)



module.exports = pageRouter