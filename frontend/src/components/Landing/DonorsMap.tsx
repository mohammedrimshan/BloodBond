import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Droplets, MapPin } from 'lucide-react';
import type { IDonorResponse } from '../../types/DonorTypes';

// Fix for default leaflet icons in React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Blood Drop Icon for Donors
const createDonorIcon = (bloodGroup: string, isEligible: boolean = true) => {
  const markerColor = isEligible ? 'bg-red-600' : 'bg-slate-400';
  const borderColor = isEligible ? 'border-white' : 'border-slate-100';
  const shadowColor = isEligible ? 'shadow-lg' : 'shadow-md grayscale';

  return L.divIcon({
    className: 'custom-donor-marker',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="w-10 h-10 ${markerColor} rounded-full flex items-center justify-center border-4 ${borderColor} ${shadowColor} transform transition-transform hover:scale-110">
          <span class="text-white font-black text-[10px] leading-none">${bloodGroup}</span>
          ${!isEligible ? '<div class="absolute -top-1 -right-1 w-3 h-3 bg-slate-500 rounded-full border-2 border-white"></div>' : ''}
        </div>
        <div class="absolute -bottom-1 w-2 h-2 ${markerColor} rotate-45"></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
};

interface Props {
  donors: IDonorResponse[];
  center?: [number, number];
  zoom?: number;
  onViewProfile?: (userId: string) => void;
}

// Component to handle map center updates
const RecenterMap = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const DonorsMap: React.FC<Props> = ({ donors, center = [10.8505, 76.2711], zoom = 7, onViewProfile }) => {
  // Filter donors who have valid location data
  const donorsWithLocation = donors.filter(d => 
    d.location?.coordinates && 
    d.location.coordinates[0] !== 0 && 
    d.location.coordinates[1] !== 0
  );

  return (
    <div className="w-full h-[500px] rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl relative z-10">
      <MapContainer 
        center={center as any} 
        zoom={zoom} 
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <RecenterMap center={center} />

        {donorsWithLocation.map((donor, idx) => {
          const [lng, lat] = donor.location!.coordinates;
          return (
            <Marker 
              key={donor.id || (donor as any)._id || idx} 
              position={[lat, lng] as any} 
              icon={createDonorIcon(donor.bloodGroup, donor.isEligible) as any}
            >
              <Popup {...({ className: "donor-popup" } as any)}>
                <div className="p-2 min-w-[150px]">
                  <div className="flex items-center gap-3 mb-2 pb-2 border-b border-slate-100">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${donor.isEligible ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                      {donor.bloodGroup}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm leading-tight">{donor.name}</h4>
                      <p className={`text-[10px] uppercase tracking-wider font-bold ${donor.isEligible ? 'text-green-500' : 'text-red-500'}`}>
                        {donor.isEligible ? 'Available' : 'Currently Unavailable'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                      <MapPin size={12} className="text-red-400" />
                      <span>{donor.place || 'Location Private'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                      <Droplets size={12} className="text-red-400" />
                      <span>{donor.isEligible ? 'Eligible Hero' : 'Recovery Period'}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => onViewProfile?.(donor.id || (donor as any)._id)}
                    className="w-full mt-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm"
                  >
                    View Profile
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Overlay Info */}
      <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/50 shadow-xl flex items-center gap-3">
         <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
         <p className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">
           {donorsWithLocation.length} Active Donors Visible
         </p>
      </div>
    </div>
  );
};

export default DonorsMap;
