import Table from "../../../ui/Table";
import Modal from "../../../ui/Modal";
import Menus from "../../../ui/Menus";
import Pagination from "../../../ui/Pagination";
import Confirm from "../../../ui/Confirm";
import { useVehicle, useDeleteVehicle } from "./useVehicle";
import { useSearchParams } from "react-router-dom";
import Spinner from "../../../ui/Spinner";
import { formatDate } from "../../../utils/helper";
import VehicleForm from "./VehicleForm";

const VehicleTable = () => {
  const { data, isLoading } = useVehicle();
  console.log(data);
  const { removeVehicle } = useDeleteVehicle();
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);

  return (
    <Menus>
      {isLoading && <Spinner />}
      {!isLoading && (
        <Table>
          <Table.Head>
            <Table.HeadCell></Table.HeadCell>
            <Table.HeadCell>Vehicle Number</Table.HeadCell>
            <Table.HeadCell>Type</Table.HeadCell>
            <Table.HeadCell>Warehosue</Table.HeadCell>
            <Table.HeadCell>Created At</Table.HeadCell>
            <Table.HeadCell>Updated At</Table.HeadCell>
            <Table.HeadCell width="5%"></Table.HeadCell>
          </Table.Head>

          <Table.Body>
            {data?.data?.map((vehicle, i) => (
              <Table.Row key={vehicle._id}>
                <Table.Cell>{(page - 1) * 10 + i + 1}</Table.Cell>
                <Table.Cell>{vehicle.vehicleNumber}</Table.Cell>
                <Table.Cell>{vehicle.type}</Table.Cell>
                <Table.Cell>{vehicle.warehouse.name}</Table.Cell>
                <Table.Cell>{formatDate(vehicle.createdAt)}</Table.Cell>
                <Table.Cell>{formatDate(vehicle.updatedAt)}</Table.Cell>
                <Table.Cell>
                  <Menus.Toggle id={vehicle._id} />
                  <Menus.MenuList id={vehicle._id}>
                    <Modal.Open opens={`EditDeliveryStation${vehicle._id}`}>
                      <Menus.Button>Edit</Menus.Button>
                    </Modal.Open>
                    <Modal.Window name={`EditDeliveryStation${vehicle._id}`}>
                      <VehicleForm vehicle={vehicle} />
                    </Modal.Window>

                    <Modal.Open opens="confirmDelete">
                      <Menus.Button>Delete</Menus.Button>
                    </Modal.Open>
                    <Modal.Window name="confirmDelete">
                      <Confirm
                        btnText="Delete"
                        message="Are you sure you want to delete the vehicle?"
                        onConfirm={() => removeVehicle(vehicle._id)}
                      />
                    </Modal.Window>
                  </Menus.MenuList>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.FooterCell colSpan={10}>
                <Pagination numOfResults={data?.length} />
              </Table.FooterCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      )}
    </Menus>
  );
};

export default VehicleTable;
