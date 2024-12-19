import React from "react";
import Modal from "../../ui/Modal";
import { HeaderContent, HeaderMain, HeadingMain } from "../../ui/HeaderMain";
import SortBy from "../../ui/SortBy";
import AddButton from "../../ui/AddButton";
import WarehouseTable from "../../features/admin/warehouse/WarehouseTable";
import WarehouseForm from "../../features/admin/warehouse/WarehouseForm";

const Warehouse = () => {
  return (
    <Modal>
      <HeaderMain>
        <HeadingMain>Warehouses</HeadingMain>
        <HeaderContent>
          <SortBy
            options={[
              { label: "Default", value: "" },
              { label: "Sort By Created At (ASCE)", value: "createdAt" },
              { label: "Sort By Created At (DSC)", value: "-createdAt" },
            ]}
          />
          <Modal.Open opens="AddWarehouse">
            <AddButton />
          </Modal.Open>
          <Modal.Window name="AddWarehouse">
            <WarehouseForm />
          </Modal.Window>
        </HeaderContent>
      </HeaderMain>
      <WarehouseTable />
    </Modal>
  );
};

export default Warehouse;
