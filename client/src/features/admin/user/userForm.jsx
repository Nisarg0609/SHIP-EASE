import Form from "../../../ui/Form";
import FormRow from "../../../ui/FormRow";
import FormElement from "../../../ui/FormElement";
import Input from "../../../ui/Input";
import { Controller, useForm } from "react-hook-form";
import { useAddUser, useEditUser } from "./useUser";
import Select from "../../../ui/Select";
import { genderOptions } from "../../../assets/constants/constants";
import { useUnassignedWarehouses } from "../warehouse/useWarehouse";
import { useState } from "react";
import { useUnassignedDeliveryStations } from "../deliveryStation/useDeliveryStation";
import MultiSelectButtons from "../../../ui/MultiSelectButtons";

const UserForm = ({ onCloseModal, user }) => {
  let defaultValues = {
    name: user?.name || "",
    email: user?.email || "",
    password: user?.password || "",
    passwordConfirm: user?.passwordConfirm || "",
    dateOfBirth: user?.dateOfBirth
      ? new Date(user.dateOfBirth)
          .toLocaleDateString("en-GB")
          .split("/")
          .reverse()
          .join("-")
      : "",
    gender: user?.gender || "",
    phone: user?.phone || "",
    warehouse: user?.warehouse || "",
    deliveryStation: user?.deliveryStation || "",
  };

  const { register, handleSubmit, formState, getValues, control, reset } = useForm({
    defaultValues,
  });
  const { errors } = formState;
  const { addUser } = useAddUser();
  const { editUser } = useEditUser();
  const { data: warehouses } = useUnassignedWarehouses();
  const { data: deliveryStations } = useUnassignedDeliveryStations();
  const [managerType, setManagerType] = useState("warehouseManager");

  function onSubmit(data) {
    console.log(data);
    if (!user) {
      if (managerType === "warehouseManager") delete data.deliveryStation;
      if (managerType === "deliveryStationManager") delete data.warehouse;
    }
    user ? editUser({ data, id: user._id }) : addUser(data);
    onCloseModal?.();
  }
  return (
    <Form onSubmit={handleSubmit(onSubmit)} width="800px">
      <Form.Header>
        <h1>{!user ? "Add" : "Update"} Manager</h1>
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

        {!user && (
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
        )}

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
              defaultValue={defaultValues.gender}
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

        {!user && (
          <FormRow columns="2fr 1fr">
            <FormElement
              label="Manager Type"
              error={!managerType && "Please Select Manager Type"}
            >
              <MultiSelectButtons
                buttons={[
                  {
                    label: "Warehouse Manager",
                    handler: () => setManagerType("warehouseManager"),
                    defaultActive: true,
                  },
                  {
                    label: "Delivery Station Manager",
                    handler: () => setManagerType("deliveryStationManager"),
                  },
                ]}
              />
            </FormElement>

            {managerType && managerType === "warehouseManager" && (
              <FormElement
                label="Warehouse"
                id="warehouse"
                error={errors?.warehouse?.message}
              >
                <Controller
                  name="warehouse"
                  control={control}
                  defaultValue={user?.warehouse || ""}
                  rules={{ required: "Warehouse is required" }}
                  render={({ field }) => (
                    <Select {...field}>
                      {warehouses?.data.map((warehouse) => (
                        <option key={warehouse._id} value={warehouse._id}>
                          {warehouse.name}
                        </option>
                      ))}
                    </Select>
                  )}
                />
              </FormElement>
            )}

            {managerType && managerType === "deliveryStationManager" && (
              <FormElement
                label="Delivery Station"
                id="deliveryStation"
                error={errors?.deliveryStation?.message}
              >
                <Controller
                  name="deliveryStation"
                  control={control}
                  defaultValue=""
                  rules={{ required: !user && "delivery Station is required" }}
                  render={({ field }) => (
                    <Select {...field}>
                      {deliveryStations?.data.map((deliveryStation) => (
                        <option key={deliveryStation._id} value={deliveryStation._id}>
                          {deliveryStation.name}
                        </option>
                      ))}
                    </Select>
                  )}
                />
              </FormElement>
            )}
          </FormRow>
        )}

        <FormRow columns="1fr 1fr">
          <FormElement>
            <Input type="reset" value="Reset" disabled={false} />
          </FormElement>
          <FormElement>
            <Input
              type="submit"
              value={user ? "Edit" : "Create"}
              id="submit-button"
              disabled={!managerType}
            />
          </FormElement>
        </FormRow>
      </Form.Body>
    </Form>
  );
};

export default UserForm;
