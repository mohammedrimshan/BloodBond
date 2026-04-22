import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import { CLOUDINARY_ASSETS } from "@/constants/cloudinary";

const TOTAL_FRAMES: number = 240;

// Generate URLs dynamically from the centralized asset path
const frameUrls: string[] = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
  const frameNumber = String(i + 1).padStart(3, '0');
  return `${CLOUDINARY_ASSETS.BLOOD_DROPS_ANIMATION}/ezgif-frame-${frameNumber}.jpg`;
});

const InteractiveDroplet = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  
  // Animation state refs
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const imgArray: HTMLImageElement[] = [];

    if (TOTAL_FRAMES === 0) {
      setImagesLoaded(true);
      return;
    }

    frameUrls.forEach((url, index) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          setImagesLoaded(true);
        }
      };
      imgArray[index] = img;
    });

    imagesRef.current = imgArray;
  }, []);

  // Rendering Loop
  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current || TOTAL_FRAMES === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      // Easing logic: currentFrame smoothly approaches targetFrame
      // Using a small easing factor (0.04) for an Apple-like fluid feel
      const diff = targetFrameRef.current - currentFrameRef.current;
      
      if (Math.abs(diff) > 0.1) {
        currentFrameRef.current += diff * 0.04;
      } else {
        currentFrameRef.current = targetFrameRef.current;
      }

      let frameIndex = Math.round(currentFrameRef.current);
      frameIndex = Math.max(0, Math.min(frameIndex, TOTAL_FRAMES - 1));
      
      const img = imagesRef.current[frameIndex];
      
      if (img && img.complete && img.naturalWidth > 0) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Fill canvas while maintaining aspect ratio (object-fit: cover equivalent)
        const scale = Math.max(
          canvas.width / img.width,
          canvas.height / img.height
        );
        
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;
        
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      }
      
      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [imagesLoaded]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        // Use parent's dimensions
        const parent = canvasRef.current.parentElement;
        if (parent) {
          canvasRef.current.width = parent.clientWidth;
          canvasRef.current.height = parent.clientHeight;
        }
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [imagesLoaded]);

  const [isHovered, setIsHovered] = useState(false);

  // Hover Handlers
  const handleMouseEnter = () => {
    targetFrameRef.current = TOTAL_FRAMES - 1; // Scrub to end
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    targetFrameRef.current = 0; // Scrub back to start
    setIsHovered(false);
  };

  return (
    <motion.div 
      className="relative w-full aspect-square max-w-[500px] overflow-hidden rounded-3xl bg-[#FFFFFF] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      whileHover={{ y: -5, boxShadow: "0 30px 60px rgba(239,68,68,0.15)", scale: 1.02 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        style={{ opacity: imagesLoaded ? 1 : 0 }}
      />
      
      {/* Subtle interaction hint when loaded and not hovered */}
      {imagesLoaded && (
        <div 
          className={`absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none transition-all duration-500 ${
            isHovered ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          }`}
        >
          <span className="bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-medium tracking-widest text-slate-400 uppercase shadow-sm">
            Hover to explore
          </span>
        </div>
      )}

      {/* Loading state */}
      {!imagesLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </motion.div>
  );
};

export default InteractiveDroplet;
