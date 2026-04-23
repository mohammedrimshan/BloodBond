import { MapPin, Droplet, Calendar } from "lucide-react";
import type { IDonorResponse } from "@/types/DonorTypes";

interface DonorCardProps {
  donor: IDonorResponse;
  onClick?: () => void;
}

const DonorCard = ({ donor, onClick }: DonorCardProps) => {
  const formattedDate = donor.lastDonatedDate 
    ? new Date(donor.lastDonatedDate).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "No recent donation";

  const getBadge = (count: number) => {
    if (count >= 10) return { label: "Legend", color: "bg-amber-500 text-white shadow-amber-500/50" };
    if (count >= 5) return { label: "Guardian", color: "bg-indigo-500 text-white shadow-indigo-500/50" };
    if (count >= 1) return { label: "Life Saver", color: "bg-emerald-500 text-white shadow-emerald-500/50" };
    return null;
  };
  const badge = getBadge(donor.totalDonations ?? 0);

  return (
    <div 
      onClick={onClick}
      className={`group relative rounded-2xl border border-border bg-background p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${onClick ? 'cursor-pointer' : ''} ${donor.isEligible === false ? 'opacity-75 grayscale-[0.2]' : ''}`}
    >
      {/* Availability Status */}
      {donor.isEligible === false && (
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-[10px] font-semibold text-red-700 ring-1 ring-inset ring-red-600/10">
            Not Available
          </span>
        </div>
      )}

      {/* Top right badges */}
      <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5">
        {badge && (
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider shadow-md ${badge.color}`}>
            {badge.label}
          </span>
        )}
        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary border border-primary/20 backdrop-blur-sm">
          {donor.bloodGroup}
        </span>
      </div>

      {/* Avatar + Name */}
      <div className="flex items-center gap-4 mb-6 mt-4">
        <img
          src={donor.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${donor.name}`}
          alt={donor.name}
          className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20 shrink-0 shadow-sm"
        />
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-foreground truncate leading-tight">
            {donor.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
            <MapPin size={13} />
            <span className="truncate">{donor.place || "Unknown Location"}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between pt-4 border-t border-border/60">
        <div className="flex items-center gap-1.5 text-sm">
          <Droplet size={15} className="text-primary fill-primary/30" />
          <span className="text-foreground font-bold">{donor.totalDonations ?? 0}</span>
          <span className="text-muted-foreground">donations</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar size={13} />
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default DonorCard;
