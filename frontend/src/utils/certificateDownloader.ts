import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const downloadCertificate = async (element: HTMLElement, donorName: string) => {
  try {
    console.log('📸 Capturing certificate element...', element);
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true,
      logging: true, // Enable html2canvas internal logs for debugging
      backgroundColor: '#ffffff'
    });
    
    console.log('🖼️ Canvas generated:', canvas.width, 'x', canvas.height);
    const imgData = canvas.toDataURL('image/png');
    
    console.log('📄 Creating PDF...');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    
    console.log('💾 Saving PDF...');
    pdf.save(`BloodBond_Certificate_${donorName.replace(/\s+/g, '_')}.pdf`);
    console.log('✅ PDF saved successfully!');
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    throw error;
  }
};
