import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RootState } from "@/store/store";
import { clearUser } from "@/store/userSlice";
import { logoutUser } from "@/Service/authService";
import { PROFILE_TOASTS } from "@/constants/toastMessages";
import { toast } from "sonner";

const ProfilePage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    return age;
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Not provided";
    return new Date(dateString)
      .toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })
      .replace(/\//g, " - ");
  };

  const age = calculateAge(user.dateOfBirth);
  const lastDonation = user.lastDonatedDate ? formatDate(user.lastDonatedDate) : "11 - 10 - 2021";

  const donationHistory = [
    { date: "13 Dec 2020", units: 120 },
    { date: "28 Nov 2020", units: 20 },
    { date: "04 Nov 2020", units: 40 },
    { date: "15 Oct 2020", units: 310 },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-3 font-sans">
      {/* Main Window Container */}
      <div className="w-full max-w-[1100px] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col lg:flex-row">

        {/* Main Content Area */}
        <div className="flex-1 p-5 space-y-4 bg-[#f9fafb]/50">

          {/* Header Section */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="w-20 h-20 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden ring-1 ring-slate-100 shrink-0">
                {user.photoUrl ? (
                  <img src={user.photoUrl} alt={user.name || "User"} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-100" />
                )}
              </div>
              <h1 className="text-xl font-extrabold text-[#1a1c1e] tracking-tight">
                {user.name || "User Name"}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <Bell size={20} />
              </button>
              <Button className="bg-black hover:bg-slate-900 text-white rounded-xl px-6 py-2 text-sm font-bold transition-all h-auto">
                Edit Profile
              </Button>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-3 text-center border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-600">About</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                { label: "Full Name", value: user.name },
                { label: "Email", value: user.email },
                { label: "District", value: user.place || "Kozhikode" },
                { label: "Phone Number", value: user.phoneNumber },
                { label: "Pincode", value: "673014" },
                { label: "Age", value: age === "Not provided" ? "21" : age },
                { label: "Blood Group", value: user.bloodGroup || "O +ve" },
                { label: "Address", value: "Karuvally Reenugeetham House..." },
                { label: "Last Donation Date", value: lastDonation },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-center px-6 py-2.5 hover:bg-slate-50/40 transition-all"
                >
                  <span className="w-full sm:w-5/12 text-slate-500 font-semibold text-sm text-center">{item.label}</span>
                  <span className="w-full sm:w-7/12 text-slate-800 font-medium text-sm text-center sm:text-left">{item.value || "Not provided"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Logout */}
          <div className="flex justify-start">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors font-medium px-3 py-1.5 text-sm"
            >
              <LogOut size={15} />
              <span>Logout and return home</span>
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[320px] p-5 space-y-4 bg-[#f3f4f6]/30 border-l border-slate-100/50">

          {/* Donation History Card */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <h2 className="text-center text-sm font-bold text-slate-700 mb-4">Donation History</h2>
            <div className="space-y-3">
              <div className="flex justify-between px-1 text-slate-300 text-xs font-bold">
                <span>Date</span>
                <span>Blood Units</span>
              </div>
              <div className="space-y-1">
                {donationHistory.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                    <span className="text-slate-600 font-medium text-sm">{item.date}</span>
                    <span className="text-slate-800 font-bold text-sm">{item.units}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Calendar Card */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-slate-800">December 2020</h2>
              <div className="flex gap-2">
                <button className="text-slate-400 hover:text-slate-600"><ChevronLeft size={18} /></button>
                <button className="text-slate-400 hover:text-slate-600"><ChevronRight size={18} /></button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-y-1 text-center">
              {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
                <span key={day} className="text-[10px] font-bold text-slate-400 uppercase pb-1">{day}</span>
              ))}
              {[...Array(31)].map((_, i) => {
                const day = i + 1;
                const isSelected = day === 18;
                return (
                  <div key={i} className="flex items-center justify-center">
                    <span
                      className={`w-7 h-7 flex items-center justify-center text-xs font-bold rounded-md transition-all ${
                        isSelected
                          ? "bg-[#3b49df] text-white shadow-md"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;