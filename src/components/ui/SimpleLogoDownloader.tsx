import React from 'react';
import { Download, Building2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SimpleLogoDownloader = () => {
  const createLogoSVG = () => {
    const svg = `
      <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .building { fill: #ea384c; }
            .trending { fill: #ea384c; }
          </style>
        </defs>
        
        <!-- Building Icon -->
        <g transform="translate(100, 100) scale(8, 8)">
          <path class="building" d="M8 20H16V4H8V20ZM10 6H14V8H10V6ZM10 10H14V12H10V10ZM10 14H14V16H10V14ZM6 20H8V12H6V20ZM18 20H20V8H18V20Z" stroke="none"/>
        </g>
        
        <!-- Trending Up Icon -->
        <g transform="translate(280, 80) scale(6, 6)">
          <path class="trending" d="M22 7L13.5 15.5L8.5 10.5L2 17L3.4 18.4L8.5 13.3L13.5 18.3L23.4 8.4L22 7Z" stroke="none"/>
          <path class="trending" d="M20 7H16V9H20V7Z" stroke="none"/>
          <path class="trending" d="M22 7V11H20V7H22Z" stroke="none"/>
        </g>
      </svg>
    `;
    return svg;
  };

  const downloadLogo = () => {
    const svg = createLogoSVG();
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'PropManagement-Logo.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadPNG = () => {
    const svg = createLogoSVG();
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const pngUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = pngUrl;
          link.download = 'PropManagement-Logo.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(pngUrl);
        }
      }, 'image/png');
      URL.revokeObjectURL(url);
    };
    
    img.src = url;
  };

  return (
    <div className="max-w-md mx-auto bg-card border rounded-lg p-6 shadow-sm">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2">Logo PropManagement</h3>
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="relative">
            <Building2 className="h-16 w-16 text-[#ea384c]" />
            <TrendingUp className="h-12 w-12 text-[#ea384c] absolute -top-2 -right-2" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Building2 + TrendingUp - Couleur: #ea384c
        </p>
      </div>
      
      <div className="space-y-3">
        <Button 
          onClick={downloadLogo}
          className="w-full bg-[#ea384c] hover:bg-[#d31c3f] text-white"
        >
          <Download className="h-4 w-4 mr-2" />
          Télécharger SVG (Vectoriel)
        </Button>
        
        <Button 
          onClick={downloadPNG}
          variant="outline"
          className="w-full border-[#ea384c] text-[#ea384c] hover:bg-[#ea384c] hover:text-white"
        >
          <Download className="h-4 w-4 mr-2" />
          Télécharger PNG (512x512)
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground mt-4 text-center">
        Format vectoriel recommandé pour impression et redimensionnement
      </p>
    </div>
  );
};