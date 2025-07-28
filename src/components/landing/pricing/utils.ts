
export const formatPrice = (price: string | number) => {
  return price === "0" ? "Gratuit" : `${price}$ CAD`;
};
