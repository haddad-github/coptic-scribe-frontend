//SearchDropdown.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchDropdown from './SearchDropdown';

//Sample bookmarks used in all tests
const mockBookmarks = [
  { id: 1, name: 'Bookmark One', notes: 'Some notes here' },
  { id: 2, name: 'Bookmark Two' }
];

//Mock handlers to spy on callback behavior
const mockSelect = jest.fn();
const mockRename = jest.fn();
const mockDelete = jest.fn();
const mockClose = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('SearchDropdown component', () => {
  //Renders bookmarks and close button
  it('renders bookmarks and close button', () => {
    render(
      <SearchDropdown
        bookmarks={mockBookmarks}
        onSelect={mockSelect}
        onRename={mockRename}
        onDelete={mockDelete}
        onClose={mockClose}
      />
    );
    expect(screen.getByText('My Bookmarks')).toBeInTheDocument();
    expect(screen.getByText('Bookmark One')).toBeInTheDocument();
    expect(screen.getByText('Bookmark Two')).toBeInTheDocument();
    expect(screen.getByText('✖ Close')).toBeInTheDocument();
  });

  //Calls onClose when close button is clicked
  it('calls onClose when close is clicked', () => {
    render(
      <SearchDropdown
        bookmarks={mockBookmarks}
        onSelect={mockSelect}
        onRename={mockRename}
        onDelete={mockDelete}
        onClose={mockClose}
      />
    );
    fireEvent.click(screen.getByText('✖ Close'));
    expect(mockClose).toHaveBeenCalled();
  });

  //Filters bookmarks by search input
  it('filters bookmarks based on search input', () => {
    render(
      <SearchDropdown
        bookmarks={mockBookmarks}
        onSelect={mockSelect}
        onRename={mockRename}
        onDelete={mockDelete}
        onClose={mockClose}
      />
    );
    fireEvent.change(screen.getByPlaceholderText('Search bookmarks...'), {
      target: { value: 'two' }
    });
    expect(screen.queryByText('Bookmark One')).not.toBeInTheDocument();
    expect(screen.getByText('Bookmark Two')).toBeInTheDocument();
  });

  //Calls onSelect when a bookmark is clicked
  it('calls onSelect when a bookmark is clicked', () => {
    render(
      <SearchDropdown
        bookmarks={mockBookmarks}
        onSelect={mockSelect}
        onRename={mockRename}
        onDelete={mockDelete}
        onClose={mockClose}
      />
    );
    fireEvent.click(screen.getByText('Bookmark One'));
    expect(mockSelect).toHaveBeenCalledWith(mockBookmarks[0]);
  });

  //Allows editing and submitting new name
  it('calls onRename when renaming a bookmark', () => {
    render(
      <SearchDropdown
        bookmarks={mockBookmarks}
        onSelect={mockSelect}
        onRename={mockRename}
        onDelete={mockDelete}
        onClose={mockClose}
      />
    );
    fireEvent.click(screen.getAllByText('✏️')[0]);
    const input = screen.getByDisplayValue('Bookmark One');
    fireEvent.change(input, { target: { value: 'Updated Name' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mockRename).toHaveBeenCalledWith(1, 'Updated Name');
  });

  //Calls onDelete when confirm passes
  it('calls onDelete when delete is confirmed', () => {
    window.confirm = jest.fn(() => true); //simulate user clicking 'OK'
    render(
      <SearchDropdown
        bookmarks={mockBookmarks}
        onSelect={mockSelect}
        onRename={mockRename}
        onDelete={mockDelete}
        onClose={mockClose}
      />
    );
    fireEvent.click(screen.getAllByText('🗑️')[0]);
    expect(mockDelete).toHaveBeenCalledWith(1);
  });

  //Does not call onDelete if user cancels confirm
  it('does not call onDelete if deletion is cancelled', () => {
    window.confirm = jest.fn(() => false); //simulate user clicking 'Cancel'
    render(
      <SearchDropdown
        bookmarks={mockBookmarks}
        onSelect={mockSelect}
        onRename={mockRename}
        onDelete={mockDelete}
        onClose={mockClose}
      />
    );
    fireEvent.click(screen.getAllByText('🗑️')[0]);
    expect(mockDelete).not.toHaveBeenCalled();
  });

  //Shows message when no bookmarks match search
  it('displays fallback message if no bookmarks match search', () => {
    render(
      <SearchDropdown
        bookmarks={mockBookmarks}
        onSelect={mockSelect}
        onRename={mockRename}
        onDelete={mockDelete}
        onClose={mockClose}
      />
    );
    fireEvent.change(screen.getByPlaceholderText('Search bookmarks...'), {
      target: { value: 'zzz' }
    });
    expect(screen.getByText('No bookmarks found.')).toBeInTheDocument();
  });
});
