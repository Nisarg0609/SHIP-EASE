import Modal from "../../ui/Modal";
import { HeaderContent, HeaderMain, HeadingMain } from "../../ui/HeaderMain";
import SortBy from "../../ui/SortBy";
import AddButton from "../../ui/AddButton";
import VehicleTable from "../../features/admin/vehicle/VehicleTable";
import VehicleForm from "../../features/admin/vehicle/VehicleForm";

const Vehicle = () => {
  return (
    <Modal>
      <HeaderMain>
        <HeadingMain>Vehicles</HeadingMain>
        <HeaderContent>
          <SortBy
            options={[
              { label: "Default", value: "" },
              { label: "Sort By Type (ASCE)", value: "type" },
              { label: "Sort By Type (ASCE)", value: "-type" },
              { label: "Sort By Warehouse (ASCE)", value: "warehouse" },
              { label: "Sort By Warehouse (ASCE)", value: "-warehouse" },
              { label: "Sort By Created At (ASCE)", value: "createdAt" },
              { label: "Sort By Created At (DSC)", value: "-createdAt" },
            ]}
          />
          <Modal.Open opens="AddVehicle">
            <AddButton />
          </Modal.Open>
          <Modal.Window name="AddVehicle">
            <VehicleForm />
          </Modal.Window>
        </HeaderContent>
      </HeaderMain>
      <VehicleTable />
    </Modal>
  );
};

export default Vehicle;
