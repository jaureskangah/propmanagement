
import { renderHook } from '@testing-library/react-hooks';
import { useTransformedActivities } from '../useActivityTransformers';
import { mockTenants, mockPayments, mockMaintenance } from './testSetup';

// Mock the components used in the transformer
jest.mock('@/components/dashboard/activity/TenantActivity', () => ({
  TenantActivity: () => <div data-testid="tenant-activity">Mocked Tenant Activity</div>
}));

jest.mock('@/components/dashboard/activity/PaymentActivity', () => ({
  PaymentActivity: () => <div data-testid="payment-activity">Mocked Payment Activity</div>
}));

jest.mock('@/components/dashboard/activity/MaintenanceActivity', () => ({
  MaintenanceActivity: () => <div data-testid="maintenance-activity">Mocked Maintenance Activity</div>
}));

describe('useTransformedActivities', () => {
  it('should transform data from different sources into activities array', () => {
    const { result } = renderHook(() => 
      useTransformedActivities(mockTenants, mockPayments, mockMaintenance)
    );
    
    const activities = result.current;
    
    // Check total count
    expect(activities).toHaveLength(4); // 1 tenant + 2 payments + 1 maintenance
    
    // Check that activities are sorted by date (newest first)
    expect(activities[0].type).toBe('maintenance');
    
    // Check that each activity has the required properties
    activities.forEach(activity => {
      expect(activity).toHaveProperty('id');
      expect(activity).toHaveProperty('created_at');
      expect(activity).toHaveProperty('type');
      expect(activity).toHaveProperty('component');
    });
    
    // Verify correct types are present
    const types = activities.map(a => a.type);
    expect(types).toContain('tenant');
    expect(types).toContain('payment');
    expect(types).toContain('maintenance');
    
    // Count by type
    const typeCount = types.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    expect(typeCount.tenant).toBe(1);
    expect(typeCount.payment).toBe(2);
    expect(typeCount.maintenance).toBe(1);
  });
  
  it('should handle empty arrays gracefully', () => {
    const { result } = renderHook(() => 
      useTransformedActivities([], [], [])
    );
    
    expect(result.current).toHaveLength(0);
    expect(result.current).toEqual([]);
  });
  
  it('should handle null or undefined inputs', () => {
    const { result } = renderHook(() => 
      // @ts-ignore - Testing with undefined values
      useTransformedActivities(undefined, null, undefined)
    );
    
    expect(result.current).toHaveLength(0);
    expect(result.current).toEqual([]);
  });
});
