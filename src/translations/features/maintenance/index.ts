
import { enVendors, frVendors } from './vendors';
import { enInterventions, frInterventions } from './interventions';
import { enTasks, frTasks } from './tasks';
import { enRequests, frRequests } from './requests';
import { enCommon, frCommon } from './common';

export const enMaintenance = {
  ...enVendors,
  ...enInterventions,
  ...enTasks,
  ...enRequests,
  ...enCommon
};

export const frMaintenance = {
  ...frVendors,
  ...frInterventions,
  ...frTasks,
  ...frRequests,
  ...frCommon
};
