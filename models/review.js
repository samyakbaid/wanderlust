import mongoose from 'mongoose';
const Schema= mongoose.Schema;

const reviewSchema= new Schema({
    comment: String,
    rating:{
        type: Number,
        min: 1,
        max: 5,
    },
    createdAT:{
        type:Date,
        default: Date.now(),
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
    }
)

const Review = mongoose.model("Review", reviewSchema);


export default Review;