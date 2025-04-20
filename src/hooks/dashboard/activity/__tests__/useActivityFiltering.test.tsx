
import { renderHook, act } from '@testing-library/react-hooks';
import { useActivityFiltering } from '../useActivityFiltering';
import { mockActivities } from './testSetup';

describe('useActivityFiltering', () => {
  it('should initially limit activities to default count', () => {
    const { result } = renderHook(() => useActivityFiltering(mockActivities));
    
    expect(result.current.limitedActivities).toHaveLength(
      Math.min(5, mockActivities.length)
    );
  });
  
  it('should show more activities when requested', () => {
    const { result } = renderHook(() => useActivityFiltering(mockActivities));
    
    const initialVisibleCount = result.current.limitedActivities.length;
    
    act(() => {
      result.current.showMoreActivities();
    });
    
    // Should show more activities (or all if less than page size)
    const expectedCount = Math.min(initialVisibleCount + 5, mockActivities.length);
    expect(result.current.limitedActivities.length).toBe(expectedCount);
  });
  
  it('should correctly report when more activities are available', () => {
    // Create many activities to ensure pagination
    const manyActivities = Array(12).fill(null).map((_, i) => ({
      ...mockActivities[0],
      id: `id-${i}`,
    }));
    
    const { result } = renderHook(() => useActivityFiltering(manyActivities));
    
    // Initially should have more (12 > 5)
    expect(result.current.hasMoreActivities).toBe(true);
    
    // Show more
    act(() => {
      result.current.showMoreActivities();
    });
    
    // After showing 5 more (10 total), should still have more (12 > 10)
    expect(result.current.hasMoreActivities).toBe(true);
    
    // Show more again
    act(() => {
      result.current.showMoreActivities();
    });
    
    // After showing all 12, should not have more
    expect(result.current.hasMoreActivities).toBe(false);
  });
});
