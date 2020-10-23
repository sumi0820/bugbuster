require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const logger = require("morgan");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");

require("./config/db.config");

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true,
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));
hbs.registerHelper("dateFormat", require("handlebars-dateformat"));

// Register the location for handlebars partials here:
hbs.registerPartials(path.join(__dirname, "views/partials"));

// default value for title local
app.locals.title = "BugBuster";

// Session handler
app.use(
  session({
    secret: "foo",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60,
    }),
  })
);

const sessionCheck = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/");
  }
};

const index = require("./routes/index");
app.use("/", index);

const authRoutes = require("./routes/auth.routes");
app.use("/", authRoutes);

const homeRoutes = require("./routes/home.routes");
app.use("/", sessionCheck, homeRoutes);

const postRoutes = require("./routes/post.routes");
app.use("/", sessionCheck, postRoutes);

const userRoutes = require("./routes/user.routes");
app.use("/", sessionCheck, userRoutes);

const projectRoutes = require("./routes/project.routes");
app.use("/", sessionCheck, projectRoutes);

app.get("/*", (req, res, next) => {
  res.render("404");
});

module.exports = app;
