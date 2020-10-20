const express = require("express");
const { findByIdAndUpdate } = require("../models/Post.model");
const router = express.Router();
const PostModel = require("../models/Post.model");
const ProjectModel = require("../models/Project.model");
const TaskModel = require("../models/Task.model");

/* GET home page */
router.get("/project/create", (req, res, next) => {
  res.locals.loggedInUser = req.session.loggedInUser;
  res.render("project/projectCreateBase");
});

//====== Create New Project ========//

// 1. Create Base Info
router.post("/project/create", (req, res) => {
  let loggedInUser = req.session.loggedInUser;
  let userId = req.session.loggedInUser._id;
  console.log(req.body);

  ProjectModel.create({
    user: loggedInUser,
    ...req.body,
  })
    .then((project) => {
      res.locals.loggedInUser = req.session.loggedInUser;
      res.redirect(`/project/${project._id}`);
    })
    .catch((err) => {
      console.log(err);
    });
});

// 2. Create Task
router.get("/create/:projectId/task", (req, res) => {
  let projectId = req.params.projectId;
  ProjectModel.findById(projectId).then((project) => {
    res.locals.loggedInUser = req.session.loggedInUser;
    res.render("project/projectCreateTask", { project });
  });
});

router.post("/project/create/:projectId/task", (req, res) => {
  let loggedInUser = req.session.loggedInUser;
  let userId = req.session.loggedInUser._id;
  let projectId = req.params.projectId;

  TaskModel.create({
    project: projectId,
    ...req.body,
  }).then((result) => {
    TaskModel.find({ project: projectId }).then((tasks) => {
      console.log(tasks);
      ProjectModel.findById(projectId).then((project) => {
        console.log("project updated", project);
        res.locals.loggedInUser = req.session.loggedInUser;
        res.redirect(`/project/${projectId}`);
      });
    });
  });
});

//====== Display single project =========//
router.get("/project/:projectId", (req, res, next) => {
  let projectId = req.params.projectId;
  res.locals.isLoggedIn = req.session.loggedInUser;

  ProjectModel.findById(projectId)
    .populate("user")
    .then((project) => {
      TaskModel.find({ project: projectId }).then((tasks) => {
        console.log("Project: ", project, "Tasks: ", tasks);
        res.locals.loggedInUser = req.session.loggedInUser;
        res.render("project/project", { project, tasks });
      });
      // }
    });
});

//====== Edit Project ========//

router.get("/project/:taskId/editTask", (req, res) => {
  let taskId = req.params.taskId;
  console.log(taskId);
  TaskModel.findById(taskId)
    .then((task) => {
      res.locals.loggedInUser = req.session.loggedInUser;
      res.render("project/projectEditTask", { task });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/project/:taskId/editTask", (req, res) => {
  let taskId = req.params.taskId;
  console.log(req.body);
  TaskModel.findById(taskId)
    .populate("project")
    .then((task) => {
      console.log(task);
      res.locals.loggedInUser = req.session.loggedInUser;
      // res.redirect(`/project/${task.project._id}`);
      res.render("project/projectEditTask", task.project);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/project/:taskId/deleteTask", (req, res) => {
  let taskId = req.params.taskId;
  TaskModel.findByIdAndDelete(taskId)
    .then((task) => {
      console.log("deleted");
      res.locals.loggedInUser = req.session.loggedInUser;
      res.redirect(`/project/${task.project._id}`);
    })
    .catch((err) => {
      console.log(err);
    });
});

// //====== Review ========//
// router.get("/projects/:postId/review", (req, res) => {
//   let postId = req.params.postId;
//   res.locals.isLoggedIn = req.session.loggedInUser;
//   res.render("post/postReview", { postId });
// });

// router.post("/posts/:postId/review", (req, res) => {
//   let postId = req.params.postId;
//   res.locals.loggedInUser = req.session.loggedInUser;

//   ReviewModel.create({
//     user: res.locals.loggedInUser,
//     ...req.body,
//   }).then((review) => {
//     // console.log(review);
//     PostModel.findByIdAndUpdate(postId, { $push: { review: review } })
//       // .populate('review')
//       .then((post) => {
//         // console.log("This is in mongoose: ", post);
//         res.locals.loggedInUser = req.session.loggedInUser;
//         res.redirect(`/posts/${postId}`);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   });
// });

// //====== Sorted Post ========//

// // All posts
// router.get("/allPosts", (req, res, next) => {
//   res.locals.loggedInUser = req.session.loggedInUser;
//   let userId = res.locals.loggedInUser._id;
//   PostModel.find()
//     .populate("user")
//     .then((allPosts) => {
//       let sortedByStatus = allPosts.sort((a, b) => {
//         if (a.createdAt < b.createdAt) {
//           return 1;
//         } else if (a.createdAt > b.createdAt) {
//           return -1;
//         } else {
//           return 0;
//         }
//       });
//       res.render("post/sortedPosts", { sortedByStatus });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// // Open items
// router.get("/openIssues", (req, res, next) => {
//   res.locals.loggedInUser = req.session.loggedInUser;
//   let userId = res.locals.loggedInUser._id;
//   PostModel.find()
//     .populate("user")
//     .then((posts) => {
//       let sortedByStatus = posts
//         .filter((post) => {
//           return (
//             post.status === "Pending Reply" ||
//             post.status === "Open" ||
//             post.status === "Reopen"
//           );
//         })
//         .filter((post) => {
//           console.log(userId);
//           return post.user._id == userId;
//         })
//         .sort((a, b) => {
//           if (a.createdAt < b.createdAt) {
//             return 1;
//           } else if (a.createdAt > b.createdAt) {
//             return -1;
//           } else {
//             return 0;
//           }
//         });
//       res.render("post/sortedPosts", { sortedByStatus });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// // Closed items
// router.get("/archive", (req, res, next) => {
//   res.locals.loggedInUser = req.session.loggedInUser;
//   let userId = res.locals.loggedInUser._id;
//   PostModel.find()
//     .populate("user")
//     .then((posts) => {
//       let sortedByStatus = posts
//         .filter((post) => {
//           return post.status === "Closed";
//         })
//         .filter((post) => {
//           console.log(userId);
//           return post.user._id == userId;
//         })
//         .sort((a, b) => {
//           if (a.createdAt < b.createdAt) {
//             return 1;
//           } else if (a.createdAt > b.createdAt) {
//             return -1;
//           } else {
//             return 0;
//           }
//         });
//       res.render("post/sortedPosts", { sortedByStatus });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

module.exports = router;
