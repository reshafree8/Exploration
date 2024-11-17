if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose=require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy =  require("passport-local");
const User =  require("./models/user.js");


const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/exploration";
// const dbUrl =process.env.ATLASDB_URL;

main()
.then(()=>{
    console.log("connectred to Db");
})
.catch((err) =>{
    console.log(err);
});
async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


// const store =MongoStore.create({
//     mongoUrl: dbUrl,
//     crypto: {
//         secret: "mysupersecret",
//     },
//     touchAfter: 24 * 3600,
// });


// store.on("error",()=>{
//     console.log("ERROR in MONGO SESSION STORE",err);
// });


const sessionOptions = {
    // store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
         expires: Date.now() + 7 *24 *60 *60 *1000,
         maxAge: 7 *24 * 60 * 60 *1000,
         httpOnly: true,
    },
};




// app.get("/",(req,res)=>{
//     res.send("hi,iam root");
// });



app.use(session(sessionOptions));
app.use(flash());//we have write flash before writing the routes i.e,listings and reviews

//to use paasport session is important
//becuz if we know that one is accessing in different tabs from same pc
//then no require to ask log-in again and again
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


//all the listing routes are in ../reviews/listing.js
app.use("/listings",listingsRouter);
//all the listing routes are in ../reviews/review.js
app.use("/listings/:id/reviews",reviewsRouter);

app.use("/",userRouter);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});

app.use((err,req,res,next)=>{
    let {statuscode=500,message="somethig went wrong"} = err;
    res.status(statuscode).render("error.ejs",{message});
    // res.status(statuscode).send(message);
})


app.listen(8080, ()=> {
    console.log("server is listening at port 8080");
})
