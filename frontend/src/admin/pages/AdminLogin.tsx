import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/validations/auth.schema";
import { setAdmin } from "@/store/adminSlice";
import adminAxios from "@/admin/api/adminAxios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Droplets, 
  Mail, 
  Lock, 
  Loader2, 
  AlertCircle,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (formData: LoginFormData) => {
    setLoading(true);
    try {
      const { data } = await adminAxios.post("/auth/login", formData);
      dispatch(setAdmin(data.admin));
      toast.success("Authentication successful. Welcome, Administrator.");
      navigate("/admin/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid credentials or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 selection:bg-red-500/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[440px] z-10"
      >
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/60 p-10 rounded-[2.5rem] shadow-2xl shadow-black/50">
          <div className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-red-600 to-red-400 rounded-2xl shadow-lg shadow-red-900/20 mb-6"
            >
              <Droplets className="text-white fill-white/10" size={32} />
            </motion.div>
            <h1 className="text-4xl font-black text-white tracking-tighter mb-2 italic">BloodBond</h1>
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-6 bg-slate-800" />
              <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">Administrator</span>
              <div className="h-px w-6 bg-slate-800" />
            </div>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 px-1 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                 <Mail size={12} className="opacity-70" /> Email Address
              </label>
              <div className="relative group">
                <input
                  {...register("email")}
                  type="email"
                  placeholder="admin@bloodbond.io"
                  className={`w-full px-5 py-4 bg-slate-950/50 border ${errors.email ? 'border-red-500/50 focus:ring-red-500/10' : 'border-slate-800 focus:border-red-500/50 focus:ring-red-600/10'} rounded-2xl text-white focus:outline-none focus:ring-4 transition-all font-medium placeholder:text-slate-700`}
                />
                <AnimatePresence>
                  {errors.email && (
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-1.5 mt-2 text-xs font-bold text-red-500 px-1"
                    >
                      <AlertCircle size={14} /> {errors.email.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 px-1 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                 <Lock size={12} className="opacity-70" /> Secrets Key
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  className={`w-full px-5 py-4 bg-slate-950/50 border ${errors.password ? 'border-red-500/50 focus:ring-red-500/10' : 'border-slate-800 focus:border-red-500/50 focus:ring-red-600/10'} rounded-2xl text-white focus:outline-none focus:ring-4 transition-all font-medium placeholder:text-slate-700`}
                />
                <AnimatePresence>
                  {errors.password && (
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-1.5 mt-2 text-xs font-bold text-red-500 px-1"
                    >
                      <AlertCircle size={14} /> {errors.password.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden py-4 bg-red-600 hover:bg-red-500 text-white font-black text-sm rounded-2xl transition-all shadow-xl shadow-red-900/20 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span>AUTHORIZE ACCESS</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
            </div>
          </form>

          <div className="mt-10 flex flex-col items-center gap-4">
             <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 tracking-widest">
                <ShieldCheck size={12} />
                SECURED END-TO-END ENCRYPTION
             </div>
             <p className="text-[10px] text-slate-500 font-medium opacity-40">SYSTEM VERSION 2.0.4-STABLE</p>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-6">
           <Link to="/" className="text-xs font-bold text-slate-500 hover:text-red-500 transition-colors">Client Portal</Link>
           <span className="text-slate-800">|</span>
           <Link to="#" className="text-xs font-bold text-slate-500 hover:text-red-500 transition-colors">Documentation</Link>
           <span className="text-slate-800">|</span>
           <Link to="#" className="text-xs font-bold text-slate-500 hover:text-red-500 transition-colors">Security</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;

