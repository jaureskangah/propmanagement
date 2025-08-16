// Provinces et territoires du Canada avec traductions
export const CANADIAN_PROVINCES = [
  { code: 'AB', name: 'Alberta', nameFr: 'Alberta' },
  { code: 'BC', name: 'British Columbia', nameFr: 'Colombie-Britannique' },
  { code: 'MB', name: 'Manitoba', nameFr: 'Manitoba' },
  { code: 'NB', name: 'New Brunswick', nameFr: 'Nouveau-Brunswick' },
  { code: 'NL', name: 'Newfoundland and Labrador', nameFr: 'Terre-Neuve-et-Labrador' },
  { code: 'NT', name: 'Northwest Territories', nameFr: 'Territoires du Nord-Ouest' },
  { code: 'NS', name: 'Nova Scotia', nameFr: 'Nouvelle-Écosse' },
  { code: 'NU', name: 'Nunavut', nameFr: 'Nunavut' },
  { code: 'ON', name: 'Ontario', nameFr: 'Ontario' },
  { code: 'PE', name: 'Prince Edward Island', nameFr: 'Île-du-Prince-Édouard' },
  { code: 'QC', name: 'Quebec', nameFr: 'Québec' },
  { code: 'SK', name: 'Saskatchewan', nameFr: 'Saskatchewan' },
  { code: 'YT', name: 'Yukon', nameFr: 'Yukon' }
] as const;

export type ProvinceCode = typeof CANADIAN_PROVINCES[number]['code'];

// Validation du code postal canadien
export const validateCanadianPostalCode = (postalCode: string): boolean => {
  // Format canadien : A1A 1A1
  const postalCodeRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
  return postalCodeRegex.test(postalCode.trim());
};

// Format du code postal canadien
export const formatCanadianPostalCode = (postalCode: string): string => {
  const cleaned = postalCode.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  if (cleaned.length === 6) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  }
  return postalCode;
};