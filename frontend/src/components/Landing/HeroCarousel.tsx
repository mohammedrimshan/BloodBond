import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Droplet, HeartHandshake } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import type { IDonorResponse } from "@/types/DonorTypes";

interface HeroCarouselProps {
  donors: IDonorResponse[];
}

const HeroCarousel = ({ donors }: HeroCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  // Filter for donors who have actually donated
  const spotlightDonors = donors.filter((d) => d.lastDonatedDate).slice(0, 5);

  const handleBecomeDonor = () => {
    if (!isLoggedIn) {
      navigate("/signup");
    }
  };

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [isTransitioning]
  );

  const goNext = useCallback(() => {
    goToSlide((currentIndex + 1) % spotlightDonors.length);
  }, [currentIndex, spotlightDonors.length, goToSlide]);

  const goPrev = useCallback(() => {
    goToSlide(
      (currentIndex - 1 + spotlightDonors.length) % spotlightDonors.length
    );
  }, [currentIndex, spotlightDonors.length, goToSlide]);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const interval = setInterval(goNext, 5000);
    return () => clearInterval(interval);
  }, [goNext]);

  if (spotlightDonors.length === 0) {
    return (
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-primary/5 via-peach/50 to-primary/10 py-12 sm:py-16 lg:py-20">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center px-6 sm:px-20 animate-in fade-in duration-700">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 ring-4 ring-primary/20 shadow-lg">
              <HeartHandshake size={40} className="text-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Be the First to <span className="text-primary">Donate</span>
            </h2>
            <p className="mt-2 mb-8 text-base sm:text-lg text-muted-foreground font-medium max-w-xl">
              Currently, there are no recorded donations in our community. Join our mission and spark a chain of life-saving events.
            </p>
            {!isLoggedIn && (
              <Button 
                onClick={handleBecomeDonor}
                className="bg-primary hover:bg-burgundy-light text-primary-foreground font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all h-auto text-lg"
              >
                <HeartHandshake size={20} className="mr-2" />
                Become a Donor
              </Button>
            )}
          </div>
        </div>
      </section>
    );
  }

  const donor = spotlightDonors[currentIndex];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-primary/5 via-peach/50 to-primary/10 py-12 sm:py-16 lg:py-20">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary/5 rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary/5 rounded-full blur-xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section title */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            🩸 Donor <span className="text-primary">Spotlight</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            Celebrating our amazing donors who save lives every day
          </p>
        </div>

        {/* Carousel content */}
        <div className="relative flex items-center justify-center min-h-[220px] sm:min-h-[250px]">
          {/* Prev button */}
          <button
            onClick={goPrev}
            className="absolute left-0 sm:left-2 z-10 p-2 rounded-full bg-background/80 border border-border shadow-md hover:bg-muted transition-colors"
            aria-label="Previous donor"
          >
            <ChevronLeft size={20} className="text-foreground" />
          </button>

          {/* Slide */}
          <div
            className={`flex flex-col items-center text-center px-12 sm:px-20 transition-all duration-500 ${
              isTransitioning
                ? "opacity-0 translate-y-4"
                : "opacity-100 translate-y-0"
            }`}
          >
            <div className="relative mb-4">
              <img
                src={donor.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${donor.name}`}
                alt={donor.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-lg ring-4 ring-primary/20"
              />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                <Droplet size={14} className="text-primary fill-primary" />
              </div>
            </div>

            {/* Info */}
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">
              {donor.name}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {donor.bloodGroup}
              </span>
              <span className="text-sm text-muted-foreground">
                {donor.place || "Unknown Location"}
              </span>
            </div>
            {/* 
            <p className="mt-3 text-base sm:text-lg text-foreground font-medium max-w-md">
              {donor.congratsMessage}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-semibold text-primary">
                {donor.donationCount}
              </span>{" "}
              donations completed
            </p> 
            */}
          </div>

          {/* Next button */}
          <button
            onClick={goNext}
            className="absolute right-0 sm:right-2 z-10 p-2 rounded-full bg-background/80 border border-border shadow-md hover:bg-muted transition-colors"
            aria-label="Next donor"
          >
            <ChevronRight size={20} className="text-foreground" />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {spotlightDonors.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-primary w-6"
                  : "bg-primary/30 hover:bg-primary/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
