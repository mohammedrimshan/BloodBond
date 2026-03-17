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
import ProfilePage from "@/components/Profile/ProfilePage";
import Navbar from "@/components/Navbar/Navbar";

import ProtectedRoute from "@/Protect/ProtectedRoute";
import AuthProtectedRoute from "@/Protect/AuthProtectedRoute";

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
      <Routes>
        <Route element={<LoadingWrapper />}>
          {/* Pages with Navbar */}
          <Route element={<NavbarLayout />}>
            {/* Public landing page */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth-only pages */}
            <Route element={<AuthProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* Guest-only (no navbar) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
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
          <AppContent />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
