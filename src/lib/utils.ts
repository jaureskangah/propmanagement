
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatRelative, isToday, isYesterday } from "date-fns";
import { fr, enUS } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, localeCode: string = 'en') {
  const dateObj = new Date(date);
  return format(dateObj, "d MMMM yyyy", {
    locale: localeCode === 'fr' ? fr : enUS
  });
}

export function formatDateTime(date: string | Date, localeCode: string = 'en') {
  const dateObj = new Date(date);
  return format(dateObj, "d MMM yyyy, HH:mm", {
    locale: localeCode === 'fr' ? fr : enUS
  });
}

export function formatRelativeDate(date: string | Date, localeCode: string = 'en') {
  const dateObj = new Date(date);
  const locale = localeCode === 'fr' ? fr : enUS;
  
  if (isToday(dateObj)) {
    return localeCode === 'fr' ? "Aujourd'hui" : "Today";
  }
  
  if (isYesterday(dateObj)) {
    return localeCode === 'fr' ? "Hier" : "Yesterday";
  }
  
  return formatRelative(dateObj, new Date(), { locale });
}

export function formatCurrency(amount: number | string): string {
  // Convertir le montant en nombre si c'est une chaîne
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Utiliser l'API Intl.NumberFormat pour formater le montant en dollars canadiens
  return new Intl.NumberFormat('en-CA', { 
    style: 'currency', 
    currency: 'CAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numericAmount);
}
