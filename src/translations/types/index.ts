
import { AdminDashboardTranslations } from './admin';
import { MaintenanceTranslations } from './maintenance';
import { TenantTranslations } from './tenant';
import { PropertyManagementTranslations } from './property';

export interface Translations 
  extends AdminDashboardTranslations, 
    MaintenanceTranslations,
    TenantTranslations,
    PropertyManagementTranslations {
  // Add any global translations here
}

export type { AdminDashboardTranslations } from './admin';
export type { MaintenanceTranslations } from './maintenance';
export type { TenantTranslations } from './tenant';
export type { PropertyManagementTranslations } from './property';
