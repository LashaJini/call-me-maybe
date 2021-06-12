import React from "react";
import { createRoom, joinRoom } from "./Home.api";
import { HomePageActions, Notification } from "../";
import { Redirect } from "react-router-dom";
import styled from "styled-components";

function Home(props) {
  const [notification, setNotification] = React.useState({
    show: false,
    text: "",
  });
  const [peerName, setPeerName] = React.useState("PEER_NAME"); // for future
  const [roomName, setRoomName] = React.useState("ROOM_NAME"); // for future
  const [roomId, setRoomId] = React.useState("");
  const [roomIsPublic, setRoomIsPublic] = React.useState(true);
  const [serverResponse, setServerResponse] = React.useState({});

  const handlePeerNameChange = (event) => {
    setPeerName(event.target.value);
  };

  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value);
  };

  const handleRoomIdChange = (event) => {
    setRoomId(event.target.value);
  };

  const createRoomHandler = () => {
    createRoom({ peerName, roomName, roomIsPublic })
      .then((response) => {
        window.sessionStorage.setItem("NoRedirect", 1);
        setServerResponse(response);
      })
      .catch((error) => {
        console.error(error);
        setNotification({ show: true, text: error.response.data.error });
      });
  };

  const joinRoomHandler = () => {
    joinRoom({ peerName, roomId })
      .then((response) => {
        window.sessionStorage.setItem("NoRedirect", 1);
        setServerResponse(response);
      })
      .catch((error) => {
        console.error(error);
        setNotification({ show: true, text: error.response.data.error });
      });
  };

  const handleRoomDescriptionCHange = () => {
    setRoomIsPublic((prev) => !prev);
  };

  React.useEffect(() => {
    let _roomId = window.location.search.split("=")[1];
    window.sessionStorage.setItem("NoRedirect", 0);
    if (_roomId) {
      window.location.search = "";
      setRoomId(_roomId);
    } else if (
      props &&
      props.location &&
      props.location.state &&
      props.location.state.roomId
    ) {
      _roomId = props.location.state.roomId;
      setRoomId(_roomId);
    }
  }, []);

  return (
    <>
      {serverResponse.roomPath ? (
        <Redirect
          to={{
            pathname: serverResponse.roomPath,
            state: { redirected: true },
          }}
        />
      ) : (
        <Wrapper>
          <Notification show={notification.show} text={notification.text} />
          <HomePageActions
            handleRoomDescriptionCHange={handleRoomDescriptionCHange}
            handlePeerNameChange={handlePeerNameChange}
            handleRoomNameChange={handleRoomNameChange}
            handleRoomIdChange={handleRoomIdChange}
            peerName={peerName}
            roomName={roomName}
            roomId={roomId}
            roomIsPublic={roomIsPublic}
            createRoom={createRoomHandler}
            joinRoom={joinRoomHandler}
          />
        </Wrapper>
      )}
    </>
  );
}

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export default Home;
