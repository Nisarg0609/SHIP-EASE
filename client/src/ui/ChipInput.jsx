import React, { useState } from "react";
import { IoIosClose } from "react-icons/io";
import styled from "styled-components";
import Input from "./Input";

const StyledChipInput = styled.div``;
const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 8px;
  min-height: 40px;
`;
const Chip = styled.div`
  display: flex;
  align-items: center;
  background-color: #e0e0e0;
  padding: 0.3rem 0.8rem;
  border-radius: 16px;
  margin-right: 4px;
`;
const ChipCloseButton = styled.button`
  margin-left: 6px;
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: red;
`;
const InputChip = styled.input`
  flex: 1;
  border: none;
  outline: none;
  min-width: 100px;
  &:focus {
    border: none;
    outline: none;
  }
`;

const ChipInput = ({ name, getValues, setValue, useWatch, control }) => {
  const [inputValue, setInputValue] = useState("");
  const pincodes = useWatch({ control, name: name });

  const addChip = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue) {
      const currentpincodes = getValues(name);
      setValue(name, [...currentpincodes, trimmedValue]);
      setInputValue("");
    }
  };
  const removeChip = (index) => {
    const currentpincodes = getValues(name);
    setValue(
      name,
      currentpincodes.filter((_, i) => i !== index)
    );
  };
  return (
    <StyledChipInput>
      <Chips>
        {pincodes.map((chip, index) => (
          <Chip key={index}>
            <span>{chip}</span>
            <ChipCloseButton type="button" onClick={() => removeChip(index)}>
              <IoIosClose size={28} />
            </ChipCloseButton>
          </Chip>
        ))}
        <InputChip
          id="chip-input"
          type="text"
          placeholder="Type and press Enter"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addChip();
            }
          }}
        />
      </Chips>
    </StyledChipInput>
  );
};

export default ChipInput;
