import { Bell, Check, Clock, Droplet, HeartPulse, Info } from "lucide-react";
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from "../hooks/useNotifications";
import { motion, AnimatePresence } from "framer-motion";

const NotificationPage = () => {
  const { data: notifications, isLoading } = useNotifications();
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead } = useMarkAllAsRead();

  const formatRelativeTime = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    
    return then.toLocaleDateString();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "eligibility":
        return <Droplet className="text-red-500" size={20} />;
      case "donation_completed":
        return <Check className="text-emerald-500" size={20} />;
      case "emergency_completed":
        return <HeartPulse className="text-amber-500" size={20} />;
      default:
        return <Info className="text-blue-500" size={20} />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "eligibility":
        return "bg-red-50";
      case "donation_completed":
        return "bg-emerald-50";
      case "emergency_completed":
        return "bg-amber-50";
      default:
        return "bg-blue-50";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
              <Bell className="text-red-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800">Notifications</h1>
              <p className="text-slate-500 text-sm">Stay updated with your donation journey</p>
            </div>
          </div>
          {notifications && notifications.length > 0 && (
            <button
              onClick={() => markAllAsRead()}
              className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors bg-red-50 px-4 py-2 rounded-full"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {notifications && notifications.length > 0 ? (
              notifications.map((notif) => (
                <motion.div
                  key={notif._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => !notif.isRead && markAsRead(notif._id)}
                  className={`relative group bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex gap-4 cursor-pointer transition-all hover:shadow-md ${
                    !notif.isRead ? "ring-2 ring-red-500/20" : ""
                  }`}
                >
                  <div className={`shrink-0 w-12 h-12 rounded-2xl ${getBgColor(notif.type)} flex items-center justify-center shadow-inner`}>
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-bold truncate ${!notif.isRead ? "text-slate-900" : "text-slate-600"}`}>
                        {notif.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <Clock size={12} />
                        {formatRelativeTime(notif.createdAt)}
                      </div>
                    </div>
                    <p className={`text-sm leading-relaxed ${!notif.isRead ? "text-slate-600 font-medium" : "text-slate-500"}`}>
                      {notif.message}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <div className="absolute top-4 right-4">
                      <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse shadow-sm shadow-red-600/50" />
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Bell className="text-slate-300" size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">No notifications yet</h3>
                <p className="text-slate-500 max-w-xs mx-auto">
                  When you have notifications, they'll appear here.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
