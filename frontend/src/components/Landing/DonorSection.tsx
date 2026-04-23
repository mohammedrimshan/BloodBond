import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Search, HeartHandshake, Map as MapIcon, LayoutGrid, Navigation, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DonorCard from "./DonorCard";
import DonorsMap from "./DonorsMap";
import PublicUserModal from "@/components/Modal/PublicUserModal";
import type { IDonorResponse } from "../../types/DonorTypes";
import type { RootState } from "@/store/store";
import { DONOR_TOASTS } from "@/constants/toastMessages";
import { toast } from "sonner";
import { useGetNearbyDonors } from "@/hooks/users/useUsers";

interface DonorSectionProps {
  donors: IDonorResponse[];
  isLoading?: boolean;
}

const BLOOD_GROUPS = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

const DonorSection = ({ donors, isLoading }: DonorSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isNearbyMode, setIsNearbyMode] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const navigate = useNavigate();

  const { data: nearbyResponse, isLoading: isNearbyLoading } = useGetNearbyDonors(
    userLocation?.lat || null,
    userLocation?.lng || null,
    10
  );

  if (isNearbyMode) {
    console.log("📍 Nearby Donors Found:", nearbyResponse?.data?.map(d => ({
      name: d.name,
      coords: d.location?.coordinates,
      dist: "within 10km"
    })));
  }

  const activeDonors = isNearbyMode && nearbyResponse?.data ? nearbyResponse.data : donors;

  const filteredDonors = useMemo(() => {
    return activeDonors.filter((donor) => {
      const matchesSearch = donor.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBloodGroup = selectedBloodGroup === "All" || donor.bloodGroup === selectedBloodGroup;
      return matchesSearch && matchesBloodGroup;
    });
  }, [activeDonors, searchQuery, selectedBloodGroup]);

  const handleBecomeDonor = () => {
    if (isLoggedIn) {
      toast.success(DONOR_TOASTS.ALREADY_REGISTERED);
    } else {
      navigate("/signup");
    }
  };

  const toggleNearby = () => {
    if (!isNearbyMode) {
      if (!navigator.geolocation) {
        toast.error("Geolocation is not supported by your browser");
        return;
      }
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("📡 Nearby Search Center Detected:", { latitude, longitude });
          setUserLocation({
            lat: latitude,
            lng: longitude
          });
          setIsNearbyMode(true);
          setIsLocating(false);
          toast.success("Finding donors within 10km");
        },
        () => {
          setIsLocating(false);
          toast.error("Location access denied");
        }
      );
    } else {
      setIsNearbyMode(false);
      setUserLocation(null);
    }
  };

  return (
    <section id="donors" className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Our <span className="text-red-600">Life-Savers</span>
            </h2>
            <p className="text-slate-500 mt-2 text-sm font-medium">Find and connect with blood donors</p>
          </div>
          <div className="flex items-center gap-3">
             <Button variant={isNearbyMode ? "default" : "outline"} onClick={toggleNearby} disabled={isLocating} className="rounded-xl px-5 h-12 font-bold">
                {isLocating ? <Loader2 size={18} className="animate-spin mr-2" /> : <Navigation size={18} className="mr-2" />}
                {isNearbyMode ? "Showing Nearby" : "Find Near Me"}
              </Button>
              <Button onClick={handleBecomeDonor} className="bg-slate-900 text-white font-bold px-6 h-12 rounded-xl">
                <HeartHandshake size={18} className="mr-2" />
                Become a Donor
              </Button>
          </div>
        </div>

        <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-[2rem] mb-10">
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
            <div className="flex gap-4 w-full lg:w-auto">
              <div className="relative w-full sm:w-80">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input type="text" placeholder="Search by name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-12 pl-11 rounded-xl" />
              </div>
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                <button onClick={() => setViewMode("grid")} className={`p-2.5 rounded-lg ${viewMode === "grid" ? 'bg-red-600 text-white' : 'text-slate-400'}`}><LayoutGrid size={18} /></button>
                <button onClick={() => setViewMode("map")} className={`p-2.5 rounded-lg ${viewMode === "map" ? 'bg-red-600 text-white' : 'text-slate-400'}`}><MapIcon size={18} /></button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {BLOOD_GROUPS.map((group) => (
                <button key={group} onClick={() => setSelectedBloodGroup(group)} className={`px-4 py-2 rounded-xl text-xs font-bold border ${selectedBloodGroup === group ? "bg-red-600 text-white" : "bg-white text-slate-500"}`}>
                  {group}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLoading || isNearbyLoading ? (
          <div className="flex flex-col items-center py-24 gap-4">
            <div className="w-16 h-16 border-4 border-t-red-600 rounded-full animate-spin" />
          </div>
        ) : viewMode === "map" ? (
          <DonorsMap donors={filteredDonors} center={userLocation ? [userLocation.lat, userLocation.lng] : undefined} zoom={userLocation ? 13 : undefined} onViewProfile={(id) => setSelectedUserId(id)} />
        ) : filteredDonors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDonors.map((donor, idx) => (
              <div key={donor.id || (donor as any)._id || idx} className="relative group">
                <DonorCard donor={donor} onClick={() => setSelectedUserId(donor.id || (donor as any)._id)} />
                {isNearbyMode && <div className="absolute -top-3 -right-3 z-20 bg-green-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg border-2 border-white">NEARBY</div>}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-24 text-center">
            <h3 className="text-2xl font-black text-slate-800 mb-2">No matching donors found</h3>
          </div>
        )}
      </div>

      {selectedUserId && (
        <PublicUserModal 
          userId={selectedUserId} 
          onClose={() => setSelectedUserId(null)} 
        />
      )}
    </section>
  );
};

export default DonorSection;
