
import { ModalCommonTranslations } from './common';
import { ModalFieldsTranslations } from './fields';
import { ModalPlaceholdersTranslations } from './placeholders';
import { ModalValidationTranslations } from './validation';
import { ModalActionsTranslations } from './actions';

export interface ModalTranslations extends 
  ModalCommonTranslations,
  ModalFieldsTranslations,
  ModalPlaceholdersTranslations,
  ModalValidationTranslations,
  ModalActionsTranslations {}

export const enModal: ModalTranslations = {
  // Inclure ici les traductions en anglais pour modal
  // ... au besoin, importer les traductions depuis des fichiers séparés
  // Exemple:
  close: "Close",
  confirm: "Confirm",
  cancel: "Cancel",
  delete: "Delete",
  // ... etc.
};

export const frModal: ModalTranslations = {
  // Inclure ici les traductions en français pour modal
  // ... au besoin, importer les traductions depuis des fichiers séparés
  // Exemple:
  close: "Fermer",
  confirm: "Confirmer",
  cancel: "Annuler",
  delete: "Supprimer",
  // ... etc.
};

export * from './common';
export * from './fields';
export * from './placeholders';
export * from './validation';
export * from './actions';
