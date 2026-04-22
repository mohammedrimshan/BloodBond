import React from 'react';
import { Droplets, Award, Calendar, User } from 'lucide-react';

interface Props {
  donorName: string;
  bloodGroup: string;
  date: string;
  certificateId: string;
}

const CertificateTemplate = React.forwardRef<HTMLDivElement, Props>(({ donorName, bloodGroup, date, certificateId }, ref) => {
  return (
    <div 
      ref={ref}
      className="w-[800px] h-[600px] bg-white p-12 relative overflow-hidden flex flex-col items-center justify-center text-slate-900 font-serif"
      style={{ border: '20px solid #ef4444' }}
    >
      {/* Decorative Corners */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-8 border-l-8 border-red-600/20" />
      <div className="absolute top-0 right-0 w-32 h-32 border-t-8 border-r-8 border-red-600/20" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-8 border-l-8 border-red-600/20" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-8 border-r-8 border-red-600/20" />

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <Droplets size={400} className="text-red-600" />
      </div>

      {/* Header */}
      <div className="flex flex-col items-center mb-8 relative z-10">
        <div className="p-4 bg-red-600 rounded-full mb-4">
          <Award size={48} className="text-white" />
        </div>
        <h1 className="text-5xl font-black uppercase tracking-tighter text-red-600">Certificate of Appreciation</h1>
        <div className="h-1 w-64 bg-red-600 mt-2" />
      </div>

      {/* Body */}
      <div className="text-center space-y-6 relative z-10">
        <p className="text-xl italic text-slate-600 font-sans">This is to certify that</p>
        
        <h2 className="text-6xl font-bold text-slate-900 tracking-tight underline decoration-red-600/30 underline-offset-8">
          {donorName}
        </h2>

        <p className="max-w-2xl text-lg text-slate-600 font-sans leading-relaxed">
          has successfully donated <span className="font-bold text-red-600">{bloodGroup}</span> blood at 
          <span className="font-bold text-slate-900"> BloodBond</span>, contributing to our mission 
          of saving lives and supporting the community.
        </p>
      </div>

      {/* Footer */}
      <div className="mt-16 w-full flex justify-between items-end relative z-10 px-8">
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Calendar size={16} />
            <span className="text-sm font-sans uppercase tracking-widest font-bold">Date of Donation</span>
          </div>
          <p className="text-xl font-bold">{new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-48 h-px bg-slate-300 mb-2" />
          <p className="text-sm font-sans uppercase tracking-widest text-slate-500 font-bold">Authorized Signatory</p>
          <p className="font-serif italic text-lg mt-1 text-red-600">BloodBond Team</p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <User size={16} />
            <span className="text-sm font-sans uppercase tracking-widest font-bold">Certificate ID</span>
          </div>
          <p className="text-xs font-mono text-slate-400">{certificateId.toUpperCase()}</p>
        </div>
      </div>

      {/* Badge Overlay */}
      <div className="absolute top-12 right-12 opacity-10">
        <Droplets size={120} className="text-red-600" />
      </div>
    </div>
  );
});

CertificateTemplate.displayName = 'CertificateTemplate';

export default CertificateTemplate;
