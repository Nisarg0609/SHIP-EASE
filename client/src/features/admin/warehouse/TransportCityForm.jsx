import React from "react";
import { useForm } from "react-hook-form";
import Form from "../../../ui/Form";
import FormElement from "../../../ui/FormElement";
import { useAddTransportCities } from "./useWarehouse";
import Input from "../../../ui/Input";
import MultipleSelectCheckmarks from "../../../ui/MultiSelectCheckmarks";
import { useUnassignedCities } from "./useWarehouse";

const TransportCityForm = ({ warehouseId, onCloseModal }) => {
  const { data: unassignedCities } = useUnassignedCities();
  const { handleSubmit, setValue, getValues, control, watch } = useForm({
    defaultValues: { transportCities: [] },
  });
  const { addTransportCity } = useAddTransportCities();

  function onSubmit(data) {
    addTransportCity({ data, id: warehouseId });
    onCloseModal?.();
    console.log(data);
  }
  return (
    <Form onSubmit={handleSubmit(onSubmit)} width="500px" height="300px">
      <Form.Body>
        {(!unassignedCities || unassignedCities.length === 0) && (
          <p>No Unassigned Cities Found</p>
        )}
        {unassignedCities && unassignedCities.length > 0 && (
          <FormElement label="Transport Cities">
            <MultipleSelectCheckmarks
              name="transportCities"
              items={unassignedCities?.data}
              control={control}
              setValue={setValue}
              watch={watch}
              valueKey="_id"
              labelKey="city"
            />
          </FormElement>
        )}
        <FormElement>
          <Input type="submit" value="Add" id="submit-button" disabled={false} />
        </FormElement>
      </Form.Body>
    </Form>
  );
};

export default TransportCityForm;
