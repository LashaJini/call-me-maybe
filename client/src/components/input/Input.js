import React from "react";
import styled from "styled-components";

const InputExtended = (props) => {
  return <Input {...props} />;
};

const Input = styled.input`
  border: 2px solid black;
  border-radius: 6px;
  font-size: 1.125rem;
  padding: 5px;
`;

export default InputExtended;
