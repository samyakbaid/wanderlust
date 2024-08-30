// controllers/review.js
import Listing from '../models/listing.js';
import Review from '../models/review.js';
import ExpressError from '../utils/ExpressError.js';

export const createReview = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return res.status(404).send("Listing not found");
    }

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview._id);
    await newReview.save();
    await listing.save();

    req.flash("success", "Review Created");
    res.redirect(`/listing/${listing._id}`);
};

export const deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted");
    res.redirect(`/listing/${id}`);
};
