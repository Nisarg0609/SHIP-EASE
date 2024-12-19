import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDeliveryStation,
  deleteDeliveryStation,
  getDeliveryStationNames,
  getDeliveryStations,
  getUnassignedDeliveryStations,
  updateDeliveryStation,
} from "../../../services/deliveryStationService";
import { useSearchParams } from "react-router-dom";
import { LIMIT } from "../../../assets/constants/constants";
import toast from "react-hot-toast";

export function useDeliveryStation() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const sort = searchParams.get("sort") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const { data, isLoading } = useQuery({
    queryKey: ["deliveryStation", sort, page],
    queryFn: () => getDeliveryStations(sort, page, LIMIT),
  });

  if (page > 1) {
    queryClient.prefetchQuery({
      queryKey: ["deliveryStation", sort, page],
      queryFn: () => getDeliveryStations(sort, page - 1, LIMIT),
    });
  }
  if (page < Math.ceil(data?.length / LIMIT)) {
    queryClient.prefetchQuery({
      queryKey: ["deliveryStation", sort, page + 1],
      queryFn: () => getDeliveryStations(sort, page + 1, LIMIT),
    });
  }
  return { data, isLoading };
}

export function useDeliveryStationName() {
  const { data, isLoading } = useQuery({
    queryKey: ["deliveryStationName"],
    queryFn: () => getDeliveryStationNames(),
  });
  return { data, isLoading };
}

export function useUnassignedDeliveryStations() {
  const { data, isLoading } = useQuery({
    queryKey: ["unassignedDeliveryStations"],
    queryFn: getUnassignedDeliveryStations,
  });
  return { data, isLoading };
}

export function useAddDeliveryStation() {
  const queryClient = useQueryClient();
  const { mutate: addDeliveryStation } = useMutation({
    mutationFn: (data) => createDeliveryStation(data),
    onSuccess: () => {
      toast.success("Delivery Station added successfully");
      queryClient.invalidateQueries(["deliveryStation"]);
    },
    onError: (err) => {
      toast.error(`Failed. ${err.message}`);
    },
  });
  return { addDeliveryStation };
}

export function useEditDeliveryStation() {
  const queryClient = useQueryClient();
  const { mutate: editDeliveryStation } = useMutation({
    mutationFn: ({ data, id }) => updateDeliveryStation(data, id),
    onSuccess: () => {
      toast.success("Delivery Station updated successfully");
      queryClient.invalidateQueries(["deliveryStation"]);
    },
    onError: (err) => {
      toast.error(`Failed. ${err.message}`);
    },
  });
  return { editDeliveryStation };
}

export function useDeleteDeliveryStation() {
  const queryClient = useQueryClient();
  const { mutate: removeDeliveryStation } = useMutation({
    mutationFn: (id) => deleteDeliveryStation(id),
    onSuccess: () => {
      toast.success("Delivery Station deleted successfully");
      queryClient.invalidateQueries(["deliveryStation"]);
    },
    onError: (err) => {
      toast.error(`Failed. ${err.message}`);
    },
  });
  return { removeDeliveryStation };
}
