import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  craetePincodes,
  createCity,
  deleteCity,
  getCities,
  getCityNames,
  updateCity,
} from "../../../services/cityService";
import { useSearchParams } from "react-router-dom";
import { LIMIT } from "../../../assets/constants/constants";
import toast from "react-hot-toast";

export function useCity() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const sort = searchParams.get("sort") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const { data, isLoading } = useQuery({
    queryKey: ["city", sort, page],
    queryFn: () => getCities(sort, page, LIMIT),
  });

  if (page > 1) {
    queryClient.prefetchQuery({
      queryKey: ["city", sort, page],
      queryFn: () => getCities(sort, page - 1, LIMIT),
    });
  }
  if (page < Math.ceil(data?.length / LIMIT)) {
    queryClient.prefetchQuery({
      queryKey: ["city", sort, page + 1],
      queryFn: () => getCities(sort, page + 1, LIMIT),
    });
  }
  return { data, isLoading };
}

export function useCityName() {
  const { data, isLoading } = useQuery({
    queryKey: ["cityNames"],
    queryFn: () => getCityNames(),
  });
  return { data, isLoading };
}

export function useAddCity() {
  const queryClient = useQueryClient();
  const { mutate: addCity } = useMutation({
    mutationFn: (data) => createCity(data),
    onSuccess: () => {
      toast.success("City added successfully");
      queryClient.invalidateQueries(["city"]);
    },
    onError: (err) => {
      toast.error(`Failed. ${err.message}`);
    },
  });
  return { addCity };
}

export function useEditCity() {
  const queryClient = useQueryClient();
  const { mutate: editCity } = useMutation({
    mutationFn: ({ data, id }) => updateCity(data, id),
    onSuccess: () => {
      toast.success("City updated successfully");
      queryClient.invalidateQueries(["city"]);
    },
    onError: (err) => {
      toast.error(`Failed. ${err.message}`);
    },
  });
  return { editCity };
}

export function useDeleteCity() {
  const queryClient = useQueryClient();
  const { mutate: removeCity } = useMutation({
    mutationFn: (id) => deleteCity(id),
    onSuccess: () => {
      toast.success("City deleted successfully");
      queryClient.invalidateQueries(["city"]);
    },
    onError: (err) => {
      toast.error(`Failed. ${err.message}`);
    },
  });
  return { removeCity };
}

export function useAddPincodes() {
  const queryClient = useQueryClient();
  const { mutate: addPincodes } = useMutation({
    mutationFn: ({ data, id }) => craetePincodes(data, id),
    onSuccess: () => {
      toast.success("Pincode(s) added successfully");
      queryClient.invalidateQueries(["city"]);
    },
    onError: (err) => {
      toast.error(`Failed. ${err.message}`);
    },
  });
  return { addPincodes };
}
