//WordBlock.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WordBlock from './WordBlock';

describe('WordBlock component', () => {
  const baseProps = {
    word: 'ⲡⲁⲛⲧⲱⲛ',
    transliteration: 'pantōn',
    englishTranslation: 'of all',
    arabicTranslation: 'لكل',
    letterRules: [{ start: 0, length: 3, rule: 'Rule A' }],
  };

  //Renders Coptic word properly
  it('renders Coptic word', () => {
    render(<WordBlock {...baseProps} />);
    expect(screen.getByText('ⲡⲁⲛⲧⲱⲛ')).toBeInTheDocument();
  });

  //Shows rule tooltip on hover
  it('displays transliteration rule tooltip on hover', () => {
    render(<WordBlock {...baseProps} />);
    const ruleSpan = screen.getByText('pan');
    fireEvent.mouseEnter(ruleSpan);
    expect(screen.getByText('Rule A')).toBeInTheDocument();
  });

  //Renders English and Arabic translations
  it('renders English and Arabic translations', () => {
    render(<WordBlock {...baseProps} />);
    expect(screen.getByText('of all')).toBeInTheDocument();
    expect(screen.getByText('لكل')).toBeInTheDocument();
  });

  //Shows suggestion (? icon) when suggestion is valid
  it('renders (?) when suggestion is valid', () => {
    render(<WordBlock {...baseProps} suggestion="ⲡⲁⲛⲧⲱⲛ" />);
    expect(screen.getByText('(?)')).toBeInTheDocument();
  });

  //Shows (X) when suggestion is "No close match found"
  it('renders (X) when suggestion is "No close match found"', () => {
    render(<WordBlock {...baseProps} suggestion="No close match found" />);
    expect(screen.getByText('(X)')).toBeInTheDocument();
  });

  //Handles suggestion prompt click (Yes)
  it('triggers onSuggestionClick when "Yes" is clicked', () => {
    const mockClick = jest.fn();
    render(
      <WordBlock
        {...baseProps}
        suggestion="ⲡⲁⲛⲧⲱⲛ"
        onSuggestionClick={mockClick}
      />
    );

    fireEvent.click(screen.getByText('(?)')); //open modal
    fireEvent.click(screen.getByText('Yes')); //trigger suggestion
    expect(mockClick).toHaveBeenCalled();
  });
});
