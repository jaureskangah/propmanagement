
import { renderHook } from '@testing-library/react-hooks';
import { 
  useTenantActivities, 
  usePaymentActivities, 
  useMaintenanceActivities 
} from '../useActivityData';
import { mockTenants, mockPayments, mockMaintenance } from './testSetup';

// Mock Supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockImplementation(() => ({
      data: null,
      error: null
    }))
  }
}));

// Mock react-query
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn().mockImplementation(({ queryKey, queryFn }) => {
    let data = [];
    
    if (queryKey[0] === 'recent_tenants') {
      data = mockTenants;
    } else if (queryKey[0] === 'recent_payments') {
      data = mockPayments;
    } else if (queryKey[0] === 'recent_maintenance') {
      data = mockMaintenance;
    }
    
    return {
      data,
      isLoading: false,
      isError: false,
      error: null
    };
  })
}));

describe('useActivityData hooks', () => {
  it('should fetch tenant activities', () => {
    const { result } = renderHook(() => useTenantActivities());
    
    expect(result.current.data).toEqual(mockTenants);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });
  
  it('should fetch payment activities', () => {
    const { result } = renderHook(() => usePaymentActivities());
    
    expect(result.current.data).toEqual(mockPayments);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });
  
  it('should fetch maintenance activities', () => {
    const { result } = renderHook(() => useMaintenanceActivities());
    
    expect(result.current.data).toEqual(mockMaintenance);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });
});
