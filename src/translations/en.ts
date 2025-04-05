
import { DocumentGeneratorTranslations } from "./types/documents";
import { enUS as enUSCore } from "@mui/material/locale";
import { en as enCommon } from "./common";
import { en as enErrors } from "./errors";
import { en as enPages } from "./pages";
import { en as enComponents } from "./components";
import { en as enOnboarding } from "./onboarding";
import { en as enMaintenance } from "./maintenance";
import { en as enTenants } from "./tenants";
import { en as enProperties } from "./properties";
import { en as enVendors } from "./vendors";
import { en as enFinances } from "./finances";
// Import document translations
import enDocumentGenerator from "./features/documents/en";

export const en = {
  core: enUSCore,
  common: enCommon,
  errors: enErrors,
  pages: enPages,
  components: enComponents,
  onboarding: enOnboarding,
  maintenance: enMaintenance,
  tenants: enTenants,
  properties: enProperties,
  vendors: enVendors,
  finances: enFinances,
  documentGenerator: enDocumentGenerator,
} as const;
