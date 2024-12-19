import Modal from "../../ui/Modal";
import { HeaderContent, HeaderMain, HeadingMain } from "../../ui/HeaderMain";
import SortBy from "../../ui/SortBy";
import AddButton from "../../ui/AddButton";
import UserTable from "../../features/admin/user/UserTable";
import Filter from "../../ui/Filter";
import UserForm from "../../features/admin/user/userForm";

const sortOptions = [
  { label: "Default", value: "" },
  { label: "Sort By Role (ASCE)", value: "role" },
  { label: "Sort By Role (ASCE)", value: "-role" },
  { label: "Sort By Name (ASCE)", value: "name" },
  { label: "Sort By Name (ASCE)", value: "-name" },
  { label: "Sort By Created At (ASCE)", value: "createdAt" },
  { label: "Sort By Created At (DSC)", value: "-createdAt" },
];

const filterOptions = [
  { label: "All", value: "" },
  { label: "Customer", value: "customer" },
  { label: "Warehouse Manager", value: "warehouseManager" },
  { label: "DS Manager", value: "deliveryStationManager" },
  { label: "Warehouse Driver", value: "warehouseDriver" },
  { label: "DS Driver", value: "deliveryStationDriver" },
];

const Vehicle = () => {
  return (
    <Modal>
      <HeaderMain>
        <HeadingMain>Users</HeadingMain>
        <HeaderContent>
          <Filter filterField="role" options={filterOptions} />
          <SortBy options={sortOptions} />
          <Modal.Open opens="AddCity">
            <AddButton />
          </Modal.Open>
          <Modal.Window name="AddCity">
            <UserForm />
          </Modal.Window>
        </HeaderContent>
      </HeaderMain>
      <UserTable />
    </Modal>
  );
};

export default Vehicle;
