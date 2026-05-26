const express = require('express');
const adminRouter = express.Router()
const admincontroller = require("../controller/admin");
const isAadmin = require('../Middleware/isAdmin');
const uploadr = require('../Middleware/upload');


// user

adminRouter.get("/userlist", isAadmin, admincontroller.userlist)
adminRouter.put("/user/update", isAadmin, admincontroller.updateUser);
adminRouter.put("/user/balance", isAadmin, admincontroller.updateBalance);
adminRouter.get("/changerole/:id", isAadmin, admincontroller.changerole)
adminRouter.get("/deleteuser/:id", isAadmin, admincontroller.deleteuser)
adminRouter.get("/authentication/:id", isAadmin, admincontroller.authentication)
adminRouter.get("/isRejected/:id", isAadmin, admincontroller.isRejectedpage)
adminRouter.post("/isRejected", isAadmin, admincontroller.isRejected)
adminRouter.put("/isactive/:id", isAadmin, admincontroller.isactive)
adminRouter.post("/user/create", isAadmin, admincontroller.createUser)




// order

adminRouter.get("/order", isAadmin, admincontroller.order)
adminRouter.delete("/order/delete/:id", isAadmin, admincontroller.deleteorder)


// product
adminRouter.get("/product", isAadmin,admincontroller.product);
adminRouter.post("/product/create", isAadmin, uploadr.single("img"), admincontroller.productcreate);
adminRouter.put("/product/update/:id", isAadmin, uploadr.single("img"), admincontroller.productupdate);
adminRouter.delete("/product/delete/:id", isAadmin, admincontroller.productdelete);


// blog

adminRouter.get("/bloglist", isAadmin, admincontroller.bloglist)
adminRouter.post("/addblog", isAadmin, uploadr.single("img"), admincontroller.addblog)
adminRouter.get("/editblog/:id", isAadmin, admincontroller.editblogpage)
adminRouter.post("/editblogform", isAadmin, uploadr.single("img"), admincontroller.editblogform)
adminRouter.get("/removeblog/:id", isAadmin, admincontroller.removeblog)


// banner
adminRouter.get("/getbanner", admincontroller.getbanner);
adminRouter.post(
  "/addbaner",
  uploadr.single("img"), 
  isAadmin,
  admincontroller.addbanner
);

adminRouter.delete("/removebanner/:id", isAadmin, admincontroller.removebanner);


// setting
adminRouter.get("/setting", admincontroller.getsetting);
adminRouter.post("/settingupdate", isAadmin, uploadr.single("favicon"), admincontroller.editsetting);


// getnotif

adminRouter.get("/getnotif", isAadmin, admincontroller.getnotif);
adminRouter.post("/createnotif", isAadmin, admincontroller.createnotif);
adminRouter.delete("/deletenotif/:id", isAadmin, admincontroller.deletenotif);



// ticket
adminRouter.get("/ticket", isAadmin, admincontroller.ticketpage)
adminRouter.get("/ticketuser/:id", isAadmin, admincontroller.ticketuser)
adminRouter.get("/statustick/:id", isAadmin, admincontroller.statustick)
adminRouter.post("/adminReply", isAadmin, admincontroller.adminReply)


// withdrawal

adminRouter.get("/withdrawal", isAadmin, admincontroller.withdrawal)
adminRouter.get("/withdrawal/:id", isAadmin, admincontroller.withdrawalstatus)

// card

adminRouter.get("/cards", isAadmin, admincontroller.cards)
adminRouter.get("/cardstatus/:id", isAadmin, admincontroller.cardstatus)


// cryptosetting
adminRouter.post("/cryptosetting", isAadmin, admincontroller.Createcryptosetting);

adminRouter.get("/cryptosetting", admincontroller.GetAllCryptoSettings);

adminRouter.put("/cryptosetting/:id", isAadmin, admincontroller.UpdateCryptoSetting);

adminRouter.delete("/cryptosetting/:id", isAadmin, admincontroller.DeleteCryptoSetting);



// LoanPlan

adminRouter.get("/loanplan", isAadmin, admincontroller.getAllLoanPlans);
adminRouter.post("/loanplan", isAadmin, admincontroller.createLoanPlan);
adminRouter.put("/loanplan/:id", isAadmin, admincontroller.updateLoanPlan);
adminRouter.delete("/loanplan/:id", isAadmin, admincontroller.deleteLoanPlan);
adminRouter.put("/loanplan/active/:id", isAadmin, admincontroller.aciveLoanPlan);
adminRouter.get("/loan/all", isAadmin, admincontroller.getAllLoans);
adminRouter.post("/loan/decide/:id", isAadmin, admincontroller.decideLoan);


adminRouter.get('/pledges/all', isAadmin, admincontroller.getAllPledges);
adminRouter.post('/pledge/decide/:id', isAadmin , admincontroller.decidePledge);
adminRouter.post('/pledge/release/:id', isAadmin, admincontroller.releaseCollateral);




adminRouter.get('/charity/all', isAadmin, admincontroller.getAllDonations); // لیست کل کمک‌ها برای ادمین

module.exports = adminRouter