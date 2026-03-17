import { MapPin, Droplet, Calendar } from "lucide-react";
import type { IDonorResponse } from "@/types/DonorTypes";

interface DonorCardProps {
  donor: IDonorResponse;
}

const DonorCard = ({ donor }: DonorCardProps) => {
  const formattedDate = donor.lastDonatedDate 
    ? new Date(donor.lastDonatedDate).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "No recent donation";

  return (
    <div className={`group relative rounded-2xl border border-border bg-background p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${donor.isEligible === false ? 'opacity-75 grayscale-[0.2]' : ''}`}>
      {/* Availability Status */}
      {donor.isEligible === false && (
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-[10px] font-semibold text-red-700 ring-1 ring-inset ring-red-600/10">
            Not Available
          </span>
        </div>
      )}

      {/* Blood group badge */}
      <div className="absolute top-4 right-4">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary border border-primary/20">
          {donor.bloodGroup}
        </span>
      </div>

      {/* Avatar + Name */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={donor.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${donor.name}`}
          alt={donor.name}
          className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20 shrink-0"
        />
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-foreground truncate">
            {donor.name}
          </h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin size={12} />
            <span className="truncate">{donor.place || "Unknown Location"}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between pt-3 border-t border-border/60">
        <div className="flex items-center gap-1.5 text-sm">
          <Droplet size={14} className="text-primary fill-primary/30" />
          <span className="text-foreground font-medium">-</span>
          <span className="text-muted-foreground">donations</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar size={12} />
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default DonorCard;
