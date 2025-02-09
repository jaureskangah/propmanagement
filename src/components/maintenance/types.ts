
export interface Task {
  id: string;
  title: string;
  date: Date;
  completed: boolean;
  type: "regular" | "inspection" | "seasonal";
  user_id: string;
  created_at: string;
  updated_at: string;
  priority?: "low" | "medium" | "high" | "urgent";
  status?: "pending" | "in_progress" | "completed";
  photos?: string[];
}

export interface NewTask {
  title: string;
  date: Date;
  type: "regular" | "inspection" | "seasonal";
}
