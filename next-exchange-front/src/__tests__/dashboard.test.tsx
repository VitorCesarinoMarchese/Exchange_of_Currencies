import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '../app/dashboard/page';
import { vi } from 'vitest';
import { useLogged } from '../hooks/loggedHook';

beforeEach(() => {
  vi.clearAllMocks();
});

vi.mock('../components/Navbar', () => ({
  default: ({ logged }: { logged: boolean }) => <div>{logged ? 'Logged In' : 'Logged Out'}</div>,
}));

vi.mock('../components/CurencyConverter', () => ({
  default: ({ onTransaction }: { onTransaction: () => void }) => (
    <button onClick={onTransaction}>Currency Converter</button>
  ),
}));

vi.mock('../components/TransactionHistory', () => ({
  default: ({ reloadTrigger }: { reloadTrigger: boolean }) => (
    <div data-testid="transaction-history">{reloadTrigger ? 'Reloaded' : 'Not Reloaded'}</div>
  ),
}));

vi.mock('../components/wallet', () => ({
  default: ({ reloadTrigger, onChangeValue }: { reloadTrigger: boolean; onChangeValue: (value: boolean) => void }) => (
    <div>
      <button onClick={() => onChangeValue(true)}>Open Wallet</button>
      <div data-testid="wallet-status">{reloadTrigger ? 'Reloaded' : 'Not Reloaded'}</div>
    </div>
  ),
}));

vi.mock('../components/addFunds', () => ({
  default: ({ onChangeValue }: { onChangeValue: (value: boolean) => void }) => (
    <div>
      <button onClick={() => onChangeValue(false)}>Close Add Funds</button>
      <div>Add Funds Component</div>
    </div>
  ),
}));

vi.mock('../hooks/loggedHook', () => ({
  useLogged: vi.fn(),
}));

describe('Dashboard Component', () => {
  test('renders the Dashboard page for a logged-in user', async () => {
    (useLogged as vi.Mock).mockReturnValue({ logged: true });

    render(
        <Dashboard />
    );

    expect(screen.getByText('Logged In')).toBeInTheDocument();
    expect(screen.getByText('Currency Converter')).toBeInTheDocument();
    expect(screen.getByTestId('transaction-history')).toBeInTheDocument();
    expect(screen.getByTestId('wallet-status')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Open Wallet'));
    expect(screen.getByTestId('wallet-status')).toHaveTextContent('Reloaded');

    fireEvent.click(screen.getByText('Currency Converter'));
    expect(screen.getByTestId('transaction-history')).toHaveTextContent('Reloaded');

    fireEvent.click(screen.getByText('Close Add Funds'));
    expect(screen.queryByText('Add Funds Component')).not.toBeInTheDocument();
  });
});
