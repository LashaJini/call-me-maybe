const roomRouter = require("express").Router();
const { constants } = require("../utils");
const { v4: uuidv4 } = require("uuid");
const { Room } = require("../models");

roomRouter.post("/create", async (request, response, next) => {
  const body = request.body;

  if (!body) {
    const error = new Error("Empty body.");
    error.name = constants.EMPTY_BODY;
    next(error);
    return;
  }
  let { peerName, roomName, roomIsPublic } = body;

  if (!roomName) {
    const error = new Error("Room name is required.");
    error.name = constants.MISSING_ROOM_NAME;
    next(error);
    return;
  }

  if (!peerName) {
    const error = new Error("Peer name is required.");
    error.name = constants.MISSING_PEER_NAME;
    next(error);
    return;
  }

  if (roomIsPublic === undefined || roomIsPublic === null) {
    roomIsPublic = false;
  }

  const roomId = uuidv4();
  const roomPath = `/rooms/${roomId}`;
  const newRoom = new Room({
    roomId,
    roomName,
    number_of_participants: 1,
    participants: [peerName],
    created: new Date(),
    room_is_public: roomIsPublic,
  });

  const savedRoom = await newRoom.save();

  response.json({ peerName, roomName, roomIsPublic, roomPath });
});

roomRouter.post("/join", async (request, response, next) => {
  const body = request.body;

  if (!body) {
    const error = new Error("Empty body.");
    error.name = constants.EMPTY_BODY;
    next(error);
    return;
  }
  let { peerName, roomId } = body;

  if (!roomId) {
    const error = new Error("Room name is required.");
    error.name = constants.MISSING_ROOM_NAME;
    next(error);
    return;
  }

  if (!peerName) {
    const error = new Error("Peer name is required.");
    error.name = constants.MISSING_PEER_NAME;
    next(error);
    return;
  }

  const room = await Room.findOne({ roomId });

  if (!room) {
    const error = new Error("Room does not exist.");
    error.name = constants.ROOM_DOES_NOT_EXIST;
    next(error);
    return;
  }

  if (room.number_of_participants === 2) {
    const error = new Error("Room is full.");
    error.name = constants.ROOM_IS_FULL;
    next(error);
    return;
  }

  const newData = {
    number_of_participants: room.number_of_participants + 1,
    participants: room.participants.concat(peerName),
  };

  const updatedRoom = await Room.findByIdAndUpdate(room._id, newData, {
    new: true,
  });
  if (!updatedRoom) {
    const error = new Error("Couldn't update room.");
    error.name = constants.DB_ERROR;
    next(error);
    return;
  }

  const roomPath = `/rooms/${roomId}`;

  response.json({ room: updatedRoom, peerName, roomId, roomPath });
});

roomRouter.post("/leave", async (request, response, next) => {
  const body = request.body;

  if (!body) {
    const error = new Error("Empty body.");
    error.name = constants.EMPTY_BODY;
    next(error);
    return;
  }
  let { roomId } = body;

  if (!roomId) {
    const error = new Error("Room ID is required.");
    error.name = constants.MISSING_ROOM_ID;
    next(error);
    return;
  }

  const room = await Room.findOne({ roomId });
  if (!room) {
    const error = new Error("Room does not exist.");
    error.name = constants.ROOM_DOES_NOT_EXIST;
    next(error);
    return;
  }

  if (room.number_of_participants <= 1) {
    await Room.findByIdAndRemove(room._id);
    response.json({ success: true }).status(204);
  } else {
    const newData = {
      number_of_participants: room.number_of_participants - 1,
    };

    const updatedRoom = await Room.findByIdAndUpdate(room._id, newData, {
      new: true,
    });
    if (!updatedRoom) {
      const error = new Error("Couldn't update room.");
      error.name = constants.DB_ERROR;
      next(error);
      return;
    }

    response.json({ room: updatedRoom, success: true });
  }
});

const m = (module.exports = roomRouter);
