import styled from "styled-components";

const FormRow = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.columns};
  gap: 1rem;
  margin-bottom: 5px;
  align-items: center;
`;

export default FormRow;
