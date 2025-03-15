
import '@testing-library/jest-dom';
import { expect } from '@jest/globals';

// This type definition file extends the Jest matcher types to include the DOM testing matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string): R;
    }
  }
}
