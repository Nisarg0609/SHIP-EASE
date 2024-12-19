import styled from "styled-components";

const TableContainer = styled.div`
  width: ${(props) => (props.width ? props.width : "100%")};
  overflow: auto;
  margin-top: 14px;
  position: relative;
`;
const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border-radius: 8px;
`;
const TableHead = styled.thead`
  background-color: #82c2ba48;
  font-size: 1.1rem;
  text-transform: uppercase;
  z-index: 2;
`;
const TableHeadCell = styled.th`
  padding: 16px 20px;
  text-align: left;
  font-weight: bold;
  background-color: #82c2ba;
  position: sticky;
  top: 0;
  z-index: 1;
  color: white;
  width: ${(props) => props.width || "auto"};
`;
const TableBody = styled.tbody``;
const TableRow = styled.tr`
  &:hover {
    background-color: #e9ecef;
  }
`;
const TableCell = styled.td`
  padding: 10px 20px;
  border-bottom: 1px solid #e0e0e0;
  text-align: left;
`;
const TableFooter = styled.tfoot`
  position: sticky;
  bottom: 0;
  background-color: #82c2ba;
  color: white;
  text-align: center;
  background-color: #82c2ba;
  color: white;
  box-shadow: rgba(0, 0, 0, 0.2) 0px -2px 4px;
`;
const TableFooterCell = styled.td`
  padding: 16px 20px;
  text-align: center;
  color: white;
  font-weight: bold;
  background-color: #82c2ba;
  position: sticky;
  bottom: 0;
  z-index: 1;
`;

const Table = ({ children }) => {
  return (
    <TableContainer>
      <StyledTable>{children}</StyledTable>
    </TableContainer>
  );
};

Table.Head = TableHead;
Table.Body = TableBody;
Table.Row = TableRow;
Table.HeadCell = TableHeadCell;
Table.Cell = TableCell;
Table.Footer = TableFooter;
Table.FooterCell = TableFooterCell;

export default Table;
