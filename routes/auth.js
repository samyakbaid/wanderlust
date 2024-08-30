import express from 'express';
import passport from 'passport';
import wrapAsync from '../utils/wrapAsync.js';
import { renderRegisterForm, registerUser, renderLoginForm, loginUser, logoutUser } from '../controllers/auth.js';

const router = express.Router();

// Registration Routes
router.get('/register', renderRegisterForm);
router.post('/register', wrapAsync(registerUser));

// Login Routes
router.get('/login', renderLoginForm);
router.post('/login', passport.authenticate('local', {
    failureFlash: true, // Flash message on failure
    failureRedirect: '/auth/login' // Redirect back to login page if failed
}), loginUser);

// Logout Route
router.get('/logout', logoutUser);

export default router;
