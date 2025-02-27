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
  ...enCommon,
  clickForDetails: "Click for details",
  comparedToPreviousMonth: "Compared to previous month",
  totalRequestsDesc: "The total number of maintenance requests across all properties",
  pendingRequestsDesc: "The number of maintenance requests awaiting attention",
  resolvedRequestsDesc: "The number of maintenance requests successfully completed"
};

export const frMaintenance = {
  ...frVendors,
  ...frInterventions,
  ...frTasks,
  ...frRequests,
  ...frCommon,
  clickForDetails: "Cliquer pour détails",
  comparedToPreviousMonth: "Par rapport au mois précédent",
  totalRequestsDesc: "Le nombre total de demandes de maintenance pour toutes les propriétés",
  pendingRequestsDesc: "Le nombre de demandes de maintenance en attente d'attention",
  resolvedRequestsDesc: "Le nombre de demandes de maintenance terminées avec succès"
};
