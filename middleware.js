// middleware.js
import Listing from './models/listing.js';
import ExpressError from './utils/ExpressError.js';
import { listingSchema } from './schema.js';
import { reviewSchema } from './schema.js';
import Review from './models/review.js';

export const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(',');
        console.error('Validation error:', errMsg); // Log validation errors
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


export const isAuthor = async (req, res, next) => {
    const { id } = req.params;
    try {
        const foundListing = await Listing.findById(id).populate('author');
        if (!foundListing || !foundListing.author) {
            req.flash('error', 'Listing not found or no author associated');
            return res.redirect('/listing');
        }

        if (foundListing.author.equals(req.user._id)) {
            next();
        } else {
            req.flash('error', 'You do not have permission to do that');
            return res.redirect(`/listing/${id}`);
        }
    } catch (err) {
        console.error('Error in isAuthor middleware:', err);
        req.flash('error', 'Something went wrong while processing your request.');
        return res.redirect('/listing');
    }
};

export const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) { // Check if the user is authenticated
        return next();
    }

    // Store the original URL the user was trying to access
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must be logged in to do that');
    res.redirect('/auth/login'); // Redirect to login page if not logged in
};

// middleware.js


export const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};



export const isReviewAuthor = async (req, res, next) => {
    const { reviewId, id } = req.params;
    const foundReview = await Review.findById(reviewId);

    if (!foundReview) {
        req.flash('error', 'Review not found');
        return res.redirect('/listing');
    }

    if (foundReview.author.equals(req.user._id)) {
        return next();
    } else {
        req.flash('error', 'You do not have permission to do that');
        res.redirect(`/listing/${id}`);
    }
};
