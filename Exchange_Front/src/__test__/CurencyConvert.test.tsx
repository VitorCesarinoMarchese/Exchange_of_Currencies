import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import CurencyConverter from '../components/CurencyConverter';
import { useConvert } from '../hooks/convetHook';
import { useLocation } from 'react-router';
import { exchangeService } from '../services/exchangeService';

vi.mock('../hooks/convetHook', () => ({
  useConvert: vi.fn(),
}));
vi.mock('react-router', () => ({
  useLocation: vi.fn(),
}));
vi.mock('../services/exchangeService', () => ({
  exchangeService: vi.fn(),
}));

describe('CurencyConverter', () => {
  const onTransaction = vi.fn();

  beforeEach(() => {
    onTransaction.mockClear();
    (useConvert as any).mockReturnValue({
      data: { result: { rate: 1.5, total: 200 } },
      error: null,
      loading: false,
    });
    (useLocation as any).mockReturnValue({ pathname: '/dashboard' });
    localStorage.setItem('user_id', 'testUser');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders heading and inputs', async () => {
    render(<CurencyConverter onTransaction={onTransaction} />);
    expect(screen.getByText('Curency Convert')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('100')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('GBP')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('£200')).toBeInTheDocument();
  });

  it('renders Exchange button when on dashboard', async () => {
    (useLocation as any).mockReturnValue({ pathname: '/dashboard' });
    render(<CurencyConverter onTransaction={onTransaction} />);
    expect(screen.getByText('Exchange')).toBeInTheDocument();
  });

  it('does not render Exchange button when not on dashboard', async () => {
    (useLocation as any).mockReturnValue({ pathname: '/other' });
    render(<CurencyConverter onTransaction={onTransaction} />);
    expect(screen.queryByText('Exchange')).not.toBeInTheDocument();
  });

  it('calls exchangeService and onTransaction when Exchange button is clicked with non-negative amount', async () => {
    render(<CurencyConverter onTransaction={onTransaction} />);
    const exchangeButton = screen.getByText('Exchange');
    fireEvent.click(exchangeButton);
    await waitFor(() => {
      expect(exchangeService).toHaveBeenCalled();
      expect(onTransaction).toHaveBeenCalled();
    });
  });

  it('does not call exchangeService when amount is negative', async () => {
    render(<CurencyConverter onTransaction={onTransaction} />);

    const amountInput = screen.getByPlaceholderText('100');
    fireEvent.change(amountInput, { target: { value: '-50' } });

    const exchangeButton = screen.getByText('Exchange');
    fireEvent.click(exchangeButton);
    
    const spyExchange = vi.spyOn(exchangeService, 'mockImplementation')

    await waitFor(() => {
      expect(spyExchange).not.toHaveBeenCalled();
      expect(onTransaction).not.toHaveBeenCalled();
    });
  });
});
