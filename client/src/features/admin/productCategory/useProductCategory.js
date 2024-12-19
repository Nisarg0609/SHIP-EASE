import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProductCategory,
  deleteProductCategory,
  getProductCategory,
  getProductCategoryNames,
  getSubProductCategory,
  updateProductCategory,
} from "../../../services/productCategory";
import { useSearchParams } from "react-router-dom";
import { LIMIT } from "../../../assets/constants/constants";
import toast from "react-hot-toast";

export function useProductCategory() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const sort = searchParams.get("sort") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const { data, isLoading } = useQuery({
    queryKey: ["productCategory", sort, page],
    queryFn: () => getProductCategory(sort, page, LIMIT),
  });

  if (page > 1) {
    queryClient.prefetchQuery({
      queryKey: ["productCategory", sort, page],
      queryFn: () => getProductCategory(sort, page - 1, LIMIT),
    });
  }
  if (page < Math.ceil(data?.length / LIMIT)) {
    queryClient.prefetchQuery({
      queryKey: ["productCategory", sort, page + 1],
      queryFn: () => getProductCategory(sort, page + 1, LIMIT),
    });
  }
  return { data, isLoading };
}

export function useProductCategoryName() {
  const { data, isLoading } = useQuery({
    queryKey: ["productCategoryNames"],
    queryFn: () => getProductCategoryNames(),
  });
  return { data, isLoading };
}

export function useSubProductCategory() {
  const { data, isLoading } = useQuery({
    queryKey: ["subProductCategory"],
    queryFn: () => getSubProductCategory(),
  });
  return { data, isLoading };
}

export function useAddProductCategory() {
  const queryClient = useQueryClient();
  const { mutate: addProductCategory } = useMutation({
    mutationFn: (data) => createProductCategory(data),
    onSuccess: () => {
      toast.success("Product Category added successfully");
      queryClient.invalidateQueries(["productCategory"]);
    },
    onError: (err) => {
      toast.error(`Failed. ${err.message}`);
    },
  });
  return { addProductCategory };
}

export function useEditProductCategory() {
  const queryClient = useQueryClient();
  const { mutate: editProductCategory } = useMutation({
    mutationFn: ({ data, id }) => updateProductCategory(data, id),
    onSuccess: () => {
      toast.success("Product Category updated successfully");
      queryClient.invalidateQueries(["productCategory"]);
    },
    onError: (err) => {
      toast.error(`Failed. ${err.message}`);
    },
  });
  return { editProductCategory };
}

export function useDeleteProductCategory() {
  const queryClient = useQueryClient();
  const { mutate: removeProductCategory } = useMutation({
    mutationFn: (id) => deleteProductCategory(id),
    onSuccess: () => {
      toast.success("Product Category deleted successfully");
      queryClient.invalidateQueries(["productCategory"]);
    },
    onError: (err) => {
      toast.error(`Failed. ${err.message}`);
    },
  });
  return { removeProductCategory };
}
