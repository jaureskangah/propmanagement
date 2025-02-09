
import { useMaintenanceTasks } from './useMaintenanceTasks';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';
import { ExportOptions } from '../ExportOptions';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { format } from 'date-fns';
import { CalendarIcon, Copy, Eye, Trash2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { ViewPhotosDialog } from './ViewPhotosDialog';
import { useState } from 'react';

export const MaintenanceTasksList = () => {
  const { tasks, isLoading, handleTaskCompletion, handleDeleteTask } = useMaintenanceTasks();
  const [selectedTask, setSelectedTask] = useState<{ id: string; photos?: string[] } | null>(null);
  useRealtimeNotifications();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <Table>
        <TableCaption>A list of your scheduled maintenance tasks.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => handleTaskCompletion(task.id)}
                />
              </TableCell>
              <TableCell>{task.title}</TableCell>
              <TableCell>
                <Badge className="gap-2">
                  {task.type}
                </Badge>
              </TableCell>
              <TableCell>{format(task.date, 'PPP')}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {task.photos && task.photos.length > 0 && (
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setSelectedTask(task)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="outline" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDeleteTask(task.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <ExportOptions tasks={tasks} />

      {selectedTask && (
        <ViewPhotosDialog
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          photos={selectedTask.photos || []}
        />
      )}
    </div>
  );
};
