const AppError = require("./../utils/appError");
const lodash = require("lodash");

//Cast error
const handleCastErrorDB = (err) => {
  const path = err.path || "field";
  const value = err.value || "invalid value";
  const message = `Invalid ${path}: ${value}`;
  return new AppError(message, 400);
};

//Duplicate Error
const handleDuplicateErrorDB = (err) => {
  const regex = / "([^"]+)" /;
  const value = err.errmsg.match(regex);
  const message = `Tour value: '${value[1]}' already exist, Kindly try to create a tour with unique name `;
  return new AppError(message, 409);
};

//validation error
const handleValidationErrorDB = (error) => {
  const messages = Object.values(error.errors)
    .map(
      (el) =>
        `${el.path.charAt(0).toUpperCase() + el.path.slice(1)}:${el.message}`
    )
    .join(". ");
  const paths = Object.values(error.errors)
    .map((el) => `${el.path.charAt(0).toUpperCase() + el.path.slice(1)}`)
    .join(", ");
  const message = `Validation Failed Tour must have: ${paths}. ${messages}`;
  return new AppError(message, 400);
};

// Development Error Handler
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
//Development ka JWT verify ka error
const handleJsonWebTokenError = (err) =>
  new AppError("Invalid Signature Error, Kindly login again", 401);
const handleTokenExpiredError = (err) =>
  new AppError("Token Expired kindly log in again", 401);
// Production Error Handler
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

// Global Error Handler
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    // let error = { ...err, message: err.message, name: err.name }; ethier this or below one to clone error below one is the perfect approch

    let error = Object.create(Object.getPrototypeOf(err));
    Object.getOwnPropertyNames(err).forEach((key) => {
      error[key] = err[key];
    });

    if (error.name === "CastError") {
      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) {
      error = handleDuplicateErrorDB(error);
    }
    if (error.name === "ValidationError") {
      error = handleValidationErrorDB(error);
    }
    if (error.name === "JsonWebTokenError") {
      error = handleJsonWebTokenError(error);
    }
    if (error.name === "TokenExpiredError") {
      error = handleTokenExpiredError(error);
    }

    sendErrorProd(error, res);
  }
};
