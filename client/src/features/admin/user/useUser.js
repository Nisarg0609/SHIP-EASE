import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../../../services/userService";
import { useSearchParams } from "react-router-dom";
import { LIMIT } from "../../../assets/constants/constants";
import toast from "react-hot-toast";

export function useUser() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const sort = searchParams.get("sort") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const filter = searchParams.get("role") || "";

  const { data, isLoading } = useQuery({
    queryKey: ["user", sort, page, filter],
    queryFn: () => getUsers(sort, page, LIMIT, filter),
  });

  if (page > 1) {
    queryClient.prefetchQuery({
      queryKey: ["user", sort, page, filter],
      queryFn: () => getUsers(sort, page - 1, LIMIT, filter),
    });
  }
  if (page < Math.ceil(data?.length / LIMIT)) {
    queryClient.prefetchQuery({
      queryKey: ["user", sort, page + 1, filter],
      queryFn: () => getUsers(sort, page + 1, LIMIT, filter),
    });
  }
  return { data, isLoading };
}

export function useAddUser() {
  const queryClient = useQueryClient();
  const { mutate: addUser } = useMutation({
    mutationFn: (data) => createUser(data),
    onSuccess: () => {
      toast.success("User added successfully");
      queryClient.invalidateQueries(["user"]);
    },
    onError: (err) => {
      toast.error(`Failed. ${err.message}`);
    },
  });
  return { addUser };
}

export function useEditUser() {
  const queryClient = useQueryClient();
  const { mutate: editUser } = useMutation({
    mutationFn: ({ data, id }) => updateUser(data, id),
    onSuccess: () => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries(["user"]);
    },
    onError: (err) => {
      toast.error(`Failed. ${err.message}`);
    },
  });
  return { editUser };
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { mutate: removeUser } = useMutation({
    mutationFn: (id) => deleteUser(id),
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries(["user"]);
    },
    onError: (err) => {
      toast.error(`Failed. ${err.message}`);
    },
  });
  return { removeUser };
}
