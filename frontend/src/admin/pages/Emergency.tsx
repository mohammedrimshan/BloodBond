import { useState, useEffect } from "react";
import { useGetEmergencies } from "../hooks/useEmergency";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle, Activity, Plus, Search, Filter, Droplet, Ban, Bell } from "lucide-react";
import EmergencyDrawer from "../components/EmergencyDrawer";
import EmergencyModal from "../components/EmergencyModal";
import { useSocket } from "@/contexts/SocketContext";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useSearchParams } from "react-router-dom";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Emergency = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, isLoading } = useGetEmergencies();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  // Handle direct navigation via URL ID
  useEffect(() => {
    const requestId = searchParams.get("id");
    if (requestId && data?.requests && !selectedRequest) {
      const request = data.requests.find((r: any) => r._id === requestId);
      if (request) {
        setSelectedRequest(request);
        // Clear the param after opening to allow closing the drawer
        searchParams.delete("id");
        setSearchParams(searchParams);
      }
    }
  }, [searchParams, data, selectedRequest, setSearchParams]);

  // Search & Filter State
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterBloodGroup, setFilterBloodGroup] = useState("All");

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { socket } = useSocket();
  const queryClient = useQueryClient();

  // Socket Listener for real-time updates
  useEffect(() => {
    if (socket) {
      const handleNewRequest = (request: any) => {
        console.log("[Socket] New Emergency Request received:", request);
        toast.info("New Blood Request Received!", {
          description: `${request.patientName} needs ${request.bloodGroup} at ${request.hospitalName}`,
          icon: <Bell className="text-red-500" />,
          duration: 8000,
        });
        queryClient.invalidateQueries({ queryKey: ["emergencies"] });
      };

      socket.on("new_emergency_verification", handleNewRequest);
      return () => {
        socket.off("new_emergency_verification", handleNewRequest);
      };
    }
  }, [socket, queryClient]);

  // Update selectedRequest if data changes
  useEffect(() => {
    if (selectedRequest && data?.requests) {
      const updatedReq = data.requests.find((r: any) => r._id === selectedRequest._id);
      if (updatedReq) {
        setSelectedRequest(updatedReq);
      }
    }
  }, [data, selectedRequest]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 px-2">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Emergency Requests</h1>
          <p className="text-slate-400 mt-1.5 font-medium">Manage and broadcast urgent blood requirements</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-red-900/40 active:scale-[0.98] shrink-0"
        >
          <Plus size={18} />
          <span>New Emergency</span>
        </button>
      </header>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 px-2">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search patient or hospital..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 shadow-lg shadow-black/10 transition-all" 
          />
        </div>
        
        <div className="flex gap-4">
          <div className="relative group">
            <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-focus-within:text-red-500 transition-colors" />
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl pl-11 pr-10 py-3.5 text-sm font-bold text-slate-300 focus:outline-none focus:border-red-500/50 shadow-lg shadow-black/10 transition-all cursor-pointer min-w-[160px]"
            >
              <option className="bg-slate-900 text-white" value="All">All Statuses</option>
              <option className="bg-slate-900 text-white" value="Pending Verification">Pending Verification</option>
              <option className="bg-slate-900 text-white" value="Pending">Approved (Pending)</option>
              <option className="bg-slate-900 text-white" value="In Progress">In Progress</option>
              <option className="bg-slate-900 text-white" value="Completed">Completed</option>
              <option className="bg-slate-900 text-white" value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="relative group">
            <Droplet size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-focus-within:text-red-500 transition-colors" />
            <select 
              value={filterBloodGroup} 
              onChange={(e) => setFilterBloodGroup(e.target.value)}
              className="appearance-none bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl pl-11 pr-10 py-3.5 text-sm font-bold text-slate-300 focus:outline-none focus:border-red-500/50 shadow-lg shadow-black/10 transition-all cursor-pointer min-w-[180px]"
            >
              <option className="bg-slate-900 text-white" value="All">All Blood Groups</option>
              {BLOOD_GROUPS.map(bg => <option className="bg-slate-900 text-white" key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-[2rem] overflow-hidden shadow-2xl shadow-black/20"
      >
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="hidden md:table-header-group">
              <tr className="bg-slate-900/60 text-slate-500 text-[11px] font-black uppercase tracking-[0.15em] border-b border-slate-800/50">
                <th className="px-6 py-6">Patient / Hospital</th>
                <th className="px-6 py-6 text-center">Required Blood</th>
                <th className="px-6 py-6">Status</th>
                <th className="px-6 py-6 text-center">Ready Donors</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 flex flex-col md:table-row-group p-4 md:p-0">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <tr className="flex flex-col md:table-row"><td colSpan={4} className="px-6 py-20 text-center text-slate-500">Loading emergencies...</td></tr>
                ) : (() => {
                  const filteredRequests = data?.requests?.filter((req: any) => {
                    const matchStatus = filterStatus === "All" || req.status === filterStatus;
                    const matchBlood = filterBloodGroup === "All" || req.bloodGroup === filterBloodGroup;
                    const searchLower = debouncedSearch.toLowerCase();
                    const matchSearch = debouncedSearch === "" || 
                      req.patientName.toLowerCase().includes(searchLower) || 
                      req.hospitalName.toLowerCase().includes(searchLower);
                    return matchStatus && matchBlood && matchSearch;
                  }) || [];

                  if (!filteredRequests.length) {
                    return (
                      <tr className="flex flex-col md:table-row">
                        <td colSpan={4} className="px-6 py-20 text-center">
                          <div className="flex flex-col items-center gap-4 text-slate-600">
                             <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
                               {data?.requests?.length ? <Search size={32} className="opacity-20 text-slate-500" /> : <Activity size={32} className="opacity-20 text-red-500" />}
                             </div>
                             <p className="text-sm font-bold tracking-widest uppercase">
                               {data?.requests?.length ? "No matching requests found" : "No emergency requests found"}
                             </p>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return filteredRequests.map((req: any) => (
                    <motion.tr 
                      key={req._id} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setSelectedRequest(req)}
                      className="flex flex-col md:table-row bg-slate-800/10 md:bg-transparent rounded-3xl md:rounded-none border border-slate-800/50 md:border-none mb-4 md:mb-0 hover:bg-slate-800/40 cursor-pointer transition-all group overflow-hidden"
                    >
                      <td className="px-6 py-5 md:py-6 border-b border-white/[0.03] md:border-none">
                        <p className="font-bold text-white text-sm tracking-tight truncate group-hover:text-red-400 transition-colors">{req.patientName}</p>
                        <p className="text-[11px] text-slate-500 mt-1 font-medium">{req.hospitalName}</p>
                      </td>
                      <td className="px-6 py-4 md:py-6 flex md:table-cell items-center justify-between border-b border-white/[0.03] md:border-none text-center">
                        <span className="md:hidden text-[10px] font-black uppercase tracking-widest text-slate-600">Blood</span>
                        <span className="inline-flex items-center px-3 py-1 rounded-xl bg-red-500/10 text-red-500 text-[11px] font-black tracking-tighter border border-red-500/20">
                          {req.bloodGroup}
                        </span>
                      </td>
                      <td className="px-6 py-4 md:py-6 flex md:table-cell items-center justify-between border-b border-white/[0.03] md:border-none">
                        <span className="md:hidden text-[10px] font-black uppercase tracking-widest text-slate-600">Status</span>
                        <div className="flex items-center gap-2">
                          {req.status === "Pending Verification" && <Clock size={14} className="text-amber-400" />}
                          {req.status === "Pending" && <CheckCircle size={14} className="text-emerald-500" />}
                          {req.status === "In Progress" && <Activity size={14} className="text-sky-500" />}
                          {req.status === "Completed" && <CheckCircle size={14} className="text-emerald-600" />}
                          {req.status === "Rejected" && <Ban size={14} className="text-slate-500" />}
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                            req.status === "Pending Verification" ? "bg-amber-400/10 text-amber-400" :
                            req.status === "Pending" ? "bg-emerald-500/10 text-emerald-500" :
                            req.status === "In Progress" ? "bg-sky-500/10 text-sky-500" :
                            req.status === "Completed" ? "bg-emerald-600/10 text-emerald-600" :
                            "bg-slate-500/10 text-slate-500"
                          }`}>{req.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 md:py-6 flex md:table-cell items-center justify-between border-b border-white/[0.03] md:border-none text-center">
                        <span className="md:hidden text-[10px] font-black uppercase tracking-widest text-slate-600">Ready Donors</span>
                        {req.status === "Completed" ? (
                           <span className="text-xs font-bold text-emerald-400">Done by: {req.completedByUser?.name}</span>
                        ) : (
                          <div className="flex -space-x-2 justify-center">
                            {req.readyUsers.map((u: any, i: number) => (
                              <div key={u._id} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white z-10" style={{ zIndex: 10 - i }} title={`${u.name} (${u.phoneNumber})`}>
                                {u.photoUrl ? <img src={u.photoUrl} className="w-full h-full rounded-full object-cover" /> : u.name.charAt(0)}
                              </div>
                            ))}
                            {req.readyUsers.length === 0 && <span className="text-xs text-slate-500 italic">None yet</span>}
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  ))
                })()}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Extracted Slide-in Drawer */}
      <EmergencyDrawer 
        selectedRequest={selectedRequest} 
        setSelectedRequest={setSelectedRequest} 
      />

      {/* Extracted Create Modal */}
      <EmergencyModal 
        isModalOpen={isModalOpen} 
        setIsModalOpen={setIsModalOpen} 
      />
    </div>
  );
};

export default Emergency;
