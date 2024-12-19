import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => login(data),
    onSuccess: (data) => {
      toast.success("Successfully logged in");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      queryClient.setQueryData(["user"], data.user);
      navigate(`/${data.user.role}`);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return { mutate, isPending };
}
