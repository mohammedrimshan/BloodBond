import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "@/store/store";

const AdminAuthProtectedRoute = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.admin.isAuthenticated
  );

  return isAuthenticated ? (
    <Navigate to="/admin/dashboard" replace />
  ) : (
    <Outlet />
  );
};

export default AdminAuthProtectedRoute;
