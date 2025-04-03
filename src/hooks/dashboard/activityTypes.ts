
export interface Activity {
  id: string;
  created_at: string;
  type: 'tenant' | 'payment' | 'maintenance';
  component: JSX.Element;
}

export interface GroupedActivities {
  [key: string]: Activity[];
}
