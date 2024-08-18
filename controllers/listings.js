const Listing=require("../models/listing");
const categories=require("../categories");
module.exports.index=async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm=(req,res)=>{
  res.render("listings/new.ejs", {categories});
};

module.exports.createNewListing=async (req,res)=>{  
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing= new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New Listing Created!!");
    res.redirect("/listings");
};

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id).populate({path: "reviews", populate: { path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};
module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_200");
    res.render("listings/edit.ejs",{listing, originalImageUrl, categories});
};
module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    const delListing=await Listing.findByIdAndDelete(id);
    console.log(delListing);
    req.flash("success", "Listing Deleted!!");
    res.redirect("/listings");
};

module.exports.searchListing=async (req, res) => {
    console.log(req.query.q);
    let input = req.query.q.trim().replace(/\s+/g, " "); // remove start and end space and middle space remove and middle add one space------
    console.log(input);
    if (input == "" || input == " ") {
      //search value empty
      req.flash("error", "Search value empty !!!");
      res.redirect("/listings");
    }
  
    // convert every word 1st latter capital and other small---------------
    let data = input.split("");
    let element = "";
    let flag = false;
    for (let index = 0; index < data.length; index++) {
      if (index == 0 || flag) {
        element = element + data[index].toUpperCase();
      } else {
        element = element + data[index].toLowerCase();
      }
      flag = data[index] == " ";
    }
    console.log(element);
  
    let allListings = await Listing.find({
      title: { $regex: element, $options: "i" },
    });
    if (allListings.length != 0) {
      res.locals.success = "Listings searched by Title";
      res.render("listings/index.ejs", { allListings });
      return;
    }
    if (allListings.length == 0) {
      allListings = await Listing.find({
        category: { $regex: element, $options: "i" },
      }).sort({ _id: -1 });
      if (allListings.length != 0) {
        res.locals.success = "Listings searched by Category";
        res.render("listings/index.ejs", { allListings });
        return;
      }
    }
    if (allListings.length == 0) {
      allListings = await Listing.find({
        country: { $regex: element, $options: "i" },
      }).sort({ _id: -1 });
      if (allListings.length != 0) {
        res.locals.success = "Listings searched by Country";
        res.render("listings/index.ejs", { allListings });
        return;
      }
    }
    if (allListings.length == 0) {
      let allListings = await Listing.find({
        location: { $regex: element, $options: "i" },
      }).sort({ _id: -1 });
      if (allListings.length != 0) {
        res.locals.success = "Listings searched by Location";
        res.render("listings/index.ejs", { allListings });
        return;
      }
    }
    const intValue = parseInt(element, 10); // 10 for decimal return - int ya NaN
    const intDec = Number.isInteger(intValue); // check intValue is Number & Not Number return - true ya false
  
    if (allListings.length == 0 && intDec) {
      allListings = await Listing.find({ price: { $lte: element } }).sort({
        price: 1,
      });
      if (allListings.length != 0) {
        res.locals.success = `Listings searched for less than Rs ${element}`;
        res.render("listings/index.ejs", { allListings });
        return;
      }
    }
    if (allListings.length == 0) {
      req.flash("error", "Listings is not here !!!");
      res.redirect("/listings");
    }
  };