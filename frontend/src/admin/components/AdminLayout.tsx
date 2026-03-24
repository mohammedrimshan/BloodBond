import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile sidebar on navigation
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans selection:bg-red-500/30 overflow-x-hidden">
      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Component */}
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} isMobile={isMobile} />

      {/* Main Content Wrapper */}
      <div 
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isMobile ? "ml-0" : isSidebarOpen ? "ml-72" : "ml-20"
        }`}
      >
        {/* Mobile Navbar/Header (shows when sidebar is closed on mobile) */}
        {isMobile && !isSidebarOpen && (
          <header className="sticky top-0 z-30 flex items-center justify-between p-4 bg-slate-950/80 backdrop-blur-md border-b border-white/5 lg:hidden">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-white shadow-lg"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white tracking-tighter">BloodBond</span>
              <span className="text-[8px] px-1.5 py-0.5 bg-red-600 text-white font-bold rounded uppercase tracking-widest">Admin</span>
            </div>
            <div className="w-10 h-10" /> {/* Spacer */}
          </header>
        )}

        <main className="p-4 md:p-8 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
