import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer component', () => {
  //Renders copyright line
  it('renders copyright text', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2025 Rafic Haddad/)).toBeInTheDocument();
  });

  //Renders legal links
  it('renders Terms of Service and Privacy Policy links', () => {
    render(<Footer />);
    expect(screen.getByText('Terms of Service')).toHaveAttribute('href', '/terms');
    expect(screen.getByText('Privacy Policy')).toHaveAttribute('href', '/privacy');
  });
});
