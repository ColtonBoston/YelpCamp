var express = require("express");
var router = express.Router({mergeParams: true});
var middleware = require("../middleware");
var Campground = require("../models/campground"),
    Comment = require("../models/comment");

// Show new comment page
router.get("/new", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if (err){
			console.log(err);
      req.flash("error", "Campground not found.");
      res.redirect("/campgrounds/" + req.params.id);
		} else {
			res.render("comments/new", {campground: foundCampground});
		}
	});
});

// Save new comment
router.post("/", middleware.isLoggedIn, function(req, res){
	// Lookup campground using id
	Campground.findById(req.params.id, function(err, foundCampground){
		if (err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			console.log(req.body.comment);
			Comment.create(req.body.comment, function(err, comment){
				if (err){
          req.flash("error", "Something went wrong.");
					console.log(err);
				} else {
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment
          comment.save();
          console.log(comment);
					foundCampground.comments.push(comment);
					foundCampground.save();
          req.flash("success", "Successfully created comment!");
					res.redirect("/campgrounds/" + foundCampground._id);
				}
			});
		}
	});
});

// Edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
  Campground.findById(req.params.id, function(err, foundCampground){
    if (err || !foundCampground){
      req.flash("error", "Campground not found.");
      return res.redirect("/campgrounds/" + req.params.id);
    }
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
        res.redirect("/campgrounds/" + req.params.id);
      } else {
        res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
      }
    });
  });

});

// Update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err){
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// Destroy
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if (err){
      console.log(err);
    } else {
      req.flash("success", "Comment deleted.");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

module.exports = router;
