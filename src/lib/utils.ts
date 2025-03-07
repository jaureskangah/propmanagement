
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, localeCode: string = 'fr') {
  const dateObj = new Date(date);
  return format(dateObj, "d MMMM yyyy", {
    locale: localeCode === 'fr' ? fr : undefined
  });
}
