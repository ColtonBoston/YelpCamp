
var middlewareObj = {},
    Campground = require("../models/campground");
    Comment = require("../models/comment");

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if (req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if (err || !foundCampground){
        req.flash("error", "Campground not found.");
        console.log("Error at checkCampgroundOwnership middleware (if). Redirecting back...");
				res.redirect("/campgrounds");
			} else {
				// does user own the campground?
				console.log(foundCampground.author.id + " == " + req.user._id + "?");
				console.log(foundCampground.author.id.equals(req.user._id));
				if (foundCampground.author.id.equals(req.user._id)){
					next();
				} else {
          req.flash("error", "You do not own that campground.");
          console.log("Another back");
					res.redirect("/campgrounds");
				}
			}
		});
	} else {
    req.flash("error", "You must be logged in to do that.");
    console.log("Error at checkCampgroundOwnership middleware (else). Redirecting back...");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if (req.isAuthenticated()){
  		Comment.findById(req.params.comment_id, function(err, foundComment){
  			if (err || !foundComment){
          req.flash("error", "Comment not found.");
          console.log("Error at checkCommentOwnership middleware. Redirecting back...");
  				res.redirect("/campgrounds");
  			} else {
  				// does user own the campground?
  				console.log(foundComment.author.id + " == " + req.user._id + "?");
  				console.log(foundComment.author.id.equals(req.user._id));
  				if (foundComment.author.id.equals(req.user._id)){
  					next();
  				} else {
            req.flash("error", "You do not own that comment.");
            console.log("Error at checkCommentOwnership middleware. Redirecting back...");
  					res.redirect("/campgrounds");
  				}
  			}
  		});
  	} else {
      req.flash("error", "Please login first.");
      console.log("Error at checkCommentOwnership middleware. Redirecting back...");
  		res.redirect("/campgrounds");
  	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
  req.flash("error", "You must be logged in to do that.");
	res.redirect("/login");
}

module.exports = middlewareObj;
