import Table from "../../../ui/Table";
import Modal from "../../../ui/Modal";
import Menus from "../../../ui/Menus";
import Pagination from "../../../ui/Pagination";
import Confirm from "../../../ui/Confirm";
import {
  useProductCategory,
  useDeleteProductCategory,
  useSubProductCategory,
} from "./useProductCategory";
import { useSearchParams } from "react-router-dom";
import Spinner from "../../../ui/Spinner";
import { formatDate } from "../../../utils/helper";
import ProductCategoryForm from "./ProductCategoryForm";
import TransparentButton from "../../../ui/TransparentButton";
import CategoryTree from "./CategoryTree";
import styled from "styled-components";
import CategoryDetails from "./CategoryDetails";

const ProductCategoryTable = () => {
  const { data, isLoading } = useProductCategory();
  const { data: categories } = useSubProductCategory();
  console.log(data);
  const { removeProductCategory } = useDeleteProductCategory();
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
            <Table.HeadCell>Description</Table.HeadCell>
            <Table.HeadCell>Parent Category</Table.HeadCell>
            <Table.HeadCell>Created At</Table.HeadCell>
            <Table.HeadCell>Updated At</Table.HeadCell>
            <Table.HeadCell>View Details</Table.HeadCell>
            <Table.HeadCell width="5%"></Table.HeadCell>
          </Table.Head>

          <Table.Body>
            {data?.data?.map((productCategory, i) => (
              <Table.Row key={productCategory._id}>
                <Table.Cell>{(page - 1) * 10 + i + 1}</Table.Cell>
                <Table.Cell>{productCategory.name}</Table.Cell>
                <Table.Cell width="20%">
                  {productCategory.description?.length > 30
                    ? productCategory.description?.slice(0, 30) + "..."
                    : productCategory.description}
                </Table.Cell>
                <Table.Cell>
                  {productCategory.parentCategory?.name || "Root Category"}
                </Table.Cell>
                <Table.Cell>{formatDate(productCategory.createdAt)}</Table.Cell>
                <Table.Cell>{formatDate(productCategory.updatedAt)}</Table.Cell>
                <Table.Cell>
                  <Modal.Open opens={`details${productCategory._id}`}>
                    <TransparentButton>View Details</TransparentButton>
                  </Modal.Open>
                  <Modal.Window name={`details${productCategory._id}`}>
                    <CategoryDetails productCategory={productCategory}>
                      <CategoryTree
                        key={productCategory._id}
                        category={
                          categories?.data.filter(
                            (category) => category._id === productCategory._id
                          )[0]
                        }
                      />
                    </CategoryDetails>
                  </Modal.Window>
                </Table.Cell>
                <Table.Cell>
                  <Menus.Toggle id={productCategory._id} />
                  <Menus.MenuList id={productCategory._id}>
                    <Modal.Open opens={`EditDeliveryStation${productCategory._id}`}>
                      <Menus.Button>Edit</Menus.Button>
                    </Modal.Open>
                    <Modal.Window name={`EditDeliveryStation${productCategory._id}`}>
                      <ProductCategoryForm category={productCategory} />
                    </Modal.Window>

                    <Modal.Open opens="confirmDelete">
                      <Menus.Button>Delete</Menus.Button>
                    </Modal.Open>
                    <Modal.Window name="confirmDelete">
                      <Confirm
                        btnText="Delete"
                        message="Are you sure you want to delete the productCategory?"
                        onConfirm={() => removeProductCategory(productCategory._id)}
                      />
                    </Modal.Window>
                  </Menus.MenuList>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.FooterCell colSpan={8}>
                <Pagination numOfResults={data?.length} />
              </Table.FooterCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      )}
    </Menus>
  );
};

export default ProductCategoryTable;
