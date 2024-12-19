import Form from "../../../ui/Form";
import FormRow from "../../../ui/FormRow";
import FormElement from "../../../ui/FormElement";
import Input from "../../../ui/Input";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useAddWarehouse, useEditWarehouse, useUnassignedCities } from "./useWarehouse";
import Select from "../../../ui/Select";
import { useCityName } from "../city/useCity";
import MultipleSelectCheckmarks from "../../../ui/MultiSelectCheckmarks";

const WarehouseForm = ({ onCloseModal, warehouse }) => {
  const { data: cities } = useCityName();
  const { data: unassignedCities } = useUnassignedCities();

  let defaultValues = {
    name: warehouse?.name || "",
    address: {
      street: warehouse?.address.street || "",
      city: warehouse?.address.city._id || "",
      postalCode: warehouse?.address.postalCode || "",
    },
    transportCities: [],
  };

  const { register, handleSubmit, formState, setValue, getValues, control, watch } =
    useForm({
      defaultValues,
    });
  const { errors } = formState;
  const { addWarehouse } = useAddWarehouse();
  const { editWarehouse } = useEditWarehouse();

  function onSubmit(data) {
    warehouse ? editWarehouse({ data, id: warehouse._id }) : addWarehouse(data);
    onCloseModal?.();
  }
  return (
    <Form onSubmit={handleSubmit(onSubmit)} width="400px">
      <Form.Header>
        <h1>{!warehouse ? "Add" : "Update"} Warehouse</h1>
      </Form.Header>
      <Form.Body>
        <FormElement label="Name" id="name" error={errors?.name?.message}>
          <Input
            type="text"
            id="name"
            {...register("name", {
              required: "Warehouse Name is required.",
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

        {!warehouse && unassignedCities?.length > 0 && (
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
              value={warehouse ? "Edit" : "Create"}
              id="submit-button"
              disabled={false}
            />
          </FormElement>
        </FormRow>
      </Form.Body>
    </Form>
  );
};

export default WarehouseForm;
