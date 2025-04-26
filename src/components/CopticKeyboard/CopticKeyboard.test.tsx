//CopticKeyboard.test.tsx
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import CopticKeyboard from './CopticKeyboard';

describe('CopticKeyboard component', () => {
  //Renders all Coptic characters (sample from layout)
  it('renders Coptic characters from layout', () => {
    render(<CopticKeyboard onInsert={() => {}} />);
    expect(screen.getByText('ⲁ')).toBeInTheDocument();
    expect(screen.getByText('ⲱ')).toBeInTheDocument();
    expect(screen.getByText('ϭ')).toBeInTheDocument();
  });

  //Calls onInsert when a character is clicked
  it('calls onInsert with character when button is clicked', () => {
    const mockInsert = jest.fn();
    render(<CopticKeyboard onInsert={mockInsert} />);
    fireEvent.click(screen.getByText('ⲃ'));
    expect(mockInsert).toHaveBeenCalledWith('ⲃ');
  });

  //Calls onInsert with space when "Space" is clicked
  it('calls onInsert(" ") when space button is clicked', () => {
    const mockInsert = jest.fn();
    render(<CopticKeyboard onInsert={mockInsert} />);
    fireEvent.click(screen.getByText('Space'));
    expect(mockInsert).toHaveBeenCalledWith(' ');
  });

  //Calls onInsert with BACKSPACE when ⌫ is clicked
  it('calls onInsert("BACKSPACE") when ⌫ is clicked', () => {
    const mockInsert = jest.fn();
    render(<CopticKeyboard onInsert={mockInsert} />);
    fireEvent.click(screen.getByText('⌫'));
    expect(mockInsert).toHaveBeenCalledWith('BACKSPACE');
  });

  //Calls onInsert with ENTER when ↵ is clicked
  it('calls onInsert("ENTER") when ↵ is clicked', () => {
    const mockInsert = jest.fn();
    render(<CopticKeyboard onInsert={mockInsert} />);
    fireEvent.click(screen.getByText('↵'));
    expect(mockInsert).toHaveBeenCalledWith('ENTER');
  });

  //Shows Latin letter "a" under Coptic character ⲁ
  it('shows Latin letter "a" under Coptic character ⲁ', () => {
    render(<CopticKeyboard onInsert={() => {}} />);

    //Find the ⲁ button and scope query inside it
    const copticButton = screen.getByText('ⲁ').closest('button');
    expect(copticButton).toBeInTheDocument();
    expect(within(copticButton!).getByText('a')).toBeInTheDocument();
  });
});
