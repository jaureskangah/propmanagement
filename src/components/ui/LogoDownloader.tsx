import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoImage from '@/assets/propmanagement-logo.png';

export const LogoDownloader = () => {
  const handleDownload = () => {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = logoImage;
    link.download = 'PropManagement-Logo.png';
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 border rounded-lg bg-card">
      <div className="flex items-center gap-2">
        <img 
          src={logoImage} 
          alt="PropManagement Logo" 
          className="w-16 h-16"
        />
        <div>
          <h3 className="font-semibold">Logo PropManagement</h3>
          <p className="text-sm text-muted-foreground">Building2 + TrendingUp - 512x512px</p>
        </div>
      </div>
      
      <Button 
        onClick={handleDownload}
        className="bg-[#ea384c] hover:bg-[#d31c3f] text-white"
      >
        <Download className="h-4 w-4 mr-2" />
        Télécharger le Logo
      </Button>
    </div>
  );
};