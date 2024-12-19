import { useMutation } from "@tanstack/react-query";
import { signup } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function useSignup() {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: (data) => signup(data),
    onSuccess: (data) => {
      toast.success("Successfully signed up. Please login to get access.");
      navigate("/login");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return { mutate, isPending };
}
