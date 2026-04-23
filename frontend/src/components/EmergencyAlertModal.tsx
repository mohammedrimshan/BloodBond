import React, { useEffect, useState } from "react";
import { useSocket } from "../contexts/SocketContext";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Droplet } from "lucide-react";
import { privateAxiosInstance } from "@/api/privateAxios.Instance";
import { toast } from "sonner";

interface EmergencyPayload {
  id: string;
  hospitalName: string;
  bloodGroup: string;
  message: string;
}

export const EmergencyAlertModal: React.FC = () => {
  const { socket } = useSocket();
  const [alertData, setAlertData] = useState<EmergencyPayload | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (socket) {
      console.log("[EmergencyAlertModal] Listening for 'emergency_blood_request' on socket:", socket.id);
      socket.on("emergency_blood_request", (payload: EmergencyPayload) => {
        console.log("[EmergencyAlertModal] Received alert payload:", payload);
        setAlertData(payload);
        // Maybe play a sound
      });
    } else {
      console.log("[EmergencyAlertModal] Socket is null, waiting for connection...");
    }
    return () => {
      if (socket) {
        socket.off("emergency_blood_request");
      }
    };
  }, [socket]);

  const handleReady = async () => {
    if (!alertData) return;
    setIsSubmitting(true);
    try {
      const res = await privateAxiosInstance.post(`/users/emergency/${alertData.id}/ready`);
      toast.success(res.data.message || "Thank you for being ready!");
      setAlertData(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDismiss = () => {
    setAlertData(null);
  };

  return (
    <AnimatePresence>
      {alertData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="relative w-full max-w-md bg-slate-900 border border-red-500/30 rounded-3xl p-6 shadow-2xl shadow-red-900/20 text-center"
          >
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20 animate-pulse">
              <AlertTriangle className="text-red-500 w-10 h-10" />
            </div>
            
            <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Emergency Request</h2>
            <p className="text-slate-400 mb-6">{alertData.message}</p>
            
            <div className="bg-slate-800/50 rounded-2xl p-4 mb-6 border border-slate-700/50">
              <div className="flex justify-between items-center mb-3">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Hospital</span>
                <span className="text-white font-semibold">{alertData.hospitalName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Required Blood</span>
                <div className="flex items-center gap-2 bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/20">
                  <Droplet size={14} className="text-red-500" />
                  <span className="text-red-400 font-bold">{alertData.bloodGroup}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleReady}
                disabled={isSubmitting}
                className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-red-900/40 active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmitting ? "Processing..." : "I'm Ready"}
              </button>
              <button
                onClick={handleDismiss}
                className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-bold uppercase tracking-widest rounded-xl transition-all border border-slate-700/50 active:scale-[0.98]"
              >
                Not Ready
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
