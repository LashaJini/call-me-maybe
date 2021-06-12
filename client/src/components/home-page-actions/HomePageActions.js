import React from "react";
import { Button, Input } from "../";
import styled from "styled-components";

const HomePageActions = ({
  handleRoomDescriptionCHange,
  handlePeerNameChange,
  handleRoomNameChange,
  handleRoomIdChange,
  peerName = "",
  roomName = "",
  roomIsPublic = true,
  roomId,
  createRoom,
  joinRoom,
}) => {
  return (
    <>
      <div>
        {/* <Input */}
        {/*   type="text" */}
        {/*   onChange={handlePeerNameChange} */}
        {/*   value={peerName} */}
        {/*   placeholder="Peer Name" */}
        {/* /> */}
      </div>

      <Wrapper>
        <div>
          <Button onClick={createRoom}>create</Button>

          {/* <Input */}
          {/*   type="text" */}
          {/*   onChange={handleRoomNameChange} */}
          {/*   value={roomName} */}
          {/*   placeholder="Room Name" */}
          {/* /> */}

          {/* <Input */}
          {/*   type="checkbox" */}
          {/*   name="isPublic" */}
          {/*   defaultChecked={roomIsPublic} */}
          {/*   onChange={handleRoomDescriptionCHange} */}
          {/* /> */}
          {/* <label htmlFor="isPublic">PUBLIC</label> */}
        </div>
        <OR>or</OR>
        <div>
          <Button
            onClick={joinRoom}
            bkgColor={{
              default: "hsl(14, 100%, 66%)",
              hover: "hsl(14, 100%, 56%)",
            }}
          >
            join
          </Button>
          <Input
            type="text"
            onChange={handleRoomIdChange}
            value={roomId}
            placeholder="Room ID"
          />
        </div>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  & div {
    margin: 12px;
  }
`;

const OR = styled.div`
  color: white;
  text-transform: uppercase;
  font-weight: bold;
`;

export default HomePageActions;
