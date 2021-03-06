const express = require("express");
const path = require("path");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const isDev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 3001;
const getEvent = require("./controllers/index").getEvent;
const decodeAndFetch = require("./controllers/index").decodeAndFetch;
const { decode } = require("punycode");
const bodyParser = require("body-parser");
const cors = require("cors");
var cookieParser = require("cookie-parser");
// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.error(
      `Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`
    );
  });
} else {
  const app = express();
  app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, "../react-ui/build")));
  app.use(bodyParser.json({ limit: "30mb", extended: true }));
  app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

  app.use(cookieParser());
  // Answer API requests.
  app.get("/api", getEvent);
  app.post("/api", decodeAndFetch);

  // All remaining requests return the React app, so it can handle routing.
  app.get("*", function (request, response) {
    response.sendFile(
      path.resolve(__dirname, "../react-ui/build", "index.html")
    );
  });

  app.listen(PORT, function () {
    console.error(
      `Node ${
        isDev ? "dev server" : "cluster worker " + process.pid
      }: listening on port ${PORT}`
    );
  });
}
