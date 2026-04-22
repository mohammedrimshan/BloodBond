import React, { useRef, useState } from 'react';
import { Award, Download, Loader2 } from 'lucide-react';
import { useDonationCertificate } from '@/hooks/donations/useDonationCertificate';
import CertificateTemplate from './CertificateTemplate';
import { downloadCertificate } from '@/utils/certificateDownloader';
import { toast } from 'sonner';

interface Props {
  donationId: string;
}

const CertificateButton: React.FC<Props> = ({ donationId }) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);

  const { data: donation, isLoading } = useDonationCertificate(shouldFetch ? donationId : "");

  const handleDownload = async () => {
    // If we haven't fetched yet, trigger fetch and wait
    if (!shouldFetch) {
      setShouldFetch(true);
      return;
    }

    // Ensure donation data and ref are ready
    if (donation && certificateRef.current) {
      setIsDownloading(true);
      const loadingToast = toast.loading("Generating your Hero Certificate...");
      
      try {
        // Short delay to ensure browser has rendered the template
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await downloadCertificate(certificateRef.current, donation.userId.name);
        toast.dismiss(loadingToast);
        toast.success("Certificate downloaded! You are a hero.");
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error("Failed to generate certificate. Please try again.");
        console.error(error);
      } finally {
        setIsDownloading(false);
      }
    }
  };

  // Trigger download automatically once data arrives after the first click
  React.useEffect(() => {
    if (shouldFetch && donation && !isDownloading) {
      handleDownload();
    }
  }, [donation, shouldFetch]);

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDownload();
        }}
        disabled={isDownloading || (shouldFetch && isLoading)}
        className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors group/btn relative disabled:opacity-50"
      >
        {isDownloading || (shouldFetch && isLoading) ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Award size={16} />
        )}
      </button>

      {/* 
        The template must be in the DOM for html2canvas. 
        Using opacity-0 and pointer-events-none instead of absolute positioning out of bounds.
      */}
      <div 
        style={{ 
          position: 'absolute', 
          left: 0, 
          top: 0, 
          zIndex: -100, 
          opacity: 0, 
          pointerEvents: 'none',
          transform: 'scale(0.1)' // Small enough not to cause scrollbars
        }}
      >
        {donation && (
          <CertificateTemplate
            ref={certificateRef}
            donorName={donation.userId.name}
            bloodGroup={donation.userId.bloodGroup}
            date={donation.donatedAt}
            certificateId={donation._id}
          />
        )}
      </div>
    </>
  );
};

export default CertificateButton;
