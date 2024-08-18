if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express= require("express");
const app=express();
const mongoose= require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const dbUrl=process.env.ATLASDB_URL;

const store=MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionOptions={
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now()+ 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    }
};



//to create a session id / sid cookie
app.use(session(sessionOptions));
//to flash messages 
app.use(flash());

//to authenticate user
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//requiring the routes exported from respective js file
const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


//main function called
main().then(()=>{
    console.log("connected to db");
}).catch(err => {
    console.log(err);
}); 

//main function created-->to connect to db
async function main(){
    await mongoose.connect(dbUrl);
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


/* app.get("/",(req,res)=>{
    res.send("this is root");
}); */

//flash middleware
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    //console.log(res.locals.success);
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user//beacuse we cannot access the req object in ejs template directly but can through local variables
    next();
})

/* app.get("/demouser", async(req,res)=>{
    let fakeUser=new User({
        email: "student@gmail.com",
        username: "delta-student"
    });

    let registerdUser=await User.register(fakeUser,"password123");
    res.send(registerdUser);
}) */

//using the required routes
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/",userRouter);


//when no defined route matches with the route being accessed
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found"));
});

//error handling middleware
app.use((err,req,res,next)=>{
    //res.send("Something went wrong");
    let {status=500, message="Something Went Wrong"}=err;
    //res.status(status).send(message);
    res.status(status).render("error.ejs",{err});
});

app.listen("8080",()=>{
    console.log("App is listening on port 8080");
});