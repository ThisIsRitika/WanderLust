const mongoose= require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review")

const listingSchema = new Schema({
    title:{
        type:String,
        required: true
    } ,
    description : String,
    image: {
        filename:{ 
            type: String,
            default: "ListingImage"
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1515469037678-4d4f8288bcbe?q=80&w=1452&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            set: (v)=>
                v===""?"https://images.unsplash.com/photo-1515469037678-4d4f8288bcbe?q=80&w=1452&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v,
        },
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
       { 
        type: Schema.Types.ObjectId,
        ref: "Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    latitude: Number,
    longitude: Number,
    category: [String],
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing= mongoose.model("Listing",listingSchema);
module.exports=Listing;