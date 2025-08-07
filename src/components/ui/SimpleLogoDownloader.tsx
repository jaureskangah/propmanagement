import React, { useRef } from 'react';
import { Download, Building2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';

export const SimpleLogoDownloader = () => {
  const logoRef = useRef<HTMLDivElement>(null);

  const downloadAsPNG = async () => {
    if (!logoRef.current) return;

    try {
      // Create a high-resolution canvas from the actual rendered logo
      const canvas = await html2canvas(logoRef.current, {
        backgroundColor: '#ffffff',
        scale: 4, // High resolution
        width: 128,
        height: 128,
        useCORS: true,
        logging: false
      });

      // Resize to 512x512
      const finalCanvas = document.createElement('canvas');
      const finalCtx = finalCanvas.getContext('2d');
      if (!finalCtx) return;

      finalCanvas.width = 512;
      finalCanvas.height = 512;

      // Fill white background
      finalCtx.fillStyle = '#ffffff';
      finalCtx.fillRect(0, 0, 512, 512);

      // Draw the captured logo centered
      const x = (512 - 512) / 2;
      const y = (512 - 512) / 2;
      finalCtx.drawImage(canvas, x, y, 512, 512);

      // Download
      finalCanvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'PropManagement-Logo.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, 'image/png');

    } catch (error) {
      console.error('Erreur lors de la capture:', error);
      alert('Erreur lors de la génération du logo. Veuillez réessayer.');
    }
  };

  const downloadAsSVG = async () => {
    if (!logoRef.current) return;

    // Get the actual SVG content from the rendered icons
    const svgElements = logoRef.current.querySelectorAll('svg');
    
    if (svgElements.length >= 2) {
      const building2Svg = svgElements[0];
      const trendingUpSvg = svgElements[1];
      
      const building2Path = building2Svg.querySelector('path')?.getAttribute('d') || '';
      const trendingUpPath = trendingUpSvg.querySelector('path')?.getAttribute('d') || '';

      const combinedSVG = `
        <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
          <rect width="512" height="512" fill="white"/>
          <!-- Building2 Icon -->
          <g transform="translate(200, 200) scale(4.5, 4.5)">
            <path d="${building2Path}" fill="#ea384c" stroke="none"/>
          </g>
          <!-- TrendingUp Icon -->
          <g transform="translate(280, 160) scale(3.2, 3.2)">
            <path d="${trendingUpPath}" fill="#ea384c" stroke="none"/>
          </g>
        </svg>
      `;

      const blob = new Blob([combinedSVG], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'PropManagement-Logo.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      alert('Impossible d\'extraire les icônes SVG. Utilisez le format PNG.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-card border rounded-lg p-6 shadow-sm">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2">Logo PropManagement</h3>
        <div 
          ref={logoRef} 
          className="flex items-center justify-center gap-0 mb-4 p-4"
          style={{ 
            width: '128px', 
            height: '128px', 
            margin: '0 auto',
            backgroundColor: '#ffffff'
          }}
        >
          <div className="relative">
            <Building2 size={64} className="text-[#ea384c]" />
            <TrendingUp size={48} className="text-[#ea384c] absolute -top-2 -right-2" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Logo exactement identique à l'application
        </p>
      </div>
      
      <div className="space-y-3">
        <Button 
          onClick={downloadAsPNG}
          className="w-full bg-[#ea384c] hover:bg-[#d31c3f] text-white"
        >
          <Download className="h-4 w-4 mr-2" />
          Télécharger PNG (Recommandé)
        </Button>
        
        <Button 
          onClick={downloadAsSVG}
          variant="outline"
          className="w-full border-[#ea384c] text-[#ea384c] hover:bg-[#ea384c] hover:text-white"
        >
          <Download className="h-4 w-4 mr-2" />
          Télécharger SVG
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground mt-4 text-center">
        Capture directe du rendu de l'application
      </p>
    </div>
  );
};