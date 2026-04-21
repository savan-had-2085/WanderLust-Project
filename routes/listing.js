const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

const listingController = require("../controllers/listings.js");
const { route } = require("./review.js");

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));
// .post(upload.single('listing[image]'), (req, res) => {
//     res.send(req.file);
// });

router.get("/new", isLoggedIn, listingController.renderNewForm);

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

router.route("/:id")
.put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing))
.get(wrapAsync(listingController.showListing));

//index route :-
//show all data(listings)
// router.get("/", wrapAsync(listingController.index));

//Create route :-
//show form for add data in db
// router.get("/new", isLoggedIn, listingController.renderNewForm);

//Add data in DB from form 
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

//Update route :-
//edit data in listings by link given in listing
// router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

//update data when click on edit button in particular listing
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

//Delete route
//delete data when click on delete button in particular listing
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

//Show route :-
//read particular listing's details in detail
// router.get("/:id", wrapAsync(listingController.showListing));

module.exports = router;