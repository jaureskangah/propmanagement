
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
import { CalendarIcon, Copy, Eye, Trash2, GripVertical } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { ViewPhotosDialog } from './ViewPhotosDialog';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DragDropContext, Draggable, Droppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../types';

export const MaintenanceTasksList = () => {
  const { tasks, isLoading, handleTaskCompletion, handleDeleteTask, handleUpdateTaskPosition } = useMaintenanceTasks();
  const [selectedTask, setSelectedTask] = useState<{ id: string; photos?: string[] } | null>(null);
  useRealtimeNotifications();

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const newTasks = Array.from(tasks);
    const [reorderedItem] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, reorderedItem);

    // Update positions in the database
    newTasks.forEach((task, index) => {
      handleUpdateTaskPosition(task.id, index);
    });
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="overflow-x-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <Table>
                <TableCaption>Liste des tâches de maintenance planifiées.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead className="w-[100px]">Statut</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead className="hidden md:table-cell">Priorité</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                  {tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <TableRow 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="animate-fade-in transition-colors hover:bg-muted/50"
                        >
                          <TableCell>
                            <div {...provided.dragHandleProps} className="cursor-grab">
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </TableCell>
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
                              <Badge 
                                className={`md:hidden mt-1 ${getPriorityColor(task.priority)}`}
                              >
                                {task.priority}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge className="gap-2 transition-all hover:scale-105">
                              {task.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge 
                              className={`transition-all hover:scale-105 ${getPriorityColor(task.priority)}`}
                            >
                              {task.priority}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {format(task.date, 'PPP')}
                          </TableCell>
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
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TableBody>
              </Table>
            )}
          </Droppable>
        </DragDropContext>
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
