import Form from "../../../ui/Form";
import FormRow from "../../../ui/FormRow";
import FormElement from "../../../ui/FormElement";
import Input from "../../../ui/Input";
import { Controller, useForm } from "react-hook-form";
import { useAddDeliveryStation, useEditDeliveryStation } from "./useDeliveryStation";
import Select from "../../../ui/Select";
import { useCityName } from "../city/useCity";

const DeliveryStationForm = ({ onCloseModal, deliveryStation }) => {
  const { data: cities } = useCityName();

  let defaultValues = {
    name: deliveryStation?.name || "",
    address: {
      street: deliveryStation?.address.street || "",
      city: deliveryStation?.address.city._id || "",
      postalCode: deliveryStation?.address.postalCode || "",
    },
  };

  const { register, handleSubmit, formState, control } = useForm({
    defaultValues,
  });
  const { errors } = formState;
  const { addDeliveryStation } = useAddDeliveryStation();
  const { editDeliveryStation } = useEditDeliveryStation();

  function onSubmit(data) {
    deliveryStation
      ? editDeliveryStation({ data, id: deliveryStation._id })
      : addDeliveryStation(data);
    onCloseModal?.();
  }
  return (
    <Form onSubmit={handleSubmit(onSubmit)} width="400px">
      <Form.Header>
        <h1>{!deliveryStation ? "Add" : "Update"} Delivery Station</h1>
      </Form.Header>
      <Form.Body>
        <FormElement label="Name" id="name" error={errors?.name?.message}>
          <Input
            type="text"
            id="name"
            {...register("name", {
              required: "deliveryStation Name is required.",
              validate: (value) =>
                /^[a-zA-Z0-9_]{4,}$/.test(value) || "Please enter a valid name",
            })}
          />
        </FormElement>
        <FormElement
          label="Street"
          id="address.street"
          error={errors?.address?.street?.message}
        >
          <Input
            type="text"
            id="address.street"
            {...register("address.street", {
              required: "Street is required.",
            })}
          />
        </FormElement>
        <FormElement
          label="City"
          id="address.city"
          error={errors?.address?.city?.message}
        >
          <Controller
            name="address.city"
            control={control}
            defaultValue=""
            rules={{ required: "City is required" }}
            render={({ field }) => (
              <Select {...field}>
                {cities?.data?.map((city) => (
                  <option key={city._id} value={city._id}>
                    {city.city}
                  </option>
                ))}
              </Select>
            )}
          />
        </FormElement>

        <FormElement
          label="Postal Code"
          id="address.postalCode"
          error={errors?.address?.postalCode?.message}
        >
          <Input
            type="text"
            id="address.postalCode"
            {...register("address.postalCode", {
              required: "Postal Code is required.",
            })}
          />
        </FormElement>

        <FormRow columns="1fr 1fr">
          <FormElement>
            <Input type="reset" value="Reset" disabled={false} />
          </FormElement>
          <FormElement>
            <Input
              type="submit"
              value={deliveryStation ? "Edit" : "Create"}
              id="submit-button"
              disabled={false}
            />
          </FormElement>
        </FormRow>
      </Form.Body>
    </Form>
  );
};

export default DeliveryStationForm;
