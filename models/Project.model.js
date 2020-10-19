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
    // mvp: [
    //   {
    //   item:String,
    //   status: {
    //     type: String,
    //     default: "Open"
    //   }
    // }],
    task: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "task",
      },
    ],
    // backlog: [{
    //   item:String,
    //   status: {
    //     type: String,
    //     default: "Open"
    //   }
    // }],
    // route: [{
    //   item:String,
    //   status: {
    //     type: String,
    //     default: "Open"
    //   }
    // }],
    // model: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "backlog",
    //   },
    // ],
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
