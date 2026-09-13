const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    issueTitle: {
      type: String,
      required: true,
    },

    repository: {
      type: String,
      required: true,
    },

    issueUrl: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Started", "Completed"],
      default: "Started",
    },
  },
  {
    timestamps: true,
  }
);

// Enforce unique issue tracking per user at database level
progressSchema.index({ user: 1, issueUrl: 1 }, { unique: true });

module.exports = mongoose.model("Progress", progressSchema);