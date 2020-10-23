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
      const postResult = posts.filter((post) => {
        return post.description.toLowerCase().includes(userInput);
      });
      res.render("searchResult", { postResult });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
