
export const formatPrice = (price: string | number, language: string = 'en') => {
  // Convert to string first to ensure consistent handling
  const priceStr = String(price);
  
  if (priceStr === "0") {
    return language === 'fr' ? "Gratuit" : "Free";
  }
  
  // For French, replace decimal point with comma
  const formattedPrice = language === 'fr' 
    ? priceStr.replace('.', ',')
    : priceStr;
    
  return `${formattedPrice}$ CAD`;
};
