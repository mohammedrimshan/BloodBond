import HeroCarousel from "./HeroCarousel";
import DonorSection from "./DonorSection";
import { useGetDonors } from "@/hooks/users/useUsers";
import { Droplets, Heart, Users } from "lucide-react";

const LandingPage = () => {
  const { data: donorsResponse, isLoading } = useGetDonors();
  const donors = donorsResponse?.data || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Carousel */}
      <HeroCarousel donors={donors} />

      {/* Stats ribbon */}
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4 py-6 sm:py-8">
            <div className="flex flex-col items-center text-center">
              <Droplets size={24} className="mb-2 opacity-80" />
              <span className="text-xl sm:text-2xl font-bold">1,200+</span>
              <span className="text-xs sm:text-sm opacity-80">Units Donated</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Users size={24} className="mb-2 opacity-80" />
              <span className="text-xl sm:text-2xl font-bold">500+</span>
              <span className="text-xs sm:text-sm opacity-80">Active Donors</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Heart size={24} className="mb-2 opacity-80" />
              <span className="text-xl sm:text-2xl font-bold">3,600+</span>
              <span className="text-xs sm:text-sm opacity-80">Lives Saved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Donor Section */}
      <DonorSection donors={donors} isLoading={isLoading} />

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                BloodBond
              </span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              © 2026 BloodBond. Every drop counts. Donate blood, save lives.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
