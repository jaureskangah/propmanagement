
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface StatusDisplayProps {
  signupStatus: 'idle' | 'creating' | 'linking' | 'success' | 'failed';
}

export const StatusDisplay = ({ signupStatus }: StatusDisplayProps) => {
  if (signupStatus === 'idle') return null;

  const getStatusDisplay = () => {
    switch (signupStatus) {
      case 'creating':
        return (
          <div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Création du compte...</span>
          </div>
        );
      case 'linking':
        return (
          <div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Liaison du profil...</span>
          </div>
        );
      case 'success':
        return (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Compte créé avec succès!</span>
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Erreur lors de la création</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
      {getStatusDisplay()}
    </div>
  );
};
