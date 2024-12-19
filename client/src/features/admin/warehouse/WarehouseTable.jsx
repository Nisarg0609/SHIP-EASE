import React from "react";
import Table from "../../../ui/Table";
import Modal from "../../../ui/Modal";
import TransparentButton from "../../../ui/TransparentButton";
import Menus from "../../../ui/Menus";
import Pagination from "../../../ui/Pagination";
import Confirm from "../../../ui/Confirm";
import { useWarehouse, useDeleteWarehouse } from "./useWarehouse";
import { useSearchParams } from "react-router-dom";
import Spinner from "../../../ui/Spinner";
import { formatDate } from "../../../utils/helper";
import ViewBox from "../../../ui/ViewBox";
import WarehouseForm from "./WarehouseForm";
import TransportCityForm from "./TransportCityForm";

const WarehouseTable = () => {
  const { data, isLoading } = useWarehouse();
  const { removeWarehouse } = useDeleteWarehouse();
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
            <Table.HeadCell>Transport Cities</Table.HeadCell>
            <Table.HeadCell>Transport Cities</Table.HeadCell>
            <Table.HeadCell>Created At</Table.HeadCell>
            <Table.HeadCell>Updated At</Table.HeadCell>
            <Table.HeadCell width="5%"></Table.HeadCell>
          </Table.Head>

          <Table.Body>
            {data?.data?.map((warehouse, i) => (
              <Table.Row key={warehouse._id}>
                <Table.Cell>{(page - 1) * 10 + i + 1}</Table.Cell>
                <Table.Cell>{warehouse.name}</Table.Cell>
                <Table.Cell>{warehouse.address.city.city}</Table.Cell>
                <Table.Cell>{warehouse.address.city.state}</Table.Cell>
                <Table.Cell>{warehouse.manager?.name}</Table.Cell>
                <Table.Cell>
                  <Modal.Open opens={`ViewTransportCities${warehouse._id}`}>
                    <TransparentButton>View Cities</TransparentButton>
                  </Modal.Open>
                  <Modal.Window name={`ViewTransportCities${warehouse._id}`}>
                    <ViewBox>
                      {(!warehouse?.transportCities ||
                        warehouse?.transportCities.length === 0) && (
                        <ViewBox.Text>Transport cities Not Available</ViewBox.Text>
                      )}
                      {warehouse?.transportCities?.map((transportCity) => (
                        <div key={transportCity._id}>
                          <ViewBox.Item>{transportCity.city}</ViewBox.Item>
                        </div>
                      ))}
                    </ViewBox>
                  </Modal.Window>
                </Table.Cell>

                <Table.Cell>
                  <Modal.Open opens={`AddTransportCities${warehouse._id}`}>
                    <TransparentButton>Add Cities</TransparentButton>
                  </Modal.Open>
                  <Modal.Window name={`AddTransportCities${warehouse._id}`}>
                    <TransportCityForm warehouseId={warehouse._id} />
                  </Modal.Window>
                </Table.Cell>

                <Table.Cell>{formatDate(warehouse.createdAt)}</Table.Cell>
                <Table.Cell>{formatDate(warehouse.updatedAt)}</Table.Cell>
                <Table.Cell>
                  <Menus.Toggle id={warehouse._id} />
                  <Menus.MenuList id={warehouse._id}>
                    <Modal.Open opens={`EditWarehouse${warehouse._id}`}>
                      <Menus.Button>Edit</Menus.Button>
                    </Modal.Open>
                    <Modal.Window name={`EditWarehouse${warehouse._id}`}>
                      <WarehouseForm warehouse={warehouse} />
                    </Modal.Window>

                    <Modal.Open opens="confirmDelete">
                      <Menus.Button>Delete</Menus.Button>
                    </Modal.Open>
                    <Modal.Window name="confirmDelete">
                      <Confirm
                        btnText="Delete"
                        message="Are you sure you want to delete the warehouse?"
                        onConfirm={() => removeWarehouse(warehouse._id)}
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

export default WarehouseTable;
