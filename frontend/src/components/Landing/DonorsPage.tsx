import DonorSection from "./DonorSection";
import { useGetDonors } from "@/hooks/users/useUsers";
import { motion } from "framer-motion";

const DonorsPage = () => {
  const { data: donorsResponse, isLoading } = useGetDonors();
  const donors = donorsResponse?.data || [];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background pt-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight"
          >
            Our Life-Saving <span className="text-primary">Community</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Every donor listed here has made the choice to save lives. 
            Join these heroes today and help build a healthier future for everyone.
          </motion.p>
        </div>

        <DonorSection donors={donors} isLoading={isLoading} />
      </div>
    </motion.div>
  );
};

export default DonorsPage;
