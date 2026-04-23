import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can add to home screen
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsVisible(false);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    // Show the prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      console.log("User accepted the PWA install prompt");
    } else {
      console.log("User dismissed the PWA install prompt");
    }
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-md"
      >
        <div className="bg-background/95 backdrop-blur-md border border-border rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
              <Download className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-sm font-black text-foreground">Install BloodBond</h3>
              <p className="text-[11px] text-muted-foreground font-medium">Add to your home screen for easy access</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleInstall} className="bg-primary hover:bg-burgundy-light text-white text-[11px] font-bold h-9 px-4 rounded-lg">
              Install
            </Button>
            <button 
              onClick={() => setIsVisible(false)}
              className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;
