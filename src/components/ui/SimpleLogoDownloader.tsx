import React, { useRef } from 'react';
import { Download, Building2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SimpleLogoDownloader = () => {
  const logoRef = useRef<HTMLDivElement>(null);

  const downloadAsPNG = async () => {
    if (!logoRef.current) return;

    // Create a canvas to draw the logo
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 512;
    canvas.height = 512;

    // Fill white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 512, 512);

    // Create SVG data from the actual rendered icons
    const svgData = `
      <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <rect width="512" height="512" fill="white"/>
        <g transform="translate(180, 180)">
          <!-- Building2 icon path -->
          <g transform="scale(7,7)" fill="#ea384c" stroke="none">
            <path d="M6 22V4c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v18H6zM8 6h2v2H8V6zM8 10h2v2H8v-2zM8 14h2v2H8v-2zM12 6h2v2h-2V6zM12 10h2v2h-2v-2zM12 14h2v2h-2v-2z"/>
            <path d="M20 22V8c0-1.1-.9-2-2-2v16h2z"/>
          </g>
          <!-- TrendingUp icon -->
          <g transform="translate(100, -20) scale(5,5)" fill="#ea384c" stroke="none">
            <path d="m22 7-8.5 8.5-5-5L2 17l1.4 1.4 4.1-4.1 5 5L23.4 8.4 22 7Z"/>
            <path d="M20 7h-4v2h4V7zM22 7v4h-2V7h2z"/>
          </g>
        </g>
      </svg>
    `;

    // Convert SVG to image
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, 512, 512);
      
      // Download as PNG
      canvas.toBlob((blob) => {
        if (blob) {
          const downloadUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = 'PropManagement-Logo.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(downloadUrl);
        }
      }, 'image/png');
      
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  const downloadAsSVG = () => {
    const svgData = `
      <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <rect width="512" height="512" fill="white"/>
        <g transform="translate(180, 180)">
          <!-- Building2 icon path -->
          <g transform="scale(7,7)" fill="#ea384c" stroke="none">
            <path d="M6 22V4c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v18H6zM8 6h2v2H8V6zM8 10h2v2H8v-2zM8 14h2v2H8v-2zM12 6h2v2h-2V6zM12 10h2v2h-2v-2zM12 14h2v2h-2v-2z"/>
            <path d="M20 22V8c0-1.1-.9-2-2-2v16h2z"/>
          </g>
          <!-- TrendingUp icon -->
          <g transform="translate(100, -20) scale(5,5)" fill="#ea384c" stroke="none">
            <path d="m22 7-8.5 8.5-5-5L2 17l1.4 1.4 4.1-4.1 5 5L23.4 8.4 22 7Z"/>
            <path d="M20 7h-4v2h4V7zM22 7v4h-2V7h2z"/>
          </g>
        </g>
      </svg>
    `;

    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'PropManagement-Logo.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-md mx-auto bg-card border rounded-lg p-6 shadow-sm">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2">Logo PropManagement</h3>
        <div ref={logoRef} className="flex items-center justify-center gap-2 mb-4">
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
          onClick={downloadAsSVG}
          className="w-full bg-[#ea384c] hover:bg-[#d31c3f] text-white"
        >
          <Download className="h-4 w-4 mr-2" />
          Télécharger SVG (Vectoriel)
        </Button>
        
        <Button 
          onClick={downloadAsPNG}
          variant="outline"
          className="w-full border-[#ea384c] text-[#ea384c] hover:bg-[#ea384c] hover:text-white"
        >
          <Download className="h-4 w-4 mr-2" />
          Télécharger PNG (512x512)
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground mt-4 text-center">
        Logo identique à celui de l'application
      </p>
    </div>
  );
};