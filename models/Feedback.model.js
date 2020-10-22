const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("feedback", feedbackSchema);
