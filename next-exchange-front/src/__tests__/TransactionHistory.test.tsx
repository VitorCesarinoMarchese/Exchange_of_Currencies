import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import TransactionHistory from '../components/TransactionHistory';
import { useHistory } from '../hooks/historyHook';
import { usePathname } from 'next/navigation';

vi.mock('../hooks/historyHook', () => ({ useHistory: vi.fn() }));
vi.mock('next/navigation', () => ({ usePathname: vi.fn() }));

describe('TransactionHistory', () => {
  const mockTransactions = [
    { _id: '1', user_id: 'user1', amount: '100', from: 'usd', to: 'gbp', rate: '1.2', transaction_date: '2025-03-12T10:00:00Z', __v: 0 },
    { _id: '2', user_id: 'user1', amount: '200', from: 'gbp', to: 'usd', rate: '1.5', transaction_date: '2025-03-10T10:00:00Z', __v: 0 },
    { _id: '3', user_id: 'user1', amount: '150', from: 'eur', to: 'usd', rate: '1.3', transaction_date: '2025-03-11T10:00:00Z', __v: 0 }
  ];
  beforeEach(() => {
    (useHistory as vi.mock).mockReturnValue({ history: mockTransactions, loading: false, error: null });
    (usePathname as vi.mock).mockReturnValue('/history');
  });

  it('renders table headers', async () => {
    render(<TransactionHistory reloadTrigger={true} />);
    expect(screen.getByText('Transaction History')).toBeInTheDocument();
    expect(screen.getByText('Rate')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
  });
  it('renders transaction rows when history is available', async () => {
    render(<TransactionHistory reloadTrigger={true} />);
    await waitFor(() => {
      expect(screen.getByText('1.20')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('USDGBP')).toBeInTheDocument();
      expect(screen.getByText('12/03/')).toBeInTheDocument();
    });
  });

  it('renders loading row when loading is true', async () => {
    (useHistory as vi.mock).mockReturnValue({ history: [], loading: true, error: null });
    render(<TransactionHistory reloadTrigger={true} />);
    await waitFor(() => {
      expect(screen.getByText('Loading .../')).toBeInTheDocument();
    });
  });

  it('renders "No transactions found." when history is empty', async () => {
    (useHistory as vi.mock).mockReturnValue({ history: [], loading: false, error: null });
    render(<TransactionHistory reloadTrigger={true} />);
    await waitFor(() => {
      expect(screen.getByText('No transactions found.')).toBeInTheDocument();
    });
  });

  it('handles pagination buttons', async () => {
    render(<TransactionHistory reloadTrigger={true} page={1} />);
    await waitFor(() => {
      expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
    });
    const nextButton = screen.getByText('Next');
    const backButton = screen.getByText('Back');
    expect(backButton).toBeDisabled();
    fireEvent.click(nextButton);
    await waitFor(() => {
      expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
    });
    fireEvent.click(nextButton);
    await waitFor(() => {
      expect(screen.getByText('Page 3 of 3')).toBeInTheDocument();
    });
    fireEvent.click(backButton);
    await waitFor(() => {
      expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
    });
  });

  it('triggers filter functions when filter buttons are clicked', async () => {
    render(<TransactionHistory reloadTrigger={true} />);
    const rateButton = screen.getByText('Rate');
    const amountButton = screen.getByText('Amount');
    const fromButton = screen.getByText('From');
    const dateButton = screen.getByText('Date');
    fireEvent.click(rateButton);
    fireEvent.click(amountButton);
    fireEvent.click(fromButton);
    fireEvent.click(dateButton);
    expect(rateButton).toBeInTheDocument();
    expect(amountButton).toBeInTheDocument();
    expect(fromButton).toBeInTheDocument();
    expect(dateButton).toBeInTheDocument();
  });
});
