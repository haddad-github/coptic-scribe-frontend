import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import AuthModal from './AuthModal';

//Reusable mock for success
const mockSubmit = jest.fn(async (email: string, password?: string) => {
  if (email === 'test@example.com' && password === 'password') {
    return null; //indicates success
  }
  return 'Invalid credentials'; //otherwise simulate failure
});

const mockClose = jest.fn();

describe('AuthModal component', () => {
  //reset mocks before each test
  beforeEach(() => {
    mockSubmit.mockClear();
    mockClose.mockClear();
  });

  //Test: renders in login mode
  test('renders login modal correctly', () => {
    render(<AuthModal mode="login" onSubmit={mockSubmit} onClose={mockClose} />);
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  //Test: switches to reset mode
  test('switches to reset mode on "Forgot password?" click', () => {
    render(<AuthModal mode="login" onSubmit={mockSubmit} onClose={mockClose} />);
    fireEvent.click(screen.getByText('Forgot password?'));
    expect(screen.getByText('Password Reset')).toBeInTheDocument();
  });

  //Test: renders confirm password in signup mode
  test('renders confirm password field in signup mode', () => {
    render(<AuthModal mode="signup" onSubmit={mockSubmit} onClose={mockClose} />);
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
  });

  //Test: shows error if passwords mismatch in signup mode
  test('shows error if passwords do not match in signup', async () => {
    render(<AuthModal mode="signup" onSubmit={mockSubmit} onClose={mockClose} />);
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'abc' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'xyz' } });
    fireEvent.click(screen.getByText('Submit'));
    expect(await screen.findByText('Passwords do not match.')).toBeInTheDocument();
  });

  //Test: successful login and modal close
  test('calls onSubmit and shows success message on correct login', async () => {
    jest.useFakeTimers(); //simulate timer

    render(<AuthModal mode="login" onSubmit={mockSubmit} onClose={mockClose} />);
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByText('Submit'));

    expect(await screen.findByText('Successfully signed in.')).toBeInTheDocument();

    jest.runAllTimers(); //simulate time passing
    expect(mockClose).toHaveBeenCalled(); //modal should close

    jest.useRealTimers(); //cleanup
  });

  //Test: failed login shows error
  test('shows error message when login fails', async () => {
    const failMock = jest.fn(async () => 'Invalid credentials');
    render(<AuthModal mode="login" onSubmit={failMock} onClose={mockClose} />);
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByText('Submit'));
    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
  });
});
