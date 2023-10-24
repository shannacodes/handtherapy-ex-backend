var createError = require("http-errors");
var express = require("express");
var path = require("path");
//var cookieParser = require("cookie-parser");
const morgan = require("morgan"); // morgan installed
const session = require("express-session");
const FileStore = require("session-file-store")(session);

const passport = require("passport");
const authenticate = require("./authenticate");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const exerciseRouter = require("./routes/exerciseRouter");

// connects express server to mongodb/mongoose
const mongoose = require("mongoose");

const url = "mongodb://localhost:27017/handtherapyex";

const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connect.then(
  () => console.log("Connected correctly to server"),
  (err) => console.log(err)
);

var app = express();

const hostname = "localhost";
const port = 3005;

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

app.use(
  session({
    name: "session-id",
    secret: "12345-67890-09876-54321",
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
  })
);

// passport MUST go after passport.session
app.use(passport.initialize());
app.use(passport.session());

// public, non-authenticated routes at the moment
app.use("/", indexRouter);
app.use("/users", usersRouter);

function auth(req, res, next) {
  console.log(req.user);

  if (!req.user) {
    const err = new Error("You are not authenticated!");
    err.status = 401;
    return next(err);
  } else {
    return next();
  }
}

app.use(auth);

app.use(express.static(path.join(__dirname, "/public")));

app.use("/exercises", exerciseRouter); // 2) link path to router

// the following must go AFTER expr ess.static
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

module.exports = app;
