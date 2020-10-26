const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      text: true,
    },
    description: {
      type: String,
      text: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    github: { type: String, default: "https://github.com/" },
    status: {
      type: String,
      default: "Open",
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("project", projectSchema);
