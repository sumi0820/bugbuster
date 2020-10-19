const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    task: String,
    status: {
      type: String,
      default: "Open",
    },
    type: String,
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("task", taskSchema);
