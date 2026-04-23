import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAdmin } from "@/store/adminSlice";
import type { RootState } from "@/store/store";
import adminAxios from "@/admin/api/adminAxios";
import { toast } from "sonner";
import { 
  LayoutDashboard, 
  Users, 
  LogOut, 
  Droplets,
  ChevronRight,
  X,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isMobile: boolean;
}

const AdminSidebar = ({ isOpen, setIsOpen, isMobile }: AdminSidebarProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const admin = useSelector((state: RootState) => state.admin.admin);

  const handleLogout = async () => {
    try {
      await adminAxios.post("/auth/logout");
      dispatch(clearAdmin());
      toast.success("Logged out successfully");
      navigate("/admin/login");
    } catch {
      dispatch(clearAdmin());
      navigate("/admin/login");
    }
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Emergency Requests", path: "/admin/emergency", icon: AlertCircle },
  ];

  return (
    <>

      <motion.aside
        initial={isMobile ? { x: -300 } : { x: 0 }}
        animate={{ x: isOpen || !isMobile ? 0 : -300 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`fixed left-0 top-0 h-screen bg-slate-950 border-r border-slate-800/60 z-50 flex flex-col transition-all duration-300 ${
          isOpen ? "w-72" : "w-0 lg:w-20 overflow-hidden lg:overflow-visible"
        }`}
      >
        {/* Logo Section */}
        <div className="p-6 flex items-center justify-between border-b border-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-red-400 flex items-center justify-center shadow-lg shadow-red-900/20">
              <Droplets className="text-white fill-white/20" size={22} />
            </div>
            {(isOpen || isMobile) && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col"
              >
                <span className="text-lg font-bold text-white tracking-tight leading-none">BloodBond</span>
                <span className="text-[10px] text-red-500 font-extrabold uppercase tracking-[0.2em] mt-1.5 opacity-80">Admin Panel</span>
              </motion.div>
            )}
          </div>
          {isMobile && (
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white lg:hidden">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group relative flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium ${
                  isActive 
                    ? "bg-red-600/10 text-white" 
                    : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-100"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} className={isActive ? "text-red-500" : "group-hover:text-red-400/80 transition-colors"} />
                  {(isOpen || isMobile) && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex-1"
                    >
                      {item.name}
                    </motion.span>
                  )}
                  {isActive && (isOpen || isMobile) && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute left-0 w-1 h-6 bg-red-600 rounded-r-full"
                    />
                  )}
                  {isActive && (isOpen || isMobile) && <ChevronRight size={14} className="text-red-500/50" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 mt-auto border-t border-slate-800/40 bg-slate-900/20">
          {(isOpen || isMobile) ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <div className="relative group">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-700 flex items-center justify-center text-white font-bold shadow-inner group-hover:border-red-500/50 transition-colors">
                    {admin?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-slate-950 rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{admin?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate font-medium">{admin?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-600/10 hover:text-red-500 transition-all font-medium border border-transparent hover:border-red-600/20"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex justify-center py-4 text-slate-400 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </motion.aside>
    </>
  );
};

export default AdminSidebar;

