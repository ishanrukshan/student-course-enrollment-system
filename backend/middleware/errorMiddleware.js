// Global error handler middleware
const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message || "Internal Server Error";

    // Mongoose bad ObjectId (CastError)
    if (err.name === "CastError" && err.kind === "ObjectId") {
        statusCode = 404;
        message = "Resource not found";
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue).join(", ");
        message = `Duplicate value for: ${field}`;
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((e) => e.message)
            .join(", ");
    }

    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
};

// 404 handler for undefined routes
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

module.exports = { errorHandler, notFound };
