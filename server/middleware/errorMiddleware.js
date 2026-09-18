const mongoose = require("mongoose");

const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  // Invalid MongoDB ObjectId
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      message: "Invalid ID format",
    });
  }

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      message: "Invalid data provided",
    });
  }

  // Duplicate MongoDB key
  if (err.code === 11000) {
    return res.status(400).json({
      message: "Duplicate value already exists",
    });
  }

  res.status(500).json({
    message: "Server error",
  });
};

module.exports = errorMiddleware;