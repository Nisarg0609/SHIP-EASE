import Modal from "../../ui/Modal";
import { HeaderContent, HeaderMain, HeadingMain } from "../../ui/HeaderMain";
import SortBy from "../../ui/SortBy";
import AddButton from "../../ui/AddButton";
import ProductCategoryTable from "../../features/admin/productCategory/ProductCategoryTable";
import ProductCategoryForm from "../../features/admin/productCategory/ProductCategoryForm";
// import UserTable from "../../features/admin/user/UserTable";
// import UserForm from "../../features/admin/user/userForm";

const sortOptions = [
  { label: "Default", value: "" },
  { label: "Sort By Name (ASCE)", value: "name" },
  { label: "Sort By Name (ASCE)", value: "-name" },
  { label: "Sort By Parent Category (ASCE)", value: "parentCategory" },
  { label: "Sort By Parent Category (ASCE)", value: "-parentCategory" },
  { label: "Sort By Created At (ASCE)", value: "createdAt" },
  { label: "Sort By Created At (DSC)", value: "-createdAt" },
];

const Vehicle = () => {
  return (
    <Modal>
      <HeaderMain>
        <HeadingMain>Product Categories</HeadingMain>
        <HeaderContent>
          <SortBy options={sortOptions} />
          <Modal.Open opens="AddCity">
            <AddButton />
          </Modal.Open>
          <Modal.Window name="AddCity">
            <ProductCategoryForm />
          </Modal.Window>
        </HeaderContent>
      </HeaderMain>
      <ProductCategoryTable />
    </Modal>
  );
};

export default Vehicle;
