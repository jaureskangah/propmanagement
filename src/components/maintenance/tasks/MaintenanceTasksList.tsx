
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ViewPhotosDialog } from "./ViewPhotosDialog";
import { EmptyTenantState } from "@/components/tenant/EmptyTenantState";

interface MaintenanceTasksListProps {
  requests: any[];
}

export const MaintenanceTasksList = ({ requests }: MaintenanceTasksListProps) => {
  const { t } = useLocale();
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [isViewingPhotos, setIsViewingPhotos] = useState(false);

  const handleViewPhotos = (photos: string[]) => {
    setSelectedPhotos(photos);
    setIsViewingPhotos(true);
  };

  if (requests.length === 0) {
    return (
      <EmptyTenantState />
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="p-4 border rounded-lg hover:bg-muted/20 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{request.issue}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{request.description}</p>
                  
                  <div className="flex items-center mt-2 gap-2">
                    <span 
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}
                    >
                      {request.status}
                    </span>
                    
                    <span 
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        request.priority === 'Urgent' ? 'bg-red-100 text-red-800' :
                        request.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                        request.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}
                    >
                      {request.priority}
                    </span>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {new Date(request.created_at).toLocaleDateString()}
                </div>
              </div>
              
              {request.photos && request.photos.length > 0 && (
                <div className="mt-3">
                  <button
                    onClick={() => handleViewPhotos(request.photos)}
                    className="text-sm text-primary hover:underline"
                  >
                    {t('viewPhotos')} ({request.photos.length})
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      
      <ViewPhotosDialog
        photos={selectedPhotos}
        isOpen={isViewingPhotos}
        onClose={() => setIsViewingPhotos(false)}
      />
    </Card>
  );
};
