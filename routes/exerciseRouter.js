const express = require("express");
const exerciseRouter = express.Router();

exerciseRouter // chaining for exerciseRouter /exercises
  .route("/")
  .get((req, res) => {
    res.end("GET operation will send all the exercises to you");
  })
  .post((req, res) => {
    res.end(
      `POST operation will add the exercise: ${req.body.name} with description: ${req.body.description}`
    );
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end("PUT operation not supported on /exercises");
  })
  .delete((req, res) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end("DELETE operation not supported on /exercises");
  });

exerciseRouter // chaining for /exercises/:exerciseId
  .route("/:exerciseId")
  .get((req, res) => {
    res.end(
      `GET operation will send details of the exercise: ${req.params.exerciseId} to you`
    );
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /exercises/${req.params.exerciseId}`
    );
  })
  .put((req, res) => {
    res.write(`Updating the exercise: ${req.params.exerciseId} \n`);
    res.end(
      `will update the exercise: ${req.body.name} with description: ${req.body.description}`
    );
  })
  .delete((req, res) => {
    res.end(`Deleting exercise: ${req.params.exerciseId}`);
  });

module.exports = exerciseRouter; // NOTE TO SELF: don't forget to export this
