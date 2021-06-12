const express = require("express");
const { roomRouter } = require("./controllers");
const { middleware, logger, config } = require("./utils");
const mongoose = require("mongoose");

const app = express();
const { unknownEndpoint, errorHandler } = middleware;

const http = require("http");
const server = http.createServer(app);

const io = require("socket.io")(server, {
  pingInterval: 5000,
  pingTimeout: 10000,
});

logger.info("connecting to", config.MONGODB_URI);
mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => logger.error("error connecting to MongoDB", error.message));

app.use(express.json());
app.use(express.static("build"));

// app.get("/rooms/:id", (request, response) => {
//   response.redirect(`/?roomId=${request.params.id}`);
// });

app.use("/api/rooms", roomRouter);
app.use(unknownEndpoint, errorHandler);

const m = (module.exports = app);
m.io = io;
m.server = server;
