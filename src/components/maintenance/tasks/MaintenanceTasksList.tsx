
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ViewPhotosDialog } from "./ViewPhotosDialog";
import { EmptyTenantState } from "@/components/tenant/EmptyTenantState";
import { AlertTriangle, AlertCircle, Info, CheckCircle, Calendar, MapPin, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'High':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'Medium':
        return <Info className="h-5 w-5 text-yellow-500" />;
      case 'Low':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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
              className={`p-4 border rounded-lg transition-all duration-200 hover:shadow-md ${getPriorityStyle(request.priority)} bg-opacity-10 hover:bg-opacity-20`}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="mt-1">
                    {getPriorityIcon(request.priority)}
                  </div>
                  <div>
                    <h3 className="font-medium">{request.issue}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{request.description}</p>
                    
                    <div className="flex flex-wrap items-center mt-2 gap-2">
                      <Badge 
                        variant="outline"
                        className={`${getStatusStyle(request.status)} text-xs font-medium`}
                      >
                        {request.status}
                      </Badge>
                      
                      <Badge 
                        variant="outline"
                        className={`${getPriorityStyle(request.priority)} text-xs font-medium`}
                      >
                        {request.priority}
                      </Badge>

                      {request.due_date && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          {new Date(request.due_date).toLocaleDateString()}
                        </div>
                      )}

                      {request.location && (
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          {request.location}
                        </div>
                      )}

                      {request.assigned_to && (
                        <div className="flex items-center text-xs text-gray-500">
                          <User className="h-3.5 w-3.5 mr-1" />
                          {request.assigned_to}
                        </div>
                      )}
                    </div>
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
                    className="text-sm text-primary hover:underline flex items-center"
                  >
                    <img src="/placeholder.svg" alt="" className="w-6 h-6 mr-1 rounded-sm" />
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
