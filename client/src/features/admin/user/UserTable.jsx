import Table from "../../../ui/Table";
import Modal from "../../../ui/Modal";
import Menus from "../../../ui/Menus";
import Pagination from "../../../ui/Pagination";
import Confirm from "../../../ui/Confirm";
import { useUser, useDeleteUser } from "./useUser";
import { useSearchParams } from "react-router-dom";
import Spinner from "../../../ui/Spinner";
import { formatDate } from "../../../utils/helper";
import UserForm from "./userForm";

const UserTable = () => {
  const { data, isLoading } = useUser();
  console.log(data);
  const { removeUser } = useDeleteUser();
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
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Role</Table.HeadCell>
            {/* <Table.HeadCell>DoB</Table.HeadCell> */}
            {/* <Table.HeadCell>Gender</Table.HeadCell> */}
            <Table.HeadCell>Phone</Table.HeadCell>
            <Table.HeadCell>Warehouse</Table.HeadCell>
            <Table.HeadCell>Delivery Station</Table.HeadCell>
            <Table.HeadCell>License</Table.HeadCell>
            <Table.HeadCell>IsAvailable</Table.HeadCell>
            <Table.HeadCell>Created At</Table.HeadCell>
            <Table.HeadCell>Updated At</Table.HeadCell>
            <Table.HeadCell width="5%"></Table.HeadCell>
          </Table.Head>

          <Table.Body>
            {data?.data?.map((user, i) => (
              <Table.Row key={user._id}>
                <Table.Cell>{(page - 1) * 10 + i + 1}</Table.Cell>
                <Table.Cell>{user.name}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>{user.role}</Table.Cell>
                {/* <Table.Cell>{formatDate(user.dateOfBirth)}</Table.Cell> */}
                {/* <Table.Cell>{user.gender}</Table.Cell> */}
                <Table.Cell>{user.phone}</Table.Cell>
                <Table.Cell>{user.warehouse?.name ?? "-"}</Table.Cell>
                <Table.Cell>{user.deliveryStation?.name ?? "-"}</Table.Cell>
                <Table.Cell>{user.driverLicenseNumber ?? "-"}</Table.Cell>
                <Table.Cell>
                  {user.isDriverAvailable === undefined
                    ? "-"
                    : user.isDriverAvailable
                    ? "Yes"
                    : "No"}
                </Table.Cell>
                <Table.Cell>{formatDate(user.createdAt)}</Table.Cell>
                <Table.Cell>{formatDate(user.updatedAt)}</Table.Cell>
                <Table.Cell>
                  {user.role !== "admin" && <Menus.Toggle id={user._id} />}

                  <Menus.MenuList id={user._id}>
                    <Modal.Open opens={`EditUser${user._id}`}>
                      <Menus.Button>Edit</Menus.Button>
                    </Modal.Open>
                    <Modal.Window name={`EditUser${user._id}`}>
                      <UserForm user={user} />
                    </Modal.Window>

                    <Modal.Open opens="confirmDelete">
                      <Menus.Button>Delete</Menus.Button>
                    </Modal.Open>
                    <Modal.Window name="confirmDelete">
                      <Confirm
                        btnText="Delete"
                        message="Are you sure you want to delete the user?"
                        onConfirm={() => removeUser(user._id)}
                      />
                    </Modal.Window>
                  </Menus.MenuList>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.FooterCell colSpan={14}>
                <Pagination numOfResults={data?.length} />
              </Table.FooterCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      )}
    </Menus>
  );
};

export default UserTable;

// id name email role DOB gender phone warehouse delivery_station license_number Available
