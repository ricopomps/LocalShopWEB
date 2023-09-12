import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

const RequireAuth = () => {
  const { user } = useUser();
  const location = useLocation();
  const token = sessionStorage.getItem("token");

  return user.username || token ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default RequireAuth;
