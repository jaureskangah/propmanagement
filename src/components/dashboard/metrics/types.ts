
export interface MetricsData {
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
  communications?: {
    chartData: Array<{ value: number }>;
  };
}
