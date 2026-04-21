const Listing = require("../models/listing");

//index route :-
//show all data(listings)
module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

//Create route :-
//show form for add data in db
module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
};

//Add data in DB from form 
module.exports.createListing = async (req,res,next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "new listing created");
    res.redirect("/listings");    
};

//Update route :-
//edit data in listings by link given in listing
module.exports.renderEditForm = async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listings you requested for does not exist");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")
    res.render("listings/edit.ejs", {listing, originalImageUrl});
};

//update data when click on edit button in particular listing
module.exports.updateListing = async(req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }

    req.flash("success", "listing updated");
    return res.redirect(`/listings/${id}`);
};

//Delete route
//delete data when click on delete button in particular listing
module.exports.deleteListing = async(req,res) => {
    let {id} = req.params;
    let deletedListings = await Listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted");
    res.redirect("/listings");
};

//Show route :-
//read particular listing's details in detail
module.exports.showListing = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate({path: "reviews", 
            populate: {path: "author"},
        })
        .populate("owner");
    if(!listing){
        req.flash("error","Listings you requested for does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
};