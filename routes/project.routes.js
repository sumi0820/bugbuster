const express = require("express");
const { findByIdAndUpdate } = require("../models/Post.model");
const router = express.Router();
const PostModel = require("../models/Post.model");
const ProjectModel = require("../models/Project.model");
const TaskModel = require("../models/Task.model");
const FeedbackModel = require("../models/Feedback.model");

/* GET home page */
//====== Display single project =========//
router.get("/project/:projectId", (req, res, next) => {
  let projectId = req.params.projectId;
  const loggedInUser = req.session.loggedInUser;

  ProjectModel.findById(projectId)
    .populate("user")
    .populate("project")
    .then((project) => {
      TaskModel.find({ project: projectId }).then((tasks) => {
        FeedbackModel.find({ project: projectId })
          .populate("user")
          .then((feedbacks) => {
            res.locals.loggedInUser = req.session.loggedInUser;
            owner = project.user._id == req.session.loggedInUser._id
            res.render("project/project", {
              project,
              tasks,
              feedbacks,
              loggedInUser,
              owner
            });
          });
      });
      // }
    });
});

//====== Display open projects =========//
router.get("/openProjects", (req, res, next) => {
  res.locals.isLoggedIn = req.session.loggedInUser;

  ProjectModel.find({ status: "Open" })
    .populate("user")
    .populate("feedback")
    .populate({
      path: "feedback",
      populate: {
        path: "user",
      },
    })
    .then((projects) => {
      const loggedInUser = req.session.loggedInUser;

      res.render("project/openProjects", { projects, loggedInUser });
    });
});

//====== Create New Project ========//

// 1. Create Base Info
router.get("/projects/create", (req, res, next) => {
  res.locals.loggedInUser = req.session.loggedInUser;
  const loggedInUser = req.session.loggedInUser;

  res.render("project/projectCreateBase", { loggedInUser });
});


router.post("/project/create", (req, res) => {
  let loggedInUser = req.session.loggedInUser;
  let userId = req.session.loggedInUser._id;

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
router.get("/project/create/:projectId/task", (req, res) => {
  let projectId = req.params.projectId;
  ProjectModel.findById(projectId).then((project) => {
    res.locals.loggedInUser = req.session.loggedInUser;
    const loggedInUser = req.session.loggedInUser;

    res.render("project/projectCreateTask", { project, loggedInUser });
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
      ProjectModel.findById(projectId).then((project) => {
        res.locals.loggedInUser = req.session.loggedInUser;
        res.redirect(`/project/${projectId}`);
      });
    });
  });
});

//====== Edit Project ========//

router.get("/project/:projectId/edit", (req, res) => {
  let projectId = req.params.projectId;
  ProjectModel.findById(projectId)
    .then((project) => {
      res.locals.loggedInUser = req.session.loggedInUser;
      const loggedInUser = req.session.loggedInUser;

      res.render("project/projectEdit", { project, loggedInUser });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/project/:projectId/edit", (req, res) => {
  let projectId = req.params.projectId;
  ProjectModel.findByIdAndUpdate(projectId, req.body)
    .populate("project")
    .then((project) => {
      res.locals.loggedInUser = req.session.loggedInUser;
      res.redirect(`/project/${project._id}`);
    })
    .catch((err) => {
      console.log(err);
    });
});

//====== Delete Project ========//

router.post("/project/:projectId/delete", (req, res) => {
  let projectId = req.params.projectId;
  ProjectModel.findByIdAndDelete(projectId)
    .then((project) => {
      res.locals.loggedInUser = req.session.loggedInUser;
      const loggedInUser = req.session.loggedInUser;
      res.redirect(`/dashboard/${loggedInUser._id}`);
    })
    .catch((err) => {
      console.log(err);
    });
});
//====== Edit Task ========//

router.get("/project/:taskId/editTask", (req, res) => {
  let taskId = req.params.taskId;
  TaskModel.findById(taskId)
    .then((task) => {
      res.locals.loggedInUser = req.session.loggedInUser;
      const loggedInUser = req.session.loggedInUser;

      res.render("project/projectEditTask", { task, loggedInUser });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/project/:taskId/editTask", (req, res) => {
  let taskId = req.params.taskId;
  TaskModel.findByIdAndUpdate(taskId, req.body)
    .populate("project")
    .then((task) => {
      res.locals.loggedInUser = req.session.loggedInUser;
      res.redirect(`/project/${task.project._id}`);
    })
    .catch((err) => {
      console.log(err);
    });
});

//====== Delete Task ========//

router.post("/project/:taskId/deleteTask", (req, res) => {
  let taskId = req.params.taskId;
  TaskModel.findByIdAndDelete(taskId)
    .then((task) => {
      res.locals.loggedInUser = req.session.loggedInUser;
      res.redirect(`/project/${task.project._id}`);
    })
    .catch((err) => {
      console.log(err);
    });
});

//====== Feedback ========//
router.get("/project/:projectId/feedback", (req, res) => {
  let projectId = req.params.projectId;
  res.locals.isLoggedIn = req.session.loggedInUser;
  ProjectModel.findById(projectId)
    .populate("user")
    .then((project) => {
      if (
        req.session.loggedInUser.loginType ||
        req.session.loggedInUser._id == project.user._id
      ) {
        res.render("project/projectFeedback", { projectId });
      } else {
        res
          .status(500)
          .render("project/project", { message: "User not exist!!!!" });
      }
    });
});

router.post("/project/:projectId/feedback", (req, res) => {
  let projectId = req.params.projectId;
  res.locals.loggedInUser = req.session.loggedInUser;

  FeedbackModel.create({
    user: req.session.loggedInUser,
    project: projectId,
    ...req.body,
  }).then((feedback) => {
    ProjectModel.findByIdAndUpdate(projectId, { feedback: feedback })
      .then((project) => {
        res.locals.loggedInUser = req.session.loggedInUser;
        res.redirect(`/project/${projectId}`);
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

module.exports = router;
