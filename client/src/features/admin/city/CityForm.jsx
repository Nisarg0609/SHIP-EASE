import React from "react";
import Form from "../../../ui/Form";
import FormRow from "../../../ui/FormRow";
import FormElement from "../../../ui/FormElement";
import Input from "../../../ui/Input";
import ChipInput from "../../../ui/ChipInput";
import { useForm, useWatch } from "react-hook-form";
import { useAddCity, useEditCity } from "./useCity";

const CityForm = ({ onCloseModal, city }) => {
  let defaultValues = city
    ? { pincodes: [], city: city.city, state: city.state, country: city.country }
    : { pincodes: [], city: "", state: "", country: "" };
  const { register, handleSubmit, formState, setValue, getValues, control } = useForm({
    defaultValues,
  });
  const { errors } = formState;
  const { addCity } = useAddCity();
  const { editCity } = useEditCity();

  function onSubmit(data) {
    city ? editCity({ data, id: city._id }) : addCity(data);
    onCloseModal?.();
  }
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Header>
        s<h1>{!city ? "Add" : "Update"} City</h1>
      </Form.Header>
      <Form.Body></Form.Body>
      <Form.Body>
        <FormRow columns="1fr 1fr 1fr">
          <FormElement label="City" id="city" error={errors?.city?.message}>
            <Input
              type="text"
              id="city"
              {...register("city", {
                required: "City is required.",
                validate: (value) =>
                  /^[a-zA-Z ]{2,}$/.test(value) || "Please enter a valid name",
              })}
            />
          </FormElement>
          <FormElement label="State" id="state" error={errors?.state?.message}>
            <Input
              type="text"
              id="state"
              {...register("state", {
                required: "State is required.",
                validate: (value) =>
                  /^[a-zA-Z ]{2,}$/.test(value) || "Please enter a valid name",
              })}
            />
          </FormElement>
          <FormElement label="Country" id="country" error={errors?.country?.message}>
            <Input
              type="text"
              id="country"
              {...register("country", {
                required: "Country is required.",
                validate: (value) =>
                  /^[a-zA-Z ]{2,}$/.test(value) || "Please enter a valid name",
              })}
            />
          </FormElement>
        </FormRow>
        {!city && (
          <FormElement label="Pincodes" error={errors?.pincodes?.message}>
            <ChipInput
              control={control}
              getValues={getValues}
              name="pincodes"
              setValue={setValue}
              useWatch={useWatch}
            />
          </FormElement>
        )}

        <FormRow columns="1fr 1fr">
          <FormElement>
            <Input type="reset" value="Reset" disabled={false} />
          </FormElement>
          <FormElement>
            <Input
              type="submit"
              value={city ? "Edit" : "Create"}
              id="submit-button"
              disabled={false}
            />
          </FormElement>
        </FormRow>
      </Form.Body>
    </Form>
  );
};

export default CityForm;
