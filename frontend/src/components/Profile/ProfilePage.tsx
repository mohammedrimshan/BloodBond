import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  LogOut,
  User,
  Mail,
  MapPin,
  Phone,
  Home,
  Clock,
  Droplets,
  Calendar,
  Pencil,
  Activity,
  ShieldCheck,
  Flame,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RootState } from "@/store/store";
import { clearUser, setUser } from "@/store/userSlice";
import { logoutUser } from "@/Service/authService";
import { getProfile } from "@/Service/userService";
import { PROFILE_TOASTS } from "@/constants/toastMessages";
import { toast } from "sonner";
import { useDonations } from "@/hooks/useDonations";
import type { IDonation } from "@/types/DonationTypes";
import CertificateButton from "@/components/Donation/CertificateButton";
import DonationHistoryCalendar from "./DonationHistoryCalendar";

const ProfilePage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        if (response.success) {
          // Sync Redux with full user object
          dispatch(setUser(response.data));
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(clearUser());
      toast.success(PROFILE_TOASTS.LOGOUT_SUCCESS);
      navigate("/login");
    } catch {
      toast.error(PROFILE_TOASTS.LOGOUT_FAILED);
    }
  };

  const calculateAge = (dateOfBirth?: string | null) => {
    if (!dateOfBirth) return "Not provided";
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return `${age} years`;
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Not provided";
    return new Date(dateString)
      .toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, " - ");
  };

  const age = calculateAge(user.dateOfBirth);
  
  const { useMyDonations } = useDonations();
  const { data: donationsData, isLoading: historyLoading } = useMyDonations();
  
  const lastDonation = user.lastDonatedDate ? formatDate(user.lastDonatedDate) : "Not yet";
  const donationHistory = donationsData?.donations || [];

  // Find the next eligible date from the latest donation
  const latestDonation = donationHistory[0] as IDonation | undefined;
  const nextEligibleDate = latestDonation ? formatDate(latestDonation.nextEligibleDate) : null;

  const aboutFields = [
    {
      label: "Full Name",
      value: user.name,
      icon: <User size={14} className="text-blue-500" />,
      iconBg: "bg-blue-50",
    },
    {
      label: "Email",
      value: user.email,
      icon: <Mail size={14} className="text-purple-500" />,
      iconBg: "bg-purple-50",
    },
    {
      label: "WhatsApp Number",
      value: user.whatsappNumber || "Not provided",
      icon: <MessageCircle size={14} className="text-green-500" />,
      iconBg: "bg-green-50",
    },
    {
      label: "Place",
      value: user.place || "Not provided",
      icon: <MapPin size={14} className="text-rose-500" />,
      iconBg: "bg-rose-50",
    },
    {
      label: "District",
      value: user.district || "Not provided",
      icon: <MapPin size={14} className="text-orange-500" />,
      iconBg: "bg-orange-50",
    },
    {
      label: "Phone Number",
      value: user.phoneNumber,
      icon: <Phone size={14} className="text-green-600" />,
      iconBg: "bg-green-50",
    },
    {
      label: "Pincode",
      value: user.pincode || "Not provided",
      icon: <Home size={14} className="text-yellow-600" />,
      iconBg: "bg-yellow-50",
    },
    {
      label: "Age",
      value: age,
      icon: <Clock size={14} className="text-indigo-500" />,
      iconBg: "bg-indigo-50",
    },
    {
      label: "Blood Group",
      value: user.bloodGroup || "Not provided",
      icon: <Droplets size={14} className="text-red-500" />,
      iconBg: "bg-red-50",
      isBlood: true,
    },
    {
      label: "Address",
      value: user.address || "Not provided",
      icon: <MapPin size={14} className="text-blue-400" />,
      iconBg: "bg-slate-50",
    },
    {
      label: "Last Donation Date",
      value: lastDonation,
      icon: <Calendar size={14} className="text-teal-500" />,
      iconBg: "bg-teal-50",
    },
  ];


  return (
    <div className="min-h-screen bg-[#f0f2f5] py-6 sm:py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-5">
        {/* ─── MAIN COLUMN ─── */}
        <div className="flex-1 space-y-5">
          {/* Header Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-5 transition-all">
            <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-red-50 border-2 border-red-100 flex items-center justify-center overflow-hidden transition-transform hover:scale-105">
                  {user.photoUrl ? (
                    <img
                      src={user.photoUrl}
                      alt={user.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={36} className="text-red-400" />
                  )}
                </div>
                {/* Blood group badge */}
                <span className="absolute -bottom-1.5 -right-1.5 bg-red-600 text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-lg border-2 border-white shadow-sm">
                  {user.bloodGroup || "N/A"}
                </span>
              </div>

              {/* Name & meta */}
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                  {user.name || "User Name"}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-1.5 text-sm text-gray-400 font-medium">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="shrink-0" />
                    <span>
                      {user.place || "Not provided"}, {user.district || "Kerala"}
                    </span>
                  </div>
                  <span className="hidden sm:inline w-1 h-1 bg-slate-200 rounded-full" />
                  <span className="inline-flex items-center gap-1 bg-green-50 text-green-600 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-green-100">
                    <ShieldCheck size={10} />
                    Verified Donor
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
              <Button
                onClick={() => navigate("/profile/edit")}
                className="bg-gray-900 hover:bg-black text-white rounded-xl px-6 py-2.5 text-sm font-semibold h-11 flex items-center gap-2.5 shadow-sm active:scale-95 transition-all outline-none"
              >
                <Pencil size={15} />
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: <Droplets size={18} className="text-red-500" />,
                iconBg: "bg-red-50",
                label: "Blood Group",
                value: user.bloodGroup || "Not provided",
              },
              {
                icon: <Calendar size={18} className="text-blue-500" />,
                iconBg: "bg-blue-50",
                label: "Last Donation",
                value: lastDonation,
              },
              {
                icon: <Activity size={18} className={user.isEligible ? "text-green-600" : "text-amber-500"} />,
                iconBg: user.isEligible ? "bg-green-50" : "bg-amber-50",
                label: "Eligibility",
                value: user.isEligible ? "Ready to Donate" : `Available on ${nextEligibleDate}`,
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-100 p-4.5 flex items-center gap-4 hover:shadow-md transition-all group"
              >
                <div
                  className={`w-11 h-11 rounded-xl ${stat.iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
                >
                  {stat.icon}
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    {stat.label}
                  </div>
                  <div className="text-base font-bold text-slate-800 tracking-tight">
                    {stat.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* About Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-7 py-4 flex items-center gap-3 border-b border-slate-50 bg-slate-50/30">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                <User size={14} className="text-indigo-600" />
              </div>
              <h2 className="text-[15px] font-bold text-slate-800">
                Personal Information
              </h2>
            </div>

            <div className="divide-y divide-slate-50">
              {aboutFields.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center px-7 py-3 hover:bg-slate-50/60 transition-colors gap-1 sm:gap-0"
                >
                  <div className="flex items-center gap-4 sm:w-56 shrink-0">
                    <div
                      className={`w-7 h-7 rounded-lg ${item.iconBg} flex items-center justify-center shrink-0`}
                    >
                      {item.icon}
                    </div>
                    <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-widest">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex-1 pl-11 sm:pl-0">
                    <span className="text-slate-700 font-semibold text-[14px] tracking-tight">
                      {item.isBlood ? (
                        <span className="inline-flex items-center gap-2 bg-red-50 text-red-700 font-bold text-xs px-3 py-1 rounded-lg border border-red-100 shadow-sm">
                          <Flame size={11} fill="currentColor" />
                          {item.value}
                        </span>
                      ) : (
                        item.value || (
                          <span className="text-slate-300 font-medium italic">
                            Not provided
                          </span>
                        )
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logout */}
          <div className="flex justify-start">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 text-slate-400 hover:text-red-500 transition-all font-semibold px-4 py-2 text-sm group"
            >
              <LogOut
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span>Logout and return home</span>
            </button>
          </div>
        </div>

        {/* ─── SIDEBAR ─── */}
        <div className="w-full lg:w-[360px] space-y-5">
          {/* Donation History */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-50 bg-slate-50/30">
              <h2 className="text-[14px] font-bold text-slate-800 flex items-center gap-2.5">
                <Droplets size={15} className="text-red-500" />
                History
              </h2>
              <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-red-100 uppercase">
                {donationHistory.length} Donations
              </span>
            </div>

            {historyLoading ? (
              <div className="px-7 py-10 text-center animate-pulse">
                <p className="text-slate-300 text-sm font-medium">Loading history...</p>
              </div>
            ) : donationHistory.length > 0 ? (
              <>
                <div className="flex justify-between px-7 py-2.5 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                  <span>Date</span>
                  <span>Status</span>
                </div>
                <div className="px-1.5 pb-1.5">
                  {donationHistory.map((item: IDonation, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center px-5 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/80 rounded-xl transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-200 group-hover:bg-red-500 transition-all shrink-0" />
                        <span className="text-slate-600 font-semibold text-sm">
                          {formatDate(item.donatedAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CertificateButton donationId={item._id} />
                        <span className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold px-3 py-1 rounded-lg">
                          SUCCESS
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="px-7 py-10 text-center">
                <p className="text-slate-300 text-sm italic font-medium">
                  No donation history available yet.
                </p>
              </div>
            )}
          </div>

          {/* Calendar View */}
          <DonationHistoryCalendar donations={donationHistory} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;