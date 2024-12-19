import React from "react";
import Table from "../../../ui/Table";
import Modal from "../../../ui/Modal";
import TransparentButton from "../../../ui/TransparentButton";
import Menus from "../../../ui/Menus";
import Pagination from "../../../ui/Pagination";
import Confirm from "../../../ui/Confirm";
import CityForm from "./CityForm";
import styled from "styled-components";
import { useCity, useDeleteCity } from "./useCity";
import { useSearchParams } from "react-router-dom";
import PincodeForm from "./PincodeForm";
import Spinner from "../../../ui/Spinner";
import { formatDate } from "../../../utils/helper";
import ViewBox from "../../../ui/ViewBox";

const CityTable = () => {
  const { data, isLoading } = useCity();
  console.log(data);
  const { removeCity } = useDeleteCity();
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);

  return (
    <Menus>
      {isLoading && <Spinner />}
      {!isLoading && (
        <Table>
          <Table.Head>
            <Table.HeadCell></Table.HeadCell>
            <Table.HeadCell>City</Table.HeadCell>
            <Table.HeadCell width="12%">State</Table.HeadCell>
            <Table.HeadCell>Country</Table.HeadCell>
            <Table.HeadCell>View Pincodes</Table.HeadCell>
            <Table.HeadCell>Add Pincodes</Table.HeadCell>
            <Table.HeadCell>Created At</Table.HeadCell>
            <Table.HeadCell>Updated At</Table.HeadCell>
            <Table.HeadCell width="5%"></Table.HeadCell>
          </Table.Head>

          <Table.Body>
            {data?.data?.map((city, i) => (
              <Table.Row key={city._id}>
                <Table.Cell>{(page - 1) * 10 + i + 1}</Table.Cell>
                <Table.Cell>{city.city}</Table.Cell>
                <Table.Cell>{city.state}</Table.Cell>
                <Table.Cell>{city.country}</Table.Cell>
                <Table.Cell>
                  <Modal.Open opens={`ViewPincodes${city._id}`}>
                    <TransparentButton>View Pincodes</TransparentButton>
                  </Modal.Open>
                  <Modal.Window name={`ViewPincodes${city._id}`}>
                    <ViewBox>
                      {(!city?.pincodes || city?.pincodes.length === 0) && (
                        <ViewBox.Text>Pincodes Not Available</ViewBox.Text>
                      )}
                      {city?.pincodes?.map((pincode) => (
                        <div key={pincode}>
                          <ViewBox.Item>{pincode}</ViewBox.Item>
                        </div>
                      ))}
                    </ViewBox>
                  </Modal.Window>
                </Table.Cell>
                <Table.Cell>
                  <Modal.Open opens={`AddPincodes${city._id}`}>
                    <TransparentButton>Add Pincodes</TransparentButton>
                  </Modal.Open>
                  <Modal.Window name={`AddPincodes${city._id}`}>
                    <PincodeForm cityId={city._id} />
                  </Modal.Window>
                </Table.Cell>

                <Table.Cell>{formatDate(city.createdAt)}</Table.Cell>
                <Table.Cell>{formatDate(city.updatedAt)}</Table.Cell>
                <Table.Cell>
                  <Menus.Toggle id={city._id} />
                  <Menus.MenuList id={city._id}>
                    <Modal.Open opens={`EditCity${city._id}`}>
                      <Menus.Button>Edit</Menus.Button>
                    </Modal.Open>
                    <Modal.Window name={`EditCity${city._id}`}>
                      <CityForm city={city} />
                    </Modal.Window>

                    <Modal.Open opens="confirmDelete">
                      <Menus.Button>Delete</Menus.Button>
                    </Modal.Open>
                    <Modal.Window name="confirmDelete">
                      <Confirm
                        btnText="Delete"
                        message="Are you sure you want to delete the city?"
                        onConfirm={() => removeCity(city._id)}
                      />
                    </Modal.Window>
                  </Menus.MenuList>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.FooterCell colSpan={9}>
                <Pagination numOfResults={data?.length} />
              </Table.FooterCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      )}
    </Menus>
  );
};

export default CityTable;
