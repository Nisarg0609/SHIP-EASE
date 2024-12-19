import { Outlet } from "react-router-dom";
import { styled } from "styled-components";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import SideNav from "./SideNav";

const StyledAppLayout = styled.div`
  display: grid;
  grid-template-columns: 250px auto;
  grid-template-rows: 70px auto;
  gap: 0.5rem;
  height: 100dvh;
  padding: 0.5rem;
  background-color: var(--color-grey-300);
`;
const Header = styled.header`
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
`;
const Main = styled.main`
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  padding: 0.8rem;
  overflow: hidden;
`;
const AdminManagerLayout = ({ navLinks }) => {
  return (
    <StyledAppLayout>
      <SideNav>
        <Logo />
        <NavLinks navLinks={navLinks} />
      </SideNav>
      <Header>Header</Header>
      <Main>
        <Outlet />
      </Main>
    </StyledAppLayout>
  );
};
export default AdminManagerLayout;
