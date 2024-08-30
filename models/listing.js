import mongoose, { SchemaTypes } from 'mongoose';
import sampleListings from '../init/data.js';
const Schema= mongoose.Schema;

const listingSchema= new Schema(
    {
title :{
    type: String,
    required: true,
},
description: String,
image: {
    filename: {type: String,default: "image" },
    url:{
        type: String, 
        default:
          "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        set : (v)=> v === ""
        ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
        : v,

    }
  }, 
price: Number,
location: String,
country: String,
author: {
    type: Schema.Types.ObjectId,
    ref: 'User'},
reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});

listingSchema.pre('findOneAndDelete', async function(next) {
    const listing = await this.model.findOne(this.getFilter());

    if (listing.reviews.length) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }

    next();
});    

const Listing = mongoose.model("Listing", listingSchema);


export default Listing;