import styled, { css } from "styled-components";

const sizes = {
  small: css`
    font-size: 1.2rem;
    padding: 0.5rem 1.5rem;
    font-weight: 500;
    text-align: center;
    display: flex;
    align-items: center;
  `,
  medium: css`
    font-size: 1.4rem;
    padding: 1.2rem 1.6rem;
    font-weight: 500;
  `,
  large: css`
    font-size: 1.6rem;
    padding: 1.2rem 2.4rem;
    font-weight: 500;
  `,
};

const variations = {
  primary: css`
    color: var(--color-brand-50);
    background-color: var(--color-brand-600);
    &:hover {
      background-color: var(--color-brand-700);
    }
  `,
  secondary: css`
    color: var(--color-grey-600);
    background: var(--color-grey-0);
    border: 1px solid var(--color-grey-200);
    &:hover {
      background-color: var(--color-grey-50);
    }
  `,
  danger: css`
    color: var(--color-red-100);
    background-color: var(--color-red-700);
    &:hover {
      background-color: var(--color-red-800);
    }
  `,
};

const Button = styled.button`
  border: none;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  &:hover {
    scale: 1.03;
  }
  &:focus {
    outline: none;
  }
  ${(props) => variations[props.$variation]}
  ${(props) => sizes[props.$size]}
`;

Button.defaultProps = {
  $variation: "primary",
  $size: "small",
};

export default Button;
