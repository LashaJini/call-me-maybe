import React from "react";
import styled, { keyframes } from "styled-components";

const Notification = ({ show = false, text, ...rest }) => {
  return <>{show && <Div {...rest}>{text}</Div>}</>;
};

const fade = keyframes`
  100% {
    opacity: 1;
  }
  10% {
    opacity: 0;
  }
`;

const Div = styled.div`
  position: absolute;
  opacity: 0;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  border: 1px solid #000;
  padding: 12px;
  border-radius: 5px;
  max-width: 200px;
  font-size: 0.9rem;
  color: #fff;
  z-index: 10000;
  text-align: center;
  background: hsl(0, 0%, 28%);
  animation: ${fade} 2s;
`;

export default Notification;
