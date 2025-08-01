
import { enCommon } from './common';
import { enDashboard } from './dashboard';
import { enFinances } from './finances';
import { enMaintenance } from './maintenance';
import { enAuth } from './auth';
import { enLease } from './tenant/en/lease';
import { enDashboard as enTenantDashboard } from './tenant/en/dashboard';
import { enToasts } from './toasts';
import { enAdmin } from './admin';

export const en = {
  ...enCommon,
  ...enDashboard,
  ...enFinances,
  ...enMaintenance,
  ...enAuth,
  ...enToasts,
  ...enAdmin,
  
  // Lease translations
  ...enLease,
  
  // Tenant dashboard translations
  ...enTenantDashboard,
  
  // Additional lease management translations
  leaseExpiry: "Lease Expiry",
  leaseExpiryManagement: "Lease Expiry Management",
  leaseExpiryNotifications: "Lease Expiry Notifications",
  enableLeaseReminders: "Enable lease reminders",
  reminderSettings: "Reminder Settings",
  daysBeforeExpiry: "Days before expiry",
  notificationMethod: "Notification method",
  emailAndApp: "Email and App",
  emailOnly: "Email only",
  appOnly: "App only",
  leaseStatus: "Lease Status",
  
  // Reports translations
  revenueEvolution: "Revenue Evolution",
  maintenanceByPriority: "Maintenance by Priority",
  maintenanceByStatus: "Maintenance by Status",
  occupancyTrends: "Occupancy Trends",
  currentOccupancy: "Current Occupancy",
  activeTenants: "Active Tenants",
  totalUnits: "Total Units",
  
  // Analytics translations
  analyticsOverview: "Analytics Overview",
  comprehensiveAnalytics: "Comprehensive analysis of your real estate data",
  
  // Financial Reports translations
  financialReports: "Financial Reports",
  comprehensiveFinancialAnalysis: "Comprehensive financial analysis",
  financialOverviewByProperty: "Financial Overview by Property",
  totalExpenses: "Total Expenses",
  netIncome: "Net Income",
  roi: "ROI on Expenses",
  totalRevenueTooltip: "Sum of all rent payments received from tenants over the selected period.",
  totalExpensesTooltip: "Total amount of maintenance expenses and other costs related to managing your properties.",
  netIncomeTooltip: "Difference between total revenue and total expenses. Indicates the actual profitability of your properties.",
  roiTooltip: "Return on investment calculated as (Net Income / Total Expenses) × 100. Measures the efficiency of your expenses.",
  noPropertiesFound: "No properties found",
  
  // Property Reports translations
  propertyReports: "Property Reports",
  detailedPropertyAnalysis: "Detailed analysis by property",
  propertySummary: "Property Summary",
  property: "Property",
  type: "Type",
  units: "Units",
  occupied: "Occupied",
  occupancy: "Occupancy",
  
  // Tenant Reports translations
  tenantReports: "Tenant Reports",
  detailedTenantAnalysis: "Detailed tenant analysis",
  leaseExpiryAlerts: "Lease Expiry Alerts",
  sendReminder: "Send Reminder",
  noUpcomingLeaseExpiry: "No upcoming lease expiry",
  rentAmount: "Rent Amount",
  unit: "Unit",
  totalPaid: "Total Paid",
  lastPayment: "Last Payment",
  expired: "Expired",
  payments: "payments",
  unread: "unread",
  daysRemaining: "days remaining",
  
  // Performance Metrics translations
  performanceMetrics: "Performance Metrics",
  keyPerformanceIndicators: "Key Performance Indicators",
  paymentRate: "Payment Rate",
  maintenanceEfficiency: "Maintenance Efficiency",
  target: "Target",
  ofTarget: "of target",
  occupancyBreakdown: "Occupancy Breakdown",
  occupiedUnits: "Occupied Units",
  vacantUnits: "Vacant Units",
  financialPerformance: "Financial Performance",
  averageRent: "Average Rent",
  onTimePayments: "On-time Payments",
  latePayments: "Late Payments",
  
  // Export Options translations
  exportExcel: "Export Excel",
  exportPDF: "Export PDF",
  shareByEmail: "Share by Email",
  shareReport: "Share Report",
  recipientEmail: "Recipient Email",
  
  // Property types translations
  apartment: "Apartment",
  house: "House",
  condo: "Condo",
  propertyOffice: "Office",
  commercialspace: "Commercial Space",
  
  // Financial Overview translations
  financialOverview: "Financial Overview",
  income: "Income",
  expenses: "Expenses",
  noIncomeData: "No income data available",
  noExpenseData: "No expense data available",
  
  // Property Selector translations
  noPropertiesAvailable: "No properties available",
  selectProperty: "Select property",
  
  // Table columns
  date: "Date",
  tenant: "Tenant",
  unitNumber: "Unit Number",
  amount: "Amount",
  status: "Status",
  category: "Category",
  description: "Description",
  
  // Supabase Logs translations
  supabaseLogs: "Supabase Logs",
  edgeFunctionsLogs: "Edge Functions Logs",
  authLogs: "Authentication Logs",
  databaseLogs: "Database Logs",
  noLogsAvailable: "No logs available",
  metadata: "Metadata",
  
  // Priority translations
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  low: "Low",
  
  // Status translations
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  paid: "Paid",
  overdue: "Overdue",
  
  // Metrics translations
  occupancyRateDescription: "Current year",
  yearToDate: "Year to date",
  totalRentPaid: "Total Rent Paid",
};
