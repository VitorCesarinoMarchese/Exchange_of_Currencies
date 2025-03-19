import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import AddFunds from '../components/addFunds';
import { addFundsService } from '../services/exchangeService';
            

vi.mock('../services/exchangeService', () => ({
  addFundsService: vi.fn(),
}));

describe('AddFunds Component', () => {
  it('should render the modal with inputs and buttons', () => {
    render(<AddFunds onChangeValue={vi.fn()} />);

    const usdInput = screen.getByPlaceholderText('USD');
    const gbpInput = screen.getByPlaceholderText('GBP');
    const confirmButton = screen.getByText('Confirm');
    
    expect(usdInput).toBeInTheDocument();
    expect(gbpInput).toBeInTheDocument();
    expect(confirmButton).toBeInTheDocument();
  });

  it('should call addFundsService with correct values when Confirm button is clicked', async () => {
    const onChangeValue = vi.fn();
    render(<AddFunds onChangeValue={onChangeValue} />);
    
    const usdInput = screen.getByPlaceholderText('100.00$');
    const gbpInput = screen.getByPlaceholderText('100.00£');
    const confirmButton = screen.getByText('Confirm');

    fireEvent.change(usdInput, { target: { value: '100' } });
    fireEvent.change(gbpInput, { target: { value: '50' } });

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(addFundsService).toHaveBeenCalledWith({ usd: '100', gbp: '50' });
      expect(onChangeValue).toHaveBeenCalledWith(false);
    });
  });

  it('should close the modal when clicking on the overlay or close icon', () => {
    const onChangeValue = vi.fn();
    render(<AddFunds onChangeValue={onChangeValue} />);

    const overlay = screen.getByText('Confirm');
    fireEvent.click(overlay);
    expect(onChangeValue).toHaveBeenCalledWith(false);

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(onChangeValue).toHaveBeenCalledWith(false);
  });
});
