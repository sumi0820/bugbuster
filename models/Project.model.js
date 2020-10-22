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

    // task: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "task",
    //   },
    // ],
    github: { type: String, default: "https://github.com/" },
    // feedback:{
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "feedback",
    //   },
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
