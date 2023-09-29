const { logEvents } = require('./logEvents');
const ErrorHandler = require('../utils/errorHandler');

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Wrong Mongoose Object ID Error
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // Handling Mongoose Validation Error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map(val => val.message).join(",");
        err = new ErrorHandler(message, 400);
    }

    // Handling Mongoose Duplicate Key Error
    if (err.code === 11000 && err.name === "MongoError") {
        const message = "Duplicate field value entered";
        err = new ErrorHandler(message, 400);
    }

    // Handling wrong JWT error
    if (err.name === "JsonWebTokenError") {
        const message = "Invalid token. Please log in again";
        err = new ErrorHandler(message, 401);
    }

    // Handling Expired JWT error
    if (err.name === "TokenExpiredError") {
        const message = "Token expired. Please log in again";
        err = new ErrorHandler(message, 401);
    }

    logEvents(`${err.name}: ${err.message}`, 'errLog.txt');

    console.error(err.message);  

    res.status(err.statusCode).json({
        success: false,
        error: err.message
    });
}

module.exports = errorHandler;