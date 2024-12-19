import { useForm } from "react-hook-form";
import { useLogin } from "../../features/auth/useLogin";
import { MdOutlineLock } from "react-icons/md";
import Form, { StyledFormLink } from "../../ui/Form";
import React from "react";
import Input from "../../ui/Input";
import FormElement from "../../ui/FormElement";
import StyledAuth, { StyledAuthHeading } from "../../ui/Auth";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { mutate, isPending: isProcessing } = useLogin();
  const onSubmit = (data) => mutate(data);

  return (
    <StyledAuth>
      <div
        style={{
          padding: "1rem",
          marginBottom: "2rem",
          background: "white",
          color: "black",
        }}
      >
        For admin panel use this credentials:
        <p>email - patelnisarg2002@gmail.com</p>
        <p>pass - Nisarg2002@</p>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)} width="350px">
        <Form.Header>
          <MdOutlineLock size={27} />
          <StyledAuthHeading>Sign In</StyledAuthHeading>
        </Form.Header>

        <Form.Body>
          <FormElement label="Email Address" error={errors?.email?.message} id="email">
            <Input
              type="text"
              id="email"
              {...register("email", {
                required: "Email is required",
                validate: (value) =>
                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) ||
                  "Invalid Email Format",
              })}
            />
          </FormElement>
          <FormElement label="Password" error={errors?.password?.message} id="password">
            <Input
              type="password"
              id="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
                validate: (value) =>
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(
                    value
                  ) ||
                  "Password Should include an uppercase letter, a lowercase letter, a number, and a special character.",
              })}
            />
          </FormElement>
          <FormElement>
            <Input
              type="submit"
              value="Submit"
              id="submit-button"
              disabled={isProcessing}
            />
          </FormElement>
        </Form.Body>

        <Form.Footer>
          <StyledFormLink to="/signup">
            DON&apos;T HAVE AN ACCOUNT? SIGN UP
          </StyledFormLink>
        </Form.Footer>
      </Form>
    </StyledAuth>
  );
};

export default Login;
