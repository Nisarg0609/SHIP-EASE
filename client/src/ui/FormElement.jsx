import React from "react";
import styled from "styled-components";

const StyledElement = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: ${(props) => props.direction ?? "column"};
  margin-top: ${(props) => (props.direction ? "1.5rem" : 0)};
`;
const Label = styled.label`
  font-size: ${(props) => (props.direction ? "18px" : "14px")};
  margin-left: 2px;
  margin-right: ${(props) => (props.direction ? "1rem" : 0)};
`;
const Error = styled.span`
  color: red;
  font-size: 12px;
`;

const FormElement = ({ children, label, error, id, direction }) => {
  return (
    <StyledElement direction={direction}>
      {label && (
        <Label htmlFor={id} direction={direction}>
          {label}
        </Label>
      )}
      {children}
      {error && <Error>{error}</Error>}
    </StyledElement>
  );
};

export default FormElement;
