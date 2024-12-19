import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addTransportCities,
  createWarehouse,
  deleteWarehouse,
  getUnassignedCities,
  getUnassignedWarehouses,
  getWarehouseNames,
  getWarehouses,
  updateWarehouse,
} from "../../../services/warehouseService";
import { useSearchParams } from "react-router-dom";
import { LIMIT } from "../../../assets/constants/constants";
import toast from "react-hot-toast";

export function useWarehouse() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const sort = searchParams.get("sort") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const { data, isLoading } = useQuery({
    queryKey: ["warehouse", sort, page],
    queryFn: () => getWarehouses(sort, page, LIMIT),
  });

  if (page > 1) {
    queryClient.prefetchQuery({
      queryKey: ["warehouse", sort, page],
      queryFn: () => getWarehouses(sort, page - 1, LIMIT),
    });
  }
  if (page < Math.ceil(data?.length / LIMIT)) {
    queryClient.prefetchQuery({
      queryKey: ["warehouse", sort, page + 1],
      queryFn: () => getWarehouses(sort, page + 1, LIMIT),
    });
  }
  return { data, isLoading };
}

export function useWarehouseName() {
  const { data, isLoading } = useQuery({
    queryKey: ["warehouseNames"],
    queryFn: () => getWarehouseNames(),
  });
  return { data, isLoading };
}

export function useUnassignedCities() {
  const { data, isLoading } = useQuery({
    queryKey: ["unassignedCities"],
    queryFn: getUnassignedCities,
  });
  return { data, isLoading };
}

export function useUnassignedWarehouses() {
  const { data, isLoading } = useQuery({
    queryKey: ["unassignedWarehouses"],
    queryFn: getUnassignedWarehouses,
  });
  return { data, isLoading };
}

export function useAddWarehouse() {
  const queryClient = useQueryClient();
  const { mutate: addWarehouse } = useMutation({
    mutationFn: (data) => createWarehouse(data),
    onSuccess: () => {
      toast.success("Warehouse added successfully");
      queryClient.invalidateQueries(["warehouse"]);
    },
    onError: (err) => {
      toast.error(`Failed. ${err.message}`);
    },
  });
  return { addWarehouse };
}

export function useEditWarehouse() {
  const queryClient = useQueryClient();
  const { mutate: editWarehouse } = useMutation({
    mutationFn: ({ data, id }) => updateWarehouse(data, id),
    onSuccess: () => {
      toast.success("Warehouse updated successfully");
      queryClient.invalidateQueries(["warehouse"]);
    },
    onError: (err) => {
      toast.error(`Failed. ${err.message}`);
    },
  });
  return { editWarehouse };
}

export function useDeleteWarehouse() {
  const queryClient = useQueryClient();
  const { mutate: removeWarehouse } = useMutation({
    mutationFn: (id) => deleteWarehouse(id),
    onSuccess: () => {
      toast.success("Warehouse deleted successfully");
      queryClient.invalidateQueries(["warehouse"]);
    },
    onError: (err) => {
      toast.error(`Failed. ${err.message}`);
    },
  });
  return { removeWarehouse };
}

export function useAddTransportCities() {
  const queryClient = useQueryClient();
  const { mutate: addTransportCity } = useMutation({
    mutationFn: ({ data, id }) => addTransportCities(data, id),
    onSuccess: () => {
      toast.success("Transport Cities added successfully");
      queryClient.invalidateQueries(["warehouse"]);
    },
    onError: (err) => {
      toast.error(`Failed. ${err.message}`);
    },
  });
  return { addTransportCity };
}
