const express = require("express");
const router = express.Router();
const PostModel = require("../models/Post.model");

/* GET home page */
router.get("/home", (req, res, next) => {
  res.locals.loggedInUser = req.session.loggedInUser;

  PostModel.find()
    .populate("user")
    .then((allPosts) => {
      let posts = allPosts
        .filter((post) => {
          return post.status !== "Closed";
        })
        .sort((a, b) => {
          if (a.createdAt < b.createdAt) {
            return 1;
          } else if (a.createdAt > b.createdAt) {
            return -1;
          } else {
            return 0;
          }
        });
      res.render("home", { posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
