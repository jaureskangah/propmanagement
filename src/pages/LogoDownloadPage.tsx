import React from 'react';
import { LogoDownloader } from '@/components/ui/LogoDownloader';

export default function LogoDownloadPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Télécharger le Logo</h1>
          <p className="text-muted-foreground">Votre logo PropManagement est prêt !</p>
        </div>
        <LogoDownloader />
      </div>
    </div>
  );
}