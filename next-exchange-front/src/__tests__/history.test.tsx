import React from 'react';
import { render, screen } from '@testing-library/react';
import History from '../app/history/page';
import { vi } from 'vitest';
import { useLogged } from '../hooks/loggedHook';

beforeEach(() => {
  vi.clearAllMocks();
});

vi.mock('../components/Navbar', () => ({
  default: ({ logged }: { logged: boolean }) => <div>{logged ? 'Logged In' : 'Logged Out'}</div>,
}));

vi.mock('../components/TransactionHistory', () => ({
  default: ({ reloadTrigger }: { reloadTrigger: boolean }) => <div data-testid="transaction-history">{reloadTrigger ? 'Reloaded' : 'Not Reloaded'}</div>,
}));

vi.mock('../hooks/loggedHook', () => ({
  useLogged: vi.fn(),
}));

describe('History Component', () => {
  test('renders the history page', () => {
    (useLogged as vi.Mock).mockReturnValue({ logged: true });

    render(
        <History />
    );

    expect(screen.getByText('Logged In')).toBeInTheDocument();
    expect(screen.getByTestId('transaction-history')).toBeInTheDocument();
    expect(screen.getByText('Not Reloaded')).toBeInTheDocument();
  });
});
