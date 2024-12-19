import { Link } from "react-router-dom";
import styled from "styled-components";
import logo from "../assets/images/logo.png";

const StyledLogo = styled.div`
  border-bottom: 1px solid var(--color-brand-200);
  padding-bottom: 1rem;
  border-image: radial-gradient(circle, var(--color-grey-500) 0%, rgba(0, 0, 0, 0) 100%) 1;
  border-width: 0px 0 1px 0;
`;
const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;
const Img = styled.img`
  height: 60px;
`;

const Logo = () => {
  return (
    <StyledLogo>
      <StyledLink>
        <Img src={logo} alt="SHIP EASE LOGO" />
        <h3>SHIP EASE</h3>
      </StyledLink>
    </StyledLogo>
  );
};

export default Logo;
