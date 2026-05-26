const express = require('express');
const userRouter = express.Router()
const usercontroller = require("../controller/user");
const isuser = require('../Middleware/isuser');
const uploadr = require('../Middleware/upload');
const isloan = require('../Middleware/isloan');



userRouter.get("/profile", isuser, usercontroller.profilepage)
userRouter.post("/profile", isuser, uploadr.single("avatar"), usercontroller.profile)
userRouter.post("/Authentication", isuser, uploadr.single("cardImage"), usercontroller.Authentication)
userRouter.get("/getnotif", isuser,  usercontroller.getnotif)


// wallet
userRouter.post("/wallet", isuser, usercontroller.wallet)
userRouter.post("/wallet/v2", isuser, uploadr.single("img"), usercontroller.walletCart)
userRouter.get("/pay", usercontroller.pay)
userRouter.post("/withdrawal", isuser, isloan, usercontroller.withdrawal)
userRouter.get("/wallet/details", isuser, usercontroller.walletDetails)
userRouter.get("/list-withdrawal", isuser, usercontroller.listwithdrawal)
userRouter.post("/card", isuser, usercontroller.card)
userRouter.get("/getcard", isuser, usercontroller.getcard)


// coin
userRouter.post("/coin", isuser , usercontroller.coin)

// assets
userRouter.get("/assets", isuser , usercontroller.assets)


// gold 
userRouter.post("/gold", isuser ,isloan,  usercontroller.gold)
userRouter.post("/silver", isuser , isloan, usercontroller.silver)


// order

userRouter.get("/order", isuser , usercontroller.order)

// ticket
userRouter.get("/ticket", isuser, usercontroller.Ticket)
userRouter.get("/sendticket/:id", isuser, usercontroller.sendTicketpage)
userRouter.post("/sendTicket", isuser, usercontroller.sendTicket)
userRouter.post("/sendmessage", isuser, usercontroller.sendmessage)

// walletCrypto

userRouter.post("/wallet/crypto", isuser,uploadr.single("img"), usercontroller.walletCrypto)
userRouter.get("/wallet/crypto", isuser, usercontroller.getWalletCrypto)



userRouter.get('/loan/plans', isuser, usercontroller.getActivePlans);
userRouter.get('/loan/my-loans', isuser, usercontroller.getMyLoans);
userRouter.post('/loan/request', isuser, usercontroller.requestLoan);
userRouter.get('/loan/my', isuser, usercontroller.getMyLoans); // (این رو قبلا داشتی)
userRouter.get('/loan/:loanId', isuser, usercontroller.getLoanDetails);
userRouter.post('/loan/pay', isuser, usercontroller.payInstallment);

userRouter.post('/pledge/request', isuser, usercontroller.requestPledge);
userRouter.get('/pledge/my', isuser, usercontroller.getMyPledges);



userRouter.post('/donate', isuser, usercontroller.donate); // ثبت کمک
userRouter.get('/my-donations', isuser, usercontroller.getMyDonations); // لیست کمک‌های من


userRouter.get('/transfer/all', isuser, usercontroller.transferAll); 
userRouter.post('/transfer/create', isuser, usercontroller.transferCreate); 


module.exports = userRouter