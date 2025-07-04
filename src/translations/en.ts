
// Main English translations file - now using modular approach
import { enCommon } from './features/common';
import { enLanding } from './features/landing';
import { enProperties } from './features/properties';
import { enDashboard } from './features/dashboard';
import { enDocuments } from './features/documents';
import { enAuth } from './features/auth';
import { enFinances } from './features/finances';
import { enMaintenance } from './features/maintenance';
import { enTenant } from './features/tenant';

// Maintenance-specific translations that aren't in the module yet
const maintenanceExtensions = {
  maintenanceRequests: "Maintenance Requests",
  newMaintenanceRequest: "New Maintenance Request",
  totalRequests: "Total Requests",
  pendingRequests: "Pending Requests",
  resolvedRequests: "Resolved Requests",
  noMaintenanceRequestsFound: "No maintenance requests found",
  createNewRequestToSee: "Create a new maintenance request to see it here.",
  deleteMaintenanceRequest: "Delete Maintenance Request",
  maintenanceRequestTitlePlaceholder: "e.g., Water leak in bathroom",
  maintenanceDescriptionPlaceholder: "Describe the maintenance issue in detail...",
  submitRequest: "Submit Request",
  updateRequest: "Update Request",
  editMaintenanceRequest: "Edit Maintenance Request",
  selectPriority: "Select priority",
  selectStatus: "Select status",
  maintenanceRequestSubmitted: "Maintenance request submitted successfully",
  maintenanceRequestUpdated: "Maintenance request updated successfully",
  errorSubmittingRequest: "Error submitting maintenance request",
  errorUpdatingRequest: "Error updating maintenance request",
  maintenanceTitle: "Maintenance",
  manageMaintenanceRequests: "Manage and track your maintenance requests",
  authenticationRequired: "Authentication Required",
  pleaseSignIn: "Please sign in to continue",
  accessDenied: "Access Denied",
  tenantsOnly: "This page is for tenants only",
  loadingMaintenanceInfo: "Loading maintenance information...",
  notLinkedToTenant: "You are not linked to a tenant profile",
  pleaseSelectPriority: "Please select a priority",
  pleaseSelectStatus: "Please select a status",
  pleaseProvideDescription: "Please provide a description",
  
  // Task types for maintenance
  plumbing: "Plumbing",
  electrical: "Electrical", 
  hvac: "HVAC",
  appliance: "Appliance",
  structural: "Structural",
  painting: "Painting",
  flooring: "Flooring",
  cleaning: "Cleaning",
  landscaping: "Landscaping",
  securityMaintenance: "Security",
  other: "Other",
  general: "General",
  inspection: "Inspection",
  preventive: "Preventive",
  regularTask: "Regular Task",
  seasonalTask: "Seasonal Task",
  maintenanceTask: "Maintenance Task",
};

// Tenant-specific extensions
const tenantExtensions = {
  // Dashboard
  welcomeTenant: "Welcome, {name}",
  welcomeGeneric: "Welcome to your dashboard",
  manageApartmentInfo: "Manage your apartment information and communications",
  
  // Lease information
  lease: {
    start: "Lease Start",
    end: "Lease End"
  },
  leaseStatus: "Lease Status",
  leaseStatusActive: "Active Lease",
  leaseStatusExpiringDays: "Expires in {days} days",
  leaseStatusExpired: "Expired {days} days ago",
  leaseActive: "Active Lease",
  leaseExpiring: "Lease Expiring",
  leaseExpired: "Lease Expired",
  leaseStart: "Lease Start",
  leaseEnd: "Lease End",
  daysLeft: "{days} days left",
  daysAgo: "{days} days ago",
  daysRemaining: "Days Remaining",
  
  // Communications
  communications: "Communications",
  noCommunications: "No communications",
  allMessages: "All Messages",
  newMessage: "New Message",
  sentByYou: "Sent by you",
  andMoreMessages: "and {count} more messages",
  
  // Payments
  payments: "Payments",
  payment: "Payment",
  paymentHistory: "Payment History",
  noPaymentHistory: "No payment history available",
  paid: "Paid",
  overdue: "Overdue",
  
  // Property info
  unitLabel: "Unit",
  unit: "Unit",
  rentAmountLabel: "Rent Amount",
  
  // Direct messaging
  messageCantBeEmpty: "Message cannot be empty",
  maintenanceIssue: "Maintenance Issue",
  messageSent: "Message sent successfully",
  errorSendingMessage: "Error sending message",
  directMessaging: "Direct Messaging",
  noMessages: "No messages yet",
  fromProperty: "From Property",
  typeYourMessage: "Type your message here...",
  
  // Tenant identification
  tenant: "Tenant",
  
  // Additional tenant feedback
  rating: "Rating",
  comments: "Comments",
  feedbackPlaceholder: "Please share your feedback about the maintenance work...",
};

// Financial translations
const financialExtensions = {
  revenueAndExpenses: "Revenue and Expenses",
  monthly: "Monthly",
  yearly: "Yearly",
  dataBeingRefreshed: "Data is being refreshed",
  errorLoadingData: "Error loading data",
  profit: "Profit",
  
  // Financial page specific
  selectProperty: "Select Property",
  selectYear: "Select Year",
  noPropertySelected: "No property selected",
  pleaseSelectProperty: "Please select a property to view financial data",
  financialMetrics: "Financial Metrics",
  incomeVsExpenses: "Income vs Expenses",
  monthlyBreakdown: "Monthly Breakdown",
  yearlyBreakdown: "Yearly Breakdown",
  totalRevenue: "Total Revenue",
  totalCosts: "Total Costs",
  netProfit: "Net Profit",
  profitMargin: "Profit Margin",
  averageMonthlyIncome: "Average Monthly Income",
  averageMonthlyExpenses: "Average Monthly Expenses",
  financialTrends: "Financial Trends",
  incomeGrowth: "Income Growth",
  expenseGrowth: "Expense Growth",
  cashFlow: "Cash Flow",
  positiveFlow: "Positive Flow",
  negativeFlow: "Negative Flow",
  breakEvenPoint: "Break-even Point",
  returnOnInvestment: "Return on Investment",
  
  // Chart months
  jan: "Jan", feb: "Feb", mar: "Mar", apr: "Apr", may: "May", jun: "Jun",
  jul: "Jul", aug: "Aug", sep: "Sep", oct: "Oct", nov: "Nov", dec: "Dec",
  
  // Financial filters
  filterByProperty: "Filter by Property",
  filterByYear: "Filter by Year",
  showAll: "Show All",
  thisYearData: "This Year Data",
  lastYearData: "Last Year Data",
  compareWithPrevious: "Compare with Previous Year",
  
  // Financial terms
  income: "Income",
  rental: "Rental",
  utilities: "Utilities",
  insurance: "Insurance",
  taxes: "Taxes",
  repairs: "Repairs",
  vacancy: "Vacancy",
  propertyValue: "Property Value",
  appreciation: "Appreciation",
  depreciation: "Depreciation",
  yearToDate: "Year to Date",
  roi: "ROI",
  annualReturn: "Annual Return",
  totalRentPaid: "Total Rent Paid",
  paymentEvolution: "Payment Evolution",
  cumulativeTotal: "Cumulative Total",
  late: "Late",
};

// Support
const supportExtensions = {
  getSupport: "Get Support",
};

// Compose all translations
const translations = {
  ...enCommon,
  ...enLanding,
  ...enProperties,
  ...enDashboard,
  ...enDocuments,
  ...enAuth,
  ...enFinances,
  ...enMaintenance,
  ...enTenant,
  ...maintenanceExtensions,
  ...tenantExtensions,
  ...financialExtensions,
  ...supportExtensions,
  
  // Missing translations that need to be added to proper modules later
  noMaintenanceIssues: "No maintenance issues",
  allGood: "All Good",
};

export default translations;
