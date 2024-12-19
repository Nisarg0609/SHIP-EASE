import styled from "styled-components";
import AddButton from "../../ui/AddButton";
import SortBy from "../../ui/SortBy";
import { HeaderContent, HeaderMain, HeadingMain } from "../../ui/HeaderMain";
import Modal from "../../ui/Modal";
import CityForm from "../../features/admin/city/CityForm";
import CityTable from "../../features/admin/city/CityTable";
import { useState } from "react";

const City = () => {
  return (
    <Modal>
      <HeaderMain>
        <HeadingMain>Cities</HeadingMain>
        <HeaderContent>
          <SortBy
            options={[
              { label: "Default", value: "" },
              { label: "Sort By City (ASCE)", value: "city" },
              { label: "Sort By City (DSC)", value: "-city" },
              { label: "Sort By State (ASCE)", value: "state" },
              { label: "Sort By State (DSC)", value: "-state" },
            ]}
          />
          <Modal.Open opens="AddCity">
            <AddButton />
          </Modal.Open>
          <Modal.Window name="AddCity">
            <CityForm />
          </Modal.Window>
        </HeaderContent>
      </HeaderMain>
      <CityTable />
    </Modal>
  );
};
export default City;
