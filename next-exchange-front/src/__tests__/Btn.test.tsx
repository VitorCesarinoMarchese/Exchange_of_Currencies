import { render, screen, fireEvent } from '@testing-library/react';
import Btn from '../components/Btn';
import { vi } from 'vitest';

describe('Btn Component', () => {
  it('should render with the correct label', () => {
    render(<Btn label="Click Me" color="blue" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Click Me');
  });

  it('should call func when clicked', () => {
    const mockFunc = vi.fn();
    render(<Btn label="Click Me" color="blue" func={mockFunc} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockFunc).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disable prop is true', () => {
    render(<Btn label="Click Me" color="blue" disable={true} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should not be disabled when disable prop is false', () => {
    render(<Btn label="Click Me" color="blue" disable={false} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeEnabled();
  });
});
