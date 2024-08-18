const express=require("express");
const router=express.Router({mergeParams: true});
const wrapAsync=require("../utils/wrapAsync");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

//signup route
router.route("/signup")
.get(userController.renderSignUpForm)
.post(wrapAsync(userController.signUp));

//login route
router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect: "/login", failureFlash: true}),wrapAsync(userController.logIn));

//logout route
router.get("/logout",userController.logOut);

module.exports=router;