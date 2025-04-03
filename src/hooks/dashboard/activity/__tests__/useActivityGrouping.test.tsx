
import { renderHook } from '@testing-library/react-hooks';
import { useActivityGrouping } from '../useActivityGrouping';
import { mockActivities, mockActivitiesForDates } from './testSetup';
import * as dateFns from 'date-fns';

// Mock the locale provider
jest.mock('@/components/providers/LocaleProvider', () => ({
  useLocale: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        today: 'Today',
        yesterday: 'Yesterday',
        thisWeek: 'This Week'
      };
      return translations[key] || key;
    },
    language: 'en'
  })
}));

// Mock date-fns isToday, isYesterday, isSameWeek functions
jest.mock('date-fns', () => {
  const actual = jest.requireActual('date-fns');
  return {
    ...actual,
    isToday: jest.fn(),
    isYesterday: jest.fn(),
    isSameWeek: jest.fn()
  };
});

describe('useActivityGrouping', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Default behavior: only the "maintenance-1" activity is today
    (dateFns.isToday as jest.Mock).mockImplementation((date) => {
      return mockActivitiesForDates.today.some(a => 
        new Date(a.created_at).getTime() === new Date(date).getTime()
      );
    });
    
    (dateFns.isYesterday as jest.Mock).mockReturnValue(false);
    (dateFns.isSameWeek as jest.Mock).mockReturnValue(false);
  });
  
  it('should group activities by period', () => {
    const { result } = renderHook(() => useActivityGrouping(mockActivities));
    
    const grouped = result.current;
    
    // Check that we have groups
    expect(Object.keys(grouped).length).toBeGreaterThan(0);
  });
  
  it('should group today\'s activities under "Today"', () => {
    (dateFns.isToday as jest.Mock).mockReturnValue(true);
    
    const { result } = renderHook(() => useActivityGrouping(mockActivities));
    
    // All activities should be under "Today"
    expect(result.current['Today']).toHaveLength(mockActivities.length);
  });
  
  it('should group yesterday\'s activities under "Yesterday"', () => {
    (dateFns.isToday as jest.Mock).mockReturnValue(false);
    (dateFns.isYesterday as jest.Mock).mockReturnValue(true);
    
    const { result } = renderHook(() => useActivityGrouping(mockActivities));
    
    // All activities should be under "Yesterday"
    expect(result.current['Yesterday']).toHaveLength(mockActivities.length);
  });
  
  it('should group this week\'s activities under "This Week"', () => {
    (dateFns.isToday as jest.Mock).mockReturnValue(false);
    (dateFns.isYesterday as jest.Mock).mockReturnValue(false);
    (dateFns.isSameWeek as jest.Mock).mockReturnValue(true);
    
    const { result } = renderHook(() => useActivityGrouping(mockActivities));
    
    // All activities should be under "This Week"
    expect(result.current['This Week']).toHaveLength(mockActivities.length);
  });
  
  it('should group older activities by month and year', () => {
    // All date checks return false to force month/year grouping
    (dateFns.isToday as jest.Mock).mockReturnValue(false);
    (dateFns.isYesterday as jest.Mock).mockReturnValue(false);
    (dateFns.isSameWeek as jest.Mock).mockReturnValue(false);
    
    const { result } = renderHook(() => useActivityGrouping(mockActivities));
    
    // Should have groups for different months
    const groupKeys = Object.keys(result.current);
    
    // Since our mock data spans multiple months, we should have multiple groups
    expect(groupKeys.length).toBeGreaterThan(0);
    
    // The total number of activities across all groups should match
    const totalActivities = Object.values(result.current).reduce(
      (sum, activities) => sum + activities.length, 
      0
    );
    expect(totalActivities).toBe(mockActivities.length);
  });
  
  it('should handle empty activities array', () => {
    const { result } = renderHook(() => useActivityGrouping([]));
    
    // Should return an empty object
    expect(result.current).toEqual({});
  });
});
