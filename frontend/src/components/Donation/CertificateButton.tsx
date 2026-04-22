import React, { useRef, useState } from 'react';
import { Award, Loader2 } from 'lucide-react';
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

  const handleDownload = React.useCallback(async () => {
    if (isDownloading) return;

    if (!donation) {
      setShouldFetch(true);
      return;
    }

    if (certificateRef.current) {
      setIsDownloading(true);
      const loadingToast = toast.loading("Generating your Hero Certificate...");
      
      try {
        // Ensure browser has painted the hidden template
        await new Promise(resolve => setTimeout(resolve, 800));
        
        await downloadCertificate(certificateRef.current, donation.userId.name);
        toast.dismiss(loadingToast);
        toast.success("Certificate downloaded! You are a hero.");
        setShouldFetch(false); // Reset for next time if needed
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error("Failed to generate certificate. Please try again.");
        console.error(error);
      } finally {
        setIsDownloading(false);
      }
    }
  }, [donation, isDownloading]);

  // Effect to trigger download once data is ready after first click
  React.useEffect(() => {
    if (shouldFetch && donation && !isLoading && !isDownloading) {
      handleDownload();
    }
  }, [donation, isLoading, shouldFetch, isDownloading, handleDownload]);

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDownload();
        }}
        disabled={isDownloading}
        className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors group/btn relative disabled:opacity-50"
        title="Download Certificate"
      >
        {isDownloading || (shouldFetch && isLoading) ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Award size={16} />
        )}
      </button>

      {/* Hidden template for PDF generation */}
      <div 
        style={{ 
          position: 'fixed', 
          left: '-9999px', 
          top: '-9999px', 
          zIndex: -100, 
          visibility: 'hidden'
        }}
      >
        <div style={{ visibility: 'visible' }}>
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
      </div>
    </>
  );
};

export default CertificateButton;
