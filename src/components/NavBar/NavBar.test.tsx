//NavBar.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import NavBar from './NavBar';

//Test suite for the NavBar component
describe('NavBar component', () => {
  const items = [
    { label: 'Home', href: '/' },
    { label: 'GitHub', href: 'https://github.com', external: true },
    { label: 'Coptic Text', href: '#', comingSoon: true },
    { label: 'Email', href: 'mailto:test@example.com', icon: '/email_icon.png', external: true }
  ];

  //Renders all nav items passed as props
  it('renders all navigation items', () => {
    render(<NavBar items={items} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('Coptic Text (soon)')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  //Checks if external links include target and rel attributes
  it('sets target and rel for external links', () => {
    render(<NavBar items={items} />);
    const githubLink = screen.getByText('GitHub').closest('a');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  //Checks if internal links don't have target or rel
  it('does not set target/rel for internal links', () => {
    render(<NavBar items={items} />);
    const homeLink = screen.getByText('Home').closest('a');
    expect(homeLink).not.toHaveAttribute('target');
    expect(homeLink).not.toHaveAttribute('rel');
  });

  //Checks that comingSoon items render as static text, not links
  it('renders comingSoon items as static text', () => {
    render(<NavBar items={items} />);
    const comingSoon = screen.getByText('Coptic Text (soon)');
    expect(comingSoon.tagName).toBe('SPAN');
  });

  //Checks that icons are rendered if provided
  it('renders icons for items with icon property', () => {
    render(<NavBar items={items} />);
    const emailIcon = screen.getByAltText('Email icon');
    expect(emailIcon).toBeInTheDocument();
    expect(emailIcon).toHaveAttribute('src', '/email_icon.png');
  });
});
