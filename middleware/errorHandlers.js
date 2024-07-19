// middleware/errorHandlers.js
const constant = require("../constants");

const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || res.statusCode || 500;

  switch (statusCode) {
    case constant.VALIDATION_ERROR:
      res.status(statusCode).json({
        title: "Validation failed",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    case constant.UNAUTHORIZED:
      res.status(statusCode).json({
        title: "Authentication failed",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    case constant.FORBIDDEN:
      res.status(statusCode).json({
        title: "Forbidden",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    case constant.NOT_FOUND:
      res.status(statusCode).json({
        title: "Not Found",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    case constant.SERVER_ERROR:
      res.status(statusCode).json({
        title: "Internal Server Error",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    default:
      res.status(statusCode).json({
        title: "An Error Occurred",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
  }
};

module.exports = errorHandler;
