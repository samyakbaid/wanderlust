import express from 'express';
import wrapAsync from '../utils/wrapAsync.js';
import { listingSchema } from '../schema.js';
import ExpressError from '../utils/ExpressError.js';
import {
    getAllListings,
    renderNewForm,
    getListing,
    createListing,
    renderEditForm,
    updateListing,
    deleteListing
} from '../controllers/listing.js';
import { isLoggedIn, isAuthor } from '../middleware.js';

import multer from 'multer';
import { storage } from '../utils/cloudinary.js';

const router = express.Router({ mergeParams: true });
const upload = multer({ storage });
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Routes using controller methods
router.get('/', wrapAsync(getAllListings));

router.get('/new', isLoggedIn, renderNewForm);

router.get('/:id', wrapAsync(getListing));

router.post('/', isLoggedIn, upload.single('image'), validateListing, wrapAsync(createListing));

router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, validateListing,upload.single('image'), wrapAsync(updateListing));


router.delete('/:id', isLoggedIn, isAuthor, wrapAsync(deleteListing));

export default router;
