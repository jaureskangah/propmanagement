
import { enDashboardActivity, frDashboardActivity } from './activity';
import { enDashboardCore, frDashboardCore } from './core';
import { enDashboardDates, frDashboardDates } from './dates';
import { enDashboardStatus, frDashboardStatus } from './status';
import { enDashboardNotifications, frDashboardNotifications } from './notifications';

export const enDashboard = {
  ...enDashboardActivity,
  ...enDashboardCore,
  ...enDashboardDates,
  ...enDashboardStatus,
  ...enDashboardNotifications,
};

export const frDashboard = {
  ...frDashboardActivity,
  ...frDashboardCore,
  ...frDashboardDates,
  ...frDashboardStatus,
  ...frDashboardNotifications,
};
