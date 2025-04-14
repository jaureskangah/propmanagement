
/**
 * Vérifie si un objet est une instance de Date ou une représentation valide de date
 */
export const isValidDate = (value: any): boolean => {
  if (!value) return false;
  
  // Si c'est déjà un objet Date
  if (Object.prototype.toString.call(value) === "[object Date]") {
    return !isNaN(value.getTime());
  }
  
  // Si c'est une chaîne, essayons de la convertir
  if (typeof value === 'string') {
    const date = new Date(value);
    return !isNaN(date.getTime());
  }
  
  return false;
};

/**
 * Convertit une valeur en objet Date si possible
 */
export const toDate = (value: any): Date | null => {
  if (!value) return null;
  
  // Si c'est déjà un objet Date
  if (Object.prototype.toString.call(value) === "[object Date]") {
    return !isNaN(value.getTime()) ? value : null;
  }
  
  // Si c'est une chaîne, essayons de la convertir
  if (typeof value === 'string') {
    const date = new Date(value);
    return !isNaN(date.getTime()) ? date : null;
  }
  
  return null;
};
