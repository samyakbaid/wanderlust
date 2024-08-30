import express from 'express';
import wrapAsync from '../utils/wrapAsync.js';
import { createReview, deleteReview } from '../controllers/review.js';
import { validateReview, isLoggedIn, isReviewAuthor } from '../middleware.js';

const router = express.Router({ mergeParams: true });

router.post('/', isLoggedIn, validateReview, wrapAsync(createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(deleteReview));

export default router;
