
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const MaintenanceTasksList = () => {
  const { tasks, isLoading, handleTaskCompletion, handleDeleteTask } = useMaintenanceTasks();
  const [selectedTask, setSelectedTask] = useState<{ id: string; photos?: string[] } | null>(null);
  useRealtimeNotifications();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="animate-fade-in">
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>Liste des tâches de maintenance planifiées.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Statut</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id} className="animate-fade-in transition-colors hover:bg-muted/50">
                <TableCell className="font-medium">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => handleTaskCompletion(task.id)}
                            className="transition-transform hover:scale-105"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Marquer comme {task.completed ? 'non complétée' : 'complétée'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{task.title}</span>
                    <span className="md:hidden text-sm text-muted-foreground">
                      {format(task.date, 'PPP')}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge className="gap-2 transition-all hover:scale-105">
                    {task.type}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{format(task.date, 'PPP')}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {task.photos && task.photos.length > 0 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => setSelectedTask(task)}
                              className="transition-transform hover:scale-105"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Voir les photos</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="transition-transform hover:scale-105"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Dupliquer la tâche</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            onClick={() => handleDeleteTask(task.id)}
                            className="transition-transform hover:scale-105"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Supprimer la tâche</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
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
