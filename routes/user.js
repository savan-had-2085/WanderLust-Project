const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {savedRedirectUrl} = require("../middleware.js");
// const localStrategy = require("passport-local");

const userController = require("../controllers/users.js");
const { render } = require("ejs");

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderLoginForm)
.post( 
    savedRedirectUrl,
    passport.authenticate(
        "local", 
        {failureRedirect: '/login', 
        failureFlash: true}), 
    userController.login
);

//Signup User
//show form for register user (add data in DB)
// router.get("/signup", userController.renderSignupForm);

//Add data in DB from form 
// router.post("/signup", wrapAsync(userController.signup));

//Signup User
//show form for login user (add data in DB)
// router.get("/login", userController.renderLoginForm);

//check if DB and form's data is equal
// router.post("/login", 
//     savedRedirectUrl,
//     passport.authenticate(
//         "local", 
//         {failureRedirect: '/login', 
//         failureFlash: true}), 
//     userController.login
// );

//Logout user
router.get("/logout", userController.logout);

module.exports = router;
