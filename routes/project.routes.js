const express = require("express");
const { findByIdAndUpdate } = require("../models/Post.model");
const router = express.Router();
const PostModel = require("../models/Post.model");
const ProjectModel = require("../models/Project.model");

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
      res.redirect(`/project/create/${project._id}/mvp`);
    })
    .catch((err) => {
      console.log(err);
    });
});

// 2. Create MVP

router.get("/project/create/:projectId/mvp", (req, res) => {
  let projectId = req.params.projectId;
  ProjectModel.findById(projectId).then((project) => {
    res.locals.loggedInUser = req.session.loggedInUser;
    res.render("project/projectCreateMvp", { project });
  });
});

router.post("/project/create/:projectId/mvp", (req, res) => {
  let loggedInUser = req.session.loggedInUser;
  let userId = req.session.loggedInUser._id;
  let projectId = req.params.projectId;
  console.log(req.body.mvp);

  let mvp = req.body.mvp;

  mvp.forEach((inputItem) => {
    ProjectModel.findByIdAndUpdate(projectId, {
      $push: {
        mvp: {
          item: inputItem,
          status: "Open",
        },
      },
    })
      .then((project) => {
        console.log(project);
      })
      .catch((err) => {
        console.log(err);
      });
  });
  res.locals.loggedInUser = req.session.loggedInUser;
  res.redirect(`/project/create/${projectId}/backlog`);
});

// 3. Create Backlog
router.get("/project/create/:projectId/backlog", (req, res) => {
  let projectId = req.params.projectId;
  ProjectModel.findById(projectId).then((project) => {
    res.locals.loggedInUser = req.session.loggedInUser;
    res.render("project/projectCreateBacklog", { project });
  });
});

router.post("/project/create/:projectId/backlog", (req, res) => {
  let loggedInUser = req.session.loggedInUser;
  let userId = req.session.loggedInUser._id;
  let projectId = req.params.projectId;
  console.log(req.body.backlog);

  let backlog = req.body.backlog;

  backlog.forEach((inputItem) => {
    ProjectModel.findByIdAndUpdate(projectId, {
      $push: {
        backlog: {
          item: inputItem,
          status: "Open",
        },
      },
    })
      .then((project) => {
        console.log(project);
      })
      .catch((err) => {
        console.log(err);
      });
  });
  res.locals.loggedInUser = req.session.loggedInUser;
  res.redirect(`/project/create/${projectId}/task`);
});

// 4. Create Task
router.get("/project/create/:projectId/task", (req, res) => {
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
  console.log(req.body.task);

  let task = req.body.task;

  task.forEach((inputItem) => {
    ProjectModel.findByIdAndUpdate(projectId, {
      $push: {
        task: {
          item: inputItem,
          status: "Open",
        },
      },
    })
      .then((project) => {
        console.log(project);
      })
      .catch((err) => {
        console.log(err);
      });
  });
  res.locals.loggedInUser = req.session.loggedInUser;
  res.redirect(`/project/create/${projectId}/route`);
});

// 5. Create Route
router.get("/project/create/:projectId/route", (req, res) => {
  let projectId = req.params.projectId;
  ProjectModel.findById(projectId).then((project) => {
    res.locals.loggedInUser = req.session.loggedInUser;
    res.render("project/projectCreateRoute", { project });
  });
});

router.post("/project/create/:projectId/route", (req, res) => {
  let loggedInUser = req.session.loggedInUser;
  let userId = req.session.loggedInUser._id;
  let projectId = req.params.projectId;
  console.log(req.body.route);

  let route = req.body.route;

  route.forEach((inputItem) => {
    ProjectModel.findByIdAndUpdate(projectId, {
      $push: {
        route: {
          item: inputItem,
          status: "Open",
        },
      },
    })
      .then((project) => {
        console.log(project);
      })
      .catch((err) => {
        console.log(err);
      });
  });
  res.locals.loggedInUser = req.session.loggedInUser;
  res.redirect(`/dashboard/${userId}`);
});

//====== Display single project =========//
router.get("/projects/:projectId", (req, res, next) => {
  let projectId = req.params.projectId;
  res.locals.isLoggedIn = req.session.loggedInUser;

  ProjectModel.findById(projectId)
    .populate("user")
    .then((project) => {
      let mvpCleanUp = project.mvp.filter((mvp) => {
        return mvp.item !== "";
      });
      let backlogCleanUp = project.backlog.filter((backlog) => {
        return backlog.item !== "";
      });
      let taskCleanUp = project.task.filter((task) => {
        return task.item !== "";
      });
      let routeCleanUp = project.route.filter((route) => {
        return route.item !== "";
      });

      let projectCleanUp = {
        mvp: mvpCleanUp,
        backlog: backlogCleanUp,
        task: taskCleanUp,
        route: routeCleanUp,
        title: project.title,
        status:project.status,
        description:project.description,
        createdAt:project.createdAt,
        updatedAt:project.updatedAt,
        user:project.user,
        _id: project._id
      };

      console.log(projectCleanUp);
      res.locals.loggedInUser = req.session.loggedInUser;
      res.render("project/project", { projectCleanUp });
      // }
    });
});



//====== Edit Project ========//
router.get("/project/:projectId/edit", (req, res) => {
  let projectId = req.params.projectId;
  ProjectModel.findById(projectId)
    .then((project) => {
      res.locals.loggedInUser = req.session.loggedInUser;
      res.render("project/projectEdit", { project });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/project/:projectId/edit", (req, res) => {
  let projectId = req.params.projectId;
  ProjectModel.findByIdAndUpdate(projectId, req.body)
    .then((project) => {
      console.log(project);
      res.locals.loggedInUser = req.session.loggedInUser;
      let userId = res.locals.loggedInUser._id;
      res.redirect(`/project/${projectId}`);
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
