import { useAdminStats } from "@/admin/hooks/useAdminStats";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Users, 
  UserCheck, 
  UserMinus, 
  UserPlus, 
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight
} from "lucide-react";

const Dashboard = () => {
  const { data: stats, isLoading } = useAdminStats();

  const cards = [
    { 
      label: "Total Users", 
      value: stats?.total || 0, 
      icon: Users, 
      color: "blue",
      trend: "+12%",
      isUp: true
    },
    { 
      label: "Active Users", 
      value: stats?.active || 0, 
      icon: UserCheck, 
      color: "green",
      trend: "+5.4%",
      isUp: true
    },
    { 
      label: "Blocked Users", 
      value: stats?.blocked || 0, 
      icon: UserMinus, 
      color: "red",
      trend: "-2%",
      isUp: false
    },
    { 
      label: "Verified Users", 
      value: stats?.verified || 0, 
      icon: UserPlus, 
      color: "purple",
      trend: "+8%",
      isUp: true
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto"
    >
          {/* Header */}
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl md:text-4xl font-extrabold text-white tracking-tight"
              >
                Platform Overview
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-slate-400 mt-2 font-medium"
              >
                Real-time insights into the BloodBond community
              </motion.p>
            </div>
            <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-800/60 p-1.5 rounded-xl backdrop-blur-md">
              <button className="px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded-lg shadow-sm">Last 30 Days</button>
              <button className="px-4 py-2 text-slate-400 text-sm font-semibold hover:text-white transition-colors">Last 7 Days</button>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card) => (
              <motion.div
                key={card.label}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="relative group bg-slate-900/40 border border-slate-800/60 p-6 rounded-3xl backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/20"
              >
                {/* Background Glow */}
                <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${card.color}-500/5 rounded-full blur-3xl group-hover:bg-${card.color}-500/10 transition-all duration-500`} />
                
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl bg-${card.color}-500/10 border border-${card.color}-500/20 text-${card.color}-500`}>
                    <card.icon size={24} />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${card.isUp ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {card.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {card.trend}
                  </div>
                </div>

                <div>
                  <p className="text-slate-500 font-semibold text-xs uppercase tracking-widest">{card.label}</p>
                  {isLoading ? (
                    <div className="h-10 w-24 bg-slate-800/50 animate-pulse mt-2 rounded-xl" />
                  ) : (
                    <div className="flex items-baseline gap-2">
                       <p className="text-4xl font-bold mt-1 text-white tracking-tighter">{card.value}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Secondary Sections */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
             <motion.div 
               variants={itemVariants}
               className="lg:col-span-2 bg-slate-900/40 border border-slate-800/60 p-8 rounded-[2rem] backdrop-blur-xl shadow-2xl shadow-black/20 relative overflow-hidden group"
             >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                      <Activity size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">User Engagement</h3>
                  </div>
                  <TrendingUp className="text-slate-600" size={20} />
                </div>
                
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-800/50 rounded-[1.5rem] bg-slate-950/20 group-hover:bg-slate-950/40 transition-all duration-500">
                   <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                     <Activity className="text-slate-600 animate-pulse" size={32} />
                   </div>
                   <p className="text-slate-500 font-medium italic text-sm">Real-time interaction matrix coming soon...</p>
                </div>
             </motion.div>

             <motion.div 
               variants={itemVariants}
               className="bg-slate-900/40 border border-slate-800/60 p-8 rounded-[2rem] backdrop-blur-xl shadow-2xl shadow-black/20"
             >
                <h3 className="text-xl font-bold text-white mb-8 tracking-tight">Quick Actions</h3>
                 <div className="space-y-4">
                   <motion.div whileHover={{ x: 5 }}>
                    <Link 
                      to="/admin/users" 
                      className="group flex items-center justify-between p-5 bg-slate-800/40 hover:bg-red-600/10 border border-slate-700/50 hover:border-red-600/30 rounded-2xl transition-all duration-300"
                    >
                       <div className="flex items-center gap-4">
                         <div className="p-2.5 bg-slate-700/50 group-hover:bg-red-600/20 rounded-xl text-slate-300 group-hover:text-red-500 transition-colors">
                           <Users size={20} />
                         </div>
                         <div>
                           <p className="font-bold text-white group-hover:text-red-500 transition-colors">User Management</p>
                           <p className="text-xs text-slate-500 group-hover:text-slate-400 mt-1 font-medium">Verify, block, or view profiles</p>
                         </div>
                       </div>
                       <ChevronRight size={18} className="text-slate-600 group-hover:text-red-500 transition-colors" />
                    </Link>
                   </motion.div>
                   
                   {/* Placeholder for more actions */}
                   <div className="p-8 border border-slate-800/60 border-dashed rounded-2xl flex flex-col items-center opacity-40">
                      <div className="w-10 h-10 bg-slate-800 rounded-lg mb-2" />
                      <div className="h-2 w-20 bg-slate-800 rounded-full" />
                   </div>
                </div>
             </motion.div>
          </div>
    </motion.div>
  );
};

export default Dashboard;

