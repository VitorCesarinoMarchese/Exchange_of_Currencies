import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Wallet from '../components/Wallet';
import { useWallet } from '../hooks/walletHook';
import { useLocation } from 'react-router';

vi.mock('../hooks/walletHook', () => ({ useWallet: vi.fn() }));
vi.mock('react-router', () => ({ useLocation: vi.fn() }));

describe('Wallet Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders heading and static inputs', () => {
    (useWallet as any).mockReturnValue({ walletData: { usd: 123.45, gbp: 67.89 }, loading: false, error: null });
    (useLocation as any).mockReturnValue({ pathname: '/dashboard' });
    render(<Wallet reloadTrigger={true} onChangeValue={vi.fn()} />);
    expect(screen.getByText('My wallet')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('USD')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('GBP')).toBeInTheDocument();
  });

  it('renders wallet amounts when loading is false', () => {
    (useWallet as any).mockReturnValue({ walletData: { usd: 123.45, gbp: 67.89 }, loading: false, error: null });
    (useLocation as any).mockReturnValue({ pathname: '/dashboard' });
    render(<Wallet reloadTrigger={true} onChangeValue={vi.fn()} />);
    expect(screen.getByPlaceholderText('123.45$')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('£67.89')).toBeInTheDocument();
  });

  it('renders loading placeholders when loading is true', () => {
    (useWallet as any).mockReturnValue({ walletData: null, loading: true, error: null });
    (useLocation as any).mockReturnValue({ pathname: '/dashboard' });
    render(<Wallet reloadTrigger={true} onChangeValue={vi.fn()} />);
    expect(screen.getByPlaceholderText('loading...$')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('£loading...')).toBeInTheDocument();
  });

  it('renders Exchange button when location is /dashboard and calls onChangeValue when clicked', async () => {
    const onChangeValue = vi.fn();
    (useWallet as any).mockReturnValue({ walletData: { usd: 123.45, gbp: 67.89 }, loading: false, error: null });
    (useLocation as any).mockReturnValue({ pathname: '/dashboard' });
    render(<Wallet reloadTrigger={true} onChangeValue={onChangeValue} />);
    const button = screen.getByText('Add founds');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    await waitFor(() => {
      expect(onChangeValue).toHaveBeenCalledWith(true);
    });
  });

  it('does not render Exchange button when location is not /dashboard', () => {
    (useWallet as any).mockReturnValue({ walletData: { usd: 123.45, gbp: 67.89 }, loading: false, error: null });
    (useLocation as any).mockReturnValue({ pathname: '/other' });
    render(<Wallet reloadTrigger={true} onChangeValue={vi.fn()} />);
    expect(screen.queryByText('Add founds')).not.toBeInTheDocument();
  });
});
