const express = require("express");
const User = require("../models/user");
const passport = require("passport");
const authenticate = require("../authenticate");
const cors = require("./cors");

var router = express.Router();

/* GET users listing. */
router.get(
  "/",
  cors.corsWithOptions,
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req, res, next) => {
    User.find()
      .then((users) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(users);
      })
      .catch((err) => next(err));
  }
);

router.post("/signup", cors.corsWithOptions, (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        passport.authenticate("local")(req, res, () => {
          const token = authenticate.getToken({ _id: req.user._id });
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({
            success: true,
            token: token,
            status: "Registration Successful!",
          });
        });
      }
    }
  );
});

router.post(
  "/login",
  cors.corsWithOptions,
  passport.authenticate("local"),
  (req, res) => {
    const token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({
      success: true,
      token: token,
      status: "You are successfully logged in!",
    });
  }
);

router.get("/logout", cors.corsWithOptions, (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.status(200).json({ success: true, message: "Logout successful! " });
  } else {
    res.status(401).json({ error: "You are not logged in!" });
  }
});

module.exports = router;
