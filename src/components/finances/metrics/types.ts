
import { ReactNode } from 'react';

export interface FinancialMetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  chartColor?: string;
  trend?: number;
}
