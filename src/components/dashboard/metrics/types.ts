export interface MetricsData {
  occupancy: {
    rate: number;
    trend: number;
    chartData: Array<{ value: number }>;
  };
  properties: {
    total: number;
    new: number;
    chartData: Array<{ value: number }>;
  };
  tenants: {
    total: number;
    occupancyRate: number;
    chartData: Array<{ value: number }>;
  };
  maintenance: {
    pending: number;
    chartData: Array<{ value: number }>;
  };
  revenue: {
    monthly: number;
    chartData: Array<{ value: number }>;
  };
  communications?: {
    chartData: Array<{ value: number }>;
  };
}