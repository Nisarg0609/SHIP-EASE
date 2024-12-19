import React from "react";
import styled from "styled-components";

const StyledNotFound = styled.div`
  height: 100dvh;
  background-color: var(--color-grey-100);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const StyledHeading = styled.h1`
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 1rem;
`;
const StyledParagraph = styled.p`
  font-size: 20px;
`;

const NotFound = () => {
  return (
    <StyledNotFound>
      <StyledHeading>404 Error : Page Not Found</StyledHeading>
      <StyledParagraph>
        We&apos;re still building this part of the universe.
      </StyledParagraph>
    </StyledNotFound>
  );
};

export default NotFound;
