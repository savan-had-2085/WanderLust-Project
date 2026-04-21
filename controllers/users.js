const User = require("../models/user.js");

//Signup User
//show form for register user (add data in DB)
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

//Add data in DB from form
module.exports.signup = async (req,res,next) => {
    try{
        let{username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        await req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            }
        });
        req.flash("success", "welcome to WanderLust");
        return res.redirect("/listings");
    }
    catch(err){
        req.flash("error", err.message);
        return res.redirect("/signup");
    }
};

//Signup User
//show form for login user (add data in DB)
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

//check if DB and form's data is equal
module.exports.login = async(req, res) => {
    req.flash("success","welcome back to wanderLust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    return res.redirect(redirectUrl);
};

//Logout user
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "you are loged out now");
        res.redirect("/listings");
    });
};