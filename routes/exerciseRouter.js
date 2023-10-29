const express = require("express");
const Exercise = require("../models/exercise"); // can use exported exercise model
const authenticate = require("../authenticate");

const exerciseRouter = express.Router();

exerciseRouter // chaining for exerciseRouter /exercises
  .route("/")
  .get((req, res, next) => {
    Exercise.find()
      .then((exercises) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(exercises);
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Exercise.create(req.body)
      .then((exercise) => {
        console.log("Exercise Created ", exercise);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(exercise);
      })
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end("PUT operation not supported on /exercises");
  })
  .delete(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end("DELETE operation not supported on /exercises");
  });

exerciseRouter // chaining for /exercises/:exerciseId
  .route("/:exerciseId")
  .get((req, res, next) => {
    Exercise.findById(req.params.exerciseId)
      .then((exercise) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(exercise);
      })
      .catch((err) => next(err));
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /exercises/${req.params.exerciseId}`
    );
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Exercise.findByIdAndUpdate(
      req.params.exerciseId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then((exercise) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(exercise);
      })
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Exercise.findByIdAndDelete(req.params.exerciseId)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  });

module.exports = exerciseRouter; // NOTE TO SELF: don't forget to export this
