import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dropdown from '../components/Dropdown';
import { vi } from 'vitest';

describe('Dropdown Component', () => {
  it('should render with default value "USD"', () => {
    render(<Dropdown onChangeValue={() => {}} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('USD');
  });

  it('should open the dropdown when clicked', () => {
    render(<Dropdown onChangeValue={() => {}} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    const dropdownItems = screen.getAllByRole('listitem');
    expect(dropdownItems).toHaveLength(2); 
  });

  it('should update value when a new item is selected', () => {
    const mockOnChangeValue = vi.fn();
    render(<Dropdown onChangeValue={mockOnChangeValue} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    const gbpItem = screen.getByText('GBP');
    fireEvent.click(gbpItem);
    
    expect(mockOnChangeValue).toHaveBeenCalledWith('GBP');
    expect(button).toHaveTextContent('GBP');
  });

  it('should close the dropdown after an item is selected', () => {
    render(<Dropdown onChangeValue={() => {}} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    const gbpItem = screen.getByText('GBP');
    fireEvent.click(gbpItem);
    
    const dropdownItems = screen.queryAllByRole('listitem');
    expect(dropdownItems).toHaveLength(0); 
  });
});
