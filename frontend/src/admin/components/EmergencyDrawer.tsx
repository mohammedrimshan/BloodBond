import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Droplet, UserCheck, Check, Ban } from "lucide-react";
import { useUpdateEmergency, useVerifyEmergency } from "../hooks/useEmergency";

interface EmergencyDrawerProps {
  selectedRequest: any;
  setSelectedRequest: (request: any) => void;
}

const EmergencyDrawer = ({ selectedRequest, setSelectedRequest }: EmergencyDrawerProps) => {
  const [drawerStatus, setDrawerStatus] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const updateMutation = useUpdateEmergency();
  const verifyMutation = useVerifyEmergency();

  useEffect(() => {
    if (selectedRequest) {
      setDrawerStatus(selectedRequest.status);
      setSelectedUserId(selectedRequest.completedByUser?._id || "");
    }
  }, [selectedRequest]);

  const handleUpdateStatus = () => {
    if (!selectedRequest) return;
    
    if (drawerStatus === "Completed" && !selectedUserId) {
      alert("Please select the user who completed the donation.");
      return;
    }

    updateMutation.mutate({ 
      id: selectedRequest._id, 
      status: drawerStatus, 
      completedByUserId: drawerStatus === "Completed" ? selectedUserId : undefined 
    });
  };

  if (!selectedRequest) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={() => setSelectedRequest(null)} 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
      />
      <motion.div 
        initial={{ x: "100%" }} 
        animate={{ x: 0 }} 
        exit={{ x: "100%" }} 
        transition={{ type: "spring", damping: 25, stiffness: 200 }} 
        className="relative w-full max-w-md bg-slate-900 h-full border-l border-slate-800/60 shadow-2xl flex flex-col z-10 overflow-y-auto custom-scrollbar"
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/80 sticky top-0 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
              <Droplet className="text-red-500 w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">Request Details</h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Manage Status & Donors</p>
            </div>
          </div>
          <button 
            onClick={() => setSelectedRequest(null)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 flex-1 space-y-8">
          {/* Info Card */}
          <div className="bg-slate-800/30 rounded-2xl p-5 border border-slate-800/60 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Patient Name</span>
              <span className="text-sm font-bold text-white">{selectedRequest.patientName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Hospital</span>
              <span className="text-sm font-semibold text-slate-300">{selectedRequest.hospitalName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Blood Group</span>
              <span className="inline-flex items-center px-2 py-1 rounded-lg bg-red-500/10 text-red-500 text-xs font-black tracking-tighter border border-red-500/20">
                {selectedRequest.bloodGroup}
              </span>
            </div>
          </div>

          {/* Ready Donors List */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <UserCheck size={14} className="text-emerald-500" />
              Ready Donors ({selectedRequest.readyUsers.length})
            </h3>
            
            {selectedRequest.readyUsers.length === 0 ? (
              <div className="bg-slate-800/20 rounded-xl p-4 text-center border border-slate-800/40 border-dashed">
                <p className="text-sm text-slate-500 font-medium">No donors have accepted yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedRequest.readyUsers.map((u: any) => (
                  <div key={u._id} className="flex items-center gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
                    <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 overflow-hidden shrink-0">
                      {u.photoUrl ? (
                        <img src={u.photoUrl} alt={u.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white">
                          {u.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{u.name}</p>
                      <p className="text-[11px] text-slate-400 font-medium">{u.phoneNumber}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status Update Form */}
          <div className="space-y-4 pt-4 border-t border-slate-800/60">
            {selectedRequest.status === "Pending Verification" ? (
              <div className="space-y-4">
                <p className="text-xs font-bold text-amber-500 uppercase tracking-[0.2em] animate-pulse">Needs Verification</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => verifyMutation.mutate({ id: selectedRequest._id, status: "Pending" })}
                    disabled={verifyMutation.isPending}
                    className="flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20"
                  >
                    <Check size={16} /> Approve
                  </button>
                  <button
                    onClick={() => verifyMutation.mutate({ id: selectedRequest._id, status: "Rejected" })}
                    disabled={verifyMutation.isPending}
                    className="flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all"
                  >
                    <Ban size={16} /> Reject
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Update Status</label>
                  <select
                    value={drawerStatus}
                    onChange={(e) => setDrawerStatus(e.target.value)}
                    disabled={selectedRequest.status === "Completed" || selectedRequest.status === "Rejected"}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-red-500/50 disabled:opacity-50"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                {drawerStatus === "Completed" && selectedRequest.status !== "Completed" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Select Donated User</label>
                    <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="w-full bg-slate-950 border border-emerald-500/30 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/80"
                    >
                      <option value="" disabled>-- Choose a User --</option>
                      {selectedRequest.readyUsers.map((u: any) => (
                        <option key={u._id} value={u._id}>{u.name} ({u.bloodGroup})</option>
                      ))}
                    </select>
                    <p className="text-[10px] text-slate-500 mt-2">Selecting a user will mark their donation in the system and reset their eligibility timer.</p>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        {selectedRequest.status !== "Pending Verification" && (
          <div className="p-6 border-t border-slate-800 bg-slate-900/80 backdrop-blur-md sticky bottom-0">
            <button
              onClick={handleUpdateStatus}
              disabled={updateMutation.isPending || selectedRequest.status === "Completed" || selectedRequest.status === "Rejected" || (drawerStatus === selectedRequest.status && selectedRequest.status !== "Completed")}
              className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-red-900/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateMutation.isPending ? "Saving..." : selectedRequest.status === "Completed" ? "Already Completed" : selectedRequest.status === "Rejected" ? "Rejected" : "Save Changes"}
            </button>
          </div>
        )}

      </motion.div>
    </div>
  );
};

export default EmergencyDrawer;
