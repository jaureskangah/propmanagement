
import { renderHook, act } from '@testing-library/react-hooks';
import { useActivities } from '../../useActivities';
import { mockTenants, mockPayments, mockMaintenance } from './testSetup';

// Mock all child hooks
jest.mock('../useActivityData', () => ({
  useTenantActivities: () => ({
    data: mockTenants,
    isLoading: false
  }),
  usePaymentActivities: () => ({
    data: mockPayments,
    isLoading: false
  }),
  useMaintenanceActivities: () => ({
    data: mockMaintenance,
    isLoading: false
  })
}));

jest.mock('../useActivityTransformers', () => ({
  useTransformedActivities: jest.fn().mockImplementation((tenants, payments, maintenance) => {
    return [
      ...(tenants || []).map(t => ({
        id: t.id,
        type: 'tenant',
        created_at: t.created_at,
        component: <div>Tenant</div>
      })),
      ...(payments || []).map(p => ({
        id: p.id,
        type: 'payment',
        created_at: p.created_at,
        component: <div>Payment</div>
      })),
      ...(maintenance || []).map(m => ({
        id: m.id,
        type: 'maintenance',
        created_at: m.created_at,
        component: <div>Maintenance</div>
      }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  })
}));

const mockFilteredActivities = [
  { id: '1', type: 'tenant', created_at: new Date().toISOString(), component: <div>Activity 1</div> },
  { id: '2', type: 'payment', created_at: new Date().toISOString(), component: <div>Activity 2</div> }
];

jest.mock('../useActivityFiltering', () => ({
  useActivityFiltering: jest.fn().mockImplementation(() => ({
    limitedActivities: mockFilteredActivities,
    activityTypeFilter: 'all',
    setActivityFilter: jest.fn(),
    hasMoreActivities: false,
    showMoreActivities: jest.fn()
  }))
}));

jest.mock('../useActivityGrouping', () => ({
  useActivityGrouping: jest.fn().mockImplementation(() => ({
    'Today': mockFilteredActivities
  }))
}));

describe('useActivities', () => {
  it('should integrate all hooks and return the expected properties', () => {
    const { result } = renderHook(() => useActivities());
    
    // Check that all expected properties exist
    expect(result.current).toHaveProperty('groupedActivities');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('activityTypeFilter');
    expect(result.current).toHaveProperty('setActivityTypeFilter');
    expect(result.current).toHaveProperty('hasMoreActivities');
    expect(result.current).toHaveProperty('showMoreActivities');
    
    // Check that groupedActivities has the expected structure
    expect(result.current.groupedActivities).toHaveProperty('Today');
    expect(result.current.groupedActivities.Today).toEqual(mockFilteredActivities);
    
    // Check loading state
    expect(result.current.isLoading).toBe(false);
  });
});
