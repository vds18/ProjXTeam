const mongoose = require("mongoose");

const validateObjectId = (req, res, next) => {
  const { id, projectId } = req.params;

  const value = id || projectId;

  if (
    value &&
    !mongoose.Types.ObjectId.isValid(value)
  ) {
    return res.status(400).json({
      message: "Invalid ID format",
    });
  }

  next();
};

module.exports = validateObjectId;