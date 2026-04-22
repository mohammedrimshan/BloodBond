import React, { useState, useRef } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Check } from 'lucide-react';
import { Button } from '../ui/button';

interface ImageCropperProps {
  image: string;
  onCrop: (croppedImage: string) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ image, onCrop, onCancel }) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const imageRef = useRef<HTMLImageElement>(null);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getCroppedImage = () => {
    const canvas = document.createElement('canvas');
    const img = imageRef.current;
    if (!img) return;

    const cropSize = 400; // Output resolution
    canvas.width = cropSize;
    canvas.height = cropSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(cropSize / 2, cropSize / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // The 'position' from UI needs to be adjusted for the canvas
    // UI crop box is 250px, container is 400px.
    // Center of container is (0,0) in our translate logic.
    ctx.drawImage(
      img,
      position.x - (img.naturalWidth / 2),
      position.y - (img.naturalHeight / 2)
    );
    
    ctx.restore();

    onCrop(canvas.toDataURL('image/jpeg', 0.9));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800 tracking-tight">Crop Profile Photo</h3>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div 
          className="relative h-[400px] bg-gray-950 overflow-hidden cursor-move touch-none flex items-center justify-center"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
           <img
            ref={imageRef}
            src={image}
            alt="To crop"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${zoom})`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              maxWidth: 'none',
              userSelect: 'none'
            }}
            draggable={false}
          />
          
          {/* Crop Overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-[250px] h-[250px] border-2 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-3 divide-x divide-white/20">
                    <div/><div/><div/>
                </div>
                <div className="absolute inset-0 grid grid-rows-3 divide-y divide-white/20">
                    <div/><div/><div/>
                </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 bg-white">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-gray-400">
              <span>Zoom</span>
              <span>{(zoom * 100).toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-4">
              <ZoomOut size={18} className="text-gray-300" />
              <input 
                type="range" 
                min="0.1" 
                max="3" 
                step="0.01" 
                value={zoom} 
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
              <ZoomIn size={18} className="text-gray-300" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
             <button
              type="button"
              onClick={() => setRotation(r => (r + 90) % 360)}
              className="flex-1 h-12 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center font-semibold text-sm transition-colors"
            >
              <RotateCw size={16} className="mr-2" />
              Rotate
            </button>
            
            <button
              type="button"
              onClick={getCroppedImage}
              className="flex-[2] h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200 flex items-center justify-center font-bold text-sm transition-all active:scale-95"
            >
              <Check size={18} className="mr-2" />
              Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
