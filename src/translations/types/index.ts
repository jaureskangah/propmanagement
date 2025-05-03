import { ToastTranslations } from "./toasts";
import { ErrorTranslations } from "./errors";

export type Language = "en" | "fr";
export type UnitSystem = "metric" | "imperial";

export interface Translations {
  [key: string]: any;
  toasts: ToastTranslations;
  errors: ErrorTranslations;
}
