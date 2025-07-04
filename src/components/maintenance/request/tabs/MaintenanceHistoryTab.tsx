
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import { useLocale } from "@/components/providers/LocaleProvider";

interface HistoryEvent {
  id: string;
  request_id: string;
  status: string;
  created_at: string;
  comments?: string;
}

interface MaintenanceHistoryTabProps {
  requestId: string;
}

export const MaintenanceHistoryTab = ({ requestId }: MaintenanceHistoryTabProps) => {
  const [history, setHistory] = useState<HistoryEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLocale();

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      
      try {
        // For now, we don't have a dedicated history table, so we'll just mock some data
        // In a real application, you would fetch from a maintenance_history table
        
        // Mock history data
        const mockHistory: HistoryEvent[] = [
          {
            id: '1',
            request_id: requestId,
            status: 'Created',
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            comments: 'Maintenance request created'
          },
          {
            id: '2',
            request_id: requestId,
            status: 'Assigned',
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            comments: 'Assigned to maintenance team'
          },
          {
            id: '3',
            request_id: requestId,
            status: 'In Progress',
            created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            comments: 'Work started on the issue'
          }
        ];
        
        setHistory(mockHistory);
      } catch (error) {
        console.error("Error fetching maintenance history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [requestId]);

  if (isLoading) {
    return (
      <div className="h-40 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 bg-gray-50 rounded-md">
        <p className="text-gray-500">No history available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative pl-6 border-l-2 border-gray-200 space-y-6">
        {history.map((event, index) => (
          <div key={event.id} className="relative pb-6">
            <div className="absolute -left-[25px] bg-white rounded-full border-2 border-gray-200 h-6 w-6 flex items-center justify-center">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
            </div>
            
            <div className="ml-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">{event.status}</h4>
                <span className="text-sm text-gray-500">{formatDate(event.created_at, language)}</span>
              </div>
              {event.comments && (
                <p className="text-sm text-gray-600 mt-1">{event.comments}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
