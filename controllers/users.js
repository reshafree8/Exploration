
const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
    console.log("SIGNUP POST RECEIVED");

    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });

        const registeredUser = await User.register(newUser, password);
        console.log("USER REGISTERED:", registeredUser.username);

        req.login(registeredUser, (err) => {
            if (err) {
                console.log("LOGIN ERROR:", err);
                return next(err);
            }

            console.log("SIGNUP LOGIN SUCCESS");
            req.flash("success", "Welcome to Exploration!");
            return res.redirect("/listings");
        });

    } catch (e) {
        console.log("SIGNUP ERROR:", e);

        if (e.code === 11000 && e.keyPattern?.email) {
            req.flash("error", "This email is already registered. Please use another email or login.");
            return res.redirect("/signup");
        }

        if (e.code === 11000 && e.keyPattern?.email) {
    req.flash("error", "TEST: This email is already registered!");
    console.log("DUPLICATE EMAIL FLASH SET");
    return res.redirect("/signup");
}

        req.flash("error", "Something went wrong. Please try again.");
        return res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = (req, res) => {
    req.flash("success", "Welcome back to Exploration!");

    const redirectUrl = res.locals.redirectUrl || "/listings";

    delete req.session.redirectUrl;

    return res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "You are logged out now.");
        res.redirect("/listings");
    });
};
