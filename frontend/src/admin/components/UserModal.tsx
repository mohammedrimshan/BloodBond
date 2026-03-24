import { useState } from "react";
import type { AdminUser } from "@/admin/hooks/useAdminUsers";
import {
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Droplet,
  ShieldCheck,
  Globe,
  MessageCircle,
  Home,
  Hash,
  Clock,
  HeartPulse,
  Cake,
  Activity,
  User as UserIcon,
  Zap,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UserModalProps {
  user: AdminUser;
  onClose: () => void;
}

const fmt = (d?: string) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

const colorMap: Record<string, string> = {
  rose: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  sky: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  violet: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  teal: "text-teal-400 bg-teal-500/10 border-teal-500/20",
  fuchsia: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20",
  indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  lime: "text-lime-400 bg-lime-500/10 border-lime-500/20",
};

const UserModal = ({ user, onClose }: UserModalProps) => {
  const [activeTab, setActiveTab] = useState<"personal" | "platform">("personal");

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const personalDetails = [
    { icon: Mail, label: "Email Address", value: user.email, color: "sky" },
    { icon: Phone, label: "Phone Number", value: user.phoneNumber || "—", color: "emerald" },
    { icon: MessageCircle, label: "WhatsApp", value: user.whatsappNumber || "—", color: "teal" },
    { icon: Cake, label: "Date of Birth", value: fmt(user.dateOfBirth), color: "fuchsia" },
    { icon: Droplet, label: "Blood Group", value: user.bloodGroup || "—", color: "rose" },
    { icon: Activity, label: "Donor Eligibility", value: user.isEligible ? "Qualified Donor" : "Pending / Ineligible", color: user.isEligible ? "emerald" : "amber" },
  ];

  const platformDetails = [
    { icon: MapPin, label: "Primary District", value: user.district || "—", color: "violet" },
    { icon: Globe, label: "Local Place", value: user.place || "—", color: "cyan" },
    { icon: Home, label: "Mailing Address", value: user.address || "—", color: "indigo" },
    { icon: Hash, label: "Postal Pincode", value: user.pincode || "—", color: "lime" },
    { icon: Calendar, label: "Registration Date", value: fmt(user.createdAt), color: "sky" },
    { icon: Clock, label: "Last Updated", value: fmt(user.updatedAt), color: "amber" },
  ];

  const tabs = [
    { id: "personal", label: "Profile Info", icon: UserIcon },
    { id: "platform", label: "System Context", icon: Zap },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="relative w-full max-w-3xl bg-[#07090f] border border-white/[0.07] rounded-[2.5rem] shadow-[0_40px_140px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col"
          style={{ maxHeight: "92vh" }}
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />

          {/* ── HEADER ─────────────────────────────────────────── */}
          <div className="relative px-10 pt-10 pb-8 border-b border-white/[0.05] shrink-0">
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-8 right-8 p-2.5 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-7">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-2xl bg-slate-800 border-2 border-white/10 flex items-center justify-center text-2xl font-black text-white overflow-hidden ring-4 ring-slate-900/60 shadow-2xl">
                  {user.photoUrl ? (
                    <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white/25 text-3xl font-black">{initials}</span>
                  )}
                </div>
                {/* Status dot */}
                <div
                  className={`absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-xl border-[3px] border-[#07090f] flex items-center justify-center ${
                    user.isBlocked ? "bg-red-500" : "bg-emerald-500"
                  }`}
                />
              </div>

              {/* Identity */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="text-3xl font-extrabold text-white tracking-tight leading-none">
                    {user.name}
                  </h2>
                  {user.isVerified && (
                    <ShieldCheck size={20} className="text-blue-400 shrink-0" />
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400 bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/20">
                    {user.role}
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-lg border ${
                      user.isBlocked
                        ? "text-red-400 bg-red-500/10 border-red-500/20"
                        : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                    }`}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 italic">
                    Member since {new Date(user.createdAt).getFullYear()}
                  </span>
                </div>

                {/* Quick stats strip */}
                <div className="flex flex-wrap items-center gap-6">
                  <QuickStat
                    icon={Droplet}
                    label="Blood Group"
                    value={user.bloodGroup || "—"}
                    accent="text-rose-400"
                  />
                  <div className="w-px h-8 bg-white/[0.06]" />
                  <QuickStat
                    icon={MapPin}
                    label="District"
                    value={user.district || "—"}
                    accent="text-violet-400"
                  />
                  <div className="w-px h-8 bg-white/[0.06]" />
                  <QuickStat
                    icon={user.isEligible ? CheckCircle : AlertCircle}
                    label="Eligibility"
                    value={user.isEligible ? "Eligible" : "Ineligible"}
                    accent={user.isEligible ? "text-emerald-400" : "text-amber-400"}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── TAB BAR ────────────────────────────────────────── */}
          <div className="px-10 pt-7 pb-0 shrink-0">
            <div className="flex gap-2 p-1.5 bg-slate-900/50 border border-white/[0.04] rounded-2xl w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "personal" | "platform")}
                  className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-red-600 text-white shadow-lg shadow-red-900/50"
                      : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]"
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── TAB CONTENT ────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto px-10 pt-7 pb-10 hide-scrollbar">
            <style>{`
              .hide-scrollbar::-webkit-scrollbar { display: none; }
              .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(activeTab === "personal" ? personalDetails : platformDetails).map(
                    (detail, idx) => (
                      <DetailCard key={idx} {...detail} delay={idx * 0.045} />
                    )
                  )}
                </div>

                {/* Platform-only: Donation banner */}
                {activeTab === "platform" && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.32 }}
                    className="mt-6 p-7 bg-red-600/[0.06] border border-red-600/[0.12] rounded-[2rem]"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                      <div className="flex items-center gap-5">
                        <div className="p-4 bg-red-600/20 rounded-2xl text-red-500 shrink-0">
                          <HeartPulse size={26} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                            Physical Status
                          </p>
                          <p className="text-base font-bold text-white leading-snug">
                            Last Donation:{" "}
                            <span className="text-red-400">{fmt(user.lastDonatedDate)}</span>
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5 font-medium">
                            Donors are re-eligible 90 days after last donation
                          </p>
                        </div>
                      </div>

                      <div
                        className={`self-start sm:self-auto px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border whitespace-nowrap ${
                          user.isEligible
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                        }`}
                      >
                        {user.isEligible ? "✓ Active Donor" : "⏸ Eligibility Hold"}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── FOOTER ─────────────────────────────────────────── */}
          <div className="px-10 py-6 border-t border-white/[0.05] bg-slate-900/10 shrink-0">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-slate-600 font-medium hidden sm:block">
                User ID:{" "}
                <span className="text-slate-500 font-mono">{(user as any).id || "—"}</span>
              </p>
              <button
                onClick={onClose}
                className="ml-auto sm:w-48 w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-2xl transition-all border border-white/[0.06] active:scale-[0.98]"
              >
                Close Profile
              </button>
            </div>
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/* ── Quick Stat ──────────────────────────────────────────────── */
const QuickStat = ({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: any;
  label: string;
  value: string;
  accent: string;
}) => (
  <div className="flex items-center gap-2.5">
    <Icon size={14} className={accent} />
    <div>
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 leading-none mb-0.5">
        {label}
      </p>
      <p className={`text-xs font-bold leading-none ${accent}`}>{value}</p>
    </div>
  </div>
);

/* ── Detail Card ─────────────────────────────────────────────── */
const DetailCard = ({
  icon: Icon,
  label,
  value,
  color,
  delay,
}: {
  icon: any;
  label: string;
  value: string;
  color: string;
  delay: number;
}) => {
  const c = colorMap[color] || colorMap.sky;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="group p-6 bg-white/[0.02] border border-white/[0.05] rounded-[1.5rem] hover:bg-white/[0.04] hover:border-white/[0.10] transition-all duration-300 flex flex-col gap-4"
    >
      <div
        className={`w-11 h-11 rounded-xl ${c} border flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shrink-0`}
      >
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-600 mb-1.5 leading-none">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-200 leading-snug break-words">{value}</p>
      </div>
    </motion.div>
  );
};

export default UserModal;