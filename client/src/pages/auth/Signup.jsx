import StyledAuth, { StyledAuthHeading } from "../../ui/Auth";
import { MdOutlineLock } from "react-icons/md";
import { Controller, useForm } from "react-hook-form";
import { useSignup } from "../../features/auth/useSignup";
import Form, { StyledFormLink } from "../../ui/Form";
import { genderOptions } from "../../assets/constants/constants";
import Input from "../../ui/Input";
import FormElement from "../../ui/FormElement";
import FormRow from "../../ui/FormRow";
import Select from "../../ui/Select";

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    control,
  } = useForm();
  const { mutate, isPending: isProcessing } = useSignup();
  const onSubmit = (data) => mutate(data);

  return (
    <StyledAuth>
      <Form onSubmit={handleSubmit(onSubmit)} width="600px">
        <Form.Header>
          <MdOutlineLock size={27} />
          <StyledAuthHeading>Sign Up</StyledAuthHeading>
        </Form.Header>

        <Form.Body>
          <FormRow columns="1fr 1fr">
            <FormElement label="Name" error={errors?.name?.message} id="name">
              <Input
                type="text"
                id="name"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 3,
                    message: "Name should be at least 3 characters long",
                  },
                })}
              />
            </FormElement>
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
          </FormRow>

          <FormRow columns="1fr 1fr">
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
            <FormElement
              label="Confirm Password"
              error={errors?.passwordConfirm?.message}
              id="passwordConfirm"
            >
              <Input
                type="password"
                id="passwordConfirm"
                {...register("passwordConfirm", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    getValues("password") === value || "Passwords do not match",
                })}
              />
            </FormElement>
          </FormRow>

          <FormRow columns="1fr 1fr 1fr">
            <FormElement
              label="Date of Birth"
              error={errors?.dateOfBirth?.message}
              id="dateOfBirthsword"
            >
              <Input
                type="date"
                id="dateOfBirth"
                {...register("dateOfBirth", {
                  required: "Date of Birth is required",
                  validate: (value) =>
                    value <= new Date().toISOString().split("T")[0] ||
                    "Date of Birth cannot be in the future",
                })}
              />
            </FormElement>
            <FormElement label="Gender" error={errors?.gender?.message} id="gender">
              <Controller
                name="gender"
                control={control}
                defaultValue=""
                rules={{ required: "Gender is required" }}
                render={({ field }) => <Select options={genderOptions} {...field} />}
              />
            </FormElement>
            <FormElement label="Contact Number" error={errors?.phone?.message} id="phone">
              <Input
                type="text"
                id="phone"
                {...register("phone", {
                  required: "Phone Number is required",
                  validate: (value) => /^[6-9]\d{9}$/.test(value) || "Invalid Contact",
                })}
              />
            </FormElement>
          </FormRow>
          <Input
            type="submit"
            value="Submit"
            id="submit-button"
            disabled={isProcessing}
          />
        </Form.Body>

        <Form.Footer>
          <StyledFormLink to="/login">ALREADY HAVE AN ACCOUNT? SIGN IN</StyledFormLink>
        </Form.Footer>
      </Form>
    </StyledAuth>
  );
};

export default Signup;
