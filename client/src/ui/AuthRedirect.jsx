import { useEffect } from "react";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";

const AuthRedirect = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        toast.error("You are already logged in.");
      }, 100);
    }
  }, [user]);

  if (user) {
    return <Navigate to={`/${user.role}`} replace />;
  }
  return children;
};

export default AuthRedirect;
