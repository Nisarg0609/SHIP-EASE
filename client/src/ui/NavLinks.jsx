/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { styled } from "styled-components";

const StyledList = styled.ul`
  margin-top: 2rem;
  overflow: auto;
`;
const StyledListItem = styled.li`
  background-color: rgba(206, 181, 181, 0.22);
  margin-bottom: 0.5rem;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  &:hover {
    background-color: rgba(205, 156, 156, 0.391);
  }
`;
const StyledLink = styled(Link)`
  padding: 0.7rem 1rem;
  display: flex;
  align-items: center;
`;

const NavLinks = ({ navLinks }) => {
  return (
    <StyledList>
      {navLinks.map((navLink) => (
        <StyledListItem key={navLink.name}>
          <StyledLink to={navLink.link}>
            {navLink.icon}

            <span style={{ marginLeft: 10 }}>{navLink.name}</span>
          </StyledLink>
        </StyledListItem>
      ))}
    </StyledList>
  );
};

export default NavLinks;
