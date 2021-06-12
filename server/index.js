const http = require("http");
const { config, logger } = require("./utils");
const { io, server } = require("./app");

io.on("connection", (socket) => {
  function log() {
    let array = [];
    array.push.apply(array, arguments);
    socket.emit("log", array);
  }

  socket.emit("joined", { userId: socket.id });

  socket.on("signal-candidate", function ({ roomId, candidate }) {
    socket.to(roomId).emit("message", { candidate });
  });

  socket.on("offer", function ({ roomId, desc }) {
    socket.to(roomId).emit("message", { desc });
  });

  socket.on("answer", function ({ roomId, desc }) {
    socket.to(roomId).emit("message", { desc });
  });

  socket.on("join-room", function ({ roomId }) {
    if (!roomId) {
      log("provide room id");
    } else {
      socket.join(roomId);
      io.to(roomId).emit("log", `user ${socket.id} joined in ${roomId}`);
    }

    socket.on("disconnect", function () {
      if (roomId) {
        socket.broadcast
          .to(roomId)
          .emit("user-disconnected", { userId: socket.id });
      }
    });
  });
});

const PORT = process.env.PORT || config.PORT;
server.listen(PORT, () => logger.info(`[*] server listening on ${PORT}`));
