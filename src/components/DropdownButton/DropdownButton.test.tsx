//DropdownButton.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DropdownButton from './DropdownButton';

describe('DropdownButton component', () => {
  //Renders button with optional icon and text
  it('renders button with icon and text', () => {
    render(<DropdownButton text="Export" icon="/icon.png" iconWidth={24} menuItems={[]} />);
    expect(screen.getByText('Export')).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument(); //icon
  });

  //Dropdown opens when button is clicked
  it('toggles dropdown open on button click', () => {
    render(<DropdownButton text="Menu" menuItems={['One', 'Two']} />);
    expect(screen.queryByText('One')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Menu'));
    expect(screen.getByText('One')).toBeInTheDocument();
  });

  //Clicking an item triggers callback and closes dropdown
  it('calls onItemClick and closes menu when item is clicked', () => {
    const mockClick = jest.fn();
    render(<DropdownButton text="Options" menuItems={['PDF', 'CSV']} onItemClick={mockClick} />);
    fireEvent.click(screen.getByText('Options')); //open dropdown
    const item = screen.getByText('CSV');
    fireEvent.click(item);
    expect(mockClick).toHaveBeenCalledWith('CSV');
    expect(screen.queryByText('CSV')).not.toBeInTheDocument(); //should close
  });

  //Handles empty menu gracefully
  it('renders nothing if menuItems is empty', () => {
    render(<DropdownButton text="Empty" menuItems={[]} />);
    fireEvent.click(screen.getByText('Empty'));
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });
});
