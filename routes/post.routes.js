const express = require("express");
const { findByIdAndUpdate } = require("../models/Post.model");
const router = express.Router();
const PostModel = require("../models/Post.model");
const ReviewModel = require("../models/Review.model");
const ProjectModel = require("../models/Project.model");
const upload = require("../config/cloudinary.config");
require("../config/cloudinary.config");
const { parser, storage } = require("../config/cloudinary.config");

/* GET home page */
router.get("/post/create", (req, res, next) => {
  res.locals.loggedInUser = req.session.loggedInUser;
  const loggedInUser = req.session.loggedInUser;
  res.render("post/postCreate", { loggedInUser });
});
//====== Create New Post ========//
router.post("/post/create", parser.single("image"), (req, res) => {
  let loggedInUser = req.session.loggedInUser;

  PostModel.create({
    user: loggedInUser,
    image: req.file ? req.file.path : "",
    ...req.body,
  })
    .then((post) => {
      res.locals.loggedInUser = req.session.loggedInUser;
      res.redirect("/home");
    })
    .catch((err) => {
      res.status(500).render("post/postCreate", {
        message: err.message,
      });
    });
});

//====== Display single post =========//
router.get("/posts/:postId", (req, res, next) => {
  let postId = req.params.postId;
  res.locals.isLoggedIn = req.session.loggedInUser;

  PostModel.findById(postId)
    .populate("user")
    .populate("review")
    .populate({
      path: "review",
      populate: {
        path: "user",
      },
    })
    .populate("like")
    .then((post) => {
      if (post.user.email == res.locals.isLoggedIn.email) {
        let loggedInUser = res.locals.isLoggedIn;
        let postInfo = {
          post,
          loggedInUser,
        };
        res.locals.loggedInUser = req.session.loggedInUser;

        res.render("post/post", { postInfo, loggedInUser });
      } else {
        let liked = false;
        post.like.forEach((like) => {
          if (like._id == res.locals.isLoggedIn._id) {
            liked = true;
          }
        });
        let likedChecked = {
          post,
          likedChecked: liked,
        };
        res.locals.loggedInUser = req.session.loggedInUser;
        const loggedInUser = req.session.loggedInUser;

        res.render("post/post", { likedChecked, loggedInUser });
      }
    });
});

//====== Like Buttons ========//
// Add Like
router.post("/posts/:postId/liked", (req, res) => {
  let postId = req.params.postId;
  res.locals.isLoggedIn = req.session.loggedInUser;

  PostModel.findByIdAndUpdate(postId, {
    $push: { like: res.locals.isLoggedIn },
  })
    .then((data) => {
      res.locals.loggedInUser = req.session.loggedInUser;
      res.redirect(`/posts/${postId}`);
    })
    .catch((err) => {
      console.log(err);
    });
});

// Unlike
router.post("/posts/:postId/unlike", (req, res) => {
  let postId = req.params.postId;
  res.locals.isLoggedIn = req.session.loggedInUser;

  PostModel.findById(postId)
    .populate("like")
    .then((post) => {
      let likeArray = post.like.filter((like) => {
        return like.email !== res.locals.isLoggedIn.email;
      });
      PostModel.findByIdAndUpdate(postId, {
        like: likeArray,
        ...req.body,
      }).then((data) => {
        res.locals.loggedInUser = req.session.loggedInUser;
        res.redirect(`/posts/${postId}`);
      });
    });
});

//====== Review ========//
router.get("/posts/:postId/review", (req, res) => {
  let postId = req.params.postId;
  res.locals.isLoggedIn = req.session.loggedInUser;
  const loggedInUser = req.session.loggedInUser;

  res.render("post/postReview", { postId, loggedInUser });
});

router.post("/posts/:postId/review", (req, res) => {
  let postId = req.params.postId;
  res.locals.loggedInUser = req.session.loggedInUser;

  ReviewModel.create({
    user: res.locals.loggedInUser,
    ...req.body,
  }).then((review) => {
   
    PostModel.findByIdAndUpdate(postId, { $push: { review: review } })

      .then((post) => {
   
        res.locals.loggedInUser = req.session.loggedInUser;
        res.redirect(`/posts/${postId}`);
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

//====== Edit Post ========//
router.get("/posts/:postId/edit", (req, res) => {
  let postId = req.params.postId;
  PostModel.findById(postId)
    .then((post) => {
      res.locals.loggedInUser = req.session.loggedInUser;
      const loggedInUser = req.session.loggedInUser;

      res.render("post/postEdit", { post, loggedInUser });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/posts/:postId/edit", parser.single("image"), (req, res) => {
  let postId = req.params.postId;
  PostModel.findById(postId).then((post) => {
    PostModel.findByIdAndUpdate(postId, {
      image: req.file ? req.file.path : post.image,
      ...req.body,
    })
      .then(() => {
        res.locals.loggedInUser = req.session.loggedInUser;
        let userId = res.locals.loggedInUser._id;
        res.redirect(`/dashboard/${userId}`);
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

//====== Delete Post ========//

router.post("/posts/:postId/delete", (req, res) => {
  let postId = req.params.postId;
  PostModel.findByIdAndDelete(postId)
    .then(() => {
      res.locals.loggedInUser = req.session.loggedInUser;
      res.redirect("/home");
    })
    .catch((err) => {
      console.log(err);
    });
});

//====== Sorted Post ========//

// All posts
router.get("/allPosts", (req, res, next) => {
  res.locals.loggedInUser = req.session.loggedInUser;
  let userId = res.locals.loggedInUser._id;
  PostModel.find()
    .populate("user")
    .then((allPosts) => {
      let sortedByStatus = allPosts.sort((a, b) => {
        if (a.createdAt < b.createdAt) {
          return 1;
        } else if (a.createdAt > b.createdAt) {
          return -1;
        } else {
          return 0;
        }
      });
      const loggedInUser = req.session.loggedInUser;

      res.render("post/sortedPosts", { sortedByStatus, loggedInUser });
    })
    .catch((err) => {
      console.log(err);
    });
});

// Open items
router.get("/openIssues", (req, res, next) => {
  res.locals.loggedInUser = req.session.loggedInUser;
  let userId = res.locals.loggedInUser._id;
  PostModel.find()
    .populate("user")
    .then((posts) => {
      let sortedByStatus = posts
        .filter((post) => {
          return (
            post.status === "Pending Reply" ||
            post.status === "Open" ||
            post.status === "Reopen"
          );
        })
        .filter((post) => {
          return post.user._id == userId;
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

      res.render("post/sortedPosts", { sortedByStatus, loggedInUser });
    })
    .catch((err) => {
      console.log(err);
    });
});

// Closed items w/closed project
router.get("/archive", (req, res, next) => {
  res.locals.loggedInUser = req.session.loggedInUser;
  let userId = res.locals.loggedInUser._id;

  PostModel.find()
    .populate("user")
    .then((posts) => {
      const sortedByStatus = posts
        .filter((post) => {
          return post.status === "Closed" && post.user._id == userId;
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

      ProjectModel.find()
        .populate("user")
        .then((projects) => {
          const projectSortedByStatus = projects
            .filter((project) => {
              return project.status === "Closed" && project.user._id == userId;
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
          res.render("post/sortedPosts", {
            sortedByStatus,
            projectSortedByStatus,
            loggedInUser,
          });
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
