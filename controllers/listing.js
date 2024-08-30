
// controllers/listing.js
import Listing from '../models/listing.js';
import Review from '../models/review.js';
import ExpressError from '../utils/ExpressError.js';
import multer from 'multer';
import { storage } from '../utils/cloudinary.js'; // Import Cloudinary storage
const upload = multer({ storage });

export const getAllListings = async (req, res) => {
    const allListings = await Listing.find();
    res.render('./listings/index.ejs', { allListings });
};

export const renderNewForm = (req, res) => {
    res.render('./listings/new.ejs');
};

export const createListing = async (req, res) => {
    
        try {
            
                console.log('Form Data:', req.body); // Log the submitted form data
                // ... rest of the code
            
            
            console.log('Inside POST /listing route'); // Check if the route is hit
            const { title, description, price, location, country } = req.body.listing;
    const newListing = new Listing({
        title,
        description,
        price,
        location,
        country,
        image: { url: req.file.path, filename: req.file.filename }, // Save image details
    });
            newListing.author = req.user._id;
            await newListing.save();
            console.log('Listing saved:', newListing); // Check if the listing is saved
    
            req.flash("success", "Successfully created a new listing!");
            res.redirect(`/listing/${newListing._id}`);
        } catch (e) {
            console.error('Error creating listing:', e); // Log error details
            throw new ExpressError(500, 'Unable to create listing');
        }
    ;
    
};
export const getListing = async (req, res) => {
    const { id } = req.params;
    const listingInfo = await Listing.findById(id).populate('author').populate({
        path: 'reviews',
        populate: {
            path: 'author' // populate authors of reviews as well
        }
    });

    if (!listingInfo) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listing');
    }
    res.render('./listings/show.ejs', { listing: listingInfo });
};








export const renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listingInfo = await Listing.findById(id);
    if (!listingInfo) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listing');
    }
    res.render('./listings/edit.ejs', { listing: listingInfo, url: listingInfo.image.url });
};

export const updateListing = async (req, res) => {
    const { id } = req.params;
    const { listing } = req.body;

    try {
        const foundListing = await Listing.findById(id);

        if (req.file) {
            // If a new image is uploaded, delete the old one from Cloudinary
            if (foundListing.image && foundListing.image.filename) {
                await cloudinary.uploader.destroy(foundListing.image.filename);
            }
            // Update listing with new image
            foundListing.image = { url: req.file.path, filename: req.file.filename };
        }

        // Update other fields
        foundListing.title = listing.title;
        foundListing.description = listing.description;
        foundListing.price = listing.price;
        foundListing.country = listing.country;
        foundListing.location = listing.location;

        await foundListing.save();

        req.flash('success', 'Listing updated successfully!');
        res.redirect(`/listing/${id}`);
    } catch (e) {
        req.flash('error', 'Something went wrong during the update.');
        res.redirect(`/listing/${id}/edit`);
    }
};

export const deleteListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
        await listing.deleteOne();
        req.flash('success', 'Listing deleted');
        res.redirect('/listing');
    } else {
        req.flash('error', 'Listing not found');
        res.redirect('/listing');
    }
};
