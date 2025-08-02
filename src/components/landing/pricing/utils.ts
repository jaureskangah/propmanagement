
export const formatPrice = (price: string | number, t: (key: string) => string) => {
  return price === "0" ? t('free') : `${price}$ CAD`;
};
