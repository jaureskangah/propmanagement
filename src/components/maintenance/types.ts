
export interface Task {
  id: string;
  title: string;
  date: Date;
  completed: boolean;
  type: "regular" | "inspection" | "seasonal";
  user_id: string;
  created_at: string;
  updated_at: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in_progress" | "completed";
  photos?: string[];
  is_recurring?: boolean;
  recurrence_pattern?: {
    frequency: "daily" | "weekly" | "monthly" | "yearly";
    interval: number;
    endDate?: string;
  };
  position: number;
}

export interface NewTask {
  title: string;
  date: Date;
  type: "regular" | "inspection" | "seasonal";
  priority?: "low" | "medium" | "high" | "urgent";
  is_recurring?: boolean;
  recurrence_pattern?: {
    frequency: "daily" | "weekly" | "monthly" | "yearly";
    interval: number;
    endDate?: string;
  };
}

export interface TaskTemplate {
  id: string;
  title: string;
  type: "regular" | "inspection" | "seasonal";
  priority: "low" | "medium" | "high" | "urgent";
  recurrence_pattern: {
    frequency: "daily" | "weekly" | "monthly" | "yearly";
    interval: number;
    endDate?: string;
  };
  user_id: string;
  created_at: string;
  updated_at: string;
}
