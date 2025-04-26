import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BookmarkModal from './BookmarkModal';

describe('BookmarkModal component', () => {
  //Reusable mocks for actions
  const mockClose = jest.fn();
  const mockSave = jest.fn();

  //Reset mocks before each test
  beforeEach(() => {
    mockClose.mockClear();
    mockSave.mockClear();
  });

  //Test: renders modal with all expected elements
  test('renders inputs and buttons correctly', () => {
    render(<BookmarkModal onClose={mockClose} onSave={mockSave} />);

    expect(screen.getByText('Save as Bookmark')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Bookmark name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add notes (optional)')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  //Test: typing into inputs updates values correctly
  test('updates name and notes inputs on user input', () => {
    render(<BookmarkModal onClose={mockClose} onSave={mockSave} />);

    fireEvent.change(screen.getByPlaceholderText('Bookmark name'), { target: { value: 'My Bookmark' } });
    fireEvent.change(screen.getByPlaceholderText('Add notes (optional)'), { target: { value: 'Some extra notes' } });

    expect((screen.getByPlaceholderText('Bookmark name') as HTMLInputElement).value).toBe('My Bookmark');
    expect((screen.getByPlaceholderText('Add notes (optional)') as HTMLTextAreaElement).value).toBe('Some extra notes');
  });

  //Test: pressing cancel triggers onClose
  test('calls onClose when cancel is clicked', () => {
    render(<BookmarkModal onClose={mockClose} onSave={mockSave} />);

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockClose).toHaveBeenCalled();
  });

  //Test: pressing save triggers onSave with correct values
  test('calls onSave with current input values when save is clicked', () => {
    render(<BookmarkModal onClose={mockClose} onSave={mockSave} />);

    fireEvent.change(screen.getByPlaceholderText('Bookmark name'), { target: { value: 'Fav Verse' } });
    fireEvent.change(screen.getByPlaceholderText('Add notes (optional)'), { target: { value: 'Genesis 1:1' } });

    fireEvent.click(screen.getByText('Save'));
    expect(mockSave).toHaveBeenCalledWith('Fav Verse', 'Genesis 1:1');
  });
});
