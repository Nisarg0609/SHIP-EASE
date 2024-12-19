import React, { useImperativeHandle } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Form = styled.form`
  width: ${(props) => (props.width ? props.width : "auto")};
  height: ${(props) => props.height ?? "auto"};
  padding: 1rem;
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-brand-200);
  border-image: radial-gradient(circle, var(--color-grey-500) 0%, rgba(0, 0, 0, 0) 100%) 1;
  border-width: 0px 0 1px 0;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;
const Footer = styled.div`
  text-align: center;
  margin-top: 1rem;
`;
const Body = styled.div``;

export const StyledFormLink = styled(Link)`
  font-size: 12px;
  text-align: center;
  &:hover {
    color: red;
    cursor: pointer;
  }
`;

// eslint-disable-next-line react/display-name
export const FormContainer = React.forwardRef(({ children, onCloseModal }, ref) => {
  useImperativeHandle(ref, () => ({ onCloseModal }));
  return children;
});

// => create ref in Parent Component and pass it in FormContainer
// const formRef = useRef();
// <FormContainer ref={formRef}>
// => call onCloseModal in Parent Component
// formRef?.current?.onCloseModal && formRef?.current?.onCloseModal();

Form.Header = Header;
Form.Body = Body;
Form.Footer = Footer;

export default Form;
