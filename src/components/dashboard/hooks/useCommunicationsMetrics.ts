
export const useCommunicationsMetrics = (tenantsData: any[]) => {
  // Calculate unread messages
  const unreadMessages = tenantsData.reduce((acc, tenant) => {
    const unreadCount = tenant.tenant_communications?.filter(
      (comm: any) => comm.status === 'unread' && comm.is_from_tenant
    ).length || 0;
    return acc + unreadCount;
  }, 0);

  // Generate communications chart data
  const communicationsChartData = Array.from({ length: 7 }, (_, i) => ({
    value: Math.max(0, Math.floor(Math.random() * 5) + (i === 6 ? unreadMessages : 0))
  }));

  return {
    unreadMessages,
    communicationsChartData
  };
};
