//Source.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Source from './Source';

describe('Source component', () => {
  //Test props for rendering
  const defaultProps = {
    name: 'Origen',
    source: 'Commentary on John',
    content: 'This passage supports the pre-existence of the Word.',
    link: 'https://example.com/origen-john',
    thumbnail: '/custom_thumb.png'
  };

  //Renders all fields correctly
  it('renders name, source, content, and link text', () => {
    render(<Source {...defaultProps} />);
    expect(screen.getByText(/Name:/)).toBeInTheDocument();
    expect(screen.getByText(/Source:/)).toBeInTheDocument();
    expect(screen.getByText(/Content:/)).toBeInTheDocument();
    expect(screen.getByText(/Link:/)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.name)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.source)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.content)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.link)).toBeInTheDocument();
  });

  //Renders with custom thumbnail if provided
  it('renders custom thumbnail when thumbnail is passed', () => {
    render(<Source {...defaultProps} />);
    const img = screen.getByAltText('Source icon') as HTMLImageElement;
    expect(img.src).toContain('/custom_thumb.png');
  });

  //Renders default icon when no thumbnail provided
  it('renders default thumbnail if no custom thumbnail is provided', () => {
    const { thumbnail, ...rest } = defaultProps;
    render(<Source {...rest} />);
    const img = screen.getByAltText('Source icon') as HTMLImageElement;
    expect(img.src).toContain('/book_icon.png');
  });

  //Link should open in new tab
  it('renders anchor tag with target="_blank" and correct href', () => {
    render(<Source {...defaultProps} />);
    const anchor = screen.getByRole('link');
    expect(anchor).toHaveAttribute('href', defaultProps.link);
    expect(anchor).toHaveAttribute('target', '_blank');
    expect(anchor).toHaveAttribute('rel', 'noopener noreferrer');
  });
});