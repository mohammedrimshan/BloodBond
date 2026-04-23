import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  Clock, 
  CheckCircle, 
  ChevronRight, 
  Info, 
  Heart,
  Droplet
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/contexts/SocketContext";
import { useNavigate } from "react-router-dom";
import type { INotification } from "@/Service/notificationService";
import {
  getAdminNotifications,
  markAdminAsRead,
  markAdminAllAsRead,
} from "@/admin/api/adminNotificationService";

const formatDistanceToNow = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

const Notifications = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  const { data: notifications = [], isLoading } = useQuery<INotification[], Error>({
    queryKey: ["admin-notifications"],
    queryFn: getAdminNotifications,
  });

  const markAsRead = useMutation({
    mutationFn: markAdminAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: markAdminAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
    },
  });

  // Listen for real-time updates — only invalidate queries, no toast (SocketContext handles that)
  useEffect(() => {
    if (socket) {
      const handleNewNotification = () => {
        queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
      };

      socket.on("new_notification", handleNewNotification);
      socket.on("new_emergency_verification", handleNewNotification);
      return () => {
        socket.off("new_notification", handleNewNotification);
        socket.off("new_emergency_verification", handleNewNotification);
      };
    }
  }, [socket, queryClient]);

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      markAsRead.mutate(notification._id);
    }
    
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "emergency_verification":
        return { icon: Droplet, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" };
      case "emergency_completed":
        return { icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
      case "donation_completed":
        return { icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" };
      default:
        return { icon: Info, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" };
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            System <span className="text-red-500">Notifications</span>
            <Bell size={28} className="text-red-500" />
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Keep track of platform events and user requests</p>
        </div>
        
        {notifications.length > 0 && (
          <button 
            onClick={() => markAllAsRead.mutate()}
            className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors"
          >
            Mark all as read
          </button>
        )}
      </header>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-24 bg-slate-900/40 border border-slate-800/60 rounded-3xl animate-pulse" />
            ))
          ) : notifications.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 text-slate-600 bg-slate-900/20 border border-slate-800/40 border-dashed rounded-[3rem]"
            >
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6">
                <Bell size={32} className="opacity-20" />
              </div>
              <p className="text-sm font-black uppercase tracking-widest">No notifications yet</p>
            </motion.div>
          ) : (
            notifications.map((notification) => {
              const styles = getTypeStyles(notification.type);
              return (
                <motion.div
                  key={notification._id}
                  variants={itemVariants}
                  layout
                  onClick={() => handleNotificationClick(notification)}
                  className={`group relative flex items-start gap-5 p-6 bg-slate-900/40 hover:bg-slate-800/60 border ${notification.isRead ? 'border-slate-800/40 opacity-70' : 'border-red-500/20 shadow-lg shadow-red-500/5'} rounded-[2rem] backdrop-blur-xl transition-all cursor-pointer overflow-hidden`}
                >
                  {!notification.isRead && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
                  )}

                  <div className={`shrink-0 w-12 h-12 rounded-2xl ${styles.bg} border ${styles.border} flex items-center justify-center ${styles.color} group-hover:scale-110 transition-transform`}>
                    <styles.icon size={22} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <h3 className={`font-bold tracking-tight truncate ${notification.isRead ? 'text-slate-400' : 'text-white text-lg'}`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2 shrink-0 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                        <Clock size={12} />
                        {formatDistanceToNow(new Date(notification.createdAt))}
                      </div>
                    </div>
                    <p className={`text-sm leading-relaxed mb-3 ${notification.isRead ? 'text-slate-500' : 'text-slate-300 font-medium'}`}>
                      {notification.message}
                    </p>
                    
                    {notification.link && !notification.isRead && (
                      <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] group-hover:gap-3 transition-all">
                        Take Action <ChevronRight size={14} />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Notifications;
