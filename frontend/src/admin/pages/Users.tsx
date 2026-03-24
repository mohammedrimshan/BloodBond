import { useState, useEffect } from "react";
import { useAdminUsers, type AdminUser } from "@/admin/hooks/useAdminUsers";
import { useBlockUser } from "@/admin/hooks/useBlockUser";
import UserModal from "@/admin/components/UserModal";
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  ShieldAlert, 
  ShieldCheck, 
  Mail, 
  MapPin,
  MoreHorizontal,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Users = () => {
  const [filters, setFilters] = useState({ page: 1, limit: 10, search: "" });
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { data, isLoading } = useAdminUsers({ ...filters, search: debouncedSearch });
  const blockMutation = useBlockUser();
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
      setFilters(f => ({ ...f, page: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const handleBlockToggle = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    blockMutation.mutate(userId);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto"
    >
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">User Management</h1>
              <p className="text-slate-400 mt-1.5 font-medium">Manage and monitor platform participants</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-500 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Search name or email..."
                  value={filters.search}
                  onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                  className="w-full pl-12 pr-4 py-3 bg-slate-900 shadow-inner border border-slate-800 focus:border-red-500/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-600/10 transition-all text-sm font-medium text-white placeholder:text-slate-600"
                />
              </div>
              <button className="flex items-center gap-2 px-5 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-sm font-semibold">
                <Filter size={18} />
                <span>Filters</span>
              </button>
            </div>
          </header>

          {/* Table Container */}
          <motion.div 
            variants={itemVariants}
            className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-[2rem] overflow-hidden shadow-2xl shadow-black/20"
          >
            <div className="overflow-x-auto md:overflow-visible custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="hidden md:table-header-group">
                  <tr className="bg-slate-900/60 text-slate-500 text-[11px] font-black uppercase tracking-[0.15em] border-b border-slate-800/50">
                    <th className="px-8 py-6">Identity</th>
                    <th className="px-8 py-6">Blood Type</th>
                    <th className="px-8 py-6">Location</th>
                    <th className="px-8 py-6">Account Status</th>
                    <th className="px-8 py-6 text-right">Privacy & Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 flex flex-col md:table-row-group p-4 md:p-0">
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      [...Array(6)].map((_, i) => (
                        <tr key={i} className="animate-pulse flex flex-col md:table-row mb-4 md:mb-0">
                          <td colSpan={5} className="px-6 py-8 md:px-8">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-800 shrink-0" />
                                <div className="space-y-2 flex-1">
                                   <div className="h-4 w-1/3 bg-slate-800 rounded-full" />
                                   <div className="h-3 w-1/2 bg-slate-800/50 rounded-full" />
                                </div>
                             </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      data?.users.map((user) => (
                        <motion.tr 
                          key={user._id} 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col md:table-row bg-slate-800/10 md:bg-transparent rounded-3xl md:rounded-none border border-slate-800/50 md:border-none mb-4 md:mb-0 hover:bg-slate-800/30 transition-all cursor-pointer group overflow-hidden"
                          onClick={() => setSelectedUser(user)}
                        >
                          {/* Identity Card Header (Mobile Only) / Cell (Desktop) */}
                          <td className="px-6 py-5 md:px-8 md:py-6 border-b border-white/[0.03] md:border-none">
                            <div className="flex items-center gap-4">
                               <div className="relative shrink-0">
                                 <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 flex items-center justify-center font-bold text-red-500 text-lg shadow-inner group-hover:border-red-500/30 transition-colors">
                                    {user.name.charAt(0).toUpperCase()}
                                 </div>
                                 <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-lg border-2 border-slate-900 ${user.isBlocked ? 'bg-red-500' : 'bg-green-500'}`} />
                               </div>
                               <div className="min-w-0">
                                  <p className="font-bold text-white text-sm tracking-tight group-hover:text-red-500 transition-colors truncate">{user.name}</p>
                                  <div className="flex items-center gap-1.5 mt-1 text-slate-500 truncate">
                                    <Mail size={12} className="shrink-0" />
                                    <span className="text-[11px] font-medium truncate">{user.email}</span>
                                  </div>
                               </div>
                            </div>
                          </td>

                          {/* Blood Group */}
                          <td className="px-6 py-4 md:px-8 md:py-6 flex md:table-cell items-center justify-between border-b border-white/[0.03] md:border-none">
                            <span className="md:hidden text-[10px] font-black uppercase tracking-widest text-slate-600">Blood Type</span>
                            <span className="inline-flex items-center px-3 py-1 rounded-xl bg-red-500/5 text-red-500 text-[11px] font-black tracking-tighter border border-red-500/10">
                              {user.bloodGroup || "—"}
                            </span>
                          </td>

                          {/* Location */}
                          <td className="px-6 py-4 md:px-8 md:py-6 flex md:table-cell items-center justify-between border-b border-white/[0.03] md:border-none">
                            <span className="md:hidden text-[10px] font-black uppercase tracking-widest text-slate-600">Location</span>
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <MapPin size={13} className="text-slate-600" />
                              <span className="text-xs font-semibold">{user.district || "Unset"}</span>
                            </div>
                          </td>

                          {/* Account Status */}
                          <td className="px-6 py-4 md:px-8 md:py-6 flex md:table-cell items-center justify-between border-b border-white/[0.03] md:border-none">
                            <span className="md:hidden text-[10px] font-black uppercase tracking-widest text-slate-600">Status</span>
                             {user.isBlocked ? (
                               <div className="flex items-center gap-2 text-red-500">
                                 <ShieldAlert size={14} />
                                 <span className="text-[10px] font-black uppercase tracking-widest bg-red-500/10 px-2 py-0.5 rounded-md">Blocked</span>
                               </div>
                             ) : (
                               <div className="flex items-center gap-2 text-green-500">
                                 <ShieldCheck size={14} />
                                 <span className="text-[10px] font-black uppercase tracking-widest bg-green-500/10 px-2 py-0.5 rounded-md">Active</span>
                               </div>
                             )}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-5 md:px-8 md:py-6 md:table-cell">
                            <div className="flex items-center justify-end gap-3">
                              <button
                                onClick={(e) => { e.stopPropagation(); setSelectedUser(user); }}
                                className="p-2.5 bg-slate-800/50 md:bg-transparent text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                                title="View Details"
                              >
                                <Info size={19} />
                              </button>
                              <button
                                onClick={(e) => handleBlockToggle(e, user._id)}
                                disabled={blockMutation.isPending}
                                className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg text-center ${
                                  user.isBlocked 
                                    ? "bg-green-600 hover:bg-green-500 text-white shadow-green-900/30" 
                                    : "bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white border border-red-600/20 hover:border-red-600 shadow-red-900/5"
                                }`}
                              >
                                {user.isBlocked ? "UNBLOCK" : "REVOKE"}
                              </button>
                              <button className="hidden md:block p-2 text-slate-600 hover:text-white transition-colors">
                                <MoreHorizontal size={18} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Pagination UI */}
            <div className="px-8 py-6 bg-slate-900/60 border-t border-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
               <div className="flex items-center gap-3">
                 <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">
                    Page <span className="text-white">{filters.page}</span> of <span className="text-white">{data?.totalPages || 1}</span>
                 </p>
                 <div className="h-4 w-px bg-slate-800 mx-2" />
                 <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">
                   <span className="text-white font-black">{data?.total || 0}</span> Total Records
                 </p>
               </div>
               
               <div className="flex items-center gap-2">
                  <button
                    disabled={filters.page === 1}
                    onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all border border-slate-700/50"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  {[...Array(data?.totalPages || 0)].map((_, i) => i + 1).slice(Math.max(0, filters.page - 3), Math.min(data?.totalPages || 0, filters.page + 2)).map(pageNum => (
                    <button
                      key={pageNum}
                      onClick={() => setFilters(f => ({ ...f, page: pageNum }))}
                      className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                        filters.page === pageNum 
                          ? "bg-red-600 text-white shadow-xl shadow-red-900/20" 
                          : "text-slate-500 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  <button
                    disabled={!data || filters.page >= data.totalPages}
                    onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all border border-slate-700/50"
                  >
                    <ChevronRight size={18} />
                  </button>
               </div>
            </div>
          </motion.div>
      {selectedUser && (
        <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </motion.div>
  );
};

export default Users;

