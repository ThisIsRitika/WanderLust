const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing}=require("../middleware.js");

const listingController=require("../controllers/listings.js");

const {cloudinary,storage}=require("../cloudConfig.js");
const multer  = require('multer');
const upload = multer({ storage: storage });

//console logging for debugging
/* console.log(cloudinary);
console.log("this is cloudinary v2")
console.log('Cloudinary v2:', cloudinary.v2);  */// Check if this is defined


//search route
router.get("/search",wrapAsync(listingController.searchListing));

//combines routes with same paths
router
    .route("/")
    .get(wrapAsync(listingController.index) )//index route
    .post(isLoggedIn,upload.single('listing[image][url]'),validateListing,wrapAsync(listingController.createNewListing));//create route
//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);    

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))//show route
    .put(isLoggedIn,isOwner,upload.single('listing[image][url]'),validateListing,wrapAsync(listingController.updateListing))//update route
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));//delete route

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));


module.exports=router;