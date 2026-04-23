import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/Theme/ThemeProvider";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import Login from "@/components/Auth/Login";
import Signup from "@/components/Auth/SignUp";
import Loading from "@/components/Loading/Loading";
import LandingPage from "@/components/Landing/LandingPage";
import DonorsPage from "@/components/Landing/DonorsPage";
import ProfilePage from "@/components/Profile/ProfilePage";
import EditProfilePage from "@/components/Profile/EditProfilePage";
import Navbar from "@/components/Navbar/Navbar";
import { SocketProvider } from "@/contexts/SocketContext";
import { EmergencyAlertModal } from "@/components/EmergencyAlertModal";
import NotificationPage from "@/pages/NotificationPage";
import SuccessStoriesPage from "@/pages/SuccessStoriesPage";

import ProtectedRoute from "@/Protect/ProtectedRoute";
import AuthProtectedRoute from "@/Protect/AuthProtectedRoute";

import AdminLogin from "@/admin/pages/AdminLogin";
import Dashboard from "@/admin/pages/Dashboard";
import Users from "@/admin/pages/Users";
import Emergency from "@/admin/pages/Emergency";
import AdminLayout from "@/admin/components/AdminLayout";
import AdminProtectedRoute from "@/Protect/AdminProtectedRoute";
import AdminAuthProtectedRoute from "@/Protect/AdminAuthProtectedRoute";

/* ---------------- React Query Client ---------------- */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/* ---------------- Loading Wrapper ---------------- */
const LoadingWrapper = () => {
  const [isLoading, setIsLoading] = useState(() => {
    return !sessionStorage.getItem("bloodbond-initial-loaded");
  });

  const handleLoadingComplete = () => {
    sessionStorage.setItem("bloodbond-initial-loaded", "true");
    setIsLoading(false);
  };

  if (isLoading) {
    return <Loading onComplete={handleLoadingComplete} />;
  }

  return <Outlet />;
};

/* ---------------- Layout with Navbar ---------------- */
const NavbarLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

/* ---------------- App Content ---------------- */
const AppContent = () => {
  return (
    <TooltipProvider>
      <Toaster richColors />
      <EmergencyAlertModal />
      <Routes>
        <Route element={<LoadingWrapper />}>
          {/* Pages with Navbar */}
          <Route element={<NavbarLayout />}>
            {/* Public pages */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/donors" element={<DonorsPage />} />
            <Route path="/stories" element={<SuccessStoriesPage />} />

            {/* Auth-only pages */}
            <Route element={<AuthProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/edit" element={<EditProfilePage />} />
              <Route path="/notifications" element={<NotificationPage />} />
            </Route>
          </Route>

          {/* Guest-only (no navbar) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          <Route path="/admin">
            <Route element={<AdminAuthProtectedRoute />}>
              <Route path="login" element={<AdminLogin />} />
            </Route>
            <Route element={<AdminProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="emergency" element={<Emergency />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </TooltipProvider>
  );
};

/* ---------------- App Wrapper ---------------- */
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="bloodbond-theme">
        <BrowserRouter>
          <SocketProvider>
            <AppContent />
          </SocketProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
