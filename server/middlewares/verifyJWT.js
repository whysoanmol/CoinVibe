const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = catchAsyncErrors(async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return next(new ErrorHandler('Not authorized to access this route', 401));
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.email = decoded.email;
    next();
})

module.exports = verifyJWT;

// (req, res, next) => {
//     const authHeader = req.headers.authorization || req.headers.Authorization;
//     if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
//     const token = authHeader.split(' ')[1];
//     jwt.verify(
//         token,
//         process.env.JWT_SECRET,
//         (err, decoded) => {
//             if (err) return res.sendStatus(403); //invalid token
//             req.email = decoded.email;
//             next();
//         }
//     );
// }