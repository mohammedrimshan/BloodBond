import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

interface AuthProtectedRouteProps {
  redirectPath?: string;
}

const AuthProtectedRoute = ({ redirectPath = "/login" }: AuthProtectedRouteProps) => {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  // If the user is not logged in, redirect to the login page
  if (!isLoggedIn) {
    return <Navigate to={redirectPath} replace />;
  }

  // If logged in, render the child routes
  return <Outlet />;
};

export default AuthProtectedRoute;