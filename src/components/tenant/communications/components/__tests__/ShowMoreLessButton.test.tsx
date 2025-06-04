
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ShowMoreLessButton } from '../ShowMoreLessButton';
import { LocaleProvider } from '@/components/providers/LocaleProvider';

// Mock the useLocale hook
jest.mock('@/components/providers/LocaleProvider', () => ({
  useLocale: () => ({
    t: (key: string) => key === 'showMore' ? 'Show More' : 'Show Less',
  }),
  LocaleProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('ShowMoreLessButton', () => {
  const mockToggle = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when total count is less than or equal to initial display count', () => {
    const { container } = render(
      <ShowMoreLessButton 
        showAll={false}
        toggleShowAll={mockToggle}
        totalCount={5}
        initialDisplayCount={5}
      />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('renders "Show More" button when not showing all and total count is greater than initial display count', () => {
    const { getByRole } = render(
      <ShowMoreLessButton 
        showAll={false}
        toggleShowAll={mockToggle}
        totalCount={10}
        initialDisplayCount={5}
      />
    );
    
    const button = getByRole('button', { name: /Show More/i });
    expect(button).toBeInTheDocument();
  });

  it('renders "Show Less" button when showing all and total count is greater than initial display count', () => {
    const { getByRole } = render(
      <ShowMoreLessButton 
        showAll={true}
        toggleShowAll={mockToggle}
        totalCount={10}
        initialDisplayCount={5}
      />
    );
    
    const button = getByRole('button', { name: /Show Less/i });
    expect(button).toBeInTheDocument();
  });

  it('calls toggleShowAll function when button is clicked', async () => {
    const user = userEvent.setup();
    
    const { getByRole } = render(
      <ShowMoreLessButton 
        showAll={false}
        toggleShowAll={mockToggle}
        totalCount={10}
        initialDisplayCount={5}
      />
    );
    
    const button = getByRole('button');
    await user.click(button);
    
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });
});
