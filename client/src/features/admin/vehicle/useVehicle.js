import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createVehicle,
  deleteVehicle,
  getVehicles,
  updateVehicle,
} from "../../../services/vehicleService";
import { useSearchParams } from "react-router-dom";
import { LIMIT } from "../../../assets/constants/constants";
import toast from "react-hot-toast";

export function useVehicle() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const sort = searchParams.get("sort") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const { data, isLoading } = useQuery({
    queryKey: ["vehicle", sort, page],
    queryFn: () => getVehicles(sort, page, LIMIT),
  });

  if (page > 1) {
    queryClient.prefetchQuery({
      queryKey: ["vehicle", sort, page],
      queryFn: () => getVehicles(sort, page - 1, LIMIT),
    });
  }
  if (page < Math.ceil(data?.length / LIMIT)) {
    queryClient.prefetchQuery({
      queryKey: ["vehicle", sort, page + 1],
      queryFn: () => getVehicles(sort, page + 1, LIMIT),
    });
  }
  return { data, isLoading };
}

export function useAddVehicle() {
  const queryClient = useQueryClient();
  const { mutate: addVehicle } = useMutation({
    mutationFn: (data) => createVehicle(data),
    onSuccess: () => {
      toast.success("Vehicle added successfully");
      queryClient.invalidateQueries(["vehicle"]);
    },
    onError: (err) => {
      toast.error(`Failed. ${err.message}`);
    },
  });
  return { addVehicle };
}

export function useEditVehicle() {
  const queryClient = useQueryClient();
  const { mutate: editVehicle } = useMutation({
    mutationFn: ({ data, id }) => updateVehicle(data, id),
    onSuccess: () => {
      toast.success("Vehicle updated successfully");
      queryClient.invalidateQueries(["vehicle"]);
    },
    onError: (err) => {
      toast.error(`Failed. ${err.message}`);
    },
  });
  return { editVehicle };
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();
  const { mutate: removeVehicle } = useMutation({
    mutationFn: (id) => deleteVehicle(id),
    onSuccess: () => {
      toast.success("Vehicle deleted successfully");
      queryClient.invalidateQueries(["vehicle"]);
    },
    onError: (err) => {
      toast.error(`Failed. ${err.message}`);
    },
  });
  return { removeVehicle };
}
