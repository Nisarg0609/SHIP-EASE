import React, { useState } from "react";
import styled, { css } from "styled-components";

const StyledButtons = styled.div`
  border: 1px solid var(--color-grey-200);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-sm);
  padding: 0.1rem;
  margin-top: 0.2rem;
  display: flex;
  gap: 0.4rem;
`;

const TypeButton = styled.button`
  background-color: var(--color-grey-0);
  border: none;
  ${(props) =>
    props.$active &&
    css`
      background-color: var(--color-brand-600);
      color: var(--color-brand-50);
    `}
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 18px;
  padding: 0.2rem 0.8rem;
  transition: all 0.3s;
  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
`;

const MultiSelectButtons = ({ buttons }) => {
  const [activeLabel, setActiveLabel] = useState(
    buttons.find((button) => button.defaultActive)?.label || buttons[0].label
  );

  return (
    <StyledButtons>
      {buttons.map((button) => (
        <TypeButton
          type="button"
          key={button.label}
          onClick={() => {
            setActiveLabel(button.label);
            button.handler();
          }}
          $active={activeLabel === button.label}
        >
          {button.label}
        </TypeButton>
      ))}
    </StyledButtons>
  );
};

export default MultiSelectButtons;
