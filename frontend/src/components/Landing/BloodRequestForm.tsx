import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Droplet, Send, Hospital, User, AlertCircle } from "lucide-react";
import { privateAxiosInstance } from "@/api/privateAxios.Instance";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { emergencySchema, type EmergencyFormData } from "@/validations/emergency.schema";

interface BloodRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const BloodRequestForm: React.FC<BloodRequestFormProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<EmergencyFormData>({
    patientName: "",
    hospitalName: "",
    bloodGroup: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
    // Add delay for suggestions hide to allow click
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsSubmitting(true);
    try {
      await privateAxiosInstance.post("/users/emergency/request", formData);
      toast.success(t("bloodRequest.success"));
      
      // Reset form state
      setFormData({
        patientName: "",
        hospitalName: "",
        bloodGroup: "",
      });
      setErrors({});
      setTouched({});
      
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-background rounded-t-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto border border-border"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-50 dark:bg-red-950/30 rounded-xl sm:rounded-2xl flex items-center justify-center border border-red-100 dark:border-red-900/30">
                  <Droplet className="text-red-600 w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl font-black text-foreground tracking-tight">{t("bloodRequest.title")}</h2>
                  <p className="text-muted-foreground text-[9px] sm:text-xs font-bold uppercase tracking-widest">{t("bloodRequest.subtitle")}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4 mb-2 block">{t("bloodRequest.patientName")}</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                      required
                      type="text"
                      name="patientName"
                      placeholder={t("bloodRequest.patientNamePlaceholder")}
                      value={formData.patientName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full h-12 sm:h-14 pl-11 sm:pl-12 pr-4 bg-muted border-none rounded-xl sm:rounded-2xl text-sm sm:text-base text-foreground font-bold placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-red-500/20 transition-all ${errors.patientName && touched.patientName ? 'ring-2 ring-red-500/20' : ''}`}
                    />
                  </div>
                  {errors.patientName && touched.patientName && (
                    <p className="text-[10px] text-red-500 mt-1.5 ml-4 font-bold">{errors.patientName}</p>
                  )}
                </div>

                <div className="relative">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4 mb-2 block">{t("bloodRequest.hospital")}</label>
                  <div className="relative">
                    <Hospital className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                      required
                      type="text"
                      name="hospitalName"
                      placeholder={t("bloodRequest.hospitalPlaceholder")}
                      value={formData.hospitalName}
                      onChange={(e) => {
                        handleInputChange(e);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={handleBlur}
                      className={`w-full h-12 sm:h-14 pl-11 sm:pl-12 pr-4 bg-muted border-none rounded-xl sm:rounded-2xl text-sm sm:text-base text-foreground font-bold placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-red-500/20 transition-all ${errors.hospitalName && touched.hospitalName ? 'ring-2 ring-red-500/20' : ''}`}
                    />
                  </div>
                  {errors.hospitalName && touched.hospitalName && (
                    <p className="text-[10px] text-red-500 mt-1.5 ml-4 font-bold">{errors.hospitalName}</p>
                  )}

                  <AnimatePresence>
                    {showSuggestions && formData.hospitalName.trim().length >= 3 && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute z-[110] w-full mt-2 bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
                      >
                        {isSearchingHospitals ? (
                          <div className="p-4 text-xs font-bold text-muted-foreground text-center animate-pulse">{t("bloodRequest.searchingMaps")}</div>
                        ) : hospitalSuggestions.length > 0 ? (
                          <ul className="max-h-48 overflow-y-auto">
                            {hospitalSuggestions.map((hospital, idx) => {
                              const parts = hospital.display_name.split(',');
                              const mainName = parts[0].trim();
                              const address = parts.slice(1).join(',').trim();
                              
                              return (
                                <li 
                                  key={idx}
                                  onMouseDown={(e) => {
                                    e.preventDefault(); 
                                    const newName = hospital.display_name;
                                    setFormData(prev => ({ ...prev, hospitalName: newName }));
                                    setShowSuggestions(false);
                                    validateField("hospitalName", newName);
                                  }}
                                  className="px-4 py-3 hover:bg-muted cursor-pointer border-b border-border last:border-0 transition-colors"
                                >
                                  <p className="text-sm font-bold text-foreground truncate">{mainName}</p>
                                  <p className="text-[10px] text-muted-foreground truncate mt-0.5">{address}</p>
                                </li>
                              )
                            })}
                          </ul>
                        ) : (
                          <div className="p-4 text-xs font-bold text-muted-foreground text-center">
                            {t("bloodRequest.noMatch")}. Proceed with "{formData.hospitalName}".
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4 mb-2 sm:mb-3 block">{t("bloodRequest.bloodGroup")}</label>
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                    {BLOOD_GROUPS.map((group) => (
                      <button
                        key={group}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, bloodGroup: group });
                          validateField("bloodGroup", group);
                        }}
                        className={`py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-black border transition-all ${
                          formData.bloodGroup === group
                            ? "bg-red-600 text-white border-red-700 shadow-lg shadow-red-600/20"
                            : "bg-muted text-muted-foreground border-border hover:border-red-200"
                        } ${errors.bloodGroup && touched.bloodGroup ? 'border-red-500' : ''}`}
                      >
                        {group}
                      </button>
                    ))}
                  </div>
                  {errors.bloodGroup && touched.bloodGroup && (
                    <p className="text-[10px] text-red-500 mt-1.5 ml-4 font-bold">{errors.bloodGroup}</p>
                  )}
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-amber-100 dark:border-amber-900/20 flex gap-2.5 sm:gap-3">
                <AlertCircle className="text-amber-500 shrink-0" size={18} />
                <p className="text-[10px] sm:text-[11px] text-amber-700 dark:text-amber-400 font-medium leading-relaxed">
                  {t("bloodRequest.warning")}
                </p>
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full h-16 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-red-900/20 transition-all active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={20} />
                    {t("bloodRequest.submit")}
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BloodRequestForm;
