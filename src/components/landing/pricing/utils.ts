
export const formatPrice = (price: string | number, language: string = 'en') => {
  if (price === "0") {
    return language === 'fr' ? "Gratuit" : "Free";
  }
  
  const formattedPrice = language === 'fr' 
    ? String(price).replace('.', ',')
    : String(price);
    
  return `${formattedPrice}$ CAD`;
};
