const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/User');

exports.refreshToken = catchAsyncErrors(async (req, res, next) => {
    // get refresh token from cookie
    const refreshToken = req.cookies.jwt;
    if (!refreshToken) {
        return next(new ErrorHandler('Please login to continue', 401));
    }

    const foundUser = await User.findOne({ refreshToken });

    if (!foundUser) {
        return next(new ErrorHandler('Please login to continue', 401));
    }

    // Verify refresh token
    jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET,
        (err, decoded) => {
            if (err || foundUser.email !== decoded.email) return next(new ErrorHandler('Please login to continue', 401));
            // Create JWTs
            const payload = {
                email: foundUser.email,
            };

            const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN,
            });

            res.status(200).json({
                success: true,
                accessToken,
            });
        }
    );    
});
