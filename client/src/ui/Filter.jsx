import React from "react";
import { useSearchParams } from "react-router-dom";
import styled, { css } from "styled-components";

const StyledFilter = styled.div`
  border: 1px solid var(--color-grey-200);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-sm);
  padding: 0.3rem;
  display: flex;
  gap: 0.4rem;
`;
const FilterButton = styled.button`
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
  padding: 0.3rem 0.8rem;
  transition: all 0.3s;
  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
`;
const Filter = ({ filterField, options }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currectFilter = searchParams.get(filterField) || options.at(0).value;
  function handleClick(value) {
    value ? searchParams.set(filterField, value) : searchParams.delete(filterField);
    if (searchParams.get("page")) searchParams.set("page", 1);
    setSearchParams(searchParams);
  }
  return (
    <StyledFilter>
      {options.map((option) => (
        <FilterButton
          key={option.value}
          $active={option.value === currectFilter}
          disabled={option.value === currectFilter}
          onClick={() => handleClick(option.value)}
        >
          {option.label}
        </FilterButton>
      ))}
    </StyledFilter>
  );
};
export default Filter;
