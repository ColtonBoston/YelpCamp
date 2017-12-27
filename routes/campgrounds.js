var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX -- Show all campgrounds
router.get("/", function(req, res){
	console.log(req.user);
	Campground.find({}, function(err, allCampgrounds){
		if (err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user, page: "campgrounds"});
		}
	});
});

// CREATE -- add new campground to db
router.post("/", middleware.isLoggedIn, function(req, res){
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var description = req.body.description;
	geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
		var author = { id: req.user._id, username: req.user.username };
		var newCampground =
		{
			name: name,
			price: price,
			image: image,
			description: description,
			author: author,
			location: location,
			lat: lat,
			lng: lng
		};

    // Create a new campground and save to DB
		Campground.create(newCampground, function(err, createdCampground){
			if (err){
				console.log(err);
			} else {
				req.flash("success", "Campground created!");
				res.redirect("/campgrounds");
			}
		});
  });
});

// NEW -- Show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

// SHOW -- Shows info about one campground
router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if (err || !foundCampground) {
			req.flash("error", "Campground not found.");
			console.log("Error at campground show route");
			res.redirect("/campgrounds");
		} else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	// is user logged in?
	if (req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			res.render("campgrounds/edit", {campground: foundCampground});
		});
	}
});

// UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	// find and update the correct campground
	geocoder.geocode(req.body.campground.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.campground.name, image: req.body.campground.image, description: req.body.campground.description, price: req.body.campground.price, location: location, lat: lat, lng: lng};
		Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("/campgrounds/");
        } else {
            req.flash("success", "Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });
});

// DESTROY
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if (err){
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "Campground deleted.");
			res.redirect("/campgrounds");
		}
	})
});

module.exports = router;
