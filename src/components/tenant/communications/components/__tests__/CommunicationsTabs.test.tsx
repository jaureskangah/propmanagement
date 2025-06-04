
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CommunicationsTabs } from '../CommunicationsTabs';
import { Communication } from '@/types/tenant';

// Mock child components
jest.mock('../CommunicationsTab', () => ({
  CommunicationsTab: ({ displayedCommunications }: any) => (
    <div data-testid="communications-tab">Communications Tab: {displayedCommunications.length}</div>
  )
}));

jest.mock('../../CommunicationFilters', () => ({
  CommunicationFilters: ({ searchQuery, selectedType, startDate }: any) => (
    <div data-testid="communication-filters">
      Filters: search={searchQuery}, type={selectedType || 'none'}, date={startDate}
    </div>
  )
}));

// Mock useLocale hook
jest.mock('@/components/providers/LocaleProvider', () => ({
  useLocale: () => ({
    t: (key: string) => key === 'allMessages' ? 'All Messages' : 
                       key === 'urgent' ? 'Urgent' : 
                       key === 'unread' ? 'Unread' : key,
  }),
}));

describe('CommunicationsTabs', () => {
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
    }
  ];

  const mockProps = {
    communications: mockCommunications,
    activeTab: 'all',
    setActiveTab: jest.fn(),
    searchTerm: '',
    setSearchTerm: jest.fn(),
    selectedType: null,
    setSelectedType: jest.fn(),
    selectedDate: '',
    setSelectedDate: jest.fn(),
    sortOrder: "newest" as const,
    setSortOrder: jest.fn(),
    unreadCount: 1,
    urgentCount: 1,
    showAll: false,
    toggleShowAll: jest.fn(),
    filteredCommunications: mockCommunications,
    displayedCommunications: mockCommunications,
    displayedGroupedCommunications: {},
    initialDisplayCount: 5,
    onCommunicationSelect: jest.fn(),
    onToggleStatus: jest.fn(),
    onDeleteCommunication: jest.fn()
  };

  it('renders tab triggers with correct counts', () => {
    render(<CommunicationsTabs {...mockProps} />);
    
    expect(screen.getByText('All Messages')).toBeInTheDocument();
    expect(screen.getByText('Urgent')).toBeInTheDocument();
    expect(screen.getByText('Unread')).toBeInTheDocument();
    
    // Check badge counts
    expect(screen.getByText('2')).toBeInTheDocument(); // Total communication count
    expect(screen.getAllByText('1').length).toBe(2); // Unread and urgent counts
  });

  it('renders CommunicationFilters with correct props', () => {
    render(<CommunicationsTabs {...mockProps} />);
    
    const filters = screen.getByTestId('communication-filters');
    expect(filters).toBeInTheDocument();
    expect(filters).toHaveTextContent('Filters: search=, type=none, date=');
  });

  it('renders CommunicationsTab for each tab content', () => {
    render(<CommunicationsTabs {...mockProps} />);
    
    // All tabs should be rendered, but only the active one should be visible
    const tabsContent = screen.getAllByTestId('communications-tab');
    expect(tabsContent.length).toBe(3); // Three tabs: all, urgent, unread
  });

  it('calls setActiveTab when a tab is clicked', () => {
    render(<CommunicationsTabs {...mockProps} />);
    
    // Click on Urgent tab
    fireEvent.click(screen.getByText('Urgent'));
    expect(mockProps.setActiveTab).toHaveBeenCalledWith('urgent');
    
    // Click on Unread tab
    fireEvent.click(screen.getByText('Unread'));
    expect(mockProps.setActiveTab).toHaveBeenCalledWith('unread');
  });
});
