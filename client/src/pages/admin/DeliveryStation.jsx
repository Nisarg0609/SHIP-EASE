import Modal from "../../ui/Modal";
import { HeaderContent, HeaderMain, HeadingMain } from "../../ui/HeaderMain";
import SortBy from "../../ui/SortBy";
import AddButton from "../../ui/AddButton";
import DeliveryStationTable from "../../features/admin/deliveryStation/DeliveryStationTable";
import DeliveryStationForm from "../../features/admin/deliveryStation/DeliveryStationForm";

const DeliveryStation = () => {
  return (
    <Modal>
      <HeaderMain>
        <HeadingMain>Delivery Stations</HeadingMain>
        <HeaderContent>
          <SortBy
            options={[
              { label: "Default", value: "" },
              { label: "Sort By Created At (ASCE)", value: "createdAt" },
              { label: "Sort By Created At (DSC)", value: "-createdAt" },
            ]}
          />
          <Modal.Open opens="AddDeliveryStation">
            <AddButton />
          </Modal.Open>
          <Modal.Window name="AddDeliveryStation">
            <DeliveryStationForm />
          </Modal.Window>
        </HeaderContent>
      </HeaderMain>
      <DeliveryStationTable />
    </Modal>
  );
};

export default DeliveryStation;
