import React from "react";
import styled from "styled-components";
import { Controller } from "react-hook-form";
import { FaAngleDown } from "react-icons/fa6";
import useOutsideClick from "../hooks/useOutsideClick";

const DropdownWrapper = styled.div`
  position: relative;
`;
const DropdownHeader = styled.div`
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ccc;
  background-color: white;
  z-index: 1000;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0;
  margin: 0;
  list-style: none;
`;
const ListItem = styled.li`
  padding: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;
const Checkbox = styled.input`
  margin-right: 10px;
  height: 20px;
  width: 20px;
`;

export default function MultipleSelectCheckmarks({
  name,
  control,
  setValue,
  watch,
  items,
  valueKey = null,
  labelKey = null,
}) {
  const selectedValues = watch(name);
  const closeDropdown = () => {
    document.getElementById("dropdown-list").style.display = "none";
  };

  const { ref } = useOutsideClick(closeDropdown);

  const toggleDropdown = (event) => {
    const dropdown = event.currentTarget.nextSibling;
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  };

  const handleSelection = (value) => {
    const updatedValues = selectedValues.includes(value)
      ? selectedValues.filter((item) => item !== value)
      : [...selectedValues, value];
    setValue(name, updatedValues);
  };

  const getItemLabel = (item) => (labelKey ? item[labelKey] : item);
  const getItemValue = (item) => (valueKey ? item[valueKey] : item);

  return (
    <Controller
      name={name}
      control={control}
      render={() => (
        <DropdownWrapper>
          <DropdownHeader onClick={toggleDropdown}>
            {selectedValues.length > 0 ? (
              <span>
                {selectedValues
                  .map((value) => {
                    const selectedItem = items.find(
                      (item) => getItemValue(item) === value
                    );
                    return selectedItem ? getItemLabel(selectedItem) : value;
                  })
                  .join(", ")}
              </span>
            ) : (
              <span>Select...</span>
            )}
            <span>
              <FaAngleDown />
            </span>
          </DropdownHeader>
          <DropdownList ref={ref} style={{ display: "none" }} id="dropdown-list">
            {items.map((item) => {
              const value = getItemValue(item);
              const label = getItemLabel(item);
              return (
                <ListItem key={value} onClick={() => handleSelection(value)}>
                  <Checkbox
                    type="checkbox"
                    checked={selectedValues.includes(value)}
                    readOnly
                  />
                  <span>{label}</span>
                </ListItem>
              );
            })}
          </DropdownList>
        </DropdownWrapper>
      )}
    />
  );
}
