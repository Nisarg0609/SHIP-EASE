import React from "react";
import { useForm, useWatch } from "react-hook-form";
import styled from "styled-components";
import Form from "../../../ui/Form";
import FormElement from "../../../ui/FormElement";
import ChipInput from "../../../ui/ChipInput";
import { useAddPincodes } from "./useCity";
import Input from "../../../ui/Input";

const PincodeForm = ({ cityId, onCloseModal }) => {
  const { register, handleSubmit, formState, setValue, getValues, control } = useForm({
    defaultValues: { pincodes: [] },
  });
  const { errors } = formState;
  const { addPincodes } = useAddPincodes();

  function onSubmit(data) {
    addPincodes({ data, id: cityId });
    onCloseModal?.();
  }
  return (
    <Form onSubmit={handleSubmit(onSubmit)} width="500px">
      <Form.Body>
        <FormElement label="Pincodes" error={errors?.pincodes?.message}>
          <ChipInput
            control={control}
            getValues={getValues}
            name="pincodes"
            setValue={setValue}
            useWatch={useWatch}
          />
        </FormElement>
        <FormElement>
          <Input type="submit" value="Add" id="submit-button" disabled={false} />
        </FormElement>
      </Form.Body>
    </Form>
  );
};

export default PincodeForm;
