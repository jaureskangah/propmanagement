
export const getDefaultImageByType = (type: string) => {
  switch (type.toLowerCase()) {
    case 'apartment':
      return "https://images.unsplash.com/photo-1721322800607-8c38375eef04";
    case 'house':
      return "https://images.unsplash.com/photo-1501854140801-50d01698950b";
    case 'studio':
      return "https://images.unsplash.com/photo-1721322800607-8c38375eef04";
    case 'condo':
      return "https://images.unsplash.com/photo-1721322800607-8c38375eef04";
    case 'office':
      return "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7";
    case 'commercial space':
      return "https://images.unsplash.com/photo-1473091534298-04dcbce3278c";
    default:
      return "https://images.unsplash.com/photo-1506744038136-46273834b3fb";
  }
};

export const getGradientByType = (type: string) => {
  switch (type.toLowerCase()) {
    case 'apartment':
      return "from-blue-500/10 to-blue-600/10";
    case 'house':
      return "from-green-500/10 to-green-600/10";
    case 'studio':
      return "from-purple-500/10 to-purple-600/10";
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
    case 'studio':
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
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
