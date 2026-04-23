import { useState, useEffect } from "react";
import { useGetEmergencies, useCreateEmergency, useUpdateEmergency } from "../hooks/useEmergency";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle, Activity, Plus, X, Droplet, UserCheck } from "lucide-react";
import { z } from "zod";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const emergencySchema = z.object({
  patientName: z.string().min(2, "Patient name must be at least 2 characters").max(50, "Patient name is too long"),
  hospitalName: z.string().min(2, "Hospital name must be at least 2 characters").max(100, "Hospital name is too long"),
  bloodGroup: z.string().min(1, "Blood group is required"),
});

const Emergency = () => {
  const { data, isLoading } = useGetEmergencies();
  const createMutation = useCreateEmergency();
  const updateMutation = useUpdateEmergency();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ patientName: "", hospitalName: "", bloodGroup: "A+" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string) => {
    // Create a partial object to validate just the field being changed
    const fieldData = { ...formData, [name]: value };
    const result = emergencySchema.pick({ [name]: true } as any).safeParse(fieldData);
    
    if (result.success) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    } else {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors((prev) => ({
        ...prev,
        [name]: fieldErrors[name as keyof typeof fieldErrors]?.[0] || "Invalid field",
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [drawerStatus, setDrawerStatus] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  // Hospital Autocomplete State
  const [hospitalSuggestions, setHospitalSuggestions] = useState<any[]>([]);
  const [isSearchingHospitals, setIsSearchingHospitals] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (selectedRequest) {
      setDrawerStatus(selectedRequest.status);
      setSelectedUserId(selectedRequest.completedByUser?._id || "");
    }
  }, [selectedRequest]);

  // Update selectedRequest if data changes
  useEffect(() => {
    if (selectedRequest && data?.requests) {
      const updatedReq = data.requests.find((r: any) => r._id === selectedRequest._id);
      if (updatedReq) {
        setSelectedRequest(updatedReq);
      }
    }
  }, [data, selectedRequest]);

  // Debounced API call for Hospital Autocomplete
  useEffect(() => {
    if (!formData.hospitalName || formData.hospitalName.trim().length < 3 || !showSuggestions) {
      setHospitalSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearchingHospitals(true);
      try {
        // Use free OpenStreetMap Nominatim API
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            formData.hospitalName + " hospital in Kerala"
          )}&limit=5`
        );
        const data = await response.json();
        setHospitalSuggestions(data);
      } catch (error) {
        console.error("Failed to fetch hospital suggestions", error);
      } finally {
        setIsSearchingHospitals(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.hospitalName, showSuggestions]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      patientName: true,
      hospitalName: true,
      bloodGroup: true,
    });

    const result = emergencySchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const newErrors: Record<string, string> = {};
      
      // Extract the first error message for each field
      Object.keys(fieldErrors).forEach((key) => {
        if (fieldErrors[key as keyof typeof fieldErrors]?.length) {
          newErrors[key] = fieldErrors[key as keyof typeof fieldErrors]![0];
        }
      });
      
      setErrors(newErrors);
      return;
    }

    createMutation.mutate(formData, {
      onSuccess: () => {
        setIsModalOpen(false);
        setFormData({ patientName: "", hospitalName: "", bloodGroup: "A+" });
        setErrors({});
        setTouched({});
      }
    });
  };

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
    }, {
      onSuccess: () => {
        // We let the useEffect handle updating the selectedRequest state
      }
    });
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 px-2">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Emergency Requests</h1>
          <p className="text-slate-400 mt-1.5 font-medium">Manage and broadcast urgent blood requirements</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-red-900/40 active:scale-[0.98]"
        >
          <Plus size={18} />
          <span>New Emergency</span>
        </button>
      </header>

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
                ) : !data?.requests?.length ? (
                  <tr className="flex flex-col md:table-row">
                    <td colSpan={4} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 text-slate-600">
                         <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
                           <Activity size={32} className="opacity-20 text-red-500" />
                         </div>
                         <p className="text-sm font-bold tracking-widest uppercase">No emergency requests found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.requests.map((req: any) => (
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
                          {req.status === "Pending" && <Clock size={14} className="text-amber-500" />}
                          {req.status === "In Progress" && <Activity size={14} className="text-sky-500" />}
                          {req.status === "Completed" && <CheckCircle size={14} className="text-emerald-500" />}
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                            req.status === "Pending" ? "bg-amber-500/10 text-amber-500" :
                            req.status === "In Progress" ? "bg-sky-500/10 text-sky-500" :
                            "bg-emerald-500/10 text-emerald-500"
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
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Slide-in Drawer for Selected Request */}
      <AnimatePresence>
        {selectedRequest && (
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
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Update Status</label>
                    <select
                      value={drawerStatus}
                      onChange={(e) => setDrawerStatus(e.target.value)}
                      disabled={selectedRequest.status === "Completed"}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-red-500/50 disabled:opacity-50"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
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
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-slate-800 bg-slate-900/80 backdrop-blur-md sticky bottom-0">
                <button
                  onClick={handleUpdateStatus}
                  disabled={updateMutation.isPending || selectedRequest.status === "Completed" || (drawerStatus === selectedRequest.status && selectedRequest.status !== "Completed")}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-red-900/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateMutation.isPending ? "Saving..." : selectedRequest.status === "Completed" ? "Already Completed" : "Save Changes"}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">Broadcast Emergency</h2>
              <form onSubmit={handleCreate} className="space-y-5">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 block">Patient Name</label>
                  <input 
                    type="text" 
                    name="patientName"
                    value={formData.patientName} 
                    onChange={handleInputChange} 
                    onBlur={handleBlur}
                    className={`w-full bg-slate-950 border ${errors.patientName && touched.patientName ? 'border-red-500' : 'border-slate-800'} rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50`} 
                  />
                  {errors.patientName && touched.patientName ? (
                    <p className="text-[10px] text-red-500 mt-1.5 font-bold">{errors.patientName}</p>
                  ) : (
                    <p className="text-[10px] text-slate-600 mt-1.5">* This will remain hidden from donors.</p>
                  )}
                </div>
                <div className="relative">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 block">Hospital Name</label>
                  <input 
                    type="text" 
                    name="hospitalName"
                    value={formData.hospitalName} 
                    onChange={(e) => {
                      handleInputChange(e);
                      setShowSuggestions(true);
                    }} 
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={(e) => {
                      handleBlur(e);
                      setShowSuggestions(false);
                    }}
                    autoComplete="off"
                    className={`w-full bg-slate-950 border ${errors.hospitalName && touched.hospitalName ? 'border-red-500' : 'border-slate-800'} rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50`} 
                  />
                  
                  {/* Autocomplete Dropdown */}
                  <AnimatePresence>
                    {showSuggestions && formData.hospitalName.trim().length >= 3 && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden"
                      >
                        {isSearchingHospitals ? (
                          <div className="p-4 text-xs font-bold text-slate-400 text-center animate-pulse">Searching maps...</div>
                        ) : hospitalSuggestions.length > 0 ? (
                          <ul className="max-h-48 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {hospitalSuggestions.map((hospital, idx) => {
                              const parts = hospital.display_name.split(',');
                              const mainName = parts[0].trim();
                              const address = parts.slice(1).join(',').trim();
                              
                              return (
                                <li 
                                  key={idx}
                                  onMouseDown={(e) => {
                                    // Use onMouseDown to prevent the input from losing focus and closing the dropdown before the click registers
                                    e.preventDefault(); 
                                    setFormData(prev => ({ ...prev, hospitalName: hospital.display_name }));
                                    setShowSuggestions(false);
                                    validateField("hospitalName", hospital.display_name);
                                  }}
                                  className="px-4 py-3 hover:bg-slate-700 cursor-pointer border-b border-slate-700/50 last:border-0 transition-colors"
                                >
                                  <p className="text-sm font-bold text-white truncate">{mainName}</p>
                                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{address}</p>
                                </li>
                              )
                            })}
                          </ul>
                        ) : (
                          <div className="p-4 text-xs font-bold text-slate-400 text-center">
                            No match found. Proceed with "{formData.hospitalName}".
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {errors.hospitalName && touched.hospitalName && (
                    <p className="text-[10px] text-red-500 mt-1.5 font-bold">{errors.hospitalName}</p>
                  )}
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 block">Blood Group</label>
                  <select 
                    name="bloodGroup"
                    value={formData.bloodGroup} 
                    onChange={handleInputChange} 
                    onBlur={handleBlur}
                    className={`w-full bg-slate-950 border ${errors.bloodGroup && touched.bloodGroup ? 'border-red-500' : 'border-slate-800'} rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50`}
                  >
                    {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                  {errors.bloodGroup && touched.bloodGroup && (
                    <p className="text-[10px] text-red-500 mt-1.5 font-bold">{errors.bloodGroup}</p>
                  )}
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all">Cancel</button>
                  <button type="submit" disabled={createMutation.isPending} className="flex-1 py-3.5 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-red-900/40 active:scale-[0.98] disabled:opacity-50">
                    {createMutation.isPending ? "Sending..." : "Broadcast"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Emergency;
