import React from "react";
import Button from "./Button";
import { MdAdd } from "react-icons/md";
import styled from "styled-components";

const StyledButton = styled.button`
  border: none;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  color: var(--color-brand-50);
  background-color: var(--color-brand-600);
  padding: 0.4rem 1rem;
  display: flex;
  align-items: center;
  &:hover {
    scale: 1.03;
    background-color: var(--color-brand-700);
  }
`;
const AddButton = ({ children, onClick }) => {
  return (
    <StyledButton onClick={onClick}>
      <span style={{ marginRight: 4 }}>{children ? children : "ADD"}</span>
      <MdAdd size={24} />
    </StyledButton>
  );
};
export default AddButton;
