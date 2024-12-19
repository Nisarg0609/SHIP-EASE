import styled, { css } from "styled-components";
import Button from "./Button";

const TransparentButton = styled(Button)`
  padding: 0;
  background: transparent;
  color: ${(props) => props.color ?? css`var(--color-indigo-700)`};
  box-shadow: none;
  &:hover {
    background-color: transparent;
  }
`;

export default TransparentButton;
