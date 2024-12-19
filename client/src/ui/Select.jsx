import styled from "styled-components";

const StyledSelect = styled.select`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  padding: 0.5rem 1rem;
  margin-top: 0.2rem;
  width: 100%;
`;

const Select = ({ options, children, ...props }) => {
  return (
    <StyledSelect {...props}>
      <option value="" disabled hidden>
        Select an option
      </option>
      {options &&
        options.map((option) => (
          <option value={option.value} key={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      {children}
    </StyledSelect>
  );
};

export default Select;
