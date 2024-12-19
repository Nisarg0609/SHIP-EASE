import React from "react";
import Select from "./Select";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
const StyledSortBy = styled.div`
  width: ${(props) => (props.width ? props.width : "280px")};
  margin: 0 1rem;
`;
const SortBy = ({ options }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get("sort");

  function handleChange(e) {
    searchParams.set("sort", e.target.value);
    if (searchParams.get("page")) searchParams.set("page", 1);
    setSearchParams(searchParams);
  }
  return (
    <StyledSortBy>
      <Select
        options={options}
        onChange={handleChange}
        value={sort}
        style={{ padding: "0.7rem" }}
      />
    </StyledSortBy>
  );
};
export default SortBy;
