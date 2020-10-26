const express = require("express");
const router = express.Router();
const UserModel = require("../models/User.model");
const PostModel = require("../models/Post.model");
const ProjectModel = require("../models/Project.model");

require("../config/cloudinary.config");
const { parser } = require("../config/cloudinary.config");

router.get("/dashboard/:userId", (req, res, next) => {
  let userId = req.params.userId;
  res.locals.loggedInUser = req.session.loggedInUser;

  UserModel.findById(userId).then((user) => {
    PostModel.find()
      .populate("user")
      .then((posts) => {
        let yourPosts = posts
          .filter((post) => post.user.email == user.email)
          .splice(0, 5)
          .sort((a, b) => b.createdAt - a.createdAt);

        ProjectModel.find()
          .populate("user")
          .then((projects) => {
            let yourProjects = projects
              .filter((project) => project.user.email == user.email)
              .splice(0, 5)
              .sort((a, b) => b.createdAt - a.createdAt);

            let profile = { user, yourPosts, yourProjects };
            res.render("user/dashboard", { profile });
          });
      });
  });
});

router.get("/dashboard/:userId/edit", (req, res) => {
  let userId = req.params.userId;
  res.locals.loggedInUser = req.session.loggedInUser;
  UserModel.findById(userId).then((user) => {
    res.render("user/userEdit", { user });
  });
});

router.post("/dashboard/:userId/edit", parser.single("image"), (req, res) => {
  let userId = req.params.userId;
  res.locals.loggedInUser = req.session.loggedInUser;
  const user = req.session.loggedInUser;
  UserModel.findByIdAndUpdate(userId, {
    image: req.file ? req.file.path : user.image,
    ...req.body,
  })
    .then((data) => {
      res.redirect(`/dashboard/${user._id}`);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
