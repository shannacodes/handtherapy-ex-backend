const cors = require("cors");

const whitelist = [
  "http://localhost:3000",
  "https://localhost:3000",
  "http://localhost:3443",
  "https://localhost:3443",
  "https://us-central1-hand-ex-gen.cloudfunctions.net/myApp/",
  "https://us-central1-hand-ex-gen.cloudfunctions.net/",
];
const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  console.log(req.header("Origin"));

  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = {
      origin: true,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
