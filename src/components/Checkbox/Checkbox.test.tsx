//Checkbox.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Checkbox from './Checkbox';

describe('Checkbox component', () => {
  //Renders with correct label text
  it('renders with given label text', () => {
    render(<Checkbox text="Enable feature" checked={false} onChange={() => {}} />);
    expect(screen.getByText('Enable feature')).toBeInTheDocument();
  });

  //Calls onChange with true when initially unchecked and clicked
  it('calls onChange(true) when clicked while unchecked', () => {
    const mockChange = jest.fn();
    render(<Checkbox text="Enable feature" checked={false} onChange={mockChange} />);
    fireEvent.click(screen.getByText('Enable feature'));
    expect(mockChange).toHaveBeenCalledWith(true);
  });

  //Calls onChange with false when initially checked and clicked
  it('calls onChange(false) when clicked while checked', () => {
    const mockChange = jest.fn();
    render(<Checkbox text="Enable feature" checked={true} onChange={mockChange} />);
    fireEvent.click(screen.getByText('Enable feature'));
    expect(mockChange).toHaveBeenCalledWith(false);
  });

  //Displays the ✠ character when checked
  it('displays ✠ when checkbox is checked', () => {
    render(<Checkbox text="Enable feature" checked={true} onChange={() => {}} />);
    expect(screen.getByText('✠')).toBeInTheDocument();
  });

  //Hides the ✠ character when checkbox is not checked
  it('does not display ✠ when checkbox is not checked', () => {
    render(<Checkbox text="Enable feature" checked={false} onChange={() => {}} />);
    expect(screen.queryByText('✠')).toBeNull();
  });
});