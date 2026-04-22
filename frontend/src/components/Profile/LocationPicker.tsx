import React, { useState } from 'react';
import { MapPin, Navigation, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  onLocationSelect: (lat: number, lng: number) => void;
  onAddressFound?: (address: any) => void;
  initialLocation?: { type: string; coordinates: number[] } | null;
}

const LocationPicker: React.FC<Props> = ({ onLocationSelect, onAddressFound, initialLocation }) => {
  const [loading, setLoading] = useState(false);
  const [hasLocation, setHasLocation] = useState(!!initialLocation?.coordinates?.[0]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("📍 Real-time Location Detected:", { latitude, longitude });
        
        try {
          // Free Reverse Geocoding using Nominatim
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await response.json();
          const address = data.display_name;
          console.log("🏠 Detected Address:", address);
          
          if (onAddressFound) {
            onAddressFound(data); // Pass full data object
          }
        } catch (error) {
          console.error("Failed to fetch place name:", error);
        }

        onLocationSelect(latitude, longitude);
        setHasLocation(true);
        setLoading(false);
        toast.success("Location detected successfully!");
      },
      (error) => {
        setLoading(false);
        let message = "Failed to get location";
        if (error.code === 1) message = "Please allow location access in your browser settings";
        toast.error(message);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg text-red-600">
            <MapPin size={20} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Real-time Location</h4>
            <p className="text-xs text-slate-500 font-medium">Used for nearby emergency alerts</p>
          </div>
        </div>
        {hasLocation && (
          <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
            <CheckCircle2 size={12} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Set</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <button
          type="button"
          onClick={handleGetLocation}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white border-2 border-slate-200 hover:border-red-500 hover:text-red-600 text-slate-600 rounded-xl font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Navigation size={18} />
          )}
          {loading ? "Detecting..." : hasLocation ? "Update Current Location" : "Detect My Location"}
        </button>

        {!hasLocation && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100 text-amber-700">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <p className="text-[11px] font-medium leading-relaxed">
              Enabling location helps hospitals and seekers find you faster during emergencies within a 10km radius.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPicker;
