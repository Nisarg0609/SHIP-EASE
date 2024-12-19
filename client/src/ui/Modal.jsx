import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import styled from "styled-components";
import useOutsideClick from "../hooks/useOutsideClick";

const StyledModal = styled.div`
  max-height: 90dvh;
  overflow: auto;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3rem 6rem;
  transition: all 0.5s;
`;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;
const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;
  &:hover {
    background-color: var(--color-grey-100);
  }
  & svg {
    color: var(--color-grey-500);
  }
`;

const ModalContext = createContext();
function Modal({ children }) {
  const [openName, setOpenName] = useState("form");
  const close = () => setOpenName("");
  const open = setOpenName;
  const { ref } = useOutsideClick(close);

  return (
    <ModalContext.Provider value={{ openName, close, open, ref }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({ children, opens: opensWindowModal }) {
  const { open } = useContext(ModalContext);
  return cloneElement(children, { onClick: () => open(opensWindowModal) });
}

function Window({ children, name }) {
  const { openName, close, ref } = useContext(ModalContext);
  if (name !== openName) return null;
  // return createPortal(
  return (
    <Overlay>
      <StyledModal ref={ref}>
        <Button onClick={close}>
          <HiXMark size={30} color="red" />
        </Button>
        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </StyledModal>
    </Overlay>
  );
  // ,document.body
  // );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
