import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Heart, Plus, Send, X, Loader2, Quote } from "lucide-react";
import { privateAxiosInstance } from "@/api/privateAxios.Instance";
import { publicAxiosInstance } from "@/api/publicAxios.Instance";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { toast } from "sonner";
import { useSocket } from "@/contexts/SocketContext";

interface Story {
  _id: string;
  authorName: string;
  authorPhoto?: string;
  content: string;
  createdAt: string;
}

const SuccessStoriesPage = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStoryContent, setNewStoryContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const user = useSelector((state: RootState) => state.user.user);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const { socket } = useSocket();

  const fetchStories = async () => {
    try {
      const response = await publicAxiosInstance.get("/stories");
      if (response.data.success) {
        setStories(response.data.stories);
      }
    } catch (error) {
      console.error("Failed to fetch stories", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  // Socket listener for real-time stories
  useEffect(() => {
    if (socket) {
      const handleNewStory = (story: Story) => {
        setStories((prev) => [story, ...prev]);
        toast.info("New success story shared!", {
          description: `${story.authorName} just shared their experience.`,
        });
      };
      socket.on("new_success_story", handleNewStory);
      return () => {
        socket.off("new_success_story", handleNewStory);
      };
    }
  }, [socket]);

  const handleSubmitStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryContent.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await privateAxiosInstance.post("/stories", {
        content: newStoryContent,
        authorName: user.name,
        authorPhoto: user.photoUrl,
      });
      if (response.data.success) {
        // Story will be added via socket or fetchStories
        setIsModalOpen(false);
        setNewStoryContent("");
        toast.success("Thank you for sharing your story!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to post story");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShareClick = () => {
    if (!isLoggedIn) {
      toast.error("Please login to share your success story");
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              Success <span className="text-red-600">Stories</span>
              <Heart className="text-red-600 fill-red-600" size={28} />
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Real impact, real lives saved by our community.</p>
          </div>
          
          <button
            onClick={handleShareClick}
            className="flex items-center gap-3 px-6 py-4 bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-slate-900/20 active:scale-[0.98]"
          >
            <Plus size={20} />
            Share Your Story
          </button>
        </header>

        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {stories.map((story) => (
                <motion.div
                  key={story._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 relative group hover:shadow-xl transition-all duration-500"
                >
                  <Quote className="absolute top-6 right-8 text-slate-50 opacity-10 group-hover:opacity-20 transition-opacity" size={80} />
                  
                  <div className="flex items-center gap-4 mb-6 relative">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 overflow-hidden shadow-sm">
                      <img 
                        src={story.authorPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${story.authorName}`} 
                        alt={story.authorName} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{story.authorName}</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Verified Lifesaver</p>
                    </div>
                  </div>

                  <p className="text-slate-600 leading-relaxed font-medium italic relative">
                    "{story.content}"
                  </p>

                  <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                      Shared {new Date(story.createdAt).toLocaleDateString()}
                    </span>
                    <Heart className="text-red-100 group-hover:text-red-500 transition-colors" size={18} fill="currentColor" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {stories.length === 0 && !isLoading && (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-100 border-dashed">
            <MessageSquare className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-400 font-bold uppercase tracking-widest">No stories yet. Be the first to share!</p>
          </div>
        )}
      </div>

      {/* Post Story Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
                    <MessageSquare className="text-red-600 w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Share Experience</h2>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Post a success story</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmitStory} className="space-y-6">
                <textarea
                  required
                  rows={5}
                  placeholder="Share how BloodBond helped you or how you felt after donating..."
                  value={newStoryContent}
                  onChange={(e) => setNewStoryContent(e.target.value)}
                  className="w-full p-6 bg-slate-50 border-none rounded-[1.5rem] text-slate-900 font-medium placeholder:text-slate-300 focus:ring-2 focus:ring-red-500/20 transition-all resize-none"
                />

                <button
                  disabled={isSubmitting || !newStoryContent.trim()}
                  type="submit"
                  className="w-full h-16 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-red-900/20 transition-all active:scale-[0.98]"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send size={20} /> Post Story</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SuccessStoriesPage;
