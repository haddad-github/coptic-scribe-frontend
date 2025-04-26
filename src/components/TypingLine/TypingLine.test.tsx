//TypingLine.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import TypingLine from './TypingLine';

describe('TypingLine component', () => {
  //Renders the contentEditable div
  it('renders the editable div with expected class', () => {
    const { container } = render(<TypingLine />);
    const editable = container.querySelector('.TypingLine');
    expect(editable).toBeInTheDocument();
    expect(editable?.getAttribute('contenteditable')).toBe('true');
  });

  //Calls onTextChange when input is triggered
  it('calls onTextChange when input is triggered', async () => {
    const mockChange = jest.fn();
    const { container } = render(<TypingLine onTextChange={mockChange} />);
    const editable = container.querySelector('.TypingLine')!;

    //Simulate user typing
    //@ts-ignore
    editable.innerText = 'ⲁ';
    fireEvent.input(editable);

    await waitFor(() => {
      expect(mockChange).toHaveBeenCalledWith('ⲁ');
    });
  });

  //Syncs internal text when value prop is provided
  it('syncs internal text when value prop is provided', async () => {
    const { container } = render(<TypingLine value="ⲡⲁⲛⲧⲱⲛ" />);
    const editable = container.querySelector('.TypingLine');
    await waitFor(() => {
      //@ts-ignore
      expect(editable?.innerText).toBe('ⲡⲁⲛⲧⲱⲛ');
    });
  });

  //Ref is forwarded to parent correctly
  it('calls onRefReady with ref to the div', () => {
    const mockRef = jest.fn();
    render(<TypingLine onRefReady={mockRef} />);
    expect(mockRef).toHaveBeenCalled();
    const ref = mockRef.mock.calls[0][0];
    expect(ref.current instanceof HTMLDivElement).toBe(true);
  });
});
