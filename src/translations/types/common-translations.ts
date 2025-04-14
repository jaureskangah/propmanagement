
// This interface contains translations that are shared across multiple feature areas
export interface CommonTimeTranslations {
  today: string;
  tomorrow: string;
  thisWeek: string;
  later: string;
  yesterday: string;
}

export interface CommonPriorityTranslations {
  urgent: string;
  high: string;
  medium: string;
  low: string;
}

export interface CommonStatusTranslations {
  pending: string;
  completed: string;
  inProgress: string;
}

// This interface can be extended by other translation interfaces
export interface SharedTranslations 
  extends CommonTimeTranslations, 
          CommonPriorityTranslations,
          CommonStatusTranslations {
  loading: string;
  date: string;
  property: string;
  unit: string;
  
  // KPI descriptions shared between maintenance and finances
  totalExpenses?: string;
  yearToDate?: string;
  annualReturn?: string;
  totalRentPaid?: string;
  allTime?: string;
  comparedToPreviousMonth?: string;
}
