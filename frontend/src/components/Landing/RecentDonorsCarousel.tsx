import { useDonations } from "@/hooks/useDonations";
import { Droplet, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

const RecentDonorsCarousel = () => {
  const { useRecentDonations } = useDonations();
  const { data, isLoading } = useRecentDonations();
  const recentDonations = data?.donations || [];

  if (isLoading) {
    return (
      <div className="py-12 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-lg mb-8" />
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="min-w-[280px] h-40 bg-white rounded-2xl shadow-sm border border-slate-100 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (recentDonations.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-b from-white to-slate-50/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Recently <span className="text-red-600">Donated</span>
            </h2>
            <p className="text-slate-500 mt-1 text-sm font-medium">Real-time updates from our life-saving community</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-widest bg-red-50 px-4 py-2 rounded-full border border-red-100">
            <span className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            Live Updates
          </div>
        </div>

        <motion.div 
          className="flex gap-6 overflow-x-auto pb-8 pt-2 no-scrollbar px-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {recentDonations.map((donation) => (
            <motion.div
              key={donation._id}
              whileHover={{ y: -5 }}
              className="min-w-[280px] sm:min-w-[320px] bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-red-900/5 transition-all group relative overflow-hidden"
            >
              {/* Decorative background */}
              <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-red-50 rounded-full blur-3xl group-hover:bg-red-100 transition-colors" />
              
              <div className="flex items-center gap-5 relative z-10">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-inner">
                    {donation.userId.photoUrl ? (
                      <img src={donation.userId.photoUrl} alt={donation.userId.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-red-50 text-red-600 font-bold text-xl">
                        {donation.userId.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-lg shadow-sm border border-slate-100">
                    <Droplet size={14} className="text-red-600 fill-red-600" />
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-red-600 transition-colors">{donation.userId.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-black bg-red-600 text-white px-2 py-0.5 rounded-md uppercase tracking-tighter">
                      {donation.userId.bloodGroup}
                    </span>
                    <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                      <Calendar size={12} />
                      {formatRelativeTime(donation.donatedAt)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                  <HeartHandshake size={14} className="text-red-400" />
                  <span>Verified Hero</span>
                </div>
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  Thank You!
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const HeartHandshake = ({ size, className }: { size: number, className: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66" />
    <path d="m18 15-2-2" />
    <path d="m15 18-2-2" />
  </svg>
)

export default RecentDonorsCarousel;
