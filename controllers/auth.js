import User from '../models/user.js';
import passport from 'passport';

export const renderRegisterForm = (req, res) => {
    res.render('auth/register');
};

export const registerUser = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;

        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('error', 'Email is already registered. Please use another email or log in.');
            return res.redirect('/auth/register');
        }

        // Register the user
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        
        // Automatically log the user in after successful registration
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Wanderlust!');
            res.redirect('/listing');
        });
    } catch (e) {
        if (e.name === 'UserExistsError') {
            req.flash('error', 'Username is already taken. Please choose another one.');
        } else {
            req.flash('error', e.message);
        }
        res.redirect('/auth/register');
    }
};

export const renderLoginForm = (req, res) => {
    res.render('auth/login');
};

export const loginUser = (req, res) => {
    req.flash('success', 'Welcome back!');
    
    // Redirect user to where they came from or default to /listing
    const redirectUrl = req.session.returnTo || '/listing';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

export const logoutUser = (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        req.flash('success', 'Logged out successfully');
        res.redirect('/listing');
    });
};
