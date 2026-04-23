import { useForm } from "@/hooks/forms/useForm";
import { updateProfileSchema, type UpdateProfileFormData } from "@/validations/auth.schema";
import { toast } from "sonner";
import { useUpdateProfile } from "@/hooks/users/useUpdateProfile";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  User,
  Phone,
  Calendar,
  Droplets,
  MapPin,
  Home,
  Hash,
  MessageCircle,
  Save,
  Loader2,
  Camera,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LocationPicker from "./LocationPicker";
import ImageCropper from "./ImageCropper";
import { SectionHeader, Field, StyledInput } from "@/components/ui/ProfileFormElements";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const EditProfilePage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();
  const updateProfileMutation = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user.photoUrl || null
  );
  const [base64Avatar, setBase64Avatar] = useState<string | null>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    user.location?.coordinates?.[0] ? { lat: user.location.coordinates[1], lng: user.location.coordinates[0] } : null
  );

  const { values, errors, handleChange, handleBlur, handleSubmit, setMultipleValues } =
    useForm<UpdateProfileFormData>({
      schema: updateProfileSchema,
      initialValues: {
        name: user.name || "",
        phoneNumber: user.phoneNumber || "",
        dateOfBirth: user.dateOfBirth
          ? new Date(user.dateOfBirth).toISOString().split("T")[0]
          : "",
        bloodGroup: user.bloodGroup || "",
        place: user.place || "",
        district: user.district || "",
        state: user.state || "",
        address: user.address || "",
        pincode: user.pincode || "",
        whatsappNumber: user.whatsappNumber || "",
        lastDonatedDate: user.lastDonatedDate
          ? new Date(user.lastDonatedDate).toISOString().split("T")[0]
          : "",
      },
      onSubmit: async (data) => {
        try {
          const updateData: any = { ...data };
          if (base64Avatar) {
            updateData.profileImage = base64Avatar;
          }
          if (location) {
            updateData.location = {
              type: "Point",
              coordinates: [location.lng, location.lat]
            };
          }
          
          await updateProfileMutation.mutateAsync(updateData);
          navigate("/profile");
        } catch (err) {
          // Error handled in mutation hook
        }
      },
    });

  const handleLocationSelect = (lat: number, lng: number) => {
    setLocation({ lat, lng });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImageToCrop(result);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = (croppedBase64: string) => {
    setAvatarPreview(croppedBase64);
    setBase64Avatar(croppedBase64);
    setImageToCrop(null);
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    setBase64Avatar(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div
      className="min-h-screen py-10 px-4 sm:px-6 lg:px-10"
      style={{
        background: "linear-gradient(135deg, #fdf6f0 0%, #fceee6 50%, #f9e4d8 100%)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Back button */}
      <div className="max-w-6xl mx-auto mb-8">
        <button
          onClick={() => navigate("/profile")}
          className="inline-flex items-center gap-2 text-[#7c3a2a] hover:text-[#5a1e10] transition-colors group font-semibold text-sm tracking-wide"
        >
          <span className="w-9 h-9 rounded-full border border-[#c8856a]/40 bg-white/70 backdrop-blur flex items-center justify-center group-hover:-translate-x-1 transition-transform shadow-sm">
            <ArrowLeft size={15} />
          </span>
          Back to Profile
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Outer card */}
        <div
          className="rounded-[2rem] overflow-hidden shadow-2xl bg-white"
          style={{ boxShadow: "0 32px 80px rgba(120,40,20,0.18)" }}
        >
          {/* ── Hero Header ── */}
          <div
            className="relative px-10 pt-12 pb-10 overflow-hidden"
            style={{
              background: "linear-gradient(120deg, #6b1a0f 0%, #9b2c18 45%, #c0392b 100%)",
            }}
          >
            {/* Decorative circles */}
            <div
              className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }}
            />
            <div
              className="absolute bottom-0 left-1/3 w-40 h-40 rounded-full opacity-5"
              style={{ background: "#fff" }}
            />

            <div className="relative flex flex-col lg:flex-row items-start lg:items-end gap-8">
              {/* Avatar upload section */}
              <div className="flex-shrink-0">
                <p
                  className="text-[10px] uppercase tracking-[0.25em] text-red-200 mb-3"
                >
                  Profile Photo
                </p>
                <div className="relative w-32 h-32">
                  <div
                    className="w-32 h-32 rounded-[1.25rem] overflow-hidden border-2 border-white/20 shadow-xl"
                    style={{ background: "#7c1a0f" }}
                  >
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-red-300">
                        <User size={36} />
                        <span className="text-[9px] uppercase tracking-widest">No Photo</span>
                      </div>
                    )}
                  </div>

                  {/* Upload button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-white shadow-lg flex items-center justify-center hover:bg-red-50 transition-colors border border-red-100"
                  >
                    <Camera size={16} className="text-[#9b2c18]" />
                  </button>

                  {/* Remove button */}
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={removeAvatar}
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 shadow-lg flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X size={12} className="text-white" />
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
                <p
                  className="text-[9px] text-red-300/70 mt-3 max-w-[8rem] leading-relaxed"
                >
                  JPG, PNG or WEBP · Max 5 MB
                </p>
              </div>

              {/* Title */}
              <div className="pb-1">
                <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                  Edit Your
                  <br />
                  <span style={{ color: "#fca58a" }}>Profile</span>
                </h1>
                <p
                  className="text-red-200/80 mt-2 text-sm"
                >
                  Keep your details updated to help connect donors with people in need.
                </p>
              </div>
            </div>
          </div>

          {/* ── Form Body ── */}
          <form
            onSubmit={handleSubmit}
            className="px-8 sm:px-12 py-10"
          >
            {/* Section: Personal Info */}
            <SectionHeader label="Personal Information" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <Field
                label="Full Name"
                icon={<User size={13} />}
                error={errors.name}
              >
                <StyledInput
                  name="name"
                  value={values.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  placeholder="Your full name"
                  hasError={!!errors.name}
                />
              </Field>

              <Field
                label="Phone Number"
                icon={<Phone size={13} />}
                error={errors.phoneNumber}
              >
                <StyledInput
                  name="phoneNumber"
                  value={values.phoneNumber || ""}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  onBlur={() => handleBlur("phoneNumber")}
                  placeholder="10-digit number"
                  hasError={!!errors.phoneNumber}
                />
              </Field>

              <Field
                label="WhatsApp Number"
                icon={<MessageCircle size={13} />}
                error={errors.whatsappNumber}
                optional
              >
                <StyledInput
                  name="whatsappNumber"
                  value={values.whatsappNumber || ""}
                  onChange={(e) => handleChange("whatsappNumber", e.target.value)}
                  onBlur={() => handleBlur("whatsappNumber")}
                  placeholder="Optional"
                  hasError={!!errors.whatsappNumber}
                />
              </Field>

              <Field
                label="Date of Birth"
                icon={<Calendar size={13} />}
                error={errors.dateOfBirth}
              >
                <StyledInput
                  name="dateOfBirth"
                  type="date"
                  value={values.dateOfBirth || ""}
                  onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                  onBlur={() => handleBlur("dateOfBirth")}
                  hasError={!!errors.dateOfBirth}
                  disabled
                  title="Date of Birth cannot be changed"
                  className="opacity-60 cursor-not-allowed grayscale-[0.5]"
                />
              </Field>

              <Field
                label="Blood Group"
                icon={<Droplets size={13} />}
                error={errors.bloodGroup}
              >
                <select
                  name="bloodGroup"
                  value={values.bloodGroup || ""}
                  onChange={(e) => handleChange("bloodGroup", e.target.value)}
                  onBlur={() => handleBlur("bloodGroup")}
                  disabled
                  title="Blood Group cannot be changed"
                  className="w-full h-12 rounded-xl px-4 text-sm border transition-all outline-none appearance-none opacity-60 cursor-not-allowed grayscale-[0.5]"
                  style={{
                    borderColor: errors.bloodGroup ? "#ef4444" : "#e5ddd8",
                    background: "#fdf8f6",
                    color: values.bloodGroup ? "#1a0a06" : "#9e7a6e",
                    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.04)",
                  }}
                >
                  <option value="">Select blood group</option>
                  {BLOOD_GROUPS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="Last Donation Date"
                icon={<Calendar size={13} />}
                optional
              >
                <StyledInput
                  name="lastDonatedDate"
                  type="date"
                  value={values.lastDonatedDate || ""}
                  onChange={(e) => handleChange("lastDonatedDate", e.target.value)}
                  onBlur={() => handleBlur("lastDonatedDate")}
                  hasError={false}
                />
              </Field>
            </div>

            {/* Divider */}
            <div className="my-10 flex items-center gap-4">
              <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, #f0e8e4, #d4a898)" }} />
              <span
                className="text-[10px] uppercase tracking-[0.2em] px-3 font-bold text-[#b07060]"
              >
                Location
              </span>
              <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, #f0e8e4, #d4a898)" }} />
            </div>

            {/* Section: Location */}
            <SectionHeader label="Location Details" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              <Field label="District" icon={<MapPin size={13} />} error={errors.district}>
                <StyledInput
                  name="district"
                  value={values.district || ""}
                  onChange={(e) => handleChange("district", e.target.value)}
                  onBlur={() => handleBlur("district")}
                  placeholder="e.g. Malappuram"
                  hasError={!!errors.district}
                />
              </Field>

              <Field label="State" icon={<MapPin size={13} />} error={errors.state}>
                <StyledInput
                  name="state"
                  value={values.state || ""}
                  onChange={(e) => handleChange("state", e.target.value)}
                  onBlur={() => handleBlur("state")}
                  placeholder="e.g. Kerala"
                  hasError={!!errors.state}
                />
              </Field>

              <Field label="Place / City" icon={<MapPin size={13} />} error={errors.place}>
                <StyledInput
                  name="place"
                  value={values.place || ""}
                  onChange={(e) => handleChange("place", e.target.value)}
                  onBlur={() => handleBlur("place")}
                  placeholder="Your locality"
                  hasError={!!errors.place}
                />
              </Field>

              <Field label="Pincode" icon={<Hash size={13} />} error={errors.pincode}>
                <StyledInput
                  name="pincode"
                  value={values.pincode || ""}
                  onChange={(e) => handleChange("pincode", e.target.value)}
                  onBlur={() => handleBlur("pincode")}
                  placeholder="6-PIN"
                  maxLength={6}
                  hasError={!!errors.pincode}
                />
              </Field>

              <Field
                label="Home Address"
                icon={<Home size={13} />}
                error={errors.address}
                className="lg:col-span-4"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                    <LocationPicker 
                      onLocationSelect={handleLocationSelect} 
                      onAddressFound={(data) => {
                        const addr = data.address;
                        console.log("🗺️ Full Address Data:", data);
                        
                        // Single atomic update — no race conditions
                        setMultipleValues({
                          district: addr.state_district || "",
                          place: addr.county || "",
                          pincode: addr.postcode || "",
                          state: addr.state || "",
                          address: data.display_name || "",
                        } as any);
                        
                        toast.success(`Location Identified: ${addr.county || addr.state_district}`);
                      }}
                      initialLocation={user.location} 
                    />
                </div>
                <StyledInput
                  name="address"
                  value={values.address || ""}
                  onChange={(e) => handleChange("address", e.target.value)}
                  onBlur={() => handleBlur("address")}
                  placeholder="House name, street, nearby landmark..."
                  hasError={!!errors.address}
                />
              </Field>
            </div>

            {/* ── Actions ── */}
            <div
              className="mt-12 pt-8 flex flex-col sm:flex-row items-center gap-4"
              style={{ borderTop: "1px solid #f0e8e4" }}
            >
              <Button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="w-full sm:w-auto min-w-[220px] h-14 text-base font-bold rounded-2xl text-white transition-all active:scale-95 disabled:opacity-60 bg-gradient-to-br from-[#9b2c18] to-[#c0392b] shadow-lg shadow-red-900/30 border-none"
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving Changes…
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Save Changes
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/profile")}
                disabled={updateProfileMutation.isPending}
                className="w-full sm:w-auto min-w-[160px] h-14 text-base font-bold rounded-2xl border-2 border-[#e8d4cc] text-[#7c3a2a] bg-transparent hover:bg-red-50"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>

      {imageToCrop && (
        <ImageCropper
          image={imageToCrop}
          onCrop={onCropComplete}
          onCancel={() => setImageToCrop(null)}
        />
      )}
    </div>
  );
};

export default EditProfilePage;
