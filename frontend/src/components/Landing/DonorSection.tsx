import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Search, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DonorCard from "./DonorCard";
import type { IDonorResponse } from "@/types/DonorTypes";
import type { RootState } from "@/store/store";
import { DONOR_TOASTS } from "@/constants/toastMessages";
import { toast } from "sonner";

interface DonorSectionProps {
  donors: IDonorResponse[];
  isLoading?: boolean;
}

const BLOOD_GROUPS = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

const DonorSection = ({ donors, isLoading }: DonorSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>("All");
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const navigate = useNavigate();

  const filteredDonors = useMemo(() => {
    return donors.filter((donor) => {
      const matchesSearch = donor.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesBloodGroup =
        selectedBloodGroup === "All" || donor.bloodGroup === selectedBloodGroup;
      return matchesSearch && matchesBloodGroup;
    });
  }, [donors, searchQuery, selectedBloodGroup]);

  const handleBecomeDonor = () => {
    if (isLoggedIn) {
      toast.success(DONOR_TOASTS.ALREADY_REGISTERED);
    } else {
      navigate("/signup");
    }
  };

  return (
    <section id="donors" className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header + CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Our <span className="text-primary">Donors</span>
            </h2>
            <p className="mt-1 text-sm sm:text-base text-muted-foreground">
              Meet the heroes saving lives in your community
            </p>
          </div>
          <Button
            onClick={handleBecomeDonor}
            className="bg-primary hover:bg-burgundy-light text-primary-foreground font-medium px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <HeartHandshake size={18} className="mr-2" />
            Become a Donor
          </Button>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Search bar */}
          <div className="relative max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="text"
              placeholder="Search donors by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 pl-10 bg-background border-border focus:border-primary focus:ring-primary rounded-xl"
            />
          </div>

          {/* Blood group filter chips */}
          <div className="flex flex-wrap gap-2">
            {BLOOD_GROUPS.map((group) => (
              <button
                key={group}
                onClick={() => setSelectedBloodGroup(group)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                  selectedBloodGroup === group
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-primary"
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </div>

        {/* Donor Cards Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredDonors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredDonors.map((donor) => (
              <DonorCard key={donor.id} donor={donor} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              No donors found
            </h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default DonorSection;
