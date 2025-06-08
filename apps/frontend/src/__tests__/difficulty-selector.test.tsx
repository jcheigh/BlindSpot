import { render, screen, fireEvent } from '@testing-library/react';
import { DifficultySelector } from '@/components/game/difficulty-selector';

describe('DifficultySelector', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all difficulty options', () => {
    render(<DifficultySelector onSelect={mockOnSelect} />);
    
    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Hard')).toBeInTheDocument();
  });

  it('calls onSelect with the correct difficulty when an option is clicked', () => {
    render(<DifficultySelector onSelect={mockOnSelect} />);
    
    // Click the medium difficulty option
    fireEvent.click(screen.getByText('Medium'));
    
    expect(mockOnSelect).toHaveBeenCalledWith('medium');
  });

  it('visually highlights the selected difficulty', () => {
    render(<DifficultySelector onSelect={mockOnSelect} />);
    
    // Get all radio inputs
    const radioInputs = screen.getAllByRole('radio');
    
    // Initially none should be checked
    radioInputs.forEach(input => {
      expect(input).not.toBeChecked();
    });
    
    // Click the hard difficulty option
    fireEvent.click(screen.getByText('Hard'));
    
    // Now the hard option should be checked
    const hardRadio = screen.getByLabelText('Hard');
    expect(hardRadio).toBeChecked();
  });
});