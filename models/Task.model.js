const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  item: String,
  status: {
    type: String,
    default: "Open",
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "project",
  },
});

module.exports = mongoose.model("task", taskSchema);
