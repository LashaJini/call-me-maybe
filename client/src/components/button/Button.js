import React from "react";
import globalStyles from "../../styles/global.module.css";
import styled from "styled-components";

const ButtonExtended = ({
  bkgColor = { default: "hsl(29, 100%, 71%)", hover: "hsl(29, 100%, 61%)" },
  children,
  ...rest
}) => {
  return (
    <Button className={globalStyles.hoverable} bkgColor={bkgColor} {...rest}>
      {children}
    </Button>
  );
};

const Button = styled.button`
  background-color: ${({ bkgColor }) =>
    bkgColor.default ? bkgColor.default : "hsl(29, 100%, 71%)"};
  font-size: 1.125rem;
  padding: 6px;
  border-radius: 6px;
  letter-spacing: 1px;
  border: 2px solid black;
  text-transform: uppercase;
  font-weight: bold;

  &:hover {
    background-color: ${({ bkgColor }) =>
      bkgColor.hover ? bkgColor.hover : "hsl(29, 100%, 61%)"};
  }
`;

export default ButtonExtended;
