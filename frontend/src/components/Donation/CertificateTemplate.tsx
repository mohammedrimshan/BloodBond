import React from 'react';
import { Droplets } from 'lucide-react';

interface Props {
  donorName: string;
  bloodGroup: string;
  date: string;
  certificateId: string;
}

const CertificateTemplate = React.forwardRef<HTMLDivElement, Props>(({ donorName, bloodGroup, date, certificateId }, ref) => {
  const formattedDate = date ? new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'November 22, 2050';

  // Standard CSS reset for the certificate to avoid Tailwind variables inheritance
  const containerStyle: React.CSSProperties = {
    width: '800px',
    height: '600px',
    backgroundColor: '#ffffff',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'serif',
    color: '#1a1a1a',
    margin: '0',
    padding: '0',
    boxSizing: 'border-box'
  };

  return (
    <div ref={ref} style={containerStyle}>
      {/* Top Left Diagonal Stripes */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '256px', height: '256px', overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '300px', height: '60px', backgroundColor: '#8B0000', transform: 'rotate(-45deg)' }} />
        <div style={{ position: 'absolute', top: '-40px', left: '-40px', width: '300px', height: '40px', backgroundColor: '#D22B2B', transform: 'rotate(-45deg)' }} />
        <div style={{ position: 'absolute', top: '10px', left: '10px', width: '300px', height: '15px', backgroundColor: '#8B0000', transform: 'rotate(-45deg)' }} />
      </div>

      {/* Bottom Right Diagonal Stripes */}
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '256px', height: '256px', overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '300px', height: '60px', backgroundColor: '#8B0000', transform: 'rotate(-45deg)' }} />
        <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', width: '300px', height: '40px', backgroundColor: '#D22B2B', transform: 'rotate(-45deg)' }} />
        <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '300px', height: '15px', backgroundColor: '#8B0000', transform: 'rotate(-45deg)' }} />
      </div>

      {/* Main Content Container */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 80px', textAlign: 'center', boxSizing: 'border-box' }}>
        {/* Header */}
        <h1 style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-0.025em', color: '#5c1a1a', margin: '0 0 4px 0', textTransform: 'uppercase' }}>BLOOD DONATION</h1>
        <h2 style={{ fontSize: '48px', fontWeight: 300, letterSpacing: '0.2em', color: '#5c1a1a', margin: '0 0 48px 0', textTransform: 'uppercase' }}>CERTIFICATE</h2>

        <p style={{ fontSize: '18px', fontStyle: 'italic', color: '#475569', marginBottom: '32px' }}>This certificate is awarded to</p>

        {/* Name */}
        <div style={{ position: 'relative', marginBottom: '32px', width: '100%' }}>
          <h3 style={{ fontSize: '60px', fontWeight: 700, color: '#5c1a1a', margin: '0', padding: '0 16px' }}>
            {donorName}
          </h3>
          <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(92, 26, 26, 0.2)', marginTop: '8px' }} />
        </div>

        {/* Description */}
        <p style={{ maxWidth: '600px', fontSize: '14px', lineHeight: '1.6', color: '#475569', marginBottom: '48px', margin: '0 auto 48px auto' }}>
          to honor their selfless act of donating <span style={{ fontWeight: 700, color: '#8B0000' }}>{bloodGroup}</span> blood, which has helped save lives and bring
          hope to those in need.
        </p>

        {/* Date */}
        <p style={{ fontSize: '20px', fontWeight: 700, color: '#5c1a1a', marginBottom: '48px' }}>
          Given on this day, {formattedDate}.
        </p>

        {/* Signature Area */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{ fontSize: '14px', fontWeight: 700, color: '#5c1a1a', margin: '0' }}>BloodBond Team</p>
          <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', margin: '0' }}>Director, Blood Services</p>
          <p style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>Lifeline Center</p>
          <p style={{ fontSize: '8px', fontFamily: 'monospace', color: '#cbd5e1', marginTop: '16px' }}>ID: {certificateId?.toUpperCase()}</p>
        </div>
      </div>

      {/* Realistic Golden Seal (Bottom Left) */}
      <div style={{ position: 'absolute', bottom: '48px', left: '64px', transform: 'scale(1.2)' }}>
        {/* Ribbons */}
        <div style={{ position: 'absolute', top: '40px', left: '8px', width: '24px', height: '64px', backgroundColor: '#8B0000', transform: 'rotate(15deg)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 85%, 0% 100%)' }} />
        <div style={{ position: 'absolute', top: '40px', left: '32px', width: '24px', height: '64px', backgroundColor: '#5c1a1a', transform: 'rotate(-15deg)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 85%, 0% 100%)' }} />
        
        {/* Jagged Seal Edges */}
        <div style={{ 
          position: 'relative', 
          width: '64px', 
          height: '64px', 
          backgroundColor: '#D22B2B', 
          borderRadius: '9999px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          backgroundImage: 'radial-gradient(circle, #D22B2B 60%, #8B0000 100%)',
          clipPath: 'polygon(50% 0%, 61% 6%, 75% 1%, 81% 12%, 96% 12%, 94% 26%, 100% 40%, 92% 52%, 96% 67%, 85% 75%, 83% 90%, 69% 91%, 58% 100%, 42% 96%, 30% 100%, 18% 91%, 6% 94%, 8% 78%, 0% 67%, 8% 54%, 2% 40%, 12% 28%, 8% 14%, 22% 11%, 30% 0%, 41% 7%)'
        }}>
          {/* Inner Golden Circle */}
          <div style={{ 
            width: '44px', 
            height: '44px', 
            background: 'linear-gradient(to bottom right, #FFD700, #FDB931, #D4AF37)', 
            borderRadius: '9999px', 
            border: '2px solid #D4AF37', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)' 
          }}>
             <Droplets size={20} style={{ color: 'rgba(139, 0, 0, 0.3)' }} />
          </div>
        </div>
      </div>
    </div>
  );
});

CertificateTemplate.displayName = 'CertificateTemplate';

export default CertificateTemplate;
