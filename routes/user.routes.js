const express = require("express");
const router = express.Router();
const UserModel = require("../models/User.model");
const PostModel = require("../models/Post.model");
const ProjectModel = require("../models/Project.model");

const upload = require("../config/cloudinary.config");
require("../config/cloudinary.config");
const { parser, storage } = require("../config/cloudinary.config");

router.get("/dashboard/:userId", (req, res, next) => {
  let userId = req.params.userId;
  res.locals.loggedInUser = req.session.loggedInUser;

  UserModel.findById(userId).then((user) => {
    PostModel.find()
      .populate("user")
      .then((posts) => {
        let yourPosts = posts
          .filter((post) => {
            return post.user.email == user.email;
          })
          .splice(0, 5)
          .sort((a, b) => {
            if (a.createdAt < b.createdAt) {
              return 1;
            } else if (a.createdAt > b.createdAt) {
              return -1;
            } else {
              return 0;
            }
          });
        ProjectModel.find()
          .populate("user")
          .then((projects) => {
            let yourProjects = projects
              .filter((project) => {
                return project.user.email == user.email;
              })
              .splice(0, 5)
              .sort((a, b) => {
                if (a.createdAt < b.createdAt) {
                  return 1;
                } else if (a.createdAt > b.createdAt) {
                  return -1;
                } else {
                  return 0;
                }
              });
            let profile = { user, yourPosts, yourProjects };
            console.log(projects);
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
  console.log(req.file);
  
  UserModel.findByIdAndUpdate(userId, {
    image: req.file.path,
    ...req.body,
  })
    .then((data) => {
      // console.log(data);

      res.locals.loggedInUser = req.session.loggedInUser;
      let userId = res.locals.loggedInUser._id;
      res.redirect(`/dashboard/${userId}`);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
