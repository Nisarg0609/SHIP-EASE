import React, { Children } from "react";
import { styled } from "styled-components";

const Nav = styled.nav`
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  padding: 0.5rem 1rem;
  grid-row: 1/-1;
  overflow: auto;
`;

const SideNav = ({ children }) => {
  return (
    <Nav>
      <div>{children}</div>
    </Nav>
  );
};

export default SideNav;
