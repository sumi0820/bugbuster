const express = require("express");
const router = express.Router();
const PostModel = require("../models/Post.model");

/* GET home page */
router.get("/home", (req, res, next) => {
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
      res.locals.loggedInUser = req.session.loggedInUser;
      const loggedInUser = req.session.loggedInUser;

      res.render("home", { posts, loggedInUser });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
