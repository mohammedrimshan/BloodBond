import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { emergencySchema, type EmergencyFormData } from "@/validations/emergency.schema";
import { useCreateEmergency } from "../hooks/useEmergency";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

interface EmergencyModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

const EmergencyModal = ({ isModalOpen, setIsModalOpen }: EmergencyModalProps) => {
  const createMutation = useCreateEmergency();
  
  const [formData, setFormData] = useState<EmergencyFormData>({ patientName: "", hospitalName: "", bloodGroup: "A+" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Hospital Autocomplete State
  const [hospitalSuggestions, setHospitalSuggestions] = useState<any[]>([]);
  const [isSearchingHospitals, setIsSearchingHospitals] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounced API call for Hospital Autocomplete
  useEffect(() => {
    if (!formData.hospitalName || formData.hospitalName.trim().length < 3 || !showSuggestions) {
      setHospitalSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearchingHospitals(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            formData.hospitalName + " hospital in Kerala"
          )}&limit=5`
        );
        const data = await response.json();
        setHospitalSuggestions(data);
      } catch (error) {
        console.error("Failed to fetch hospital suggestions", error);
      } finally {
        setIsSearchingHospitals(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.hospitalName, showSuggestions]);

  const validateField = (name: string, value: string) => {
    const fieldData = { ...formData, [name]: value };
    const result = emergencySchema.pick({ [name]: true } as any).safeParse(fieldData);
    
    if (result.success) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    } else {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors((prev) => ({
        ...prev,
        [name]: fieldErrors[name as keyof typeof fieldErrors]?.[0] || "Invalid field",
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    
    setTouched({
      patientName: true,
      hospitalName: true,
      bloodGroup: true,
    });

    const result = emergencySchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const newErrors: Record<string, string> = {};
      Object.keys(fieldErrors).forEach((key) => {
        if (fieldErrors[key as keyof typeof fieldErrors]?.length) {
          newErrors[key] = fieldErrors[key as keyof typeof fieldErrors]![0];
        }
      });
      setErrors(newErrors);
      return;
    }

    createMutation.mutate(formData, {
      onSuccess: () => {
        setIsModalOpen(false);
        setFormData({ patientName: "", hospitalName: "", bloodGroup: "A+" });
        setErrors({});
        setTouched({});
      }
    });
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">Broadcast Emergency</h2>
        <form onSubmit={handleCreate} className="space-y-5">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 block">Patient Name</label>
            <input 
              type="text" 
              name="patientName"
              value={formData.patientName} 
              onChange={handleInputChange} 
              onBlur={handleBlur}
              className={`w-full bg-slate-950 border ${errors.patientName && touched.patientName ? 'border-red-500' : 'border-slate-800'} rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50`} 
            />
            {errors.patientName && touched.patientName ? (
              <p className="text-[10px] text-red-500 mt-1.5 font-bold">{errors.patientName}</p>
            ) : (
              <p className="text-[10px] text-slate-600 mt-1.5">* This will remain hidden from donors.</p>
            )}
          </div>
          <div className="relative">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 block">Hospital Name</label>
            <input 
              type="text" 
              name="hospitalName"
              value={formData.hospitalName} 
              onChange={(e) => {
                handleInputChange(e);
                setShowSuggestions(true);
              }} 
              onFocus={() => setShowSuggestions(true)}
              onBlur={(e) => {
                handleBlur(e);
                setShowSuggestions(false);
              }}
              autoComplete="off"
              className={`w-full bg-slate-950 border ${errors.hospitalName && touched.hospitalName ? 'border-red-500' : 'border-slate-800'} rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50`} 
            />
            
            <AnimatePresence>
              {showSuggestions && formData.hospitalName.trim().length >= 3 && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden"
                >
                  {isSearchingHospitals ? (
                    <div className="p-4 text-xs font-bold text-slate-400 text-center animate-pulse">Searching maps...</div>
                  ) : hospitalSuggestions.length > 0 ? (
                    <ul className="max-h-48 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {hospitalSuggestions.map((hospital, idx) => {
                        const parts = hospital.display_name.split(',');
                        const mainName = parts[0].trim();
                        const address = parts.slice(1).join(',').trim();
                        
                        return (
                          <li 
                            key={idx}
                            onMouseDown={(e) => {
                              e.preventDefault(); 
                              setFormData(prev => ({ ...prev, hospitalName: hospital.display_name }));
                              setShowSuggestions(false);
                              validateField("hospitalName", hospital.display_name);
                            }}
                            className="px-4 py-3 hover:bg-slate-700 cursor-pointer border-b border-slate-700/50 last:border-0 transition-colors"
                          >
                            <p className="text-sm font-bold text-white truncate">{mainName}</p>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">{address}</p>
                          </li>
                        )
                      })}
                    </ul>
                  ) : (
                    <div className="p-4 text-xs font-bold text-slate-400 text-center">
                      No match found. Proceed with "{formData.hospitalName}".
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {errors.hospitalName && touched.hospitalName && (
              <p className="text-[10px] text-red-500 mt-1.5 font-bold">{errors.hospitalName}</p>
            )}
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 block">Blood Group</label>
            <select 
              name="bloodGroup"
              value={formData.bloodGroup} 
              onChange={handleInputChange} 
              onBlur={handleBlur}
              className={`w-full bg-slate-950 border ${errors.bloodGroup && touched.bloodGroup ? 'border-red-500' : 'border-slate-800'} rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50`}
            >
              {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
            {errors.bloodGroup && touched.bloodGroup && (
              <p className="text-[10px] text-red-500 mt-1.5 font-bold">{errors.bloodGroup}</p>
            )}
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all">Cancel</button>
            <button type="submit" disabled={createMutation.isPending} className="flex-1 py-3.5 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-red-900/40 active:scale-[0.98] disabled:opacity-50">
              {createMutation.isPending ? "Sending..." : "Broadcast"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EmergencyModal;
