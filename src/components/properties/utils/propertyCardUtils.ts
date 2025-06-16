
export const getDefaultImageByType = (type: string) => {
  switch (type.toLowerCase()) {
    case 'apartment':
      return "/lovable-uploads/764448a6-e7d4-4afc-8852-1e793ef87ecc.png";
    case 'house':
      return "/lovable-uploads/77cac7d4-5f08-42af-ab6d-3ba3d66765eb.png";
    case 'condo':
      return "/lovable-uploads/5098a03c-679f-48e7-b2f2-b88766bb39ff.png";
    case 'office':
      return "/lovable-uploads/d934ba77-1c85-4e81-8f69-a88d38328ea8.png";
    case 'commercial space':
      return "/lovable-uploads/a9cccba1-6d24-4f71-a555-8b8e3d8a02cd.png";
    default:
      return "/lovable-uploads/764448a6-e7d4-4afc-8852-1e793ef87ecc.png";
  }
};

export const getGradientByType = (type: string) => {
  switch (type.toLowerCase()) {
    case 'apartment':
      return "from-blue-500/10 to-blue-600/10";
    case 'house':
      return "from-green-500/10 to-green-600/10";
    case 'condo':
      return "from-indigo-500/10 to-indigo-600/10";
    case 'office':
      return "from-amber-500/10 to-amber-600/10";
    case 'commercial space':
      return "from-pink-500/10 to-red-600/10";
    default:
      return "from-slate-500/10 to-slate-600/10";
  }
};

export const getBadgeColorByType = (type: string) => {
  switch (type.toLowerCase()) {
    case 'apartment':
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case 'house':
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case 'condo':
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300";
    case 'office':
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
    case 'commercial space':
      return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300";
    default:
      return "";
  }
};

export const getOccupancyColor = (rate?: number) => {
  if (rate === undefined) return "text-slate-500";
  if (rate >= 80) return "text-green-600 dark:text-green-400";
  if (rate >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
};
