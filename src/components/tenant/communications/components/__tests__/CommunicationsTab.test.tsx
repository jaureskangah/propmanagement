
import * as React from 'react';
import { render } from '@testing-library/react';
import { CommunicationsTab } from '../CommunicationsTab';
import { Communication } from '@/types/tenant';

// Mock child components
jest.mock('../ShowMoreLessButton', () => ({
  ShowMoreLessButton: ({ showAll, toggleShowAll, totalCount, initialDisplayCount }: any) => (
    <div data-testid="show-more-less-button">
      ShowMoreLessButton: {showAll ? 'true' : 'false'}, 
      total: {totalCount}, 
      initial: {initialDisplayCount}
    </div>
  )
}));

jest.mock('../../list/CommunicationsListContainer', () => ({
  CommunicationsListContainer: ({ filteredCommunications, groupedCommunications }: any) => (
    <div data-testid="communications-list-container">
      Communications: {filteredCommunications.length}, 
      Groups: {Object.keys(groupedCommunications).length}
    </div>
  )
}));

describe('CommunicationsTab', () => {
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
      category: 'maintenance',
      tenant_id: '123'
    }
  ];

  const mockGroupedCommunications = {
    message: [mockCommunications[0]],
    email: [mockCommunications[1]]
  };

  const mockProps = {
    displayedCommunications: mockCommunications,
    displayedGroupedCommunications: mockGroupedCommunications,
    filteredCommunications: mockCommunications,
    showAll: false,
    toggleShowAll: jest.fn(),
    initialDisplayCount: 5,
    onCommunicationClick: jest.fn(),
    onToggleStatus: jest.fn(),
    onDeleteCommunication: jest.fn()
  };

  it('renders CommunicationsListContainer with correct props', () => {
    const { getByTestId } = render(<CommunicationsTab {...mockProps} />);
    
    const listContainer = getByTestId('communications-list-container');
    expect(listContainer).toBeInTheDocument();
    expect(listContainer).toHaveTextContent('Communications: 2');
    expect(listContainer).toHaveTextContent('Groups: 2');
  });

  it('renders ShowMoreLessButton with correct props', () => {
    const { getByTestId } = render(<CommunicationsTab {...mockProps} />);
    
    const button = getByTestId('show-more-less-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('ShowMoreLessButton: false');
    expect(button).toHaveTextContent('total: 2');
    expect(button).toHaveTextContent('initial: 5');
  });
});
