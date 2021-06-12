import React from "react";
import { io } from "socket.io-client";
import { Button, Notification } from "../";
import { useParams } from "react-router-dom";
import styles from "./Room.module.css";
import axios from "axios";
import { Redirect } from "react-router-dom";

const configuration = {
  iceServers: [
    {
      urls: ["stun:stun1.1.google.com:19302", "stun:stun2.1.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

const exactWidth = 320;
const exactHeight = 240;

const constraints = {
  audio: true,
  video: { width: { exact: exactWidth }, height: { exact: exactHeight } },
  aspectRatio: {
    exact: exactWidth / exactHeight,
  },
  // video: { width: { exact: 640 }, height: { exact: 480 } },
};

// const offerOptions = {
//   offerToReceiveAudio: true,
//   offerToReceiveVideo: true,
// };

const Room = (props) => {
  const [notification, setNotification] = React.useState({
    show: false,
    text: "",
  });
  const { id: roomId } = useParams();
  const [redirect, setRedirect] = React.useState({
    redirect: false,
    path: "/",
    roomId,
  });
  const [userId, setUserId] = React.useState(null);
  const [socket, setSocket] = React.useState(null);

  const localVideoRef = React.useRef();
  const localStreamRef = React.useRef();

  const remoteVideoRef = React.useRef();
  // const remoteStreamRef = React.useRef();

  const pcRef = React.useRef();

  React.useEffect(() => {
    // this means we visited URL directly,
    // so we have not actually made the request to the server
    if (
      Number(window.sessionStorage.getItem("NoRedirect")) !== 1 &&
      (!props ||
        !props.location ||
        !props.location.state ||
        !props.location.state.redirected)
    ) {
      setRedirect((prev) => ({ ...prev, redirect: true }));
    }
  }, []);

  React.useEffect(() => {
    if (socket) {
      pcRef.current = new RTCPeerConnection(configuration);

      pcRef.current.onicecandidate = function ({ candidate }) {
        // console.log("onicecandidate");
        socket.emit("signal-candidate", { roomId, candidate });
      };

      // Let the "negotiationneeded" event trigger offer generation.
      pcRef.current.onnegotiationneeded = async () => {
        // console.log("onnegotiationneeded");
        try {
          // dataChannelEvents();

          await pcRef.current.setLocalDescription(
            await pcRef.current.createOffer()
          );

          // Send the offer to the other peer.
          socket.emit("offer", {
            roomId,
            desc: pcRef.current.localDescription,
          });
        } catch (error) {
          console.error(error);
          setNotification({ show: true, text: error.message });
        }
      };

      // Once remote track media arrives, show it in remote video element.
      pcRef.current.ontrack = (event) => {
        // Don't set srcObject again if it is already set.
        if (remoteVideoRef.current.srcObject) return;
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      pcRef.current.onicegatheringstatechange = (event) => {
        // console.log("iceGatheringStateChange", event);
      };

      // localVideoRef.current.onresize = (event) => {
      //   if (event.target.clientHeight > constraints.video.height.exact) {
      //     localVideoRef.current.style.height =
      //       constraints.video.height.exact + "px";
      //   }
      // };
    }
  }, [socket]);

  React.useEffect(() => {
    if (socket) {
      socket.on("log", function (...msg) {
        // console.log(...msg);
      });

      socket.on("message", async function ({ desc, candidate }) {
        try {
          if (desc) {
            // If you get an offer, you need to reply with an answer.
            if (desc.type === "offer") {
              // console.log("message#offer");

              // dataChannelEvents();

              await pcRef.current.setRemoteDescription(desc);
              await pcRef.current.setLocalDescription(
                await pcRef.current.createAnswer()
              );
              socket.emit("answer", {
                roomId,
                desc: pcRef.current.localDescription,
              });
            } else if (desc.type === "answer") {
              // console.log("message#answer");
              await pcRef.current.setRemoteDescription(desc);
            } else {
              // console.log("Unsupported SDP type.");
            }
          } else if (candidate) {
            // console.log("message#candidate");
            await pcRef.current.addIceCandidate(candidate);
          }
        } catch (error) {
          console.error(error);
          setNotification({ show: true, text: error.message });
        }
      });

      socket.on("created-room", function ({ roomId }) {
        // console.log(roomId);
      });

      socket.on("user-disconnected", function ({ userId }) {
        // console.log("user disconnected", userId);

        remoteVideoRef.current.srcObject = null;
      });

      socket.on("joined", function ({ userId }) {
        setUserId(userId);
      });

      return () => {
        socket.close();
      };
    }
  }, [socket]);

  const start = async () => {
    if (!localStreamRef.current) {
      try {
        setSocket(() => {
          const newSocket = io.connect();
          newSocket.emit("join-room", { roomId });
          return newSocket;
        });
        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        localStreamRef.current = stream;
        localVideoRef.current.srcObject = localStreamRef.current;
        localStreamRef.current
          .getTracks()
          .forEach((track) => pcRef.current.addTrack(track, stream));
      } catch (error) {
        console.error(error);
        setNotification({ show: true, text: error.message });
      }
    }
  };

  const swap = () => {
    const floatingVideo = document.querySelector(`.${styles.floatingVideo}`);
    const mainVideo = document.querySelector(`.${styles.mainVideo}`);

    floatingVideo.classList.replace(styles.floatingVideo, styles.mainVideo);
    mainVideo.classList.replace(styles.mainVideo, styles.floatingVideo);
  };

  const hangup = async () => {
    const leftRoom = await axios.post("/api/rooms/leave", { roomId, userId });
    if (leftRoom.data.success) {
      // pcRef.current && pcRef.current.close();

      if (localVideoRef.current) {
        localVideoRef.current.srcObject &&
          localVideoRef.current.srcObject.getTracks().forEach(function (track) {
            track.stop();
          });

        localStreamRef.current = null;
        localVideoRef.current.srcObject = localStreamRef.current;
      }

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject &&
          remoteVideoRef.current.srcObject
            .getTracks()
            .forEach(function (track) {
              track.stop();
            });
        remoteVideoRef.current.srcObject = null;
      }

      socket && socket.close();
      setRedirect({ redirect: true, path: "/", roomId: "" });
    } else {
      console.error("couldn't leave the room.");
    }
  };

  // console.log("Room#render");
  return (
    <>
      {redirect.redirect ? (
        <Redirect
          to={{
            pathname: redirect.path || "/",
            state: { roomId: redirect.roomId },
          }}
        />
      ) : (
        <div className={styles.room}>
          <Notification show={notification.show} text={notification.text} />
          <div className={styles.videos}>
            <div className={`${styles.videoWrapper} ${styles.mainVideo}`}>
              <video ref={localVideoRef} autoPlay playsInline></video>
            </div>
            <div className={`${styles.videoWrapper} ${styles.floatingVideo}`}>
              <video ref={remoteVideoRef} autoPlay playsInline></video>
            </div>
            <div className={`${styles.controls}`}>
              <Button onClick={start}>start</Button>
              <Button onClick={swap}>swap</Button>
              <Button onClick={hangup}>hang up</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Room;
