import styled, { css } from "styled-components";

const Input = styled.input`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  padding: 0.3rem 1rem;
  margin-top: 0.2rem;
  width: 100%;

  ${(props) =>
    (props.type === "submit" || props.type === "reset") &&
    css`
      margin-top: 0.7rem;
      background-color: var(--color-indigo-700);
      color: white;
      cursor: pointer;
      padding: 0.5rem 0;
    `}
`;

export default Input;
