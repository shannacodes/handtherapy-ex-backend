var createError = require("http-errors");
const express = require("express");
var path = require("path");
const morgan = require("morgan"); // morgan installed
const passport = require("passport");
const config = require("./config");
const cors = require("./routes/cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const exerciseRouter = require("./routes/exerciseRouter");

// connects express server to mongodb/mongoose
const mongoose = require("mongoose");

const url = config.mongoConnectionString;

const connect = mongoose
  .connect(url, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("App is connected to database");
  })
  .catch((error) => {
    console.log(error);
  });

connect.then(
  () => console.log("Connected correctly to server"),
  (err) => console.log(err)
);

const app = express();

// app.all("*", (req, res, next) => {
//   if (req.secure) {
//     return next();
//   } else {
//     console.log(
//       `Redirecting to: https://${req.hostname}:${app.get("secPort")}${req.url}`
//     );
//     res.redirect(
//       301,
//       `https://${req.hostname}:${app.get("secPort")}${req.url}`
//     );
//   }
// });

const hostname = "localhost";
const port = 4000;

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(cookieParser("12345-67890-09876-54321"));

// passport MUST go after passport.session
app.use(passport.initialize());

// cors enabled
app.use(cors.cors);

// public routes
app.use("/", indexRouter);

app.use(express.static(path.join(__dirname, "/public")));

app.use("/users", usersRouter);
app.use("/exercises", exerciseRouter); // 2) link path to router

// the following must go AFTER express.static
app.use((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end("<html><body><h1>This is an Express Server</h1></body></html>");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// module.exports = app;

exports.myApp = app;
