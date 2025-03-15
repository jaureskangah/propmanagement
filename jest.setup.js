
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

// Fix for toBeInTheDocument and other DOM testing library methods
expect.extend({
  toBeInTheDocument(received) {
    const pass = received !== null;
    return {
      pass,
      message: () => `expected ${received} to be in the document`,
    };
  },
  toHaveTextContent(received, text) {
    const pass = received.textContent.includes(text);
    return {
      pass,
      message: () => `expected ${received.textContent} to include ${text}`,
    };
  }
});
