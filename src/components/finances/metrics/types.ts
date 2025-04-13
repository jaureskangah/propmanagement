
export interface FinancialData {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  occupancyRate: number;
  unpaidRent: number;
  incomeTrend: number;
  expensesTrend: number;
  occupancyRateTrend: number;
  unpaidRentTrend: number;
}

export interface FinancialMetricCardProps {
  title: string;
  value: number | string;
  description: string;
  icon?: React.ReactNode;
  chartColor?: string;
  trend?: number;
  format?: 'currency' | 'percent' | 'number';
  isNegativeBetter?: boolean;
}

export interface FinancialMetricTrendProps {
  trend: number;
  isPositiveMetric?: boolean;
}
