import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import engine from 'ejs-mate';
import session from 'express-session';
import MongoStore from 'connect-mongo'
import flash from 'connect-flash';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from './models/user.js'; 
import listingsRoutes from './routes/listing.js';
import reviewRoutes from './routes/review.js';
import authRoutes from './routes/auth.js';
import multer from 'multer';
import { storage } from './utils/cloudinary.js';
const upload = multer({ storage });


global.__dirname = path.resolve();
const port = 3000;
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
const dbUrl = process.env.DB_URL ;

const store=MongoStore.create(
{mongoUrl : dbUrl,
crypto :{
    secret:process.env.SESSION_SECRET
},
touchAfter: 24*3600,
})

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STROE", err)
})
// Session setup
const sessionOptions = {
    store,
    secret: process.env.SESSION_SECRET || 'fallbackSecret',  // Use an environment variable for the secret
    resave: false,
    saveUninitialized: true,
    
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions)); // Session must come first

// Flash setup
app.use(flash()); // Flash middleware after session

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global flash message middleware
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname, 'public')));

// Mongoose setup


async function main() {
    await mongoose.connect(dbUrl);
}

main().then(() => console.log('DB Connected')).catch(err => console.log(err));



app.use((req, res, next) => {
    if (!req.user && req.originalUrl !== '/auth/login' && !req.originalUrl.startsWith('/auth/')) {
        req.session.returnTo = req.originalUrl;
    }
    next();
});
// Routes
app.use('/listing/:id/reviews', reviewRoutes);
app.use('/listing', listingsRoutes);
app.use('/auth', authRoutes);

// Test flash message routes
app.get('/test-success', (req, res) => {
    req.flash('success', 'This is a success message');
    res.redirect('/');
});

app.get('/test-error', (req, res) => {
    req.flash('error', 'This is an error message');
    res.redirect('/');
});

// Error handler
// Error handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    console.error('Error:', err.stack || err); // Log the full error and stack trace
    res.status(statusCode).render('error.ejs', { message, statusCode });
});


// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
