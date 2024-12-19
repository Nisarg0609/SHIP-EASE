import Table from "../../../ui/Table";
import Modal from "../../../ui/Modal";
import Menus from "../../../ui/Menus";
import Pagination from "../../../ui/Pagination";
import Confirm from "../../../ui/Confirm";
import { useDeliveryStation, useDeleteDeliveryStation } from "./useDeliveryStation";
import { useSearchParams } from "react-router-dom";
import Spinner from "../../../ui/Spinner";
import { formatDate } from "../../../utils/helper";
import DeliveryStationForm from "./DeliveryStationForm";

const DeliveryStationTable = () => {
  const { data, isLoading } = useDeliveryStation();
  const { removeDeliveryStation } = useDeleteDeliveryStation();
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);

  return (
    <Menus>
      {isLoading && <Spinner />}
      {!isLoading && (
        <Table>
          <Table.Head>
            <Table.HeadCell></Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>City</Table.HeadCell>
            <Table.HeadCell>State</Table.HeadCell>
            <Table.HeadCell>Manager</Table.HeadCell>
            <Table.HeadCell>Created At</Table.HeadCell>
            <Table.HeadCell>Updated At</Table.HeadCell>
            <Table.HeadCell width="5%"></Table.HeadCell>
          </Table.Head>

          <Table.Body>
            {data?.data?.map((deliveryStation, i) => (
              <Table.Row key={deliveryStation._id}>
                <Table.Cell>{(page - 1) * 10 + i + 1}</Table.Cell>
                <Table.Cell>{deliveryStation.name}</Table.Cell>
                <Table.Cell>{deliveryStation.address.city.city}</Table.Cell>
                <Table.Cell>{deliveryStation.address.city.state}</Table.Cell>
                <Table.Cell>{deliveryStation.manager?.name}</Table.Cell>
                <Table.Cell>{formatDate(deliveryStation.createdAt)}</Table.Cell>
                <Table.Cell>{formatDate(deliveryStation.updatedAt)}</Table.Cell>
                <Table.Cell>
                  <Menus.Toggle id={deliveryStation._id} />
                  <Menus.MenuList id={deliveryStation._id}>
                    <Modal.Open opens={`EditDeliveryStation${deliveryStation._id}`}>
                      <Menus.Button>Edit</Menus.Button>
                    </Modal.Open>
                    <Modal.Window name={`EditDeliveryStation${deliveryStation._id}`}>
                      <DeliveryStationForm deliveryStation={deliveryStation} />
                    </Modal.Window>

                    <Modal.Open opens="confirmDelete">
                      <Menus.Button>Delete</Menus.Button>
                    </Modal.Open>
                    <Modal.Window name="confirmDelete">
                      <Confirm
                        btnText="Delete"
                        message="Are you sure you want to delete the deliveryStation?"
                        onConfirm={() => removeDeliveryStation(deliveryStation._id)}
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

export default DeliveryStationTable;
