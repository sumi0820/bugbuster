const express = require("express");
const router = express.Router();
const PostModel = require("../models/Post.model");

/* GET home page */
router.get("/home", (req, res, next) => {
  res.locals.isLoggedIn = req.session.loggedUser;
  PostModel.find()
    .populate("user")
    .then((allPosts) => {
      let posts = allPosts
        .filter((post) => post.status !== "Closed")
        .sort((a, b) => b.createdAt - a.createdAt);

      const loggedInUser = req.session.loggedInUser;

      res.render("home", { posts, loggedInUser });
    })
    .catch((err) => {
      console.log(err);
    });
});

//====== Sorted Post ========//
router.get("/search", (req, res) => {
  res.locals.isLoggedIn = !!req.session.loggedUser;

  const userInput = req.query.search.toLowerCase();

  PostModel.find()
    .then((posts) => {
      const postResult = posts.filter((post) =>
        post.description.toLowerCase().includes(userInput)
      );
      res.render("searchResult", { postResult });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
