const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    interests: {
  type: [String],
  default: [],
},

    teamSize: {
      type: Number,
      required: true,
    },

    duration: {
      type: String,
      default: "",
    },
experience: {
  type: String,
  enum: [
    "Beginner",
    "Intermediate",
    "Advanced",
  ],
  default: "Beginner",
},

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);
