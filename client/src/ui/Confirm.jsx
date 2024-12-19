import React from "react";
import styled from "styled-components";
import Button from "./Button";

const StyledConfirm = styled.div`
  max-width: 500px;
`;
const StyledHeader = styled.div`
  border-bottom: 1px solid black;
  padding-bottom: 1rem;
`;
const Heading = styled.h2`
  font-size: 32px;
`;
const Text = styled.p`
  margin: 1.5rem 0;
  font-size: 26px;
`;
const StyledButtons = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  width: 100%;
`;

const Confirm = ({ btnText, message, onConfirm, onCloseModal }) => {
  return (
    <StyledConfirm>
      <StyledHeader>
        <Heading>Confirm {btnText}</Heading>
      </StyledHeader>
      <Text>{message}</Text>
      <StyledButtons>
        <Button onClick={onCloseModal}>Cancel</Button>
        <Button onClick={onConfirm} $variation="danger">
          {btnText}
        </Button>
      </StyledButtons>
    </StyledConfirm>
  );
};

export default Confirm;
