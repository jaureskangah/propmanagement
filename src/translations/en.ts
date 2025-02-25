
import { Translations } from './types';
import { enNavigation } from './features/navigation';
import { enHero } from './features/hero';
import { enFeatures } from './features/features';
import { enPricing } from './features/pricing';
import { enToasts } from './features/toasts';
import { enContact } from './features/contact';
import { enAuth } from './features/auth';
import { enCTA } from './features/cta';
import { enFAQ } from './features/faq';
import { enAdmin } from './features/admin';
import { enStatus } from './features/status';
import { enProperty } from './features/property';
import { enMaintenance } from './features/maintenance';
import { enTenant } from './features/tenant';
import { enHowItWorks } from './features/how-it-works';
import { enFooter } from './features/footer';

export const enTranslations: Translations = {
  ...enNavigation,
  ...enHero,
  ...enFeatures,
  ...enPricing,
  ...enToasts,
  ...enContact,
  ...enAuth,
  ...enCTA,
  ...enFAQ,
  ...enAdmin,
  ...enStatus,
  ...enProperty,
  ...enMaintenance,
  ...enTenant,
  ...enHowItWorks,
  ...enFooter,
  // Add missing maintenance translations
  maintenanceRequestTitle: "Maintenance Request",
  maintenanceCalendar: "Maintenance Calendar",
  preventiveMaintenance: "Preventive Maintenance",
  workOrders: "Work Orders",
  costs: "Costs",
  vendors: "Vendors",
  regularTask: "Regular Task",
  inspection: "Inspection",
  seasonalTask: "Seasonal Task",
  taskTitle: "Task Title",
  deadline: "Deadline",
  taskType: "Task Type",
  selectType: "Select Type",
  addNewTask: "Add New Task",
  // Add missing priority translations
  priorityLow: "Low Priority",
  priorityMedium: "Medium Priority",
  priorityHigh: "High Priority",
  priorityUrgent: "Urgent Priority",
  // Add missing status translations
  statusCompleted: "Completed",
  statusPending: "Pending",
  statusInProgress: "In Progress",
  // Add missing maintenance fields
  maintenanceTitle: "Maintenance Request Title",
  maintenanceDescription: "Description",
  maintenancePrioritySelect: "Select Priority",
  maintenancePhotos: "Add Photos",
  photosSelected: "Photos Selected",
  submit: "Submit",
  submitting: "Submitting...",
  delete: "Delete",
  edit: "Edit",
  confirmDelete: "Confirm Delete",
  deleteWarning: "Are you sure you want to delete this item?",
  createdOn: "Created On",
  confirmSubmit: "Confirm Submit",
  confirmEdit: "Confirm Edit",
  uploadPhotos: "Upload Photos",
  dropPhotos: "Drop photos here",
  maintenanceType: "Maintenance Type",
  requiredField: "This field is required",
  requestSaved: "Request saved successfully",
  requestDeleted: "Request deleted successfully",
  requestUpdated: "Request updated successfully",
  areYouSure: "Are you sure?",
  viewPhotos: "View Photos",
  closePhotos: "Close Photos",
  emergency: "Emergency",
  routine: "Routine",
  cosmetic: "Cosmetic",
  viewHistory: "View History",
  addNote: "Add Note",
  saveNote: "Save Note",
  noteSaved: "Note saved successfully",
  scheduledTasks: "Scheduled Tasks",
  addTask: "Add Task",
  noMaintenanceRequests: "No maintenance requests found"
};
