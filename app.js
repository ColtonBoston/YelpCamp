var express = require("express")
		flash = require("connect-flash"),
		bodyParser = require("body-parser"),
		mongoose = require("mongoose"),
		Campground = require("./models/campground"),
		Comment = require("./models/comment"),
		User = require("./models/user"),
		seedDB = require("./seeds"),
		passport = require("passport"),
		LocalStrategy = require("passport-local"),
		methodOverride = require("method-override");

var app = express();

// Requiring routes
var commentRoutes = require("./routes/comments"),
		campgroundRoutes = require("./routes/campgrounds"),
		indexRoutes = require("./routes/index");

//seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Zoe is a dog",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect("mongodb://localhost/yelp_camp_v11", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen("3000", console.log("listening..."));
