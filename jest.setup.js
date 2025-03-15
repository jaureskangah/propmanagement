
// Add any global setup for Jest tests here
import '@testing-library/jest-dom';

// Mock the window.matchMedia function which might be used by some components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// The custom matchers are now properly imported from @testing-library/jest-dom
// This file ensures that the global Jest object is extended with these matchers
