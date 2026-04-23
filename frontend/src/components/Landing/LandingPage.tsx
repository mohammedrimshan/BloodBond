import HeroCarousel from "./HeroCarousel";
import DonorSection from "./DonorSection";
import RecentDonorsCarousel from "./RecentDonorsCarousel";
import { useGetDonors } from "@/hooks/users/useUsers";
import { Droplets, Heart, Users, PlusCircle } from "lucide-react";
import InteractiveDroplet from "./InteractiveDroplet";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BloodRequestForm from "./BloodRequestForm";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const LandingPage = () => {
  const { hash } = useLocation();
  const { data: donorsResponse, isLoading } = useGetDonors();
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  const donors = donorsResponse?.data || [];

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-background">
      {/* New Hero Section with Interactive Droplet */}
      <section className="relative overflow-hidden bg-background pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Text Content */}
            <div className="flex flex-col items-start space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Save Lives Today
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                Your Blood. <br className="hidden md:block"/>
                <span className="text-primary relative inline-block">
                  Their Future.
                  <svg className="absolute -bottom-2 w-full h-3 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="4" fill="transparent"/></svg>
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 font-medium max-w-lg leading-relaxed">
                A single drop of blood holds the power to restart a heartbeat. Join our community of lifesavers and make a difference that lasts forever.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-xl bg-primary hover:bg-burgundy-light text-white shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all">
                    Become a Donor
                  </Button>
                </Link>
                <Button 
                  onClick={() => setIsRequestFormOpen(true)}
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto h-14 px-8 text-lg rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 transition-all gap-2"
                >
                  <PlusCircle size={20} className="text-red-600" />
                  Request Blood
                </Button>
              </div>
            </div>

            {/* Interactive Graphic */}
            <div className="flex justify-center lg:justify-end animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
              <div className="w-full max-w-[400px] lg:max-w-[500px]">
                <InteractiveDroplet />
              </div>
            </div>

          </div>
        </div>
      </section>

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

      {/* Recent Donors Carousel */}
      <RecentDonorsCarousel />

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
      <BloodRequestForm isOpen={isRequestFormOpen} onClose={() => setIsRequestFormOpen(false)} />
    </div>
  );
};

export default LandingPage;
