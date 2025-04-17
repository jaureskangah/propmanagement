
import React, { useEffect } from 'react';
import { MaintenancePageContainer } from '@/components/maintenance/MaintenancePageContainer';

const MaintenanceRequestList = () => {
  useEffect(() => {
    console.log("MaintenanceRequestList page mounted");
    // Force scroll to the maintenance section after a short delay
    setTimeout(() => {
      const maintenanceSection = document.getElementById('maintenance-section');
      if (maintenanceSection) {
        maintenanceSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  }, []);

  return (
    <div id="maintenance-section">
      <MaintenancePageContainer />
    </div>
  );
};

export default MaintenanceRequestList;
