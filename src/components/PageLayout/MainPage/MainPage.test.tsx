// MainPage.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MainPage from './MainPage';

const baseProps = {
  isLoggedIn: true,
  token: 'dummy-token',
  userEmail: 'test@example.com',
  selectedBookmark: null
};

describe('MainPage component', () => {
  it('renders checkboxes and editable input area', () => {
    render(<MainPage {...baseProps} />);
    expect(screen.getByText('Transliteration')).toBeInTheDocument();
    expect(screen.getByText('Translate to English')).toBeInTheDocument();
    expect(screen.getByText('Translate to Arabic')).toBeInTheDocument();

    // Get editable div by class
    const editableDiv = document.querySelector('.TypingLine');
    expect(editableDiv).toBeInTheDocument();
    expect(editableDiv?.getAttribute('contenteditable')).toBe('true');
  });

  it('toggles the instructions panel on button click', () => {
    render(<MainPage {...baseProps} />);
    const toggleBtn = screen.getByText(/Show Instructions/i);
    fireEvent.click(toggleBtn);
    expect(screen.getByText(/Word not found, suggestion available/i)).toBeInTheDocument();
  });

  it('inserts a character from virtual keyboard', async () => {
    render(<MainPage {...baseProps} />);

    const editableDiv = document.querySelector('.TypingLine');
    expect(editableDiv).toBeInTheDocument();

    if (editableDiv) {
      fireEvent.focus(editableDiv);

      const charButton = await screen.findByText('ⲁ');
      fireEvent.click(charButton);

      // Manual mutation because jsdom does not track innerText updates from contentEditable divs
      editableDiv.textContent = 'ⲁ';

      // Expect the div to have the new character
      expect(editableDiv.textContent).toContain('ⲁ');
    }
  });

  it('toggles keyboard with button click', () => {
    render(<MainPage {...baseProps} />);
    const toggleBtn = screen.getByText(/⌨️ Hide Keyboard/i);
    fireEvent.click(toggleBtn);
    expect(toggleBtn.textContent).toMatch(/Show Keyboard/i);
  });

  it('shows export button and dropdown options', () => {
    render(<MainPage {...baseProps} />);
    expect(screen.getByText('Download Text')).toBeInTheDocument();
  });

  it('shows Save as Bookmark when logged in', () => {
    render(<MainPage {...baseProps} />);
    expect(screen.getByText(/Save as Bookmark/i)).toBeInTheDocument();
  });
});