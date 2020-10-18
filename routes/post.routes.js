const express = require("express");
const { findByIdAndUpdate } = require("../models/Post.model");
const router = express.Router();
const PostModel = require("../models/Post.model");
const ReviewModel = require("../models/Review.model");

/* GET home page */
router.get("/post/create", (req, res, next) => {
  res.locals.loggedInUser = req.session.loggedInUser;
  res.render("post/postCreate");
});
//====== Create New Post ========//
router.post("/post/create", (req, res) => {
  let loggedInUser = req.session.loggedInUser;

  PostModel.create({
    user: loggedInUser,
    ...req.body,
  })
    .then((post) => {
      // console.log("New Post Created: ", post);
      res.locals.loggedInUser = req.session.loggedInUser;
      res.redirect("/home");
    })
    .catch((err) => {
      console.log(err);
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
      path: 'review', // The string we passed in before
      populate: {
        path: 'user' // This will populate the friends' addresses
      }
    })
    .populate("like")
    .then((post) => {
      console.log(post);
      if (post.user.email == res.locals.isLoggedIn.email) {
        let loggedInUser = res.locals.isLoggedIn;
        let postInfo = {
          post,
          loggedInUser,
        };
        res.locals.loggedInUser = req.session.loggedInUser;
        res.render("post/post", { postInfo });
      } else {
        let liked = false;
        post.like.forEach((like) => {
          // console.log(like);
          if (like._id == res.locals.isLoggedIn._id) {
            liked = true;
          }
        });
        let likedChecked = {
          post,
          likedChecked: liked,
        };
        res.locals.loggedInUser = req.session.loggedInUser;
        res.render("post/post", { likedChecked });
      }
    });
});

// router.get("/posts/:postId", (req, res, next) => {
//   let postId = req.params.postId;
//   PostModel.findById(postId).then((post) => {
//     console.log(post);
//     res.render("post/post", { post });
//   });
// });

//====== Like Buttons ========//
// Add Like
router.post("/posts/:postId/liked", (req, res) => {
  let postId = req.params.postId;
  res.locals.isLoggedIn = req.session.loggedInUser;

  PostModel.findByIdAndUpdate(postId, {
    $push: { like: res.locals.isLoggedIn },
  })
    .then((data) => {
      // console.log("Liked");
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
        // console.log(data);
        res.locals.loggedInUser = req.session.loggedInUser;
        res.redirect(`/posts/${postId}`);
      });
    });
});

//====== Review ========//
router.get("/posts/:postId/review", (req, res) => {
  let postId = req.params.postId;
  res.locals.isLoggedIn = req.session.loggedInUser;
  res.render("post/postReview", { postId });
});

router.post("/posts/:postId/review", (req, res) => {
  let postId = req.params.postId;
  res.locals.loggedInUser = req.session.loggedInUser;

  ReviewModel.create({
    user: res.locals.loggedInUser,
    ...req.body,
  }).then((review) => {
    // console.log(review);
    PostModel.findByIdAndUpdate(postId, { $push: { review: review } })
      // .populate('review')
      .then((post) => {
        // console.log("This is in mongoose: ", post);
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
      res.render("post/postEdit", { post });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/posts/:postId/edit", (req, res) => {
  let postId = req.params.postId;
  PostModel.findByIdAndUpdate(postId, req.body)
    .then((post) => {
      res.locals.loggedInUser = req.session.loggedInUser;
      let userId = res.locals.loggedInUser._id;
      res.redirect(`/dashboard/${userId}`);
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
      res.render("post/sortedPosts", { sortedByStatus });
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
          console.log(userId);
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
      res.render("post/sortedPosts", { sortedByStatus });
    })
    .catch((err) => {
      console.log(err);
    });
});

// Closed items
router.get("/archive", (req, res, next) => {
  res.locals.loggedInUser = req.session.loggedInUser;
  let userId = res.locals.loggedInUser._id;
  PostModel.find()
    .populate("user")
    .then((posts) => {
      let sortedByStatus = posts
        .filter((post) => {
          return post.status === "Closed";
        })
        .filter((post) => {
          console.log(userId);
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
      res.render("post/sortedPosts", { sortedByStatus });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
