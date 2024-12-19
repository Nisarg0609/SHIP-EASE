import toast from "react-hot-toast";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useSingleUser } from "../features/auth/useSingleUser";
import { useEffect } from "react";

const ProtectedRoute = ({ children, allowedRole }) => {
  const navigate = useNavigate();
  const { user, isLoading } = useSingleUser();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      setTimeout(() => {
        toast.error("Please log in to get access");
      }, 0);
    } else if (allowedRole && user?.role && user.role !== allowedRole) {
      navigate(`/${user.role}`, { replace: true });
      setTimeout(() => {
        toast.error("You do not have permission to access this resource");
      }, 0);
    }
  }, [user, navigate, allowedRole]);

  if (user && user.role === allowedRole) return children;
  return null;
};

export default ProtectedRoute;
