import React from "react";
import styled from "styled-components";

const SwitchWrapper = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 25px;
`;

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ checked }) => (checked ? "#2196f3" : "#ccc")};
  transition: 0.4s;
  border-radius: 34px;

  &::before {
    position: absolute;
    content: "";
    height: 21px;
    width: 21px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
    transform: ${({ checked }) => (checked ? "translateX(25px)" : "translateX(0)")};
  }
`;

const Switch = ({ id, checked, onChange }) => (
  <SwitchWrapper>
    <SwitchInput
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    <Slider checked={checked} />
  </SwitchWrapper>
);

export default Switch;
