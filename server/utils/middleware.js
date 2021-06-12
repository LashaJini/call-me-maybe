const logger = require("./logger");
const constants = require("./constants");

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  const msg = {
    Date: new Date(),
    ERROR: error.message,
    IP: request.ip,
    Method: request.method,
    "Original URL": request.originalUrl,
    Body: request.body,
    Params: request.params,
    Query: request.query,
    // stack: error.stack,
  };
  logger.error(msg, error.message);

  if (error.name === "CastError")
    return response.status(400).json({ error: "invalid id" });
  else if (error.name === "ValidationError")
    return response.status(400).json({ error: error.message });
  else if (error.name === "TypeError")
    return response.status(500).json({ error: "Oops. Internal Error" });
  else if (error.name === "NoPasswordProvided")
    return response.status(400).json({ error: error.message });
  else if (error.name === "InvalidUsernameOrPassword")
    return response.status(401).json({ error: error.message });
  else if (error.name === "JsonWebTokenError")
    return response.status(401).json({ error: error.message });
  else if (error.name === constants.MISSING_ROOM_NAME)
    return response.status(400).json({ error: error.message });
  else if (error.name === constants.MISSING_PEER_NAME)
    return response.status(400).json({ error: error.message });
  else if (error.name === constants.EMPTY_BODY)
    return response.status(400).json({ error: error.message });
  else if (error.name === constants.ROOM_DOES_NOT_EXIST)
    return response.status(400).json({ error: error.message });
  else if (error.name === constants.MISSING_USER_ID)
    return response.status(400).json({ error: error.message });
  else if (error.name === constants.MISSING_ROOM_ID)
    return response.status(400).json({ error: error.message });
  else if (error.name === constants.DB_ERROR)
    return response.status(500).json({ error: error.message });
  else if (error.name === constants.ROOM_IS_FULL)
    return response.status(400).json({ error: error.message });

  next(error);
};

module.exports = {
  unknownEndpoint,
  errorHandler,
};
