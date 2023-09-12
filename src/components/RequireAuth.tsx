import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

const RequireAuth = () => {
  const { user } = useUser();
  const location = useLocation();

  return user.username ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default RequireAuth;
