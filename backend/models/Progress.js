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

module.exports = mongoose.model("Progress", progressSchema);