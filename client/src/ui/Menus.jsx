import React, { createContext, useContext, useState } from "react";
import styled from "styled-components";
import { RxDotsVertical } from "react-icons/rx";
import useOutsideClick from "../hooks/useOutsideClick";

const StyledMenus = styled.div``;
const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  &:hover {
    background-color: var(--color-grey-100);
  }
  & svg {
    color: var(--color-grey-700);
  }
`;
const StyledMenuList = styled.ul`
  position: fixed;
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);
  right: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.4);
  padding: 0.5rem 0;
  z-index: 99;
`;
const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 0.5rem 1.5rem;
  font-size: 1.4rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 1.6rem;
  &:hover {
    background-color: var(--color-grey-200);
  }
  & svg {
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

const MenuContext = createContext();
const Menus = ({ children }) => {
  const [openId, setOpenId] = useState("");
  const [position, setPosition] = useState(null);
  const open = setOpenId;
  const close = () => setOpenId("");

  return (
    <MenuContext.Provider value={{ openId, open, close, position, setPosition }}>
      <StyledMenus>{children}</StyledMenus>
    </MenuContext.Provider>
  );
};
const Toggle = ({ id }) => {
  const { openId, close, open, setPosition } = useContext(MenuContext);
  function handleClick(e) {
    e.stopPropagation();
    const rect = e.target.closest("button").getBoundingClientRect();
    setPosition({
      x: window.innerWidth - rect.width - rect.x + 50,
      y: rect.y + rect.height - 18,
    });
    openId === "" || openId !== id ? open(id) : close();
  }
  return (
    <StyledToggle onClick={handleClick}>
      <RxDotsVertical size={24} />
    </StyledToggle>
  );
};
const MenuList = ({ children, id }) => {
  const { openId, position, close } = useContext(MenuContext);
  const { ref } = useOutsideClick(close, false);
  if (id !== openId) return null;

  return (
    <StyledMenuList ref={ref} position={position}>
      {children}
    </StyledMenuList>
  );
};
const Button = ({ children, icon, onClick }) => {
  return (
    <li>
      <StyledButton onClick={onClick}>
        <span>{children}</span>
      </StyledButton>
    </li>
  );
};
Menus.Toggle = Toggle;
Menus.MenuList = MenuList;
Menus.Button = Button;
export default Menus;
