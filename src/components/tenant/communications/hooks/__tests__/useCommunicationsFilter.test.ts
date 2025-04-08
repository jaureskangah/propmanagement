
import { renderHook, act } from '@testing-library/react';
import { useCommunicationsFilter } from '../useCommunicationsFilter';
import { Communication } from '@/types/tenant';

describe('useCommunicationsFilter', () => {
  const mockCommunications: Communication[] = [
    {
      id: '1',
      type: 'message',
      subject: 'Test Subject 1',
      content: 'Test Content 1',
      created_at: '2023-01-01',
      status: 'unread',
      category: 'general',
      tenant_id: '123'
    },
    {
      id: '2',
      type: 'email',
      subject: 'Test Subject 2',
      content: 'Test Content 2',
      created_at: '2023-01-02',
      status: 'read',
      category: 'urgent',
      tenant_id: '123'
    },
    {
      id: '3',
      type: 'notification',
      subject: 'Test Subject 3',
      content: 'Test Content 3',
      created_at: '2023-01-03',
      status: 'unread',
      category: 'maintenance',
      tenant_id: '123'
    }
  ];

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useCommunicationsFilter(mockCommunications));
    
    expect(result.current.activeTab).toBe('all');
    expect(result.current.searchTerm).toBe('');
    expect(result.current.selectedType).toBeNull();
    expect(result.current.selectedDate).toBe('');
    expect(result.current.showAll).toBe(false);
    expect(result.current.INITIAL_DISPLAY_COUNT).toBe(5);
  });

  it('should filter communications by tab', () => {
    const { result } = renderHook(() => useCommunicationsFilter(mockCommunications));
    
    // Initially showing all communications
    expect(result.current.filteredCommunications.length).toBe(3);
    
    // Switch to unread tab
    act(() => {
      result.current.setActiveTab('unread');
    });
    
    expect(result.current.activeTab).toBe('unread');
    expect(result.current.filteredCommunications.length).toBe(2);
    expect(result.current.filteredCommunications[0].id).toBe('1');
    expect(result.current.filteredCommunications[1].id).toBe('3');
    
    // Switch to urgent tab
    act(() => {
      result.current.setActiveTab('urgent');
    });
    
    expect(result.current.activeTab).toBe('urgent');
    expect(result.current.filteredCommunications.length).toBe(1);
    expect(result.current.filteredCommunications[0].id).toBe('2');
  });

  it('should filter communications by search term', () => {
    const { result } = renderHook(() => useCommunicationsFilter(mockCommunications));
    
    act(() => {
      result.current.setSearchTerm('Subject 2');
    });
    
    expect(result.current.searchTerm).toBe('Subject 2');
    expect(result.current.filteredCommunications.length).toBe(1);
    expect(result.current.filteredCommunications[0].id).toBe('2');
  });

  it('should filter communications by type', () => {
    const { result } = renderHook(() => useCommunicationsFilter(mockCommunications));
    
    act(() => {
      result.current.setSelectedType('maintenance');
    });
    
    expect(result.current.selectedType).toBe('maintenance');
    expect(result.current.filteredCommunications.length).toBe(1);
    expect(result.current.filteredCommunications[0].id).toBe('3');
  });

  it('should toggle show all state', () => {
    const { result } = renderHook(() => useCommunicationsFilter(mockCommunications));
    
    expect(result.current.showAll).toBe(false);
    expect(result.current.displayedCommunications.length).toBe(3); // All communications shown because total is less than limit
    
    act(() => {
      result.current.toggleShowAll();
    });
    
    expect(result.current.showAll).toBe(true);
  });

  it('should reset filters when active tab changes', () => {
    const { result } = renderHook(() => useCommunicationsFilter(mockCommunications));
    
    // Set some filters
    act(() => {
      result.current.setSearchTerm('Test');
      result.current.setSelectedType('message');
      result.current.setSelectedDate('2023-01-01');
      result.current.setShowAll(true);
    });
    
    expect(result.current.searchTerm).toBe('Test');
    expect(result.current.selectedType).toBe('message');
    expect(result.current.selectedDate).toBe('2023-01-01');
    expect(result.current.showAll).toBe(true);
    
    // Change active tab, which should reset filters
    act(() => {
      result.current.setActiveTab('urgent');
    });
    
    expect(result.current.searchTerm).toBe('');
    expect(result.current.selectedType).toBeNull();
    expect(result.current.selectedDate).toBe('');
    expect(result.current.showAll).toBe(false);
  });

  it('should calculate unread and urgent counts correctly', () => {
    const { result } = renderHook(() => useCommunicationsFilter(mockCommunications));
    
    expect(result.current.unreadCount).toBe(2);
    expect(result.current.urgentCount).toBe(1);
  });
});
