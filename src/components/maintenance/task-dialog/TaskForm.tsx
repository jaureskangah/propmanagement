
import { useTaskForm } from "./hooks/useTaskForm";
import { TaskFormContent } from "./TaskFormContent";
import { NewTask } from "../types";

interface TaskFormProps {
  onSubmit: (task: NewTask) => void;
  initialDate?: Date;
  initialValue?: NewTask;
}

export const TaskForm = ({ onSubmit, initialDate, initialValue }: TaskFormProps) => {
  const formProps = useTaskForm({ onSubmit, initialDate, initialValue });
  
  return <TaskFormContent {...formProps} />;
};
