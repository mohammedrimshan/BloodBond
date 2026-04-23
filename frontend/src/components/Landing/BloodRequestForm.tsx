import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Droplet, Send, Hospital, User, AlertCircle } from "lucide-react";
import { privateAxiosInstance } from "@/api/privateAxios.Instance";
import { toast } from "sonner";

interface BloodRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const BloodRequestForm: React.FC<BloodRequestFormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    patientName: "",
    hospitalName: "",
    bloodGroup: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bloodGroup) {
      toast.error("Please select a blood group");
      return;
    }

    setIsSubmitting(true);
    try {
      await privateAxiosInstance.post("/users/emergency/request", formData);
      toast.success("Request submitted! An admin will verify and alert donors soon.");
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
                  <Droplet className="text-red-600 w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Request Blood</h2>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Urgent Requirement</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-2 block">Patient Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      required
                      type="text"
                      placeholder="Enter patient's full name"
                      value={formData.patientName}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      className="w-full h-14 pl-12 pr-4 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-red-500/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-2 block">Hospital & Location</label>
                  <div className="relative">
                    <Hospital className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      required
                      type="text"
                      placeholder="Hospital name and address"
                      value={formData.hospitalName}
                      onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                      className="w-full h-14 pl-12 pr-4 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-red-500/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-3 block">Required Blood Group</label>
                  <div className="grid grid-cols-4 gap-2">
                    {BLOOD_GROUPS.map((group) => (
                      <button
                        key={group}
                        type="button"
                        onClick={() => setFormData({ ...formData, bloodGroup: group })}
                        className={`py-3 rounded-xl text-sm font-black border transition-all ${
                          formData.bloodGroup === group
                            ? "bg-red-600 text-white border-red-700 shadow-lg shadow-red-600/20"
                            : "bg-white text-slate-500 border-slate-100 hover:border-red-200"
                        }`}
                      >
                        {group}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex gap-3">
                <AlertCircle className="text-amber-500 shrink-0" size={20} />
                <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
                  Your request will be sent to our admins for verification. Once approved, all eligible donors in the area will be notified immediately.
                </p>
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full h-16 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-red-900/20 transition-all active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={20} />
                    Submit Request
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BloodRequestForm;
