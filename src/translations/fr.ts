
import { Translations } from './types';
import { frNavigation } from './features/navigation';
import { frHero } from './features/hero';
import { frFeatures } from './features/features';
import { frPricing } from './features/pricing';
import { frToasts } from './features/toasts';
import { frContact } from './features/contact';
import { frAuth } from './features/auth';
import { frCTA } from './features/cta';
import { frFAQ } from './features/faq';
import { frAdmin } from './features/admin';
import { frStatus } from './features/status';
import { frProperty } from './features/property';
import { frMaintenance } from './features/maintenance';
import { frTenant } from './features/tenant';
import { frHowItWorks } from './features/how-it-works';
import { frFooter } from './features/footer';

export const frTranslations: Translations = {
  ...frNavigation,
  ...frHero,
  ...frFeatures,
  ...frPricing,
  ...frToasts,
  ...frContact,
  ...frAuth,
  ...frCTA,
  ...frFAQ,
  ...frAdmin,
  ...frStatus,
  ...frProperty,
  ...frMaintenance,
  ...frTenant,
  ...frHowItWorks,
  ...frFooter,
  // Add missing maintenance translations
  maintenanceRequestTitle: "Demande de Maintenance",
  maintenanceCalendar: "Calendrier de Maintenance",
  preventiveMaintenance: "Maintenance Préventive",
  workOrders: "Ordres de Travail",
  costs: "Coûts",
  vendors: "Fournisseurs",
  regularTask: "Tâche Régulière",
  inspection: "Inspection",
  seasonalTask: "Tâche Saisonnière",
  taskTitle: "Titre de la Tâche",
  deadline: "Date Limite",
  taskType: "Type de Tâche",
  selectType: "Sélectionner le Type",
  addNewTask: "Ajouter une Nouvelle Tâche",
  // Add missing priority translations
  priorityLow: "Priorité Basse",
  priorityMedium: "Priorité Moyenne",
  priorityHigh: "Priorité Haute",
  priorityUrgent: "Priorité Urgente",
  // Add missing status translations
  statusCompleted: "Terminé",
  statusPending: "En Attente",
  statusInProgress: "En Cours",
  // Add missing maintenance fields
  maintenanceTitle: "Titre de la Demande de Maintenance",
  maintenanceDescription: "Description",
  maintenancePrioritySelect: "Sélectionner la Priorité",
  maintenancePhotos: "Ajouter des Photos",
  photosSelected: "Photos Sélectionnées",
  submit: "Soumettre",
  submitting: "Soumission en cours...",
  delete: "Supprimer",
  edit: "Modifier",
  confirmDelete: "Confirmer la Suppression",
  deleteWarning: "Êtes-vous sûr de vouloir supprimer cet élément ?",
  createdOn: "Créé le",
  confirmSubmit: "Confirmer la Soumission",
  confirmEdit: "Confirmer la Modification",
  uploadPhotos: "Télécharger des Photos",
  dropPhotos: "Déposer les photos ici",
  maintenanceType: "Type de Maintenance",
  requiredField: "Ce champ est requis",
  requestSaved: "Demande enregistrée avec succès",
  requestDeleted: "Demande supprimée avec succès",
  requestUpdated: "Demande mise à jour avec succès",
  areYouSure: "Êtes-vous sûr ?",
  viewPhotos: "Voir les Photos",
  closePhotos: "Fermer les Photos",
  emergency: "Urgence",
  routine: "Routine",
  cosmetic: "Cosmétique",
  viewHistory: "Voir l'Historique",
  addNote: "Ajouter une Note",
  saveNote: "Enregistrer la Note",
  noteSaved: "Note enregistrée avec succès",
  scheduledTasks: "Tâches Programmées",
  addTask: "Ajouter une Tâche",
  noMaintenanceRequests: "Aucune demande de maintenance trouvée"
};
