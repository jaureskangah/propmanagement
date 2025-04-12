
import { Task } from "../types";
import { ReminderItem } from "./ReminderItem";

interface ReminderGroupProps {
  title: string;
  tasks: Task[];
}

export const ReminderGroup = ({ title, tasks }: ReminderGroupProps) => {
  if (tasks.length === 0) return null;
  
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      <div className="space-y-2">
        {tasks.map((task) => (
          <ReminderItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};
