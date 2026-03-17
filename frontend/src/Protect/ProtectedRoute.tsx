import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

interface ProtectedRouteProps {
  redirectPath?: string;
}

const ProtectedRoute = ({ redirectPath = "/" }: ProtectedRouteProps) => {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  // If the user is logged in, redirect to the specified path (default: "/")
  if (isLoggedIn) {
    return <Navigate to={redirectPath} replace />;
  }

  // If not logged in, render the child routes (e.g., Login page)
  return <Outlet />;
};

export default ProtectedRoute;