//Header.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Header from './Header';

//Mock child components
jest.mock('../../AuthModal/AuthModal', () => () => <div data-testid="AuthModal">Auth Modal</div>);
jest.mock('../../SearchDropdown/SearchDropdown', () => () => <div data-testid="SearchDropdown">Dropdown</div>);
jest.mock('../../NavBar/NavBar', () => () => <div data-testid="NavBar">NavBar</div>);

describe('Header component', () => {
  const defaultProps = {
    isLoggedIn: false,
    setIsLoggedIn: jest.fn(),
    setToken: jest.fn(),
    setUserEmail: jest.fn(),
    userEmail: null,
    token: null,
    setSelectedBookmark: jest.fn(),
  };

  //Basic render
  it('renders header title and nav bar', () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText('Coptic Scribe')).toBeInTheDocument();
    expect(screen.getByTestId('NavBar')).toBeInTheDocument();
  });

  //Shows login/signup when not logged in
  it('shows Login and Sign Up buttons when logged out', () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  //Shows logout/bookmarks when logged in
  it('shows Bookmarks and Logout buttons when logged in', () => {
    render(<Header {...defaultProps} isLoggedIn={true} userEmail="test@example.com" token="abc123" />);
    expect(screen.getByText('Bookmarks')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  //Opens login modal on click
  it('shows login modal when Login is clicked', () => {
    render(<Header {...defaultProps} />);
    fireEvent.click(screen.getByText('Login'));
    expect(screen.getByTestId('AuthModal')).toBeInTheDocument();
  });

  //Opens signup modal on click
  it('shows signup modal when Sign Up is clicked', () => {
    render(<Header {...defaultProps} />);
    fireEvent.click(screen.getByText('Sign Up'));
    expect(screen.getByTestId('AuthModal')).toBeInTheDocument();
  });

  //Triggers logout and clears localStorage
  it('calls logout and shows success message', async () => {
    const mockStorage = jest.spyOn(Storage.prototype, 'removeItem');
    render(<Header {...defaultProps} isLoggedIn={true} userEmail="test@example.com" token="abc123" />);
    fireEvent.click(screen.getByText('Logout'));

    await waitFor(() =>
      expect(screen.getByText('Successfully logged out.')).toBeInTheDocument()
    );

    expect(mockStorage).toHaveBeenCalledWith('token');
    expect(mockStorage).toHaveBeenCalledWith('userEmail');
  });
});