import axios from "axios";

// for future use;
// api endpoint does not exist
const getAll = async () => {
  const response = await axios.get("/api/rooms");
  return response.data;
};

const createRoom = async (data) => {
  const response = await axios.post("/api/rooms/create", { ...data });
  return response.data;
};

const joinRoom = async (data) => {
  const response = await axios.post("/api/rooms/join", { ...data });
  return response.data;
};

export { getAll, createRoom, joinRoom };
