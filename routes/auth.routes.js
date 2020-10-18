const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const UserModel = require("../models/User.model");

//===Sign Up===//
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res) => {
  let { username, password, email, loginType } = req.body;

  bcrypt.genSalt(10).then((salt) => {
    bcrypt.hash(password, salt).then((hashedPassword) => {
      UserModel.create({
        username,
        email,
        password: hashedPassword,
        loginType
      })
        .then((user) => {
          // console.log("User added: ", user);
          req.session.loggedInUser = user;
          res.locals.loggedInUser = req.session.loggedInUser
          res.redirect("/home");
        })
        .catch((err) => {
          res.status(500).render('auth/signup', { message: 'Something went wrong' });
          console.log(err);
        });
    });
  });
});

//===Sign In===//
router.get("/signin", (req, res) => {
  res.render("auth/signin");
});

router.post("/signin", (req, res) => {
  let { email, password } = req.body;

  UserModel.findOne({ email })
    .then((user) => {
      if (!user) {
        res
          .status(500)
          .render("auth/signin", { message: "User not exist!!!!" });
      } else {
        bcrypt
          .compare(password, user.password)
          .then((result) => {

            if (result) {
              req.session.loggedInUser = user;
              res.locals.loggedInUser = req.session.loggedInUser
              res.redirect("/home");
            } else {
              res.status(500).render("auth/signin", {
                message: "Password not matched!!!!!!",
              });
            }
          })
          .catch((err) => {
            res
              .status(500)
              .render("auth/signin", { message: "Something went wrong." });
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

//===Log Out===//
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// router.get("/content/main", (req, res) => {
//   let user = req.session.loggedInUser;
//   if (!user) {
    
//     res.redirect("/signin");
//   } else {
//     res.render("content/main", { user });
//   }
// });

// router.get("/content/private", (req, res) => {
//     let user = req.session.loggedInUser;
//     if (!user) {
//       res.redirect("/signin");
//     } else {
//       res.render("content/private", { user });
//     }
//   });

module.exports = router;
