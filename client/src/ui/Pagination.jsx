import React from "react";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { LIMIT } from "../assets/constants/constants";
import TransparentButton from "./TransparentButton";

const StyledPagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const PaginateButtons = styled.div`
  display: flex;
  gap: 2rem;
`;

const Pagination = ({ numOfResults }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const totalPages = Math.ceil(numOfResults / LIMIT);
  const from = (page - 1) * 10 + 1;
  const to = page < totalPages ? page * 10 : numOfResults;

  function prev() {
    const prevPage = page === 1 ? 1 : page - 1;
    searchParams.set("page", `${prevPage}`);
    setSearchParams(searchParams);
  }
  function next() {
    const nextPage = page < totalPages ? page + 1 : page;
    searchParams.set("page", `${nextPage}`);
    setSearchParams(searchParams);
  }

  return (
    <StyledPagination>
      <span>
        Showing {from} to {to}
        out of {numOfResults} results
      </span>
      <PaginateButtons>
        {page && page !== 1 ? (
          <TransparentButton onClick={prev} color="white">
            <MdOutlineKeyboardArrowLeft />
            <span>prev</span>
          </TransparentButton>
        ) : null}
        {numOfResults && page < totalPages ? (
          <TransparentButton onClick={next} color="white">
            <span>next</span>
            <MdOutlineKeyboardArrowRight />
          </TransparentButton>
        ) : null}
      </PaginateButtons>
    </StyledPagination>
  );
};

export default Pagination;
