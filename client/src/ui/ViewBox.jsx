import styled from "styled-components";

const ViewBox = styled.div`
  max-width: 500px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 1rem 0rem;
  gap: 1rem;
  height: 100%;
`;
const Item = styled.span`
  padding: 0.5rem;
  font-size: 18px;
  border-radius: var(--border-radius-sm);
  color: var(--color-indigo-700);
  background-color: var(--color-silver-100);
`;

const Text = styled.p`
  font-size: 20px;
`;

ViewBox.Item = Item;
ViewBox.Text = Text;

export default ViewBox;
