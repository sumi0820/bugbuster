const express = require("express");
const router = express.Router();
const UserModel = require("../models/User.model");
const PostModel = require("../models/Post.model");

const { parser, storage } = require("../config/cloudinary.config");
const ProjectModel = require("../models/Project.model");

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
                console.log(project.user);

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
  console.log(req.file); // to see what is returned to you

  const image = {};
  image.url = req.file.url;
  image.id = req.file.public_id;
  Image.create(image)
    .then((newImage) => {
      console.log("image uploaded:", newImage);
      res.json(newImage);

      UserModel.findByIdAndUpdate(userId, {
        image: newImage.url,
        ...req.body,
      })
        .then((data) => {
          console.log(data);

          res.locals.loggedInUser = req.session.loggedInUser;
          let userId = res.locals.loggedInUser._id;
          res.redirect(`/dashboard/${userId}`);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => console.log(err));
});

module.exports = router;
