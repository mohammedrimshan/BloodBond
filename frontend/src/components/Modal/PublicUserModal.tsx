import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Droplet, MapPin, Calendar, HeartPulse, 
  Mail, Phone, MessageCircle, AlertCircle, CheckCircle, Navigation 
} from "lucide-react";
import { usePublicProfile } from "@/hooks/users/useUsers";

interface PublicUserModalProps {
  userId: string;
  onClose: () => void;
}

const fmt = (d?: string) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

const PublicUserModal = ({ userId, onClose }: PublicUserModalProps) => {
  const { data, isLoading, error } = usePublicProfile(userId);
  const profile = data?.data;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
        {/* Backdrop — reduced blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal — compact */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 14 }}
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
          className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          style={{ maxHeight: "85vh" }}
        >
          {isLoading ? (
            <div className="h-52 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-[3px] border-red-500/20 border-t-red-500 rounded-full animate-spin" />
              <p className="text-slate-400 text-sm font-medium">Loading profile…</p>
            </div>
          ) : error || !profile ? (
            <div className="h-52 flex flex-col items-center justify-center gap-3 text-center px-6">
              <AlertCircle size={28} className="text-red-400" />
              <p className="text-sm font-semibold text-slate-700">Profile not found</p>
              <button onClick={onClose} className="mt-2 px-5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold rounded-lg transition-colors">
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-30 p-1.5 rounded-full bg-black/5 text-slate-400 hover:text-slate-700 hover:bg-black/10 transition-all"
              >
                <X size={18} />
              </button>

              {/* Scrollable content */}
              <style>{`.pum-scroll::-webkit-scrollbar{display:none}.pum-scroll{-ms-overflow-style:none;scrollbar-width:none}`}</style>
              <div className="overflow-y-auto flex-1 pum-scroll">
                {/* Top section — avatar & identity */}
                <div className="pt-8 pb-5 px-6 flex flex-col items-center text-center">
                  {/* Avatar */}
                  <div className="relative mb-4">
                    <div className="w-20 h-20 rounded-full ring-[3px] ring-red-100 overflow-hidden bg-slate-100 flex items-center justify-center shadow-lg">
                      {profile.photoUrl ? (
                        <img src={profile.photoUrl} alt={profile.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-black text-slate-300">{profile.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    {/* Eligibility dot */}
                    <div className={`absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full border-[2.5px] border-white flex items-center justify-center shadow ${
                      profile.isEligible ? "bg-emerald-500" : "bg-amber-500"
                    }`}>
                      {profile.isEligible ? <CheckCircle size={12} className="text-white" /> : <AlertCircle size={12} className="text-white" />}
                    </div>
                  </div>

                  {/* Name */}
                  <h2 className="text-xl font-extrabold text-slate-900 leading-snug mb-0.5">{profile.name}</h2>
                  <div className="flex items-center gap-1 text-xs font-medium text-slate-400">
                    <MapPin size={13} className="text-red-400" />
                    <span>{profile.place || profile.district || "Location undisclosed"}</span>
                  </div>
                </div>

                {/* Stats row */}
                <div className="mx-6 mb-5 flex gap-3">
                  <div className="flex-1 bg-red-50/80 rounded-2xl py-3 px-3 flex flex-col items-center border border-red-100/60">
                    <Droplet size={16} className="text-red-500 mb-1.5" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Blood</span>
                    <span className="text-lg font-black text-red-600 leading-tight">{profile.bloodGroup || "—"}</span>
                  </div>
                  <div className="flex-1 bg-emerald-50/80 rounded-2xl py-3 px-3 flex flex-col items-center border border-emerald-100/60">
                    <HeartPulse size={16} className="text-emerald-500 mb-1.5" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Donated</span>
                    <span className="text-lg font-black text-slate-800 leading-tight">{profile.totalDonations}</span>
                  </div>
                  <div className="flex-1 bg-slate-50 rounded-2xl py-3 px-3 flex flex-col items-center border border-slate-100">
                    <Calendar size={16} className="text-slate-400 mb-1.5" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last</span>
                    <span className="text-xs font-bold text-slate-700 leading-tight mt-0.5">{fmt(profile.lastDonatedDate)}</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="mx-6 border-t border-slate-100" />

                {/* Contact section */}
                <div className="px-6 pt-4 pb-5 space-y-2.5">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2">Contact</h3>

                  {profile.phoneNumber && (
                    <a href={`tel:${profile.phoneNumber}`} className="flex items-center gap-3 p-3 rounded-xl bg-sky-50/60 hover:bg-sky-50 border border-sky-100/60 transition-colors group">
                      <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Phone size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold text-slate-400 mb-px">Phone</p>
                        <p className="text-sm font-semibold text-slate-800 truncate">{profile.phoneNumber}</p>
                      </div>
                    </a>
                  )}

                  {profile.whatsappNumber && (
                    <a href={`https://wa.me/${profile.whatsappNumber}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-100/60 transition-colors group">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <MessageCircle size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold text-slate-400 mb-px">WhatsApp</p>
                        <p className="text-sm font-semibold text-slate-800 truncate">{profile.whatsappNumber}</p>
                      </div>
                    </a>
                  )}

                  {profile.email && (
                    <a href={`mailto:${profile.email}`} className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50/60 hover:bg-indigo-50 border border-indigo-100/60 transition-colors group">
                      <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Mail size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold text-slate-400 mb-px">Email</p>
                        <p className="text-sm font-semibold text-slate-800 truncate">{profile.email}</p>
                      </div>
                    </a>
                  )}
                </div>

                {/* Footer — Directions */}
                {profile.place && (
                  <div className="px-6 pb-6">
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.place)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
                    >
                      <Navigation size={14} />
                      Get Directions
                    </a>
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PublicUserModal;
