const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      text: true,
    },
    description: {
      type: String,
      required: true,
      text: true,
    },
    image: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    issueType: {
      type: String,
      required: true,
      text: true,
    },
    category: {
      type: String,
      required: true,
      text: true,
    },
    status: {
      type: String,
      default: "Open",
    },
    review: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "review",
      },
    ],
    like: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("post", postSchema);
