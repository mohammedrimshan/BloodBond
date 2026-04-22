import { CLOUDINARY_ASSETS } from "@/constants/cloudinary";

interface AuthSidePanelProps {
  title: string;
  subtitle: string;
}

const AuthSidePanel = ({ title, subtitle }: AuthSidePanelProps) => {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-peach relative overflow-hidden items-center justify-center">
      {/* Decorative corner circles */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-burgundy/20 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-12 left-12 w-8 h-8 bg-burgundy/30 rounded-full" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-burgundy/10 rounded-full translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-burgundy/15 rounded-full translate-x-1/3 translate-y-1/3" />
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 right-20 w-3 h-3 bg-burgundy/40 rounded-full animate-pulse" />
      <div className="absolute top-40 left-20 w-2 h-2 bg-burgundy/30 rounded-full" />
      <div className="absolute bottom-40 right-32 w-2 h-2 bg-burgundy/25 rounded-full" />
      
      {/* Diagonal lines decoration */}
      <div className="absolute top-1/4 right-1/4 w-16 h-0.5 bg-burgundy/20 rotate-45" />
      <div className="absolute bottom-1/3 left-1/3 w-12 h-0.5 bg-burgundy/15 -rotate-45" />
      
      <div className="relative z-10 flex flex-col items-center px-12">
        <img 
          src={CLOUDINARY_ASSETS.BLOOD_DONATION_ILLUSTRATION} 
          alt="Blood donation community illustration" 
          className="max-w-md w-full h-auto drop-shadow-2xl"
        />
        <div className="text-center mt-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {title}
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthSidePanel;
