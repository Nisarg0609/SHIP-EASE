import Form from "../../../ui/Form";
import FormRow from "../../../ui/FormRow";
import FormElement from "../../../ui/FormElement";
import Input from "../../../ui/Input";
import { Controller, useForm } from "react-hook-form";
import { useAddVehicle, useEditVehicle } from "./useVehicle";
import Select from "../../../ui/Select";
import { VEHICLE_TYPES } from "../../../assets/constants/constants";
import { useWarehouseName } from "../warehouse/useWarehouse";

const VehicleForm = ({ onCloseModal, vehicle }) => {
  let defaultValues = {
    vehicleNumber: vehicle?.vehicleNumber || "",
    type: vehicle?.type || "",
    warehouse: vehicle?.warehouse._id || "",
  };

  const { register, handleSubmit, formState, control, reset } = useForm({
    defaultValues,
  });
  const { errors } = formState;
  const { addVehicle } = useAddVehicle();
  const { editVehicle } = useEditVehicle();
  const { data: warehouses, isLoading } = useWarehouseName();

  function onSubmit(data) {
    vehicle ? editVehicle({ data, id: vehicle._id }) : addVehicle(data);
    onCloseModal?.();
  }
  return (
    <Form onSubmit={handleSubmit(onSubmit)} width="400px">
      <Form.Header>
        <h1>{!vehicle ? "Add" : "Update"} Vehicle</h1>
      </Form.Header>
      <Form.Body>
        <FormElement
          label="Vehicle Number"
          id="vehicleNumber"
          error={errors?.vehicleNumber?.message}
        >
          <Input
            type="text"
            id="vehicleNumber"
            {...register("vehicleNumber", {
              required: "Vehicle Number is required.",
              validate: (value) =>
                /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/.test(value) ||
                "Please enter a valid Vehicle Number",
            })}
          />
        </FormElement>
        <FormElement label="Type" id="type" error={errors?.type?.message}>
          <Controller
            name="type"
            control={control}
            defaultValue=""
            rules={{ required: "Type is required" }}
            render={({ field }) => (
              <Select {...field}>
                {VEHICLE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            )}
          />
        </FormElement>

        <FormElement label="Warehouse" id="warehouse" error={errors?.warehouse?.message}>
          <Controller
            name="warehouse"
            control={control}
            defaultValue=""
            rules={{ required: "Warehouse is required" }}
            render={({ field }) => (
              <Select {...field}>
                {warehouses?.data?.map((warehouse) => (
                  <option key={warehouse._id} value={warehouse._id}>
                    {warehouse.name}
                  </option>
                ))}
              </Select>
            )}
          />
        </FormElement>

        <FormRow columns="1fr 1fr">
          <FormElement>
            <Input type="reset" value="Reset" disabled={false} />
          </FormElement>
          <FormElement>
            <Input
              type="submit"
              value={vehicle ? "Edit" : "Create"}
              id="submit-button"
              disabled={false}
            />
          </FormElement>
        </FormRow>
      </Form.Body>
    </Form>
  );
};

export default VehicleForm;
