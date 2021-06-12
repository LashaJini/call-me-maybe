const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
  },
  roomName: {
    type: String,
    required: true,
  },
  number_of_participants: {
    type: Number,
    required: true,
    min: 0,
    max: 2,
  },
  participants: {
    type: [String],
    required: true,
  },
  created: {
    type: Date,
    required: true,
  },
  room_is_public: {
    type: Boolean,
    required: true,
    default: true,
  },
});

roomSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
