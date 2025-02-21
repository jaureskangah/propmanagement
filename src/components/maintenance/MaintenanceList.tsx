
import { useSupabaseQuery, useSupabaseMutation, useSupabaseDelete } from "@/hooks/useSupabaseQuery";

interface MaintenanceTask {
  id: string;
  title: string;
  status: string;
  priority: string;
  created_at: string;
}

export function MaintenanceList() {
  const { data: tasks, isLoading } = useSupabaseQuery<MaintenanceTask>(
    ['maintenance_tasks'],
    'maintenance_tasks',
    {
      order: { column: 'created_at', ascending: false },
    }
  );

  const addTask = useSupabaseMutation<MaintenanceTask>(
    'maintenance_tasks',
    {
      successMessage: "Tâche ajoutée avec succès",
    }
  );

  const deleteTask = useSupabaseDelete(
    'maintenance_tasks',
    {
      successMessage: "Tâche supprimée avec succès",
    }
  );

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      {tasks?.map(task => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <p>Status: {task.status}</p>
          <p>Priority: {task.priority}</p>
          <button
            onClick={() => deleteTask.mutate(task.id)}
            disabled={deleteTask.isPending}
          >
            Supprimer
          </button>
        </div>
      ))}
    </div>
  );
}
