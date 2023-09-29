const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/User');

// Register a new user => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email and password', 400));
    }

    // Check if user exists
    const duplicate = await User.findOne({ email });
    if (duplicate) {
        return next(new ErrorHandler('User already exists', 400));
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        email,
        password: hashedPassword,
    });

    // Create token
    // const token = user.getSignedJwtToken();

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
    });
});

// Login user => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email and password', 400));
    }

    // Check if user exists
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
        return next(new ErrorHandler('Invalid credentials', 401));
    }
    // Check if password matches
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
        return next(new ErrorHandler('Invalid credentials', 401));
    } else {
        // Create JWTs
        const payload = {
            email: foundUser.email,
        };

        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
        });

        // Save refreshToken in DB
        foundUser.refreshToken = refreshToken;
        await foundUser.save();

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 days
        });
        res.json({
            success: true,
            accessToken,
        });
    }
});

// Logout user => /api/v1/logout
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {

   const refreshToken = req.cookies.jwt;
    if (!refreshToken) {
        return next(new ErrorHandler('Please login to continue', 401));
    }

    // Delete refreshToken from DB
    const foundUser = await User.findOne({ refreshToken });
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true });
        return next(new ErrorHandler('Please login to continue', 401));
    }
    foundUser.refreshToken = '';
    await foundUser.save();

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
    res.status(200).json({
        success: true,
        message: 'User logged out successfully',
    });
});
