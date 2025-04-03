
import { renderHook } from '@testing-library/react-hooks';
import { useActivityExport, activitiesToCSV } from '../useActivityExport';
import { mockActivities, mockActivitiesForDates } from './testSetup';

// Mock the document methods for testing
global.URL.createObjectURL = jest.fn(() => 'mocked-url');
global.URL.revokeObjectURL = jest.fn();

// Mock document.createElement and click function
document.createElement = jest.fn().mockImplementation((tagName) => {
  if (tagName === 'a') {
    return {
      setAttribute: jest.fn(),
      style: {},
      click: jest.fn(),
    };
  }
  return {};
}) as any;

document.body.appendChild = jest.fn();
document.body.removeChild = jest.fn();

// Mock jsPDF
jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    text: jest.fn(),
    setFontSize: jest.fn(),
    setTextColor: jest.fn(),
    save: jest.fn(),
  }));
});

// Mock autoTable
jest.mock('jspdf-autotable', () => jest.fn());

describe('useActivityExport', () => {
  const groupedMockActivities = {
    today: mockActivitiesForDates.today,
    older: mockActivitiesForDates.older,
  };
  
  it('should provide export functions', () => {
    const { result } = renderHook(() => useActivityExport(groupedMockActivities));
    
    expect(result.current).toHaveProperty('exportToCSV');
    expect(result.current).toHaveProperty('exportToPDF');
    expect(typeof result.current.exportToCSV).toBe('function');
    expect(typeof result.current.exportToPDF).toBe('function');
  });
  
  it('should convert activities to CSV format correctly', () => {
    const csvContent = activitiesToCSV(mockActivities);
    
    expect(csvContent).toContain('Date,Type,Details');
    expect(csvContent).toContain('Tenant');
    expect(csvContent).toContain('Payment');
    expect(csvContent).toContain('Maintenance');
  });
});
