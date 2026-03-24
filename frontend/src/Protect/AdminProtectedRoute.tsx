import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "@/store/store";

const AdminProtectedRoute = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.admin.isAuthenticated
  );

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default AdminProtectedRoute;
