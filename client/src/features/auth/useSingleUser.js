import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../services/authService";

export function useSingleUser() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    initialData: JSON.parse(localStorage.getItem("user")),
  });
  return { user, isLoading };
}
