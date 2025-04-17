
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AddMaintenanceDialog } from '@/components/tenant/maintenance/AddMaintenanceDialog';
import { useAuth } from '@/components/AuthProvider';

const AddMaintenanceRequest = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <AddMaintenanceDialog
      isOpen={true}
      onClose={() => navigate('/tenant/maintenance')}
      onSuccess={() => navigate('/tenant/maintenance')}
      tenantId={user?.id || ''}
    />
  );
};

export default AddMaintenanceRequest;
